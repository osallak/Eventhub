export interface Event {
  id: number;
  title: string;
  category: string;
  description: string;
  eventType: 'physical' | 'virtual' | 'hybrid';
  isPaid: boolean;
  price?: number;
  currency?: string;
  startDate: string;
  endTime: string;
  timezone?: string;
  venueName?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  latitude?: number | null;
  longitude?: number | null;
  maxParticipants?: number;
  currentParticipants: number;
  minAge?: number;
  notes?: string;
  hideAddress: boolean;
  isFull: boolean;
  meetingLink?: string;
  creator?: {
    id: number;
    email: string;
    name: string;
    username?: string;
    firstName?: string;
  };
}
