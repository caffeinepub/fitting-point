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
export interface LookbookImage {
    id: string;
    description: string;
    image: ExternalBlob;
    taggedProducts: Array<string>;
}
export type Cart = Array<CartItem>;
export interface CartItem {
    color: string;
    size: string;
    productId: string;
    quantity: bigint;
}
export interface SiteContent {
    heroText: string;
    footerItems: Array<string>;
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
export interface UserProfile {
    name: string;
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
    addLookbookImage(image: LookbookImage): Promise<void>;
    addProduct(product: Product): Promise<void>;
    addToCart(item: CartItem): Promise<void>;
    adminDeleteProduct(productId: string): Promise<void>;
    adminUpdateProduct(productId: string, product: Product): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    filterProductsByCategory(category: string): Promise<Array<Product>>;
    getAllLookbookImages(): Promise<Array<LookbookImage>>;
    getAllProducts(): Promise<Array<Product>>;
    getBestsellers(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Cart>;
    getLookbookImage(imageId: string): Promise<LookbookImage>;
    getMostLovedProducts(): Promise<Array<Product>>;
    getNewProducts(): Promise<Array<Product>>;
    getProduct(productId: string): Promise<Product>;
    getSiteContent(): Promise<SiteContent>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isReady(): Promise<boolean>;
    removeFromCart(productId: string, size: string, color: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateSiteContent(heroText: string, contactDetails: string, darkModeEnabled: boolean): Promise<void>;
}
