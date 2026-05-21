export const CATEGORIES = {
  men: ["T-Shirts", "Shirts", "Jeans", "Trousers", "Jackets", "Hoodies", "Suits", "Activewear", "Innerwear", "Footwear"],
  women: ["Dresses", "Tops", "Jeans", "Skirts", "Sarees", "Kurtas", "Jackets", "Activewear", "Lingerie", "Footwear"],
  kids: ["Boys T-Shirts", "Boys Jeans", "Girls Dresses", "Girls Tops", "Sleepwear", "School Uniforms", "Activewear", "Footwear", "Infant Wear"],
  unisex: ["T-Shirts", "Hoodies", "Sweatpants", "Jeans", "Jackets", "Accessories", "Footwear", "Bags"], // <-- NEW: Unisex categories
} as const;

export type CategoryKey = keyof typeof CATEGORIES;

export const BRANDS: { name: string; logo: string }[] = [
  { name: "Nike", logo: "https://cdn.worldvectorlogo.com/logos/nike-6.svg" },
  { name: "Adidas", logo: "https://cdn.worldvectorlogo.com/logos/adidas-2.svg" },
  { name: "Puma", logo: "https://cdn.worldvectorlogo.com/logos/puma-logo.svg" },
  { name: "Gucci", logo: "https://cdn.worldvectorlogo.com/logos/gucci.svg" },
  { name: "Levi's", logo: "https://cdn.worldvectorlogo.com/logos/levi-s-1.svg" },
  { name: "Zara", logo: "https://cdn.worldvectorlogo.com/logos/zara-1.svg" },
  { name: "H&M", logo: "https://cdn.worldvectorlogo.com/logos/h-m-1.svg" },
  { name: "Calvin Klein", logo: "https://cdn.worldvectorlogo.com/logos/calvin-klein-1.svg" },
  { name: "Tommy Hilfiger", logo: "https://cdn.worldvectorlogo.com/logos/tommy-hilfiger-1.svg" },
  { name: "Versace", logo: "https://cdn.worldvectorlogo.com/logos/versace-2.svg" },
  { name: "Prada", logo: "https://cdn.worldvectorlogo.com/logos/prada.svg" },
  { name: "Louis Vuitton", logo: "https://cdn.worldvectorlogo.com/logos/louis-vuitton-1.svg" },
  { name: "Under Armour", logo: "https://cdn.worldvectorlogo.com/logos/under-armour-2.svg" },
  { name: "Reebok", logo: "https://cdn.worldvectorlogo.com/logos/reebok-2.svg" },
  { name: "New Balance", logo: "https://cdn.worldvectorlogo.com/logos/new-balance-1.svg" },
];

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
export const COLORS = ["Black", "White", "Red", "Blue", "Green", "Yellow", "Pink", "Grey", "Beige", "Navy"];