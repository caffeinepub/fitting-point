import Text "mo:core/Text";
import Map "mo:core/Map";
import Set "mo:core/Set";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Char "mo:core/Char";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Bool "mo:core/Bool";

import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type ProductId = Text;
  type UserId = Principal;
  type Price = Nat;
  type Size = Text;
  type Color = Text;
  type Category = Text;
  type Quantity = Nat;
  type GuestId = Text;

  type ProductBadge = {
    #new;
    #bestseller;
  };

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

  module Product {
    type Product = {
      id : ProductId;
      name : Text;
      shortDescriptor : Text;
      description : Text;
      price : Price;
      images : [Storage.ExternalBlob];
      sizes : [Size];
      colors : [Color];
      category : Category;
      badge : ?ProductBadge;
      isNewProduct : Bool;
      isBestseller : Bool;
      productType : ?ProductType;
      usageCategory : ?UsageCategory;
    };
    public func compare(p1 : Product, p2 : Product) : Order.Order {
      Text.compare(p1.id, p2.id);
    };
  };

  type Product = {
    id : ProductId;
    name : Text;
    shortDescriptor : Text;
    description : Text;
    price : Price;
    images : [Storage.ExternalBlob];
    sizes : [Size];
    colors : [Color];
    category : Category;
    badge : ?ProductBadge;
    isNewProduct : Bool;
    isBestseller : Bool;
    productType : ?ProductType;
    usageCategory : ?UsageCategory;
  };

  type CartItem = {
    productId : ProductId;
    size : Size;
    color : Color;
    quantity : Quantity;
  };

  module CartItem {
    type CartItem = {
      productId : ProductId;
      size : Size;
      color : Color;
      quantity : Quantity;
    };

    public func compare(c1 : CartItem, c2 : CartItem) : Order.Order {
      switch (Text.compare(c1.productId, c2.productId)) {
        case (#equal) {
          switch (Text.compare(c1.size, c2.size)) {
            case (#equal) {
              switch (Text.compare(c1.color, c2.color)) {
                case (#equal) { Nat.compare(c1.quantity, c2.quantity) };
                case (order) { order };
              };
            };
            case (order) { order };
          };
        };
        case (order) { order };
      };
    };
  };

  type Cart = [CartItem];

  type Wishlist = Set.Set<ProductId>;

  type LookbookImage = {
    id : Text;
    image : Storage.ExternalBlob;
    description : Text;
    taggedProducts : [ProductId];
  };

  module LookbookImage {
    public func compare(l1 : LookbookImage, l2 : LookbookImage) : Order.Order {
      Text.compare(l1.id, l2.id);
    };
  };

  // Access Control State (Authorization)
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type UserSession = {
    cart : Cart;
    wishlist : Wishlist;
  };

  type UserProfile = {
    name : Text;
  };

  type GuestSession = {
    cart : Cart;
    wishlist : [ProductId];
  };

  type SiteContentBlock = {
    title : Text;
    content : Text;
    image : ?Storage.ExternalBlob;
  };

  type EditableText = {
    content : Text;
    isDraft : Bool;
    lastPublished : ?Int;
    lastEdited : ?Int;
  };

  type Banner = {
    id : Text;
    image : Storage.ExternalBlob;
    text : Text;
    link : ?Text;
  };

  type SiteContent = {
    heroText : EditableText;
    sections : [SiteContentBlock];
    contactDetails : EditableText;
    footerItems : [Text];
    darkModeEnabled : Bool;
    previewMode : Bool;
    banners : [Banner];
  };

  let products = Map.empty<ProductId, Product>();
  let userSessions = Map.empty<UserId, UserSession>();
  let lookbook = Map.empty<Text, LookbookImage>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let guestSessions = Map.empty<GuestId, GuestSession>();

  var siteContent : SiteContent = {
    heroText = { content = "<h1>Welcome to Our Store!</h1>"; isDraft = false; lastPublished = null; lastEdited = null };
    sections = [];
    contactDetails = {
      content = "<p>Contact us via WhatsApp</p>";
      isDraft = false;
      lastPublished = null;
      lastEdited = null;
    };
    footerItems = ["Home", "Shop", "About", "Contact"];
    darkModeEnabled = false;
    previewMode = false;
    banners = [];
  };

  var adminEmail : ?Text = ?"fitting.point.official@gmail.com";
  var adminPassword : ?Text = ?"Farhan@456";

  include MixinStorage();

  func toUpper(c : Char) : Char {
    switch (c.toText()) {
      case ("a") { 'A' };
      case ("b") { 'B' };
      case ("c") { 'C' };
      case ("d") { 'D' };
      case ("e") { 'E' };
      case ("f") { 'F' };
      case ("g") { 'G' };
      case ("h") { 'H' };
      case ("i") { 'I' };
      case ("j") { 'J' };
      case ("k") { 'K' };
      case ("l") { 'L' };
      case ("m") { 'M' };
      case ("n") { 'N' };
      case ("o") { 'O' };
      case ("p") { 'P' };
      case ("q") { 'Q' };
      case ("r") { 'R' };
      case ("s") { 'S' };
      case ("t") { 'T' };
      case ("u") { 'U' };
      case ("v") { 'V' };
      case ("w") { 'W' };
      case ("x") { 'X' };
      case ("y") { 'Y' };
      case ("z") { 'Z' };
      case (_) { c };
    };
  };

  func capitalizeFirst(s : Text) : Text {
    s.chars().foldRight("", func(c, acc) { toUpper(c).toText() # acc });
  };

  func generateId(input : Text) : Text {
    let cap = capitalizeFirst(input.trim(#char ' ')).toLower();
    cap.replace(#char ' ', "_");
  };

  // Add backend method to grant bootstrap admin privileges.
  public shared ({ caller }) func unlockBootstrapAdminPrivileges(adminToken : Text, userProvidedToken : Text) : async () {
    AccessControl.initialize(accessControlState, caller, adminToken, userProvidedToken);
  };

  /// Authenticate admin using email and password.
  public shared ({ caller }) func authenticateAdminWithEmailPassword(email : Text, password : Text) : async () {
    switch (adminEmail, adminPassword) {
      case (?storedEmail, ?storedPassword) {
        if (email == storedEmail and password == storedPassword) {
          AccessControl.assignRole(accessControlState, caller, caller, #admin);
        } else {
          Runtime.trap("Authentication failed. Check your credentials or unlock admin privileges.");
        };
      };
      case (_) { Runtime.trap("Administrator credentials not found. Contact support."); };
    };
  };

  // Banner Management
  public shared ({ caller }) func addBanner(image : Storage.ExternalBlob, text : Text, link : ?Text) : async Banner {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add banners");
    };

    let bannerId = generateId(text);
    let newBanner : Banner = {
      id = bannerId;
      image;
      text;
      link;
    };

    let updatedBanners = siteContent.banners.concat([newBanner]);
    siteContent := { siteContent with banners = updatedBanners };
    newBanner;
  };

  public shared ({ caller }) func updateBanner(id : Text, image : ?Storage.ExternalBlob, text : ?Text, link : ?Text) : async Banner {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update banners");
    };

    let bannerIndex = siteContent.banners.findIndex(func(b) { b.id == id });
    switch (bannerIndex) {
      case (null) { Runtime.trap("Banner with ID " # id # " not found") };
      case (?idx) {
        let banner = siteContent.banners[idx];
        let updatedBanner : Banner = {
          id = banner.id;
          image = switch (image) { case (null) { banner.image }; case (?img) { img } };
          text = switch (text) { case (null) { banner.text }; case (?txt) { txt } };
          link = link;
        };

        let updatedBanners = Array.tabulate(siteContent.banners.size(), func(i) { if (i == idx) { updatedBanner } else { siteContent.banners[i] } });

        siteContent := { siteContent with banners = updatedBanners };
        updatedBanner;
      };
    };
  };

  public shared ({ caller }) func deleteBanner(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete banners");
    };

    let filteredBanners = siteContent.banners.filter(func(b) { b.id != id });
    if (filteredBanners.size() == siteContent.banners.size()) {
      Runtime.trap("Banner with ID " # id # " not found");
    };
    siteContent := { siteContent with banners = filteredBanners };
  };

  public query ({ caller }) func getBanners() : async [Banner] {
    siteContent.banners;
  };

  // Site Content Management
  public shared ({ caller }) func saveDraft(content : Text, isHeroText : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update site content");
    };

    let time = ?Time.now();

    if (isHeroText) {
      siteContent := {
        siteContent with
        heroText = {
          content;
          isDraft = true;
          lastPublished = siteContent.heroText.lastPublished;
          lastEdited = time;
        };
      };
    } else {
      siteContent := {
        siteContent with
        contactDetails = {
          content;
          isDraft = true;
          lastPublished = siteContent.contactDetails.lastPublished;
          lastEdited = time;
        };
      };
    };
  };

  public shared ({ caller }) func publishSiteContent() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can publish site content");
    };

    siteContent := {
      siteContent with
      heroText = {
        siteContent.heroText with
        isDraft = false;
        lastPublished = ?Time.now();
      };
      contactDetails = {
        siteContent.contactDetails with
        isDraft = false;
        lastPublished = ?Time.now();
      };
      previewMode = false;
    };
  };

  public shared ({ caller }) func toggleDarkMode(enabled : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can toggle dark mode");
    };
    siteContent := {
      siteContent with darkModeEnabled = enabled;
    };
  };

  public query ({ caller }) func getSiteContent() : async SiteContent {
    // Public access - guests can view published site content
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

    let productName = product.name.trim(#char ' ');
    switch (productName.size()) {
      case (0) { Runtime.trap("Product name cannot be empty.") };
      case (nameLength) {
        if (nameLength < 3) {
          Runtime.trap("Product name must be at least 3 characters long.");
        };
      };
    };

    if (product.shortDescriptor.trim(#char ' ').size() == 0) {
      Runtime.trap("Short descriptor cannot be empty.");
    };

    if (product.price == 0) {
      Runtime.trap("Product price cannot be 0. Product #" # productName);
    };

    if (product.images.size() == 0) {
      Runtime.trap("Product must have at least one image. Product #" # productName);
    };

    if (product.sizes.size() == 0) {
      Runtime.trap("Product must have at least one size. Product #" # productName);
    };

    if (product.colors.size() == 0) {
      Runtime.trap("Product must have at least one color. Product #" # productName);
    };

    let productId = generateId(product.name);
    let newProduct = { product with id = productId };

    products.add(productId, newProduct);
  };

  public shared ({ caller }) func adminUpdateProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };

    let productName = product.name.trim(#char ' ');
    switch (productName.size()) {
      case (0) { Runtime.trap("Product name cannot be empty.") };
      case (nameLength) {
        if (nameLength < 3) {
          Runtime.trap("Product name must be at least 3 characters long.");
        };
      };
    };

    if (product.shortDescriptor.trim(#char ' ').size() == 0) {
      Runtime.trap("Short descriptor cannot be empty.");
    };

    if (product.price == 0) {
      Runtime.trap("Product price cannot be 0. Product #" # productName);
    };

    if (product.images.size() == 0) {
      Runtime.trap("Product must have at least one image. Product #" # productName);
    };

    if (product.sizes.size() == 0) {
      Runtime.trap("Product must have at least one size. Product #" # productName);
    };

    if (product.colors.size() == 0) {
      Runtime.trap("Product must have at least one color. Product #" # productName);
    };
    let productId = generateId(product.name);
    let newProduct = { product with id = productId };

    products.add(productId, newProduct);
  };

  public shared ({ caller }) func adminDeleteProduct(productId : ProductId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };

    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product with ID #" # productId # " does not exist. ") };
      case (?_) {
        products.remove(productId);
      };
    };
  };

  // Product Viewing (Public)
  public query ({ caller }) func getProduct(productId : ProductId) : async Product {
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public query ({ caller }) func filterProductsByCategory(category : Category) : async [Product] {
    products.values().toArray().filter(func(p) { p.category == category });
  };

  public query ({ caller }) func filterProductsBySize(size : Size) : async [Product] {
    products.values().toArray().filter(func(p) { p.sizes.find(func(s) { s == size }) != null });
  };

  public query ({ caller }) func filterProductsByColor(color : Color) : async [Product] {
    products.values().toArray().filter(func(p) { p.colors.find(func(c) { c == color }) != null });
  };

  public query ({ caller }) func searchProducts(searchTerm : Text) : async [Product] {
    let term = searchTerm.toLower();
    products.values().toArray().filter(
      func(p) {
        p.name.contains(#text term) or p.description.contains(#text term)
      }
    );
  };

  // Cart Management (User-only)
  public shared ({ caller }) func addToCart(item : CartItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add items to cart");
    };

    let session = switch (userSessions.get(caller)) {
      case (null) {
        { cart = []; wishlist = Set.empty<ProductId>() };
      };
      case (?existing) { existing };
    };

    let newCart = session.cart.concat([item]);

    let newSession = {
      cart = newCart;
      wishlist = session.wishlist;
    };
    userSessions.add(caller, newSession);
  };

  public shared ({ caller }) func removeFromCart(productId : ProductId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove items from cart");
    };

    let session = switch (userSessions.get(caller)) {
      case (null) {
        { cart = []; wishlist = Set.empty<ProductId>() };
      };
      case (?existing) { existing };
    };

    let filteredCart = switch (session.cart.find(func(item) { item.productId == productId })) {
      case (null) { Runtime.trap("Product not found in cart") };
      case (?item) {
        session.cart.filter(func(cartItem) { cartItem != item });
      };
    };

    let newSession = {
      cart = filteredCart;
      wishlist = session.wishlist;
    };
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

  // Wishlist Management (User-only)
  public shared ({ caller }) func addToWishlist(productId : ProductId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add items to wishlist");
    };

    let session = switch (userSessions.get(caller)) {
      case (null) {
        { cart = []; wishlist = Set.empty<ProductId>() };
      };
      case (?existing) { existing };
    };

    if (session.wishlist.contains(productId)) {
      Runtime.trap("Product '" # productId # "' is already in the wishlist.");
    };

    let newWishlist = Set.fromIter(session.wishlist.values());
    newWishlist.add(productId);

    let newSession = {
      cart = session.cart;
      wishlist = newWishlist;
    };
    userSessions.add(caller, newSession);
  };

  public query ({ caller }) func getWishlist() : async [ProductId] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their wishlist");
    };

    switch (userSessions.get(caller)) {
      case (null) { [] };
      case (?session) { session.wishlist.toArray() };
    };
  };

  // Lookbook Management
  public shared ({ caller }) func addLookbookImage(image : LookbookImage) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add lookbook images");
    };

    lookbook.add(image.id, image);
  };

  public query ({ caller }) func getLookbookImage(imageId : Text) : async LookbookImage {
    switch (lookbook.get(imageId)) {
      case (null) { Runtime.trap("Lookbook image not found") };
      case (?image) { image };
    };
  };

  public query ({ caller }) func getAllLookbookImages() : async [LookbookImage] {
    lookbook.values().toArray().sort();
  };
};
