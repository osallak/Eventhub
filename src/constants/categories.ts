export const EVENT_CATEGORIES = {
  MUSIC: 'music',
  ART: 'art',
  SPORTS: 'sports',
  TECHNOLOGY: 'technology',
  FOOD: 'food',
  BUSINESS: 'business',
  OTHER: 'other',
} as const;

export const categories = ['MUSIC', 'ART', 'SPORTS', 'TECHNOLOGY', 'FOOD', 'BUSINESS'];

export type Category = (typeof categories)[number];
