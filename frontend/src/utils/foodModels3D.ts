/**
 * 3D Food Models Inventory & Mapping Utility
 * Maps every restaurant kiosk menu item to its genuine GLB 3D food model
 * for interactive Lenskart-style 360° WebGL inspection.
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
  modelUrl: string;
  title: string;
  proceduralType: ProceduralDishType;
  scale?: number;
  cameraDistance?: number;
}

/**
 * Robust Multi-Candidate Asset URL Resolver
 * Guarantees GLB asset resolution across GitHub Pages (/smart-kiosk-demo/),
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

  try {
    if (typeof window !== 'undefined' && window.location) {
      const loc = window.location;
      if (loc.hostname.includes('github.io')) {
        candidates.push(`${loc.origin}/smart-kiosk-demo/${cleanPath}`);
      }
    }
  } catch {}

  try {
    const metaUrl = import.meta.url;
    if (metaUrl) {
      candidates.push(new URL('../' + cleanPath, metaUrl).href);
      candidates.push(new URL('../../' + cleanPath, metaUrl).href);
    }
  } catch {}

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
  } catch {}

  candidates.push(cleanPath);
  candidates.push('/' + cleanPath);

  return Array.from(new Set(candidates.filter(Boolean)));
};

export const resolveModelAssetUrl = (rawPath: string): string => {
  const candidates = getModelCandidateUrls(rawPath);
  return candidates[0] || rawPath;
};

const GLB_MODELS = {
  butterChicken: 'models/food/butter_chicken.glb',
  curry: 'models/food/curry.glb',
  biryani: 'models/food/biryani_rice.glb',
  kebab: 'models/food/tandoori_kebab.glb',
  pakora: 'models/food/takoyaki_pakora.glb',
  dumplings: 'models/food/dumplings_starters.glb',
  burger: 'models/food/burger.glb',
  parfait: 'models/food/dessert_parfait.glb',
  icecream: 'models/food/icecream.glb',
  cupcake: 'models/food/cupcake.glb',
  dish: 'models/food/dish.glb',
} as const;

const SPECIFIC_ITEM_MODELS: Record<string, FoodModel3DMeta> = {
  'item-1': { modelUrl: GLB_MODELS.butterChicken, title: 'Butter Chicken 360°', proceduralType: 'curry' },
  'item-2': { modelUrl: GLB_MODELS.kebab, title: 'Paneer Tikka 360°', proceduralType: 'kebab' },
  'item-3': { modelUrl: GLB_MODELS.biryani, title: 'Veg Dum Biryani 360°', proceduralType: 'biryani' },
  'item-4': { modelUrl: GLB_MODELS.dish, title: 'Crispy Masala Dosa 360°', proceduralType: 'crispy' },
  'item-5': { modelUrl: GLB_MODELS.parfait, title: 'Cold Coffee Frappé 360°', proceduralType: 'coffee' },
  'item-6': { modelUrl: GLB_MODELS.dish, title: 'Garlic Butter Naan 360°', proceduralType: 'kebab' },
  'item-7': { modelUrl: GLB_MODELS.biryani, title: 'Chicken Dum Biryani 360°', proceduralType: 'biryani' },
  'item-8': { modelUrl: GLB_MODELS.pakora, title: 'Crispy Baby Corn Fry 360°', proceduralType: 'crispy' },
  'item-9': { modelUrl: GLB_MODELS.parfait, title: 'Royal Mango Lassi 360°', proceduralType: 'coffee' },
  'item-10': { modelUrl: GLB_MODELS.icecream, title: 'Gulab Jamun with Ice Cream 360°', proceduralType: 'dessert' },
  'item-11': { modelUrl: GLB_MODELS.cupcake, title: 'Sizzling Brownie with Fudge 360°', proceduralType: 'dessert' },
  'item-12': { modelUrl: GLB_MODELS.curry, title: 'Kashmiri Mutton Rogan Josh 360°', proceduralType: 'curry' },
  'item-13': { modelUrl: GLB_MODELS.dish, title: 'South Indian Grand Meals Thali 360°', proceduralType: 'platter' },
  'item-14': { modelUrl: GLB_MODELS.pakora, title: 'Ghee Podi Idli & Medu Vada 360°', proceduralType: 'crispy' },
  'item-15': { modelUrl: GLB_MODELS.cupcake, title: 'Kumbakonam Degree Filter Coffee 360°', proceduralType: 'coffee' },
  'item-16': { modelUrl: GLB_MODELS.biryani, title: 'Royal Ghee Pongal 360°', proceduralType: 'biryani' },
  'item-17': { modelUrl: GLB_MODELS.parfait, title: 'Royal Kesari with Golden Cashews 360°', proceduralType: 'dessert' },
  'item-18': { modelUrl: GLB_MODELS.pakora, title: 'Crispy Medu Vada 360°', proceduralType: 'crispy' },
  'item-19': { modelUrl: GLB_MODELS.dumplings, title: 'Golden Veg Spring Rolls 360°', proceduralType: 'starters' },
  'item-20': { modelUrl: GLB_MODELS.pakora, title: 'Gobi Manchurian Dry 360°', proceduralType: 'crispy' },
  'item-21': { modelUrl: GLB_MODELS.kebab, title: 'Royal Chicken 65 360°', proceduralType: 'kebab' },
  'item-22': { modelUrl: GLB_MODELS.pakora, title: 'Crispy French Fries 360°', proceduralType: 'crispy' },
  'item-23': { modelUrl: GLB_MODELS.dish, title: 'Plain Ghee Roast Dosa 360°', proceduralType: 'crispy' },
  'item-24': { modelUrl: GLB_MODELS.curry, title: 'Paneer Butter Masala 360°', proceduralType: 'curry' },
  'item-25': { modelUrl: GLB_MODELS.curry, title: 'Dal Makhani Slow-Simmered 360°', proceduralType: 'curry' },
  'item-26': { modelUrl: GLB_MODELS.curry, title: 'Kadai Chicken Gravy 360°', proceduralType: 'curry' },
  'item-27': { modelUrl: GLB_MODELS.dish, title: 'Chole Bhature 360°', proceduralType: 'platter' },
  'item-28': { modelUrl: GLB_MODELS.dish, title: 'Fluffy Poori Bhaji 360°', proceduralType: 'platter' },
  'item-29': { modelUrl: GLB_MODELS.dish, title: 'Butter Tandoori Roti 360°', proceduralType: 'kebab' },
  'item-30': { modelUrl: GLB_MODELS.dish, title: 'Stuffed Aloo Paratha 360°', proceduralType: 'kebab' },
  'item-31': { modelUrl: GLB_MODELS.biryani, title: 'Traditional Curd Rice 360°', proceduralType: 'biryani' },
  'item-32': { modelUrl: GLB_MODELS.biryani, title: 'Jeera Rice & Tadka Dal 360°', proceduralType: 'biryani' },
  'item-33': { modelUrl: GLB_MODELS.cupcake, title: 'Masala Ginger Cutting Chai 360°', proceduralType: 'coffee' },
  'item-34': { modelUrl: GLB_MODELS.parfait, title: 'Fresh Lime Soda 360°', proceduralType: 'coffee' },
  'item-35': { modelUrl: GLB_MODELS.parfait, title: 'Sweet Punjabi Lassi 360°', proceduralType: 'coffee' },
  'item-36': { modelUrl: GLB_MODELS.parfait, title: 'Fresh Tender Coconut Water 360°', proceduralType: 'coffee' },
  'item-37': { modelUrl: GLB_MODELS.parfait, title: 'Chilled Badam Milk with Saffron 360°', proceduralType: 'coffee' },
  'item-38': { modelUrl: GLB_MODELS.parfait, title: 'Bengali Rasgulla 360°', proceduralType: 'dessert' },
  'item-39': { modelUrl: GLB_MODELS.parfait, title: 'Hot Desi Ghee Badam Halwa 360°', proceduralType: 'dessert' },
  'item-40': { modelUrl: GLB_MODELS.parfait, title: 'Creamy Rasmalai with Pistachio 360°', proceduralType: 'dessert' },
  'item-41': { modelUrl: GLB_MODELS.icecream, title: 'Madagascar Vanilla Bean Ice Cream 360°', proceduralType: 'dessert' },
  'item-42': { modelUrl: GLB_MODELS.icecream, title: 'Royal Mango Kulfi 360°', proceduralType: 'dessert' },
  'item-43': { modelUrl: GLB_MODELS.dumplings, title: 'Chilli Paneer Dry 360°', proceduralType: 'starters' },
  'item-44': { modelUrl: GLB_MODELS.pakora, title: 'Crispy Corn Salt & Pepper 360°', proceduralType: 'crispy' },
  'item-45': { modelUrl: GLB_MODELS.kebab, title: 'Tandoori Murgh Wings 360°', proceduralType: 'kebab' },
  'item-46': { modelUrl: GLB_MODELS.kebab, title: 'Hara Bhara Kebab 360°', proceduralType: 'kebab' },
  'item-47': { modelUrl: GLB_MODELS.kebab, title: 'Andhra Chicken Pakoda 360°', proceduralType: 'kebab' },
  'item-48': { modelUrl: GLB_MODELS.pakora, title: 'Golden Medu Vada 360°', proceduralType: 'crispy' },
  'item-49': { modelUrl: GLB_MODELS.curry, title: 'Palak Paneer 360°', proceduralType: 'curry' },
  'item-50': { modelUrl: GLB_MODELS.curry, title: 'Kadai Chicken Masala 360°', proceduralType: 'curry' },
  'item-51': { modelUrl: GLB_MODELS.curry, title: 'Yellow Dal Tadka 360°', proceduralType: 'curry' },
  'item-52': { modelUrl: GLB_MODELS.curry, title: 'Chettinad Pepper Chicken 360°', proceduralType: 'curry' },
  'item-53': { modelUrl: GLB_MODELS.curry, title: 'Malai Kofta Royale 360°', proceduralType: 'curry' },
  'item-54': { modelUrl: GLB_MODELS.dish, title: 'Crispy Onion Rava Dosa 360°', proceduralType: 'crispy' },
  'item-55': { modelUrl: GLB_MODELS.dish, title: 'Mysore Masala Dosa 360°', proceduralType: 'crispy' },
  'item-56': { modelUrl: GLB_MODELS.dish, title: 'Hot Fluffy Poori Masala 360°', proceduralType: 'platter' },
  'item-57': { modelUrl: GLB_MODELS.biryani, title: 'Wok Veg Fried Rice 360°', proceduralType: 'biryani' },
  'item-58': { modelUrl: GLB_MODELS.biryani, title: 'Chicken Hakka Noodles 360°', proceduralType: 'biryani' },
  'item-59': { modelUrl: GLB_MODELS.dish, title: 'Flaky Malabar Parotta 360°', proceduralType: 'kebab' },
  'item-60': { modelUrl: GLB_MODELS.dish, title: 'Tandoori Butter Roti 360°', proceduralType: 'kebab' },
  'item-61': { modelUrl: GLB_MODELS.biryani, title: 'Steamed Jeera Basmati Rice 360°', proceduralType: 'biryani' },
  'item-62': { modelUrl: GLB_MODELS.biryani, title: 'Curd Rice with Pomegranate 360°', proceduralType: 'biryani' },
  'item-63': { modelUrl: GLB_MODELS.parfait, title: 'Fresh Mint Virgin Mojito 360°', proceduralType: 'coffee' },
  'item-64': { modelUrl: GLB_MODELS.parfait, title: 'Watermelon Basil Cooler 360°', proceduralType: 'coffee' },
  'item-65': { modelUrl: GLB_MODELS.parfait, title: 'Spiced Masala Buttermilk 360°', proceduralType: 'coffee' },
  'item-66': { modelUrl: GLB_MODELS.parfait, title: 'Rich Chocolate Brownie Shake 360°', proceduralType: 'coffee' },
  'item-67': { modelUrl: GLB_MODELS.parfait, title: 'Fresh Mosambi Juice 360°', proceduralType: 'coffee' },
  'item-68': { modelUrl: GLB_MODELS.parfait, title: 'Warm Royal Badam Milk 360°', proceduralType: 'coffee' },
  'item-69': { modelUrl: GLB_MODELS.parfait, title: 'Warm Gajar Ka Halwa 360°', proceduralType: 'dessert' },
  'item-70': { modelUrl: GLB_MODELS.parfait, title: 'Royal Shahi Tukda 360°', proceduralType: 'dessert' },
  'item-71': { modelUrl: GLB_MODELS.parfait, title: 'Saffron Rasmalai 360°', proceduralType: 'dessert' },
  'item-72': { modelUrl: GLB_MODELS.parfait, title: 'Tender Coconut Payasam 360°', proceduralType: 'dessert' },
  'item-73': { modelUrl: GLB_MODELS.cupcake, title: 'Sizzling Hot Chocolate Brownie 360°', proceduralType: 'dessert' },
};

/**
 * Resolves the genuine GLB 3D food model for any menu item in the catalog.
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

  if (SPECIFIC_ITEM_MODELS[itemId]) {
    return SPECIFIC_ITEM_MODELS[itemId];
  }

  const nameLower = itemName.toLowerCase();

  if (nameLower.includes('burger') || nameLower.includes('sandwich')) {
    return { modelUrl: GLB_MODELS.burger, title: `${itemName} 360°`, proceduralType: 'burger' };
  }
  if (nameLower.includes('butter chicken')) {
    return { modelUrl: GLB_MODELS.butterChicken, title: `${itemName} 360°`, proceduralType: 'curry' };
  }
  if (nameLower.includes('biryani') || nameLower.includes('rice') || nameLower.includes('pulao')) {
    return { modelUrl: GLB_MODELS.biryani, title: `${itemName} 360°`, proceduralType: 'biryani' };
  }
  if (nameLower.includes('kebab') || nameLower.includes('tikka') || nameLower.includes('tandoori')) {
    return { modelUrl: GLB_MODELS.kebab, title: `${itemName} 360°`, proceduralType: 'kebab' };
  }
  if (nameLower.includes('curry') || nameLower.includes('dal') || nameLower.includes('masala') || nameLower.includes('paneer')) {
    return { modelUrl: GLB_MODELS.curry, title: `${itemName} 360°`, proceduralType: 'curry' };
  }
  if (nameLower.includes('ice cream') || nameLower.includes('kulfi')) {
    return { modelUrl: GLB_MODELS.icecream, title: `${itemName} 360°`, proceduralType: 'dessert' };
  }
  if (nameLower.includes('brownie') || nameLower.includes('cake') || nameLower.includes('coffee') || nameLower.includes('chai')) {
    return { modelUrl: GLB_MODELS.cupcake, title: `${itemName} 360°`, proceduralType: 'dessert' };
  }
  if (nameLower.includes('vada') || nameLower.includes('pakora') || nameLower.includes('fry') || nameLower.includes('crispy')) {
    return { modelUrl: GLB_MODELS.pakora, title: `${itemName} 360°`, proceduralType: 'crispy' };
  }

  switch (category) {
    case 'Main Course':
      return { modelUrl: GLB_MODELS.curry, title: `${itemName} 360°`, proceduralType: 'curry' };
    case 'Breads & Rice':
      return { modelUrl: GLB_MODELS.biryani, title: `${itemName} 360°`, proceduralType: 'biryani' };
    case 'Desserts':
      return { modelUrl: GLB_MODELS.parfait, title: `${itemName} 360°`, proceduralType: 'dessert' };
    case 'Starters':
      return { modelUrl: GLB_MODELS.kebab, title: `${itemName} 360°`, proceduralType: 'kebab' };
    case 'Beverages':
      return { modelUrl: GLB_MODELS.parfait, title: `${itemName} 360°`, proceduralType: 'coffee' };
    default:
      return { modelUrl: GLB_MODELS.dish, title: `${itemName} 360°`, proceduralType: 'platter' };
  }
};
