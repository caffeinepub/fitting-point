import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Category = string;
export interface CartItem {
    color: Color;
    size: Size;
    productId: ProductId;
    quantity: Quantity;
}
export type Cart = Array<CartItem>;
export type Size = string;
export type ProductType = {
    __kind__: "accessory";
    accessory: null;
} | {
    __kind__: "clothing";
    clothing: null;
} | {
    __kind__: "other";
    other: string;
} | {
    __kind__: "footwear";
    footwear: null;
} | {
    __kind__: "electronics";
    electronics: null;
};
export interface SiteContentBlock {
    title: string;
    content: string;
    image?: ExternalBlob;
}
export type Price = bigint;
export interface Banner {
    id: string;
    link?: string;
    text: string;
    image: ExternalBlob;
}
export type Quantity = bigint;
export interface LookbookImage {
    id: string;
    description: string;
    image: ExternalBlob;
    taggedProducts: Array<ProductId>;
}
export type Color = string;
export type ProductId = string;
export interface SiteContent {
    banners: Array<Banner>;
    heroText: EditableText;
    footerItems: Array<string>;
    sections: Array<SiteContentBlock>;
    previewMode: boolean;
    darkModeEnabled: boolean;
    contactDetails: EditableText;
}
export interface EditableText {
    lastEdited?: bigint;
    content: string;
    lastPublished?: bigint;
    isDraft: boolean;
}
export interface Product {
    id: ProductId;
    isNewProduct: boolean;
    name: string;
    shortDescriptor: string;
    usageCategory?: UsageCategory;
    description: string;
    productType?: ProductType;
    sizes: Array<Size>;
    isBestseller: boolean;
    category: Category;
    badge?: ProductBadge;
    colors: Array<Color>;
    price: Price;
    images: Array<ExternalBlob>;
}
export interface UserProfile {
    name: string;
}
export enum ProductBadge {
    new_ = "new",
    bestseller = "bestseller"
}
export enum UsageCategory {
    both = "both",
    hajj = "hajj",
    umrah = "umrah"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addBanner(image: ExternalBlob, text: string, link: string | null): Promise<Banner>;
    addLookbookImage(image: LookbookImage): Promise<void>;
    addProduct(product: Product): Promise<void>;
    addToCart(item: CartItem): Promise<void>;
    addToWishlist(productId: ProductId): Promise<void>;
    adminDeleteProduct(productId: ProductId): Promise<void>;
    adminUpdateProduct(product: Product): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    /**
     * / Authenticate admin using email and password.
     */
    authenticateAdminWithEmailPassword(email: string, password: string): Promise<void>;
    deleteBanner(id: string): Promise<void>;
    filterProductsByCategory(category: Category): Promise<Array<Product>>;
    filterProductsByColor(color: Color): Promise<Array<Product>>;
    filterProductsBySize(size: Size): Promise<Array<Product>>;
    getAllLookbookImages(): Promise<Array<LookbookImage>>;
    getAllProducts(): Promise<Array<Product>>;
    getBanners(): Promise<Array<Banner>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Cart>;
    getLookbookImage(imageId: string): Promise<LookbookImage>;
    getProduct(productId: ProductId): Promise<Product>;
    getSiteContent(): Promise<SiteContent>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWishlist(): Promise<Array<ProductId>>;
    isCallerAdmin(): Promise<boolean>;
    publishSiteContent(): Promise<void>;
    removeFromCart(productId: ProductId): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveDraft(content: string, isHeroText: boolean): Promise<void>;
    searchProducts(searchTerm: string): Promise<Array<Product>>;
    toggleDarkMode(enabled: boolean): Promise<void>;
    unlockBootstrapAdminPrivileges(adminToken: string, userProvidedToken: string): Promise<void>;
    updateBanner(id: string, image: ExternalBlob | null, text: string | null, link: string | null): Promise<Banner>;
}
