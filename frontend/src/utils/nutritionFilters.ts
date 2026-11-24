import { MenuItem, HealthFilterOption } from '../types';

export interface HealthFilterMeta {
  key: HealthFilterOption;
  label: string;
  badge: string;
  description: string;
}

export const HEALTH_NUTRITION_FILTERS: HealthFilterMeta[] = [
  {
    key: 'High Protein',
    label: 'High Protein',
    badge: '≥12g',
    description: 'Rich in quality protein (≥12g per serving) to fuel energy & muscle maintenance.'
  },
  {
    key: 'Iron Rich',
    label: 'Iron Rich',
    badge: '≥3mg',
    description: 'High dietary iron (≥3mg per serving) supporting healthy oxygen circulation.'
  },
  {
    key: 'Zinc Rich',
    label: 'Zinc Rich',
    badge: '≥2mg',
    description: 'Essential zinc (≥2mg per serving) to support immune defense & enzyme health.'
  },
  {
    key: 'High Fiber',
    label: 'High Fiber',
    badge: '≥6g',
    description: 'Rich dietary fiber (≥6g per serving) aiding healthy digestion and fullness.'
  },
  {
    key: 'Low Carbohydrate',
    label: 'Low Carbohydrate',
    badge: '≤15g',
    description: 'Carb-conscious meals (≤15g carbs per serving) for keto and low-carb lifestyles.'
  },
  {
    key: 'Low Fat',
    label: 'Low Fat',
    badge: '≤3g',
    description: 'FSSAI compliant low-fat preparation (≤3g total fat per serving).'
  },
  {
    key: 'Low Saturated Fat',
    label: 'Low Saturated Fat',
    badge: '≤1.5g',
    description: 'Heart-healthy cooking with minimal saturated fatty acids (≤1.5g per serving).'
  },
  {
    key: 'Low Cholesterol',
    label: 'Low Cholesterol',
    badge: '≤20mg',
    description: 'Heart-smart dining containing ≤20mg cholesterol per serving.'
  },
  {
    key: 'Sugar-Free',
    label: 'Sugar-Free',
    badge: '≤0.5g',
    description: 'Virtually zero natural sugars (≤0.5g total sugar per serving).'
  },
  {
    key: 'No Added Sugar',
    label: 'No Added Sugar',
    badge: '0g Added',
    description: 'Prepared with no refined or artificial sugars added during preparation.'
  },
  {
    key: 'Low Sugar',
    label: 'Low Sugar',
    badge: '≤5g',
    description: 'Naturally sweetened or low-sugar profile (≤5g sugars per serving).'
  },
  {
    key: 'Low Calorie',
    label: 'Low Calorie',
    badge: '≤150 kcal',
    description: 'Light, guilt-free dining keeping caloric intake under 150 kcal per serving.'
  },
  {
    key: 'High Calorie',
    label: 'High Calorie',
    badge: '≥450 kcal',
    description: 'Hearty, energizing royal feasts providing ≥450 kcal per serving.'
  },
  {
    key: 'Diet-Friendly',
    label: 'Diet-Friendly',
    badge: 'Balanced',
    description: 'Optimal balance: low calorie (≤250 kcal) + low fat (≤6g) with wholesome protein/fiber.'
  },
  {
    key: 'Calcium Rich',
    label: 'Calcium Rich',
    badge: '≥150mg',
    description: 'Calcium-fortified (≥150mg per serving) supporting strong bones & teeth.'
  }
];

/**
 * Validates whether a menu item satisfies a specific health & nutrition filter standard
 */
export function matchesHealthFilter(item: MenuItem, filter: HealthFilterOption): boolean {
  const n = item.nutrition;
  const cals = item.calories ?? n?.calories;

  switch (filter) {
    case 'High Protein':
      return (n?.protein_g ?? 0) >= 12;

    case 'Iron Rich':
      return (n?.iron_mg ?? 0) >= 3.0;

    case 'Zinc Rich':
      return (n?.zinc_mg ?? 0) >= 2.0;

    case 'High Fiber':
      return (n?.fiber_g ?? 0) >= 6.0;

    case 'Low Carbohydrate':
      return n?.carbohydrate_g !== undefined && n.carbohydrate_g <= 15.0;

    case 'Low Fat':
      return n?.total_fat_g !== undefined && n.total_fat_g <= 3.0;

    case 'Low Saturated Fat':
      return n?.saturated_fat_g !== undefined && n.saturated_fat_g <= 1.5;

    case 'Low Cholesterol':
      return n?.cholesterol_mg !== undefined && n.cholesterol_mg <= 20.0;

    case 'Sugar-Free':
      return n?.total_sugar_g !== undefined && n.total_sugar_g <= 0.5;

    case 'No Added Sugar':
      return n?.added_sugar_g !== undefined && n.added_sugar_g === 0;

    case 'Low Sugar':
      return n?.total_sugar_g !== undefined && n.total_sugar_g <= 5.0;

    case 'Low Calorie':
      return cals !== undefined && cals > 0 && cals <= 150;

    case 'High Calorie':
      return cals !== undefined && cals >= 450;

    case 'Diet-Friendly':
      return (
        cals !== undefined &&
        cals > 0 &&
        cals <= 250 &&
        (n?.total_fat_g ?? 99) <= 6.0 &&
        ((n?.protein_g ?? 0) >= 5.0 || (n?.fiber_g ?? 0) >= 3.0)
      );

    case 'Calcium Rich':
      return (n?.calcium_mg ?? 0) >= 150.0;

    default:
      return true;
  }
}

/**
 * Multi-select health filtering using AND logic across all selected filters.
 * An item must satisfy EVERY selected option to be displayed.
 */
export function matchesAllHealthFilters(
  item: MenuItem,
  selectedFilters: HealthFilterOption[]
): boolean {
  if (!selectedFilters || selectedFilters.length === 0) return true;
  return selectedFilters.every((filter) => matchesHealthFilter(item, filter));
}

