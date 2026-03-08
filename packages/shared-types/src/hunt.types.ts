export type WeaponType = 'bow' | 'rifle' | 'muzzleloader' | 'shotgun' | 'pistol';

export interface Hunt {
  id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  weaponType: WeaponType;
  notes?: string;
}

export interface CreateHuntInput {
  weaponType: WeaponType;
  notes?: string;
}

export interface StandLocation {
  id: string;
  userId: string;
  name: string;
  latitude: number;
  longitude: number;
  notes?: string;
}

export interface CreateStandInput {
  name: string;
  latitude: number;
  longitude: number;
  notes?: string;
}

export interface TrailCamera {
  id: string;
  userId: string;
  name: string;
  latitude: number;
  longitude: number;
}

export interface Harvest {
  id: string;
  userId: string;
  species: string;
  scoreEstimate?: number;
  harvestDate: string;
}
