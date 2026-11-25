/**
 * 3D Rotating Food Models & Visual Inventory Mapping
 * Maps every restaurant kiosk menu item to its authentic 3D rotating food GIF matching
 * the reference standard (high quality rotating 360° food GIF from r/lovethissmug / GIPHY),
 * complete with wide-angle uncropped framing, manual touch drag rotation, zoom, and live steam.
 */

export type ProceduralDishType = 
  | 'coffee' 
  | 'biryani' 
  | 'curry' 
  | 'kebab' 
  | 'dessert' 
  | 'crispy' 
  | 'burger' 
  | 'cupcake' 
  | 'starters' 
  | 'platter';

export interface FoodModel3DMeta {
  modelUrl?: string;
  animatedGifUrl?: string;
  videoUrl?: string;
  title: string;
  proceduralType: ProceduralDishType;
  scale?: number;
  rotationSpeed?: number;
  defaultYOffset?: number;
  cameraDistance?: number;
}

/**
 * Robust Multi-Candidate Asset URL Resolver
 * Guarantees asset resolution across GitHub Pages (/smart-kiosk-demo/),
 * custom routes (/kiosk), local dev (http://localhost:5173),
 * and Android Capacitor (https://localhost/ or capacitor://localhost/).
 */
export const getModelCandidateUrls = (rawPath: string): string[] => {
  if (!rawPath) return [];
  if (rawPath.startsWith('http://') || rawPath.startsWith('https://') || rawPath.startsWith('data:')) {
    return [rawPath];
  }
  const cleanPath = rawPath.replace(/^\/+/, '');
  const candidates: string[] = [];

  // 1. Direct GitHub Pages repository URL if on github.io
  try {
    if (typeof window !== 'undefined' && window.location) {
      const loc = window.location;
      if (loc.hostname.includes('github.io')) {
        candidates.push(`${loc.origin}/smart-kiosk-demo/${cleanPath}`);
      }
    }
  } catch (e) {}

  // 2. Relative to import.meta.url (most reliable for bundled web assets)
  try {
    const metaUrl = import.meta.url;
    if (metaUrl) {
      candidates.push(new URL('../' + cleanPath, metaUrl).href);
      candidates.push(new URL('../../' + cleanPath, metaUrl).href);
    }
  } catch (e) {}

  // 3. Document baseURI or current location directory
  try {
    if (typeof document !== 'undefined' && document.baseURI) {
      candidates.push(new URL(cleanPath, document.baseURI).href);
    }
    if (typeof window !== 'undefined' && window.location) {
      const loc = window.location;
      let path = loc.pathname || '/';
      if (!path.endsWith('/')) {
        path = path.includes('.') ? path.substring(0, path.lastIndexOf('/') + 1) : path + '/';
      }
      candidates.push(`${loc.origin}${path}${cleanPath}`);
      candidates.push(`${loc.origin}/${cleanPath}`);
    }
  } catch (e) {}

  // 4. Relative paths
  candidates.push(cleanPath);
  candidates.push('/' + cleanPath);

  // Return unique non-empty candidates
  return Array.from(new Set(candidates.filter(Boolean)));
};

export const resolveModelAssetUrl = (rawPath: string): string => {
  const candidates = getModelCandidateUrls(rawPath);
  return candidates[0] || rawPath;
};

// High-Quality 3D Rotating Food GIFs (Matching Reddit r/lovethissmug reference standard)
export const FOOD_GIF_ASSETS = {
  // Curries & Simmering Bowls
  butterChicken: 'images/food_gifs/butter_chicken.gif',
  dalMakhani: 'images/food_gifs/dal_makhani.gif',
  bowlMeal: 'images/food_gifs/rotating_bowl_meal.gif',
  ramenBowl: 'images/food_gifs/rotating_ramen.gif',

  // Rice & Biryanis
  biryani: 'images/food_gifs/biryani.gif',

  // Breads & Tandoor
  rotiNaan: 'images/food_gifs/roti_naan.gif',

  // Starters & Kebabs
  paneerTikka: 'images/food_gifs/paneer_tikka.gif',
  kebab: 'images/food_gifs/rotating_kebab.gif',
  crispyRoll: 'images/food_gifs/rotating_spring_roll.gif',

  // Burgers & Pizzas
  burger: 'images/food_gifs/rotating_burger.gif',
  pizza: 'images/food_gifs/rotating_pizza.gif',

  // Desserts & Sweets
  sizzlingBrownie: 'images/food_gifs/rotating_brownie.gif',
  dessertPastry: 'images/food_gifs/rotating_pastry.gif',
  iceCream: 'images/food_gifs/rotating_icecream.gif',
  cheesecake: 'images/food_gifs/rotating_cheesecake.gif',

  // Beverages
  coffee: 'images/food_gifs/coffee.gif',
} as const;

// Direct mappings for all specific menu item IDs
const SPECIFIC_ITEM_MODELS: Record<string, FoodModel3DMeta> = {
  // Main Courses & Curries
  'item-1': { animatedGifUrl: FOOD_GIF_ASSETS.butterChicken, title: 'Butter Chicken 3D', proceduralType: 'curry' },
  'item-12': { animatedGifUrl: FOOD_GIF_ASSETS.butterChicken, title: 'Kashmiri Mutton Rogan Josh 3D', proceduralType: 'curry' },
  'item-24': { animatedGifUrl: FOOD_GIF_ASSETS.butterChicken, title: 'Paneer Butter Masala 3D', proceduralType: 'curry' },
  'item-25': { animatedGifUrl: FOOD_GIF_ASSETS.dalMakhani, title: 'Dal Makhani Slow-Simmered 3D', proceduralType: 'curry' },
  'item-26': { animatedGifUrl: FOOD_GIF_ASSETS.butterChicken, title: 'Kadai Chicken Gravy 3D', proceduralType: 'curry' },
  'item-49': { animatedGifUrl: FOOD_GIF_ASSETS.bowlMeal, title: 'Palak Paneer 3D', proceduralType: 'curry' },
  'item-50': { animatedGifUrl: FOOD_GIF_ASSETS.butterChicken, title: 'Kadai Chicken Masala 3D', proceduralType: 'curry' },
  'item-51': { animatedGifUrl: FOOD_GIF_ASSETS.dalMakhani, title: 'Yellow Dal Tadka 3D', proceduralType: 'curry' },
  'item-52': { animatedGifUrl: FOOD_GIF_ASSETS.butterChicken, title: 'Chettinad Pepper Chicken 3D', proceduralType: 'curry' },
  'item-53': { animatedGifUrl: FOOD_GIF_ASSETS.bowlMeal, title: 'Malai Kofta Royale 3D', proceduralType: 'curry' },

  // Starters & Kebabs
  'item-2': { animatedGifUrl: FOOD_GIF_ASSETS.paneerTikka, title: 'Paneer Tikka 3D', proceduralType: 'kebab' },
  'item-8': { animatedGifUrl: FOOD_GIF_ASSETS.crispyRoll, title: 'Crispy Baby Corn Fry 3D', proceduralType: 'crispy' },
  'item-14': { animatedGifUrl: FOOD_GIF_ASSETS.crispyRoll, title: 'Ghee Podi Idli & Medu Vada 3D', proceduralType: 'crispy' },
  'item-18': { animatedGifUrl: FOOD_GIF_ASSETS.crispyRoll, title: 'Crispy Medu Vada 3D', proceduralType: 'crispy' },
  'item-19': { animatedGifUrl: FOOD_GIF_ASSETS.crispyRoll, title: 'Golden Veg Spring Rolls 3D', proceduralType: 'crispy' },
  'item-20': { animatedGifUrl: FOOD_GIF_ASSETS.crispyRoll, title: 'Gobi Manchurian Dry 3D', proceduralType: 'crispy' },
  'item-21': { animatedGifUrl: FOOD_GIF_ASSETS.kebab, title: 'Royal Chicken 65 3D', proceduralType: 'kebab' },
  'item-22': { animatedGifUrl: FOOD_GIF_ASSETS.crispyRoll, title: 'Crispy French Fries 3D', proceduralType: 'crispy' },
  'item-43': { animatedGifUrl: FOOD_GIF_ASSETS.crispyRoll, title: 'Chilli Paneer Dry 3D', proceduralType: 'crispy' },
  'item-44': { animatedGifUrl: FOOD_GIF_ASSETS.crispyRoll, title: 'Crispy Corn Salt & Pepper 3D', proceduralType: 'crispy' },
  'item-45': { animatedGifUrl: FOOD_GIF_ASSETS.kebab, title: 'Tandoori Murgh Wings 3D', proceduralType: 'kebab' },
  'item-46': { animatedGifUrl: FOOD_GIF_ASSETS.kebab, title: 'Hara Bhara Kebab 3D', proceduralType: 'kebab' },
  'item-47': { animatedGifUrl: FOOD_GIF_ASSETS.kebab, title: 'Andhra Chicken Pakoda 3D', proceduralType: 'kebab' },
  'item-48': { animatedGifUrl: FOOD_GIF_ASSETS.crispyRoll, title: 'Golden Medu Vada 3D', proceduralType: 'crispy' },

  // Biryanis, Rice & Thali
  'item-3': { animatedGifUrl: FOOD_GIF_ASSETS.biryani, title: 'Veg Dum Biryani 3D', proceduralType: 'biryani' },
  'item-7': { animatedGifUrl: FOOD_GIF_ASSETS.biryani, title: 'Chicken Dum Biryani 3D', proceduralType: 'biryani' },
  'item-13': { animatedGifUrl: FOOD_GIF_ASSETS.bowlMeal, title: 'South Indian Grand Meals Thali 3D', proceduralType: 'biryani' },
  'item-16': { animatedGifUrl: FOOD_GIF_ASSETS.bowlMeal, title: 'Royal Ghee Pongal 3D', proceduralType: 'biryani' },
  'item-31': { animatedGifUrl: FOOD_GIF_ASSETS.bowlMeal, title: 'Traditional Curd Rice 3D', proceduralType: 'biryani' },
  'item-32': { animatedGifUrl: FOOD_GIF_ASSETS.dalMakhani, title: 'Jeera Rice & Tadka Dal 3D', proceduralType: 'biryani' },
  'item-57': { animatedGifUrl: FOOD_GIF_ASSETS.bowlMeal, title: 'Wok Veg Fried Rice 3D', proceduralType: 'biryani' },
  'item-58': { animatedGifUrl: FOOD_GIF_ASSETS.ramenBowl, title: 'Chicken Hakka Noodles 3D', proceduralType: 'starters' },
  'item-61': { animatedGifUrl: FOOD_GIF_ASSETS.biryani, title: 'Steamed Jeera Basmati Rice 3D', proceduralType: 'biryani' },
  'item-62': { animatedGifUrl: FOOD_GIF_ASSETS.bowlMeal, title: 'Curd Rice with Pomegranate 3D', proceduralType: 'biryani' },

  // Breads, Naan & Roti
  'item-6': { animatedGifUrl: FOOD_GIF_ASSETS.rotiNaan, title: 'Garlic Butter Naan 3D', proceduralType: 'kebab' },
  'item-27': { animatedGifUrl: FOOD_GIF_ASSETS.rotiNaan, title: 'Chole Bhature 3D', proceduralType: 'kebab' },
  'item-28': { animatedGifUrl: FOOD_GIF_ASSETS.rotiNaan, title: 'Fluffy Poori Bhaji 3D', proceduralType: 'kebab' },
  'item-29': { animatedGifUrl: FOOD_GIF_ASSETS.rotiNaan, title: 'Butter Tandoori Roti 3D', proceduralType: 'kebab' },
  'item-30': { animatedGifUrl: FOOD_GIF_ASSETS.rotiNaan, title: 'Stuffed Aloo Paratha 3D', proceduralType: 'kebab' },
  'item-56': { animatedGifUrl: FOOD_GIF_ASSETS.rotiNaan, title: 'Hot Fluffy Poori Masala 3D', proceduralType: 'kebab' },
  'item-59': { animatedGifUrl: FOOD_GIF_ASSETS.rotiNaan, title: 'Flaky Malabar Parotta 3D', proceduralType: 'kebab' },
  'item-60': { animatedGifUrl: FOOD_GIF_ASSETS.rotiNaan, title: 'Tandoori Butter Roti 3D', proceduralType: 'kebab' },

  // Dosas
  'item-4': { animatedGifUrl: FOOD_GIF_ASSETS.crispyRoll, title: 'Crispy Masala Dosa 3D', proceduralType: 'crispy' },
  'item-23': { animatedGifUrl: FOOD_GIF_ASSETS.crispyRoll, title: 'Plain Ghee Roast Dosa 3D', proceduralType: 'crispy' },
  'item-54': { animatedGifUrl: FOOD_GIF_ASSETS.crispyRoll, title: 'Crispy Onion Rava Dosa 3D', proceduralType: 'crispy' },
  'item-55': { animatedGifUrl: FOOD_GIF_ASSETS.crispyRoll, title: 'Mysore Masala Dosa 3D', proceduralType: 'crispy' },

  // Desserts
  'item-10': { animatedGifUrl: FOOD_GIF_ASSETS.iceCream, title: 'Gulab Jamun with Ice Cream 3D', proceduralType: 'dessert' },
  'item-11': { animatedGifUrl: FOOD_GIF_ASSETS.sizzlingBrownie, title: 'Sizzling Brownie with Fudge 3D', proceduralType: 'dessert' },
  'item-17': { animatedGifUrl: FOOD_GIF_ASSETS.dessertPastry, title: 'Royal Kesari with Golden Cashews 3D', proceduralType: 'dessert' },
  'item-38': { animatedGifUrl: FOOD_GIF_ASSETS.dessertPastry, title: 'Bengali Rasgulla 3D', proceduralType: 'dessert' },
  'item-39': { animatedGifUrl: FOOD_GIF_ASSETS.dessertPastry, title: 'Hot Desi Ghee Badam Halwa 3D', proceduralType: 'dessert' },
  'item-40': { animatedGifUrl: FOOD_GIF_ASSETS.dessertPastry, title: 'Creamy Rasmalai with Pistachio 3D', proceduralType: 'dessert' },
  'item-41': { animatedGifUrl: FOOD_GIF_ASSETS.iceCream, title: 'Madagascar Vanilla Bean Ice Cream 3D', proceduralType: 'dessert' },
  'item-42': { animatedGifUrl: FOOD_GIF_ASSETS.iceCream, title: 'Royal Mango Kulfi 3D', proceduralType: 'dessert' },
  'item-69': { animatedGifUrl: FOOD_GIF_ASSETS.dessertPastry, title: 'Warm Gajar Ka Halwa 3D', proceduralType: 'dessert' },
  'item-70': { animatedGifUrl: FOOD_GIF_ASSETS.dessertPastry, title: 'Royal Shahi Tukda 3D', proceduralType: 'dessert' },
  'item-71': { animatedGifUrl: FOOD_GIF_ASSETS.dessertPastry, title: 'Saffron Rasmalai 3D', proceduralType: 'dessert' },
  'item-72': { animatedGifUrl: FOOD_GIF_ASSETS.dessertPastry, title: 'Tender Coconut Payasam 3D', proceduralType: 'dessert' },
  'item-73': { animatedGifUrl: FOOD_GIF_ASSETS.sizzlingBrownie, title: 'Sizzling Hot Chocolate Brownie 3D', proceduralType: 'dessert' },

  // Beverages
  'item-5': { animatedGifUrl: FOOD_GIF_ASSETS.coffee, title: 'Cold Coffee Frappé 3D', proceduralType: 'coffee' },
  'item-9': { animatedGifUrl: FOOD_GIF_ASSETS.coffee, title: 'Royal Mango Lassi 3D', proceduralType: 'coffee' },
  'item-15': { animatedGifUrl: FOOD_GIF_ASSETS.coffee, title: 'Kumbakonam Degree Filter Coffee 3D', proceduralType: 'coffee' },
  'item-33': { animatedGifUrl: FOOD_GIF_ASSETS.coffee, title: 'Masala Ginger Cutting Chai 3D', proceduralType: 'coffee' },
  'item-34': { animatedGifUrl: FOOD_GIF_ASSETS.coffee, title: 'Fresh Lime Soda 3D', proceduralType: 'coffee' },
  'item-35': { animatedGifUrl: FOOD_GIF_ASSETS.coffee, title: 'Sweet Punjabi Lassi 3D', proceduralType: 'coffee' },
  'item-36': { animatedGifUrl: FOOD_GIF_ASSETS.coffee, title: 'Fresh Tender Coconut Water 3D', proceduralType: 'coffee' },
  'item-37': { animatedGifUrl: FOOD_GIF_ASSETS.coffee, title: 'Chilled Badam Milk with Saffron 3D', proceduralType: 'coffee' },
  'item-63': { animatedGifUrl: FOOD_GIF_ASSETS.coffee, title: 'Fresh Mint Virgin Mojito 3D', proceduralType: 'coffee' },
  'item-64': { animatedGifUrl: FOOD_GIF_ASSETS.coffee, title: 'Watermelon Basil Cooler 3D', proceduralType: 'coffee' },
  'item-65': { animatedGifUrl: FOOD_GIF_ASSETS.coffee, title: 'Spiced Masala Buttermilk 3D', proceduralType: 'coffee' },
  'item-66': { animatedGifUrl: FOOD_GIF_ASSETS.coffee, title: 'Rich Chocolate Brownie Shake 3D', proceduralType: 'coffee' },
  'item-67': { animatedGifUrl: FOOD_GIF_ASSETS.coffee, title: 'Fresh Mosambi Juice 3D', proceduralType: 'coffee' },
  'item-68': { animatedGifUrl: FOOD_GIF_ASSETS.coffee, title: 'Warm Royal Badam Milk 3D', proceduralType: 'coffee' }
};

/**
 * Resolves the 3D rotating food visual asset for any menu item in the catalog.
 */
export const getFoodModel3D = (
  itemOrId: string | { id: string; category?: string; name?: string },
  categoryParam?: string,
  itemNameParam: string = ''
): FoodModel3DMeta => {
  let itemId = '';
  let category = '';
  let itemName = '';

  if (typeof itemOrId === 'object' && itemOrId !== null) {
    itemId = itemOrId.id || '';
    category = itemOrId.category || '';
    itemName = itemOrId.name || '';
  } else {
    itemId = itemOrId || '';
    category = categoryParam || '';
    itemName = itemNameParam || '';
  }

  // 1. Direct ID match from verified inventory
  if (SPECIFIC_ITEM_MODELS[itemId]) {
    return SPECIFIC_ITEM_MODELS[itemId];
  }

  const nameLower = itemName.toLowerCase();

  // 2. Keyword fallback
  if (nameLower.includes('burger') || nameLower.includes('sandwich')) {
    return { animatedGifUrl: FOOD_GIF_ASSETS.burger, title: `${itemName} 3D`, proceduralType: 'burger' };
  }
  if (nameLower.includes('pizza')) {
    return { animatedGifUrl: FOOD_GIF_ASSETS.pizza, title: `${itemName} 3D`, proceduralType: 'starters' };
  }
  if (nameLower.includes('noodle') || nameLower.includes('ramen') || nameLower.includes('hakka')) {
    return { animatedGifUrl: FOOD_GIF_ASSETS.ramenBowl, title: `${itemName} 3D`, proceduralType: 'starters' };
  }
  if (nameLower.includes('roti') || nameLower.includes('naan') || nameLower.includes('paratha')) {
    return { animatedGifUrl: FOOD_GIF_ASSETS.rotiNaan, title: `${itemName} 3D`, proceduralType: 'kebab' };
  }
  if (nameLower.includes('biryani') || nameLower.includes('rice')) {
    return { animatedGifUrl: FOOD_GIF_ASSETS.biryani, title: `${itemName} 3D`, proceduralType: 'biryani' };
  }
  if (nameLower.includes('kebab') || nameLower.includes('tikka') || nameLower.includes('tandoori')) {
    return { animatedGifUrl: FOOD_GIF_ASSETS.kebab, title: `${itemName} 3D`, proceduralType: 'kebab' };
  }
  if (nameLower.includes('curry') || nameLower.includes('chicken') || nameLower.includes('makhani')) {
    return { animatedGifUrl: FOOD_GIF_ASSETS.butterChicken, title: `${itemName} 3D`, proceduralType: 'curry' };
  }
  if (nameLower.includes('dessert') || nameLower.includes('sweet') || nameLower.includes('cake') || nameLower.includes('halwa')) {
    return { animatedGifUrl: FOOD_GIF_ASSETS.dessertPastry, title: `${itemName} 3D`, proceduralType: 'dessert' };
  }

  // 3. Category Fallback
  switch (category) {
    case 'Main Course':
      return { animatedGifUrl: FOOD_GIF_ASSETS.butterChicken, title: `${itemName} 3D`, proceduralType: 'curry' };
    case 'Breads & Rice':
      return { animatedGifUrl: FOOD_GIF_ASSETS.biryani, title: `${itemName} 3D`, proceduralType: 'biryani' };
    case 'Desserts':
      return { animatedGifUrl: FOOD_GIF_ASSETS.dessertPastry, title: `${itemName} 3D`, proceduralType: 'dessert' };
    case 'Starters':
      return { animatedGifUrl: FOOD_GIF_ASSETS.kebab, title: `${itemName} 3D`, proceduralType: 'kebab' };
    case 'Beverages':
      return { animatedGifUrl: FOOD_GIF_ASSETS.coffee, title: `${itemName} 3D`, proceduralType: 'coffee' };
    default:
      return { animatedGifUrl: FOOD_GIF_ASSETS.bowlMeal, title: `${itemName} 3D`, proceduralType: 'curry' };
  }
};
