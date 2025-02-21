export interface Event {
  id: number;
  title: string;
  category: string;
  description: string;
  startDate: string;
  startTime: string;
  endTime: string;
  timezone: string;
  eventType: 'physical' | 'virtual' | 'hybrid';
  meetingLink: string | null;
  venueName: string | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  latitude: string | null;
  longitude: string | null;
  hideAddress: boolean;
  maxParticipants: number | null;
  minAge: number | null;
  isPaid: boolean;
  price: string | null;
  currency: string | null;
  rules: string[];
  notes: string | null;
  creatorId: number;
  status: string;
  currentParticipants: number;
  isFull: boolean;
  creator?: {
    id: number;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
  participants: Array<{
    id: number;
    name: string;
    email: string;
    avatarUrl: string | null;
  }>;
}
