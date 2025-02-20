export const EVENT_CATEGORIES = {
  SPORTS: 'sports',
  MUSIC: 'music',
  TECH: 'tech',
  BUSINESS: 'business',
  ART: 'art',
  FOOD: 'food',
  OTHER: 'other',
} as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[keyof typeof EVENT_CATEGORIES];
