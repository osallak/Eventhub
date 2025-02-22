export interface User {
  id: number;
  email: string;
  name: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  createdEvents?: Event[];
}

export interface Event {
  id: number;
  title: string;
  category: string;
  description: string;
  startDate?: string;
  startTime?: string;
  endTime?: string;
  eventType?: 'physical' | 'virtual' | 'hybrid';
  isPaid?: boolean;
  price?: number;
  currency?: string;
  city?: string;
  hideAddress?: boolean;
  maxParticipants?: number;
  currentParticipants?: number;
  isFull?: boolean;
}
