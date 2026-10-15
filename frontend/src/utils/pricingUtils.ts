import { SpiceLevel } from '../types';

/**
 * Returns the extra cost for a given spice level.
 * - Mild: ₹0 (Free)
 * - Medium: ₹0 (Standard)
 * - Hot: ₹10 (Infused red chilli & black pepper)
 * - Extra Hot: ₹20 (Special chef ghost pepper / Guntur fiery blend)
 */
export function getSpicePrice(spice: SpiceLevel): number {
  switch (spice) {
    case 'Mild':
      return 0;
    case 'Medium':
      return 0;
    case 'Hot':
      return 10;
    case 'Extra Hot':
      return 20;
    default:
      return 0;
  }
}

/**
 * Returns a human-friendly price label for spice level
 */
export function getSpicePriceLabel(spice: SpiceLevel): string {
  const price = getSpicePrice(spice);
  if (price === 0) {
    return spice === 'Medium' ? 'Standard' : 'Free';
  }
  return `+₹${price}`;
}

/**
 * Extracts the extra cost for a customization option.
 * If the string contains an explicit price like (+₹20), extracts it.
 * Otherwise uses categorized restaurant standard pricing.
 */
export function getCustomizationPrice(option: string): number {
  if (!option) return 0;

  // 1. Check if option has an explicit price like (+₹20) or (+20)
  const explicitMatch = option.match(/\(\+?₹?\s*(\d+)\)/);
  if (explicitMatch) {
    return parseInt(explicitMatch[1], 10);
  }

  // 2. Free preferences / cooking style requests
  if (/^(mild|low|less|no\b|without|plain|soft|dry|salted|authentic|served|warm|nut-free)/i.test(option)) {
    return 0;
  }
  if (/(lemon|onion salad|fresh coriander|sambar dip|crispy hot|crispy roast|crisp edge|thick consistency|boneless portion|boneless only|light ice)/i.test(option)) {
    return 0;
  }

  // 3. Premium meat & poultry additions
  if (/extra (chicken|mutton|meat|fish|prawn)/i.test(option)) {
    return 60;
  }

  // 4. Dairy, ice cream, paneer & dessert toppings
  if (/(extra paneer|ice cream|vanilla scoop|brownie|hot fudge|double rabri|double scoop)/i.test(option)) {
    return 40;
  }

  // 5. Ghee, butter, cheese, nuts & espresso shots
  if (/(ghee|butter|cheese|oat milk|kulfi|cashew|almond|pistachio|extra shot|double kulfi)/i.test(option)) {
    return 30;
  }

  // 6. Gravy, salna, raita & sauces
  if (/(gravy|salna|raita|masala|fried onion|silver vark|whipped cream|choco chip)/i.test(option)) {
    return 25;
  }

  // 7. Chutneys, seasonings & small dips
  if (/(chutney|dip|sambar|mayo|sauce|mint|podi|gunpowder|pepper|schezwan|peri peri|pomegranate|basil)/i.test(option)) {
    return 15;
  }

  // 8. Other general add-ons
  if (/extra|add-on|topping|sub\b|dressing/i.test(option)) {
    return 20;
  }

  return 0;
}

/**
 * Returns the cleaned label without the raw (+₹...) suffix if present
 */
export function getCustomizationCleanLabel(option: string): string {
  if (!option) return '';
  return option.replace(/\s*\(\+?₹?\s*\d+\)/g, '').trim();
}

/**
 * Returns formatted price badge string, e.g. "+₹30" or "Free"
 */
export function getCustomizationPriceBadge(option: string): string {
  const price = getCustomizationPrice(option);
  return price > 0 ? `+₹${price}` : 'Free';
}

/**
 * Calculates the total unit price for an item with selected spice & customizations
 */
export function calculateItemUnitPrice(
  basePrice: number,
  spice: SpiceLevel,
  customizations: string[]
): {
  basePrice: number;
  spiceCost: number;
  customizationCost: number;
  extraCost: number;
  unitPrice: number;
} {
  const spiceCost = getSpicePrice(spice);
  const customizationCost = (customizations || []).reduce(
    (sum, opt) => sum + getCustomizationPrice(opt),
    0
  );
  const extraCost = spiceCost + customizationCost;
  return {
    basePrice,
    spiceCost,
    customizationCost,
    extraCost,
    unitPrice: basePrice + extraCost
  };
}
