import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Migration "migration";

(with migration = Migration.run)
actor {
  type ProductType = {
    #clothing;
    #accessory;
    #footwear;
    #electronics;
    #other : Text;
  };
  type UsageCategory = {
    #hajj;
    #umrah;
    #both;
  };
  type Product = {
    id : Text;
    name : Text;
    shortDescriptor : Text;
    description : Text;
    price : Nat;
    images : [Storage.ExternalBlob];
    sizes : [Text];
    colors : [Text];
    category : Text;
    productType : ?ProductType;
    usageCategory : ?UsageCategory;
    isBestseller : Bool;
    isNewProduct : Bool;
    isMostLoved : Bool;
  };
  type CartItem = { productId : Text; size : Text; color : Text; quantity : Nat };
  type Cart = [CartItem];
  type LookbookImage = {
    id : Text;
    image : Storage.ExternalBlob;
    description : Text;
    taggedProducts : [Text];
  };
  type UserSession = { cart : Cart };
  type UserProfile = { name : Text };
  type SiteContentBlock = {
    title : Text;
    content : Text;
    image : ?Storage.ExternalBlob;
  };
  type SiteContent = {
    heroText : Text;
    sections : [SiteContentBlock];
    contactDetails : Text;
    footerItems : [Text];
    darkModeEnabled : Bool;
  };

  let products = Map.empty<Text, Product>();
  let userSessions = Map.empty<Principal, UserSession>();
  let lookbook = Map.empty<Text, LookbookImage>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var siteContent : SiteContent = {
    heroText = "<h1>Welcome to Our Store!</h1>";
    sections = [];
    contactDetails = "<p>Contact us via WhatsApp</p>";
    footerItems = ["Home", "Shop", "About", "Contact"];
    darkModeEnabled = false;
  };

  // Access Control State (Authorization)
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // File Storage State
  include MixinStorage();

  // Site Content Management - Admin only
  public shared ({ caller }) func updateSiteContent(heroText : Text, contactDetails : Text, darkModeEnabled : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update site content");
    };

    siteContent := {
      siteContent with heroText;
      contactDetails;
      darkModeEnabled;
    };
  };

  // Site content is public - accessible to all including guests
  public query func getSiteContent() : async SiteContent {
    siteContent;
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Management (Admin-only)
  public shared ({ caller }) func addProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func adminUpdateProduct(productId : Text, product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    products.add(productId, product);
  };

  public shared ({ caller }) func adminDeleteProduct(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    products.remove(productId);
  };

  // Product Viewing (Public - accessible to all including guests)
  public query func getProduct(productId : Text) : async Product {
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public query func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public query func filterProductsByCategory(category : Text) : async [Product] {
    products.values().toArray().filter(func(p) { p.category == category });
  };

  public query func getBestsellers() : async [Product] {
    products.values().toArray().filter(func(p) { p.isBestseller });
  };

  public query func getNewProducts() : async [Product] {
    products.values().toArray().filter(func(p) { p.isNewProduct });
  };

  public query func getMostLovedProducts() : async [Product] {
    products.values().toArray().filter(func(p) { p.isMostLoved });
  };

  // Cart Management (User-only)
  public shared ({ caller }) func addToCart(item : CartItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add items to cart");
    };
    let session = switch (userSessions.get(caller)) {
      case (null) { { cart = [] } };
      case (?existing) { existing };
    };
    let newCart = session.cart.concat([item]);
    let newSession = { cart = newCart };
    userSessions.add(caller, newSession);
  };

  public shared ({ caller }) func removeFromCart(productId : Text, size : Text, color : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove items from cart");
    };
    let session = switch (userSessions.get(caller)) {
      case (null) { Runtime.trap("Cart is empty") };
      case (?existing) { existing };
    };
    let filteredCart = session.cart.filter(func(cartItem) { 
      not (cartItem.productId == productId and cartItem.size == size and cartItem.color == color)
    });
    let newSession = { cart = filteredCart };
    userSessions.add(caller, newSession);
  };

  public query ({ caller }) func getCart() : async Cart {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their cart");
    };
    switch (userSessions.get(caller)) {
      case (null) { [] };
      case (?session) { session.cart };
    };
  };

  // Lookbook Management - Admin only for adding, public for viewing
  public shared ({ caller }) func addLookbookImage(image : LookbookImage) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add lookbook images");
    };
    lookbook.add(image.id, image);
  };

  // Lookbook viewing is public - accessible to all including guests
  public query func getLookbookImage(imageId : Text) : async LookbookImage {
    switch (lookbook.get(imageId)) {
      case (null) { Runtime.trap("Lookbook image not found") };
      case (?image) { image };
    };
  };

  public query func getAllLookbookImages() : async [LookbookImage] {
    lookbook.values().toArray();
  };

  // Health check - public
  public query func isReady() : async Bool {
    true;
  };
};
