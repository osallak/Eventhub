export const categories = [
  'Sports',
  'Music',
  'Arts',
  'Food',
  'Technology',
  'Education',
  'Business',
  'Social',
  'Other',
] as const;

export type Category = (typeof categories)[number];
