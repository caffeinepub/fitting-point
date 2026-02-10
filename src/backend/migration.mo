import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Set "mo:core/Set";
import Array "mo:core/Array";
import Storage "blob-storage/Storage";
import Text "mo:core/Text";

module {
  type ProductId = Text;
  type UserId = Principal;
  type Price = Nat;
  type Size = Text;
  type Color = Text;
  type Category = Text;
  type Quantity = Nat;
  type GuestId = Text;

  type Product = {
    id : ProductId;
    name : Text;
    description : Text;
    price : Price;
    images : [Storage.ExternalBlob];
    sizes : [Size];
    colors : [Color];
    category : Category;
  };

  type CartItem = {
    productId : ProductId;
    size : Size;
    color : Color;
    quantity : Quantity;
  };

  type Cart = [CartItem];

  type Wishlist = Set.Set<ProductId>;

  type LookbookImage = {
    id : Text;
    image : Storage.ExternalBlob;
    description : Text;
    taggedProducts : [ProductId];
  };

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

  type OldSiteContent = {
    heroText : EditableText;
    sections : [SiteContentBlock];
    contactDetails : EditableText;
    footerItems : [Text];
    darkModeEnabled : Bool;
    previewMode : Bool;
  };

  type NewSiteContent = {
    heroText : EditableText;
    sections : [SiteContentBlock];
    contactDetails : EditableText;
    footerItems : [Text];
    darkModeEnabled : Bool;
    previewMode : Bool;
    banners : [Banner];
  };

  type OldActor = {
    products : Map.Map<Text, Product>;
    userSessions : Map.Map<Principal, UserSession>;
    lookbook : Map.Map<Text, LookbookImage>;
    userProfiles : Map.Map<Principal, UserProfile>;
    guestSessions : Map.Map<Text, GuestSession>;
    siteContent : OldSiteContent;
  };

  type NewActor = {
    products : Map.Map<Text, Product>;
    userSessions : Map.Map<Principal, UserSession>;
    lookbook : Map.Map<Text, LookbookImage>;
    userProfiles : Map.Map<Principal, UserProfile>;
    guestSessions : Map.Map<Text, GuestSession>;
    siteContent : NewSiteContent;
  };

  public func run(old : OldActor) : NewActor {
    let newSiteContent : NewSiteContent = {
      old.siteContent with
      banners = [];
    };
    {
      old with
      siteContent = newSiteContent;
    };
  };
};
