export interface WaiterInfo {
  code: string;       // 'V', 'B', 'S', 'R'
  name: string;       // 'Vikram', 'Bala', 'Suresh', 'Rajesh'
  fullName: string;   // 'Vikram (V)', 'Bala (B)', 'Suresh (S)', 'Rajesh (R)'
  initial: string;    // 'V', 'B', 'S', 'R'
  zone: string;       // 'T(1-5)', 'T(6-10)', 'T(11-15)', 'T(16-20)'
  role: string;       // 'Section Captain' or 'Table Server'
  color: string;      // badge styling classes
  avatarBg: string;   // avatar styling classes
  avatarUrl?: string; // photo avatar
}

export interface WaiterZoneConfig {
  id: string;
  rangeLabel: string;
  minTable: number;
  maxTable: number;
  specificTables?: number[]; // optional specific tables list
  waiter: WaiterInfo;
}

// Default 5 Tables per 1 Waiter Assignment Rule
export const DEFAULT_WAITER_ZONES: WaiterZoneConfig[] = [
  {
    id: 'zone-1',
    rangeLabel: 'T(1-5)',
    minTable: 1,
    maxTable: 5,
    specificTables: [1, 2, 3, 4, 5],
    waiter: {
      code: 'V',
      name: 'Vikram',
      fullName: 'Vikram (V)',
      initial: 'V',
      zone: 'T(1-5)',
      role: 'Section Waiter • Tables 1 to 5',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      avatarBg: 'bg-blue-600 text-white',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    }
  },
  {
    id: 'zone-2',
    rangeLabel: 'T(6-10)',
    minTable: 6,
    maxTable: 10,
    specificTables: [6, 7, 8, 9, 10],
    waiter: {
      code: 'B',
      name: 'Bala',
      fullName: 'Bala (B)',
      initial: 'B',
      zone: 'T(6-10)',
      role: 'Section Waiter • Tables 6 to 10',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      avatarBg: 'bg-amber-600 text-white',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    }
  },
  {
    id: 'zone-3',
    rangeLabel: 'T(11-15)',
    minTable: 11,
    maxTable: 15,
    specificTables: [11, 12, 13, 14, 15],
    waiter: {
      code: 'S',
      name: 'Suresh',
      fullName: 'Suresh (S)',
      initial: 'S',
      zone: 'T(11-15)',
      role: 'Section Waiter • Tables 11 to 15',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      avatarBg: 'bg-emerald-600 text-white',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
    }
  },
  {
    id: 'zone-4',
    rangeLabel: 'T(16-20)',
    minTable: 16,
    maxTable: 20,
    specificTables: [16, 17, 18, 19, 20],
    waiter: {
      code: 'R',
      name: 'Rajesh',
      fullName: 'Rajesh (R)',
      initial: 'R',
      zone: 'T(16-20)',
      role: 'Section Waiter • Tables 16 to 20',
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      avatarBg: 'bg-purple-600 text-white',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
    }
  }
];

export const WAITER_ZONES = DEFAULT_WAITER_ZONES;

const STORAGE_KEY = 'restaurant_waiter_table_zones';

export const getWaiterZones = (): WaiterZoneConfig[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse stored waiter zones', e);
  }
  return DEFAULT_WAITER_ZONES;
};

export const saveWaiterZones = (zones: WaiterZoneConfig[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(zones));
    window.dispatchEvent(new CustomEvent('waiter_zones_updated', { detail: zones }));
  } catch (e) {
    console.error('Failed to save waiter zones', e);
  }
};

export const getAssignedWaiter = (tableNumber: number): WaiterInfo => {
  const currentZones = getWaiterZones();
  
  // 1. Check specific tables if specified
  const specificMatch = currentZones.find(z => 
    z.specificTables && z.specificTables.includes(tableNumber)
  );
  if (specificMatch) return specificMatch.waiter;

  // 2. Check min-max range
  const rangeMatch = currentZones.find(z => 
    tableNumber >= z.minTable && tableNumber <= z.maxTable
  );
  if (rangeMatch) return rangeMatch.waiter;

  // 3. Fallbacks
  if (currentZones.length > 0) {
    return currentZones[0].waiter;
  }
  return DEFAULT_WAITER_ZONES[0].waiter;
};
