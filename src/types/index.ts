export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  isProvider: boolean;
  rating?: number;
  reviewCount?: number;
}

export interface Certificate {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  image: string; // URL ou URI de l'image/PDF
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verifiedAt?: string;
}

export interface ServiceProvider extends User {
  services: Service[];
  location: Location;
  description: string;
  experience: number;
  certifications: Certificate[]; // Changé de string[] à Certificate[]
  availability: Availability[];
  priceRange: {
    min: number;
    max: number;
  };
  isPremium?: boolean; // Statut Premium
  acceptsEmergency?: boolean; // Accepte les réservations urgentes
  emergencyCredits?: number; // Crédits disponibles pour urgences (simulation)
}

export enum ServiceLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  PRO = 'pro'
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // en minutes
  price: number;
  category: ServiceCategory;
  image?: string;
  level?: ServiceLevel; // Niveau de service
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  postalCode: string;
}

export interface Availability {
  dayOfWeek: number; // 0-6 (dimanche-samedi)
  startTime: string; // format "HH:mm"
  endTime: string; // format "HH:mm"
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  providerId: string;
  serviceId: string;
  date: string; // format ISO
  time: string; // format "HH:mm"
  duration: number;
  totalPrice: number;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  NO_SHOW = 'no_show'
}

export interface Review {
  id: string;
  bookingId: string;
  userId: string;
  providerId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  data?: any;
}

export enum NotificationType {
  BOOKING_CONFIRMED = 'booking_confirmed',
  BOOKING_CANCELLED = 'booking_cancelled',
  BOOKING_REMINDER = 'booking_reminder',
  NEW_REVIEW = 'new_review',
  PAYMENT_RECEIVED = 'payment_received'
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  createdAt: string;
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export enum PaymentMethod {
  CARD = 'card',
  CASH = 'cash',
  PAYPAL = 'paypal',
  APPLE_PAY = 'apple_pay',
  GOOGLE_PAY = 'google_pay'
} 