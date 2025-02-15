export interface EventFormData {
  // Basic Info
  title?: string;
  category?: string;
  description?: string;

  // Date & Time
  date?: string;
  startTime?: string;
  endTime?: string;
  duration?: string;
  recurring?: string;
  timezone?: string;

  // Location
  eventType?: 'physical' | 'virtual' | 'hybrid';
  venueName?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  meetingLink?: string;
  hideAddress?: boolean;

  // Details
  maxParticipants?: number;
  experienceLevel?: string;
  minAge?: number;
  price?: number;
  equipmentRequired?: boolean;
  equipmentDetails?: string;
  rules?: string[];
  notes?: string;

  // Map
  coordinates?: [number, number];
} 