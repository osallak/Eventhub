export interface Event {
  id: string;
  title: string;
  description?: string;
  category?: string;
  eventType: string;
  maxParticipants: number;
  participants?: Array<{
    id: string;
    name?: string;
  }>;
  creator?: {
    id: string;
    name?: string;
  };
  startDate: string;
  startTime: string;
  endTime: string;
  timezone: string;
  meetingLink: string | null;
  venueName: string | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  latitude: string | null;
  longitude: string | null;
  hideAddress: boolean;
  minAge: number | null;
  isPaid: boolean;
  price: string | null;
  currency: string | null;
  rules: string[];
  notes: string | null;
  status: string;
  currentParticipants: number;
  isFull: boolean;
}
