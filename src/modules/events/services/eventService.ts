import { API_ROUTES } from '@common/defs/api-routes';
import { ApiResponse } from '@common/hooks/useApi';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

interface CreateEventPayload {
  title: string;
  category: string;
  description: string;
  start_date: string;
  start_time: string;
  end_time: string;
  timezone: string;
  event_type: 'physical' | 'virtual' | 'hybrid';
  meeting_link?: string;
  venue_name?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  hide_address: boolean;
  max_participants?: number;
  min_age?: number;
  is_paid: boolean;
  price?: number;
  currency?: string;
  rules?: string[];
  notes?: string;
  status: 'draft' | 'published';
}

class ValidationError extends Error {
  type: string;

  errors?: Record<string, string[]>;

  constructor(message: string, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ValidationError';
    this.type = 'validation';
    this.errors = errors;
  }
}

interface PaginatedResponse<T> {
  currentPage: number;
  data: T[];
  firstPageUrl: string;
  from: number;
  lastPage: number;
  lastPageUrl: string;
  nextPageUrl: string | null;
  path: string;
  perPage: number;
  prevPageUrl: string | null;
  to: number;
  total: number;
}

export const createEvent = async (
  fetchApi: <T>(url: string, options?: any) => Promise<ApiResponse<T>>,
  formData: any
): Promise<any> => {
  console.log('Creating event with API:', fetchApi);
  console.log('Form data:', formData);
  console.log('API route:', API_ROUTES.Events.Create);

  // Transform the form data to match API requirements
  const payload: CreateEventPayload = {
    title: formData.title,
    category: formData.category,
    description: formData.description,
    start_date: dayjs(formData.startDate).format('YYYY-MM-DD'),
    start_time: dayjs(formData.startTime).format('HH:mm'),
    end_time: dayjs(formData.endTime).format('HH:mm'),
    timezone: formData.timezone,
    event_type: formData.eventType,
    hide_address: formData.hideAddress || false,
    is_paid: formData.isPaid || false,
    status: 'published', // We can make this configurable if needed

    // Optional fields
    meeting_link: formData.meetingLink,
    venue_name: formData.venueName,
    address: formData.address,
    city: formData.city,
    postal_code: formData.postalCode,
    max_participants: formData.maxParticipants,
    min_age: formData.minAge,
    rules: formData.rules,
    notes: formData.notes,
  };

  // Add coordinates if available
  if (formData.coordinates) {
    payload.latitude = formData.coordinates[1];
    payload.longitude = formData.coordinates[0];
  }

  // Add price and currency if it's a paid event
  if (formData.isPaid) {
    payload.price = Number(formData.price);
    payload.currency = formData.currency;
  }

  console.log('Transformed payload:', payload);

  try {
    const response = await fetchApi(API_ROUTES.Events.Create, {
      method: 'POST',
      data: payload,
    });

    if (!response.success) {
      const errors = isValidationErrors(response.errors)
        ? response.errors
        : {
            general: Array.isArray(response.errors)
              ? response.errors
              : [String(response.errors || 'Unknown error')],
          };
      throw new ValidationError('Validation failed', errors);
    }

    return response.data;
  } catch (error: unknown) {
    console.error('API Error:', error);
    throw error;
  }
};

const isValidationErrors = (obj: unknown): obj is Record<string, string[]> => {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
};

export const getEvents = async (
  fetchApi: <T>(url: string, options?: any) => Promise<ApiResponse<T>>,
  options: { page: number; per_page: number }
): Promise<PaginatedResponse<Event>> => {
  const queryParams = new URLSearchParams({
    page: options.page.toString(),
    per_page: options.per_page.toString(),
  });

  const url = `${API_ROUTES.Events.List}?${queryParams.toString()}`;

  try {
    const response = await fetchApi<{ status: string; data: PaginatedResponse<Event> }>(url, {
      method: 'GET',
    });

    if (!response.success || !response.data || response.data.status !== 'success') {
      throw new Error(response.errors?.toString() || 'Failed to fetch events');
    }

    // Add debug log to see the response structure
    console.log('Raw API response:', response.data);

    // Return the data property from the response
    return response.data.data;
  } catch (error: unknown) {
    console.error('API Error:', error);
    throw error;
  }
};
