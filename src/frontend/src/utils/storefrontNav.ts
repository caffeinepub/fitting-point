import type { CatalogFilter } from '../App';

export interface SubCategory {
  label: string;
  filter: CatalogFilter;
}

export interface NavItem {
  label: string;
  filter?: CatalogFilter;
  subcategories?: SubCategory[];
}

export const navigationStructure: NavItem[] = [
  { label: 'Home', filter: {} },
  {
    label: 'Ihram',
    filter: { category: 'Ihram' },
    subcategories: [
      { label: 'Cotton Ihram', filter: { category: 'Ihram', productType: 'clothing' } },
      { label: 'Towel Ihram', filter: { category: 'Ihram', productType: 'clothing' } },
      { label: 'Kids Ihram', filter: { category: 'Ihram', productType: 'clothing' } },
    ],
  },
  {
    label: 'Belts',
    filter: { category: 'Belts' },
    subcategories: [
      { label: 'Leather Belts', filter: { category: 'Belts', productType: 'accessory' } },
      { label: 'Fabric Belts', filter: { category: 'Belts', productType: 'accessory' } },
      { label: 'Ihram Belts', filter: { category: 'Belts', usageCategory: 'both' } },
    ],
  },
  {
    label: 'Accessories',
    filter: { category: 'Accessories' },
    subcategories: [
      { label: 'Shoe Bag', filter: { category: 'Accessories', productType: 'accessory' } },
      { label: 'Ihram Soap', filter: { category: 'Accessories', productType: 'accessory' } },
      { label: 'Prayer Beads', filter: { category: 'Accessories', productType: 'accessory' } },
    ],
  },
  {
    label: 'Hajj & Umrah',
    filter: { usageCategory: 'both' },
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
    image: '/assets/hero1.png',
    filter: { category: 'Ihram' } as CatalogFilter,
  },
  {
    title: 'Belts',
    description: 'Secure and comfortable Ihram belts',
    image: '/assets/short belt hero 1.png',
    filter: { category: 'Belts' } as CatalogFilter,
  },
  {
    title: 'Accessories',
    description: 'Essential accessories for pilgrims',
    image: '/assets/generated/handbag-luxury.dim_800x800.jpg',
    filter: { category: 'Accessories' } as CatalogFilter,
  },
];
