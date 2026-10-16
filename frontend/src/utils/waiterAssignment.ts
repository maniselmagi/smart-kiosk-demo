export interface WaiterInfo {
  code: string;       // 'V', 'B', 'S', 'R'
  name: string;       // 'Vikram', 'Bala', 'Suresh', 'Rajesh'
  fullName: string;   // 'Vikram (V)', 'Bala (B)', 'Suresh (S)', 'Rajesh (R)'
  initial: string;    // 'V', 'B', 'S', 'R'
  zone: string;       // 'T(1-5)', 'T(6-10)', 'T(11-15)', 'T(16-20)'
  role: string;       // 'Section Captain' or 'Table Server'
  color: string;      // badge styling classes
  avatarBg: string;   // avatar styling classes
}

// 5 Tables per 1 Waiter Assignment Rule
export const WAITER_ZONES: { rangeLabel: string; minTable: number; maxTable: number; waiter: WaiterInfo }[] = [
  {
    rangeLabel: 'T(1-5)',
    minTable: 1,
    maxTable: 5,
    waiter: {
      code: 'V',
      name: 'Vikram',
      fullName: 'Vikram (V)',
      initial: 'V',
      zone: 'T(1-5)',
      role: 'Section Waiter • Tables 1 to 5',
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
      avatarBg: 'bg-blue-600 text-white',
    }
  },
  {
    rangeLabel: 'T(6-10)',
    minTable: 6,
    maxTable: 10,
    waiter: {
      code: 'B',
      name: 'Bala',
      fullName: 'Bala (B)',
      initial: 'B',
      zone: 'T(6-10)',
      role: 'Section Waiter • Tables 6 to 10',
      color: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      avatarBg: 'bg-amber-600 text-white',
    }
  },
  {
    rangeLabel: 'T(11-15)',
    minTable: 11,
    maxTable: 15,
    waiter: {
      code: 'S',
      name: 'Suresh',
      fullName: 'Suresh (S)',
      initial: 'S',
      zone: 'T(11-15)',
      role: 'Section Waiter • Tables 11 to 15',
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      avatarBg: 'bg-emerald-600 text-white',
    }
  },
  {
    rangeLabel: 'T(16-20)',
    minTable: 16,
    maxTable: 20,
    waiter: {
      code: 'R',
      name: 'Rajesh',
      fullName: 'Rajesh (R)',
      initial: 'R',
      zone: 'T(16-20)',
      role: 'Section Waiter • Tables 16 to 20',
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
      avatarBg: 'bg-purple-600 text-white',
    }
  }
];

export const getAssignedWaiter = (tableNumber: number): WaiterInfo => {
  const match = WAITER_ZONES.find(z => tableNumber >= z.minTable && tableNumber <= z.maxTable);
  if (match) return match.waiter;
  if (tableNumber <= 5) return WAITER_ZONES[0].waiter;
  if (tableNumber <= 10) return WAITER_ZONES[1].waiter;
  if (tableNumber <= 15) return WAITER_ZONES[2].waiter;
  return WAITER_ZONES[3].waiter;
};
