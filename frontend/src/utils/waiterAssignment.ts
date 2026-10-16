export interface WaiterInfo {
  code: string;       // 'V' or 'B'
  name: string;       // 'Vikram' or 'Bala'
  fullName: string;   // 'Vikram (V)' or 'Bala (B)'
  initial: string;    // 'V' or 'B'
  zone: string;       // 'T(1-5)' or 'T(6-10)' or 'T(11-15)'
  role: string;       // 'Section Captain' or 'Table Server'
  color: string;      // styling classes
  avatarBg: string;   // avatar styling classes
}

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
      role: 'Floor Captain • Tables 1 to 5',
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
      role: 'Table Server • Tables 6 to 10',
      color: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      avatarBg: 'bg-amber-600 text-white',
    }
  },
  {
    rangeLabel: 'T(11-15)',
    minTable: 11,
    maxTable: 15,
    waiter: {
      code: 'B',
      name: 'Bala',
      fullName: 'Bala (B)',
      initial: 'B',
      zone: 'T(11-15)',
      role: 'Table Server • Tables 11 to 15',
      color: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      avatarBg: 'bg-amber-600 text-white',
    }
  }
];

export const getAssignedWaiter = (tableNumber: number): WaiterInfo => {
  const match = WAITER_ZONES.find(z => tableNumber >= z.minTable && tableNumber <= z.maxTable);
  if (match) return match.waiter;
  return tableNumber <= 5 ? WAITER_ZONES[0].waiter : WAITER_ZONES[1].waiter;
};
