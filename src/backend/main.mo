import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";

// Migrate old state.

actor {
  // Product Types
  type ProductType = { #clothing; #accessory; #footwear; #electronics; #other : Text };
  type UsageCategory = { #hajj; #umrah; #both };

  // Persistent Types
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
  type Cart = {
    items : [CartItem];
  };

  type LookbookImage = {
    id : Text;
    image : Storage.ExternalBlob;
    description : Text;
    taggedProducts : [Text];
  };

  type UserSession = { cart : Cart };

  type UserProfile = {
    name : Text;
    email : ?Text;
    phone : ?Text;
    address : ?Text;
  };

  type BannerImage = {
    id : Text;
    image : Storage.ExternalBlob;
    title : Text;
    description : Text;
    link : ?Text;
    order : Nat;
  };

  type Logo = {
    image : Storage.ExternalBlob;
    altText : Text;
    link : ?Text;
  };

  type Category = {
    name : Text;
    description : Text;
    isActive : Bool;
  };

  type SiteContentBlock = { title : Text; content : Text; image : ?Storage.ExternalBlob };
  type SiteContent = {
    heroText : Text;
    sections : [SiteContentBlock];
    contactDetails : Text;
    footerItems : [Text];
    darkModeEnabled : Bool;
    companyName : Text;
  };

  type AdminContent = {
    banners : Map.Map<Text, BannerImage>;
    logo : ?Logo;
    categories : Map.Map<Text, Category>;
  };

  // Mutable persistent state
  let products = Map.empty<Text, Product>();
  let userSessions = Map.empty<Principal, UserSession>();
  let lookbook = Map.empty<Text, LookbookImage>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let carts = Map.empty<Principal, Cart>();

  var siteContent : SiteContent = {
    heroText = "<h1>Welcome to Our Store!</h1>";
    sections = [];
    contactDetails = "<p>Contact us via WhatsApp</p>";
    footerItems = ["Home", "Shop", "About", "Contact"];
    darkModeEnabled = false;
    companyName = "Company Name Example";
  };

  var adminSignupEnabled = true;

  var adminContent : AdminContent = {
    banners = Map.empty<Text, BannerImage>();
    logo = null;
    categories = Map.empty<Text, Category>();
  };

  // AUTHORIZATION STATE (persistent through upgrade)
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Admin signup onboarding
  public shared ({ caller }) func registerAdmin() : async Text {
    // Check if signup window is still open
    if (not adminSignupEnabled) {
      Runtime.trap("Unauthorized: Admin registration window is closed");
    };

    // Check caller's current role
    let currentRole = AccessControl.getUserRole(accessControlState, caller);
    switch (currentRole) {
      case (#admin) {
        Runtime.trap("Unauthorized: You are already registered as an admin");
      };
      case (#user) {
        Runtime.trap("Unauthorized: Only new users can register as admin during the setup window");
      };
      case (#guest) {
        // Guest can register as admin during the window
        AccessControl.assignRole(accessControlState, caller, caller, #admin);
        let principalAsText = caller.toText();
        adminSignupEnabled := false;
        principalAsText;
      };
    };
  };

  public query func isAdminSignupEnabled() : async Bool {
    adminSignupEnabled;
  };

  public shared ({ caller }) func closeAdminSignupWindow() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can close the admin signup window");
    };
    adminSignupEnabled := false;
  };

  // Site Content Management (Admin Only)
  public shared ({ caller }) func updateSiteContent(
    heroText : Text,
    contactDetails : Text,
    darkModeEnabled : Bool,
    companyName : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update site content");
    };

    siteContent := {
      siteContent with heroText;
      contactDetails;
      darkModeEnabled;
      companyName;
    };
  };

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

  // Category Management (Admin Only)
  public shared ({ caller }) func createCategory(name : Text, description : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create categories");
    };

    switch (adminContent.categories.get(name)) {
      case (null) {
        let newCategory : Category = { name; description; isActive = true };
        adminContent.categories.add(name, newCategory);
        "Category successfully created";
      };
      case (?_existing) {
        Runtime.trap("Category with that name already exists. Please choose a different name.");
      };
    };
  };

  public shared ({ caller }) func updateCategoryDescription(name : Text, newDescription : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update categories");
    };

    switch (adminContent.categories.get(name)) {
      case (null) {
        Runtime.trap("Category not found. Cannot update description.");
      };
      case (?_existing) {
        let updatedCategory : Category = {
          name;
          description = newDescription;
          isActive = true;
        };
        adminContent.categories.add(name, updatedCategory);
        "Category description updated successfully to " # newDescription # ".";
      };
    };
  };

  public shared ({ caller }) func deleteCategory(name : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete categories");
    };

    switch (adminContent.categories.get(name)) {
      case (null) {
        Runtime.trap("Category not found. Cannot delete.");
      };
      case (?_existingCategory) {
        adminContent.categories.remove(name);
        "Category deleted successfully.";
      };
    };
  };

  public query func getAllCategories() : async [Category] {
    adminContent.categories.values().toArray();
  };

  // Banner Management (Admin Only)
  public shared ({ caller }) func addBanner(
    id : Text,
    image : Storage.ExternalBlob,
    title : Text,
    description : Text,
    link : ?Text,
    order : Nat,
  ) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add banners");
    };

    let banner : BannerImage = {
      id;
      image;
      title;
      description;
      link;
      order;
    };

    adminContent.banners.add(id, banner);
    "Banner successfully added";
  };

  public shared ({ caller }) func updateBannerOrder(bannerOrders : [(Text, Nat)]) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update banner order");
    };

    for ((bannerId, newOrder) in bannerOrders.values()) {
      switch (adminContent.banners.get(bannerId)) {
        case (null) { Runtime.trap("Banner not found: " # bannerId) };
        case (?existingBanner) {
          let updatedBanner : BannerImage = {
            existingBanner with order = newOrder;
          };
          adminContent.banners.add(bannerId, updatedBanner);
        };
      };
    };

    "Banner order successfully updated";
  };

  public shared ({ caller }) func removeBanner(bannerId : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove banners");
    };

    switch (adminContent.banners.get(bannerId)) {
      case (null) {
        Runtime.trap("Banner not found. Cannot remove.");
      };
      case (?_existingBanner) {
        adminContent.banners.remove(bannerId);
        "Banner successfully removed";
      };
    };
  };

  public query func getAllBanners() : async [BannerImage] {
    let sortedBanners = adminContent.banners.values().toArray();
    sortedBanners.sort(
      func(a, b) {
        if (a.order < b.order) { #less } else if (a.order > b.order) { #greater } else {
          #equal;
        };
      }
    );
  };

  // Logo Management (Admin Only)
  public shared ({ caller }) func updateLogo(image : Storage.ExternalBlob, altText : Text, link : ?Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update the logo");
    };

    adminContent := { adminContent with logo = ?{ image; altText; link } };
  };

  public query func getLogo() : async ?Logo {
    adminContent.logo;
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

  // Product Viewing (Public Endpoints)
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
  public shared ({ caller }) func addToCart(items : [CartItem]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add items to cart");
    };
    carts.add(caller, { items });
  };

  public shared ({ caller }) func removeFromCart(productId : Text, size : Text, color : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove items from cart");
    };
    let cart = switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart is empty") };
      case (?cart) { cart };
    };

    let filteredItems = cart.items.filter(func(cartItem) { not (cartItem.productId == productId and cartItem.size == size and cartItem.color == color) });
    carts.add(caller, { items = filteredItems });
  };

  public query ({ caller }) func getCart() : async Cart {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their cart");
    };
    switch (carts.get(caller)) {
      case (null) { { items = [] } };
      case (?cart) { cart };
    };
  };

  // Lookbook Management - Admin only for adding, public for viewing
  public shared ({ caller }) func addLookbookImage(image : LookbookImage) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add lookbook images");
    };
    lookbook.add(image.id, image);
  };

  // Public Lookbook viewing
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
