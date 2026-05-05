export const CATEGORIES = [
  { id: 'laptops', name: 'Laptops', icon: 'Laptop' },
  { id: 'smartphones', name: 'Smartphones', icon: 'Smartphone' },
  { id: 'headphones', name: 'Headphones', icon: 'Headphones' },
  { id: 'tvs', name: 'TVs', icon: 'Tv' },
  { id: 'cameras', name: 'Cameras', icon: 'Camera' },
];

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest' },
];

export const FILTERS = {
  price: { min: 0, max: 5000 },
  ratings: [4, 3, 2, 1],
};
