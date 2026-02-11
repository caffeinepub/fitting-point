import type { CatalogFilter } from '../App';

export type NavItem = {
  label: string;
  subcategories?: SubCategory[];
  filter?: CatalogFilter;
};

export type SubCategory = {
  label: string;
  filter: CatalogFilter;
};

export const navigationStructure: NavItem[] = [
  {
    label: 'Home',
    filter: {},
  },
  {
    label: 'Ihram',
    subcategories: [
      { label: 'Cotton Ihram', filter: { category: 'Ihram', subcategory: 'Cotton' } },
      { label: 'Towel Ihram', filter: { category: 'Ihram', subcategory: 'Towel' } },
      { label: 'Kids Ihram', filter: { category: 'Ihram', subcategory: 'Kids' } },
    ],
  },
  {
    label: 'Belts',
    subcategories: [
      { label: 'Leather Belts', filter: { category: 'Belts', subcategory: 'Leather' } },
      { label: 'Fabric Belts', filter: { category: 'Belts', subcategory: 'Fabric' } },
      { label: 'Ihram Belts', filter: { category: 'Belts', subcategory: 'Ihram' } },
    ],
  },
  {
    label: 'Accessories',
    subcategories: [
      { label: 'Ihram Belt', filter: { category: 'Accessories', productType: 'accessory' } },
      { label: 'Shoe Bag', filter: { category: 'Accessories', subcategory: 'Shoe Bag' } },
      { label: 'Ihram Soap', filter: { category: 'Accessories', subcategory: 'Soap' } },
      { label: 'Prayer Beads', filter: { category: 'Accessories', subcategory: 'Prayer Beads' } },
    ],
  },
  {
    label: 'Hajj & Umrah',
    subcategories: [
      { label: 'Hajj Essentials', filter: { usageCategory: 'hajj' } },
      { label: 'Umrah Essentials', filter: { usageCategory: 'umrah' } },
      { label: 'Complete Kits', filter: { usageCategory: 'both' } },
    ],
  },
  {
    label: 'New Arrivals',
    filter: { isNew: true },
  },
];

export const homepageCategoryCards = [
  {
    title: 'Ihram',
    description: 'Premium quality Ihram for your sacred journey',
    filter: { category: 'Ihram' },
    image: '/assets/generated/mens-suit-1.dim_800x800.jpg',
  },
  {
    title: 'Belts',
    description: 'Elegant belts for comfort and style',
    filter: { category: 'Belts' },
    image: '/assets/short belt hero 1.png',
  },
  {
    title: 'Accessories',
    description: 'Essential accessories for pilgrims',
    filter: { category: 'Accessories' },
    image: '/assets/generated/handbag-luxury.dim_800x800.jpg',
  },
];
