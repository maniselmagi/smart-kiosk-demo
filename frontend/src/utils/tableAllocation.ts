import { getAssignedWaiter, WaiterInfo } from './waiterAssignment';

export interface TableAllocationResult {
  tableNumber: number;
  capacity: number;
  category: string;
  zoneLabel: string;
  zoneDescription: string;
  suitableFor: string;
  waiter: WaiterInfo;
  features: string[];
  ambienceBadge: string;
  familyIcon: string;
}

/**
 * Intelligent Restaurant Table Allocation Engine
 * Analyzes guest / family count and allocates the optimal table & assigned section waiter.
 */
export const allocateTableForGuests = (personCount: number): TableAllocationResult => {
  const count = Math.max(1, personCount);

  if (count <= 2) {
    return {
      tableNumber: 3,
      capacity: 2,
      category: '2-Seater Intimate Window Table',
      zoneLabel: 'Zone T(1-5)',
      zoneDescription: 'Ground Floor • Quiet Garden Window Corner',
      suitableFor: 'Perfect fit for solo diners or cozy couple dining',
      waiter: getAssignedWaiter(3),
      features: ['Scenic Garden View', 'Warm Ambient Lighting', 'Compact Duo Setup', 'Express Course Pacing'],
      ambienceBadge: 'Cozy & Quiet Duo Table',
      familyIcon: '👥'
    };
  } else if (count <= 4) {
    return {
      tableNumber: 8,
      capacity: 4,
      category: '4-Seater Cushioned Family Booth',
      zoneLabel: 'Zone T(6-10)',
      zoneDescription: 'Pavilion Wing • Comfortable High-Back Booth',
      suitableFor: 'Ideal for standard families of 3 to 4 with kids',
      waiter: getAssignedWaiter(8),
      features: ['Plush Velvet Cushions', 'Child High-Chair Friendly', 'Spacious Dish Tabletop', 'Semi-Private Enclosure'],
      ambienceBadge: 'Comfortable Family Booth',
      familyIcon: '👨‍👩‍👧‍👦'
    };
  } else if (count <= 6) {
    return {
      tableNumber: 12,
      capacity: 6,
      category: '6-Seater Family Banquet Table',
      zoneLabel: 'Zone T(11-15)',
      zoneDescription: 'Main Dining Atrium • Central Amber Pavilion',
      suitableFor: 'Spacious allocation for larger families and friend gatherings',
      waiter: getAssignedWaiter(12),
      features: ['Solid Teakwood Banquet Table', 'Center Turntable Ready', 'Dedicated Fast Kitchen Runner', 'Wide Armchairs'],
      ambienceBadge: 'Central Family Banquet',
      familyIcon: '👨‍👩‍👧‍👦👨‍👧'
    };
  } else {
    return {
      tableNumber: 18,
      capacity: 10,
      category: '10-Seater Grand Royal Imperial Banquet',
      zoneLabel: 'Zone T(16-20)',
      zoneDescription: 'First Floor Mezzanine • Royal Maharaja Pavilion',
      suitableFor: `Royal celebration feast table for grand families of ${count}+ guests`,
      waiter: getAssignedWaiter(18),
      features: ['360° Rotating Lazy Susan', 'Dedicated Section Captain Service', 'VIP Banquet Ambience', 'Multi-Course Platter Layout'],
      ambienceBadge: 'Grand Royal Banquet',
      familyIcon: '👑👨‍👩‍👦‍👦🎉'
    };
  }
};
