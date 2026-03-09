export interface Post {
  id: string;
  userId: string;
  caption?: string;
  mediaUrls: string[];
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  body: string;
  createdAt: string;
}

export type TrophyCategory =
  | 'biggest_whitetail'
  | 'biggest_elk'
  | 'biggest_mule_deer'
  | 'biggest_turkey'
  | 'public_land_legend';

export interface TrophyEntry {
  id: string;
  harvestId: string;
  category: TrophyCategory;
  seasonYear: number;
  rankingScore: number;
}
