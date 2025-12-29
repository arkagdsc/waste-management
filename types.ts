
export enum WasteType {
  DRY = 'DRY',
  WET = 'WET',
  HAZARDOUS = 'HAZARDOUS'
}

export interface WasteReport {
  id: string;
  latitude: number;
  longitude: number;
  photoUrl: string;
  timestamp: number;
  status: 'PENDING' | 'CLEANED';
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  isCompleted: boolean;
}

export interface Facility {
  id: string;
  name: string;
  type: 'Biomethanization' | 'Waste-to-Energy' | 'Recycling' | 'Scrap Shop';
  location: string;
  contact: string;
}
