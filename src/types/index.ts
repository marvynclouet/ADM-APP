export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  isProvider: boolean;
  rating?: number;
  reviewCount?: number;
  // Données de connexion
  password?: string; // Crypté en production
  verified?: boolean; // Vérification d'identité
}

// Profil Client complet
export interface ClientProfile extends User {
  firstName: string;
  lastName: string;
  age?: number;
  ageRange?: string; // Ex: "25-30"
  // Localisation
  city?: string;
  neighborhood?: string; // Ex: "Paris 15e", "Lyon centre"
  approximateLocation?: string;
  // Préférences
  favoriteServiceTypes?: string[]; // IDs des catégories préférées
  preferredProviderGender?: 'male' | 'female' | 'any';
  priceRange?: {
    min: number;
    max: number;
  };
  // Favoris
  favoriteProviders?: string[]; // IDs des prestataires favoris
  favoriteCategories?: { [categoryId: string]: string[] }; // Favoris par catégorie
  // Historique
  bookingHistory?: string[]; // IDs des réservations
  contactedProviders?: string[]; // IDs des prestataires contactés
  reviewsPosted?: string[]; // IDs des avis déposés
  // Notifications
  notificationPreferences?: {
    newProvidersNearby?: boolean;
    offersAndPromotions?: boolean;
    bookingReminders?: boolean;
  };
  // Réseaux sociaux
  socialMedia?: {
    instagram?: string;
    tiktok?: string;
  };
  // Fidélité
  loyaltyPoints?: number;
  subscriptionHistory?: SubscriptionHistory[];
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

// Profil Prestataire complet
export interface ServiceProvider extends User {
  // Informations personnelles
  firstName: string;
  lastName: string;
  age?: number;
  // Coordonnées
  phone?: string; // Optionnel mais recommandé
  // Localisation
  location: Location;
  city?: string;
  activityZone?: string; // Ex: "Paris 15e", "Île-de-France"
  // Informations professionnelles
  mainSkills?: string[]; // Ex: ["coiffure", "maquillage", "ongles"]
  description: string; // Bio du prestataire
  experience: number; // Années d'expérience
  experienceLevel?: 'beginner' | 'intermediate' | 'expert'; // Niveau d'expérience
  // Services
  services: Service[];
  // Tarification
  priceRange: {
    min: number;
    max: number;
  };
  // Disponibilités
  availability: Availability[];
  // Portfolio/Galerie
  portfolio?: PortfolioItem[];
  // Avis et notation
  rating?: number;
  reviewCount?: number;
  // Réseaux sociaux
  socialMedia?: {
    instagram?: string;
    tiktok?: string;
    facebook?: string;
  };
  // Statut/Abonnement
  isPremium?: boolean;
  subscriptionType?: 'free' | 'premium';
  subscriptionStartDate?: string;
  subscriptionExpiryDate?: string;
  // Urgence
  acceptsEmergency?: boolean;
  emergencyCredits?: number;
  // Certifications
  certifications: Certificate[];
  // Sécurité
  verified?: boolean; // Vérification d'identité
}

export interface PortfolioItem {
  id: string;
  type: 'photo' | 'video';
  url: string;
  thumbnail?: string;
  title?: string;
  description?: string;
  category?: string; // Catégorie de service associée
  createdAt: string;
  isBeforeAfter?: boolean; // Photo avant/après
  beforeImage?: string; // URL de l'image "avant"
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
  subcategory?: ServiceSubcategory; // Sous-catégorie optionnelle
  image?: string;
  level?: ServiceLevel; // Niveau de service
  isCustom?: boolean; // Prestation personnalisée ajoutée par le prestataire
  customServiceData?: {
    providerId: string;
    createdAt: string;
    isModerated?: boolean; // Si modération nécessaire
    moderationStatus?: 'pending' | 'approved' | 'rejected';
  };
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  subcategories?: ServiceSubcategory[]; // Sous-catégories
}

export interface ServiceSubcategory {
  id: string;
  name: string;
  parentCategoryId: string;
  icon?: string;
  color?: string;
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

export interface SubscriptionHistory {
  id: string;
  type: 'free' | 'premium';
  startDate: string;
  endDate?: string;
  isActive: boolean;
} 