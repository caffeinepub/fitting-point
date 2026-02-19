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
export interface UserProfile {
    name: string;
    email?: string;
    address?: string;
    phone?: string;
}
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
export interface Logo {
    link?: string;
    image: ExternalBlob;
    altText: string;
}
export interface BannerImage {
    id: string;
    title: string;
    order: bigint;
    link?: string;
    description: string;
    image: ExternalBlob;
}
export interface LookbookImage {
    id: string;
    description: string;
    image: ExternalBlob;
    taggedProducts: Array<string>;
}
export interface Cart {
    items: Array<CartItem>;
}
export interface CartItem {
    color: string;
    size: string;
    productId: string;
    quantity: bigint;
}
export interface SiteContent {
    heroText: string;
    footerItems: Array<string>;
    companyName: string;
    sections: Array<SiteContentBlock>;
    darkModeEnabled: boolean;
    contactDetails: string;
}
export interface Product {
    id: string;
    isNewProduct: boolean;
    name: string;
    shortDescriptor: string;
    usageCategory?: UsageCategory;
    description: string;
    productType?: ProductType;
    sizes: Array<string>;
    isMostLoved: boolean;
    isBestseller: boolean;
    category: string;
    colors: Array<string>;
    price: bigint;
    images: Array<ExternalBlob>;
}
export interface Category {
    name: string;
    description: string;
    isActive: boolean;
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
    addBanner(id: string, image: ExternalBlob, title: string, description: string, link: string | null, order: bigint): Promise<string>;
    addLookbookImage(image: LookbookImage): Promise<void>;
    addProduct(product: Product): Promise<void>;
    addToCart(items: Array<CartItem>): Promise<void>;
    adminUpdateProduct(productId: string, product: Product): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    closeAdminSignupWindow(): Promise<void>;
    createCategory(name: string, description: string): Promise<string>;
    deleteCategory(name: string): Promise<string>;
    filterProductsByCategory(category: string): Promise<Array<Product>>;
    getAllBanners(): Promise<Array<BannerImage>>;
    getAllCategories(): Promise<Array<Category>>;
    getAllLookbookImages(): Promise<Array<LookbookImage>>;
    getAllProducts(): Promise<Array<Product>>;
    getBestsellers(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Cart>;
    getLogo(): Promise<Logo | null>;
    getLookbookImage(imageId: string): Promise<LookbookImage>;
    getMostLovedProducts(): Promise<Array<Product>>;
    getNewProducts(): Promise<Array<Product>>;
    getProduct(productId: string): Promise<Product>;
    getSiteContent(): Promise<SiteContent>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isAdminSignupEnabled(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    isReady(): Promise<boolean>;
    registerAdmin(): Promise<string>;
    removeBanner(bannerId: string): Promise<string>;
    removeFromCart(productId: string, size: string, color: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateBannerOrder(bannerOrders: Array<[string, bigint]>): Promise<string>;
    updateCategoryDescription(name: string, newDescription: string): Promise<string>;
    updateLogo(image: ExternalBlob, altText: string, link: string | null): Promise<void>;
    updateSiteContent(heroText: string, contactDetails: string, darkModeEnabled: boolean, companyName: string): Promise<void>;
}
