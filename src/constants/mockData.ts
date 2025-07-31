import { ServiceCategory, ServiceProvider, Service, Booking, Review, BookingStatus } from '../types';
import { COLORS } from './colors';
import { getCategoryIcon } from './icons';

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: '1',
    name: 'Coiffure',
    icon: getCategoryIcon('Coiffure'),
    color: COLORS.categoryColors.coiffure
  },
  {
    id: '2',
    name: 'Manucure',
    icon: getCategoryIcon('Manucure'),
    color: COLORS.categoryColors.manucure
  },
  {
    id: '3',
    name: 'Maquillage',
    icon: getCategoryIcon('Maquillage'),
    color: COLORS.categoryColors.maquillage
  },
  {
    id: '4',
    name: 'Massage',
    icon: getCategoryIcon('Massage'),
    color: COLORS.categoryColors.massage
  },
  {
    id: '5',
    name: 'Épilation',
    icon: getCategoryIcon('Épilation'),
    color: COLORS.categoryColors.epilation
  },
  {
    id: '6',
    name: 'Soins',
    icon: getCategoryIcon('Soins'),
    color: COLORS.categoryColors.soins
  }
];

export const SERVICES: Service[] = [
  {
    id: '1',
    name: 'Coupe + Brushing',
    description: 'Coupe personnalisée avec brushing professionnel',
    duration: 60,
    price: 45,
    category: SERVICE_CATEGORIES[0],
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400'
  },
  {
    id: '2',
    name: 'Coloration',
    description: 'Coloration complète avec produits professionnels',
    duration: 120,
    price: 80,
    category: SERVICE_CATEGORIES[0],
    image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400'
  },
  {
    id: '3',
    name: 'Manucure classique',
    description: 'Soin complet des mains avec vernis',
    duration: 45,
    price: 25,
    category: SERVICE_CATEGORIES[1],
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400'
  },
  {
    id: '4',
    name: 'Maquillage de soirée',
    description: 'Maquillage professionnel pour événements',
    duration: 90,
    price: 60,
    category: SERVICE_CATEGORIES[2],
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400'
  },
  {
    id: '5',
    name: 'Massage relaxant',
    description: 'Massage corporel complet 1h',
    duration: 60,
    price: 70,
    category: SERVICE_CATEGORIES[3],
    image: 'https://images.unsplash.com/photo-1544161512-4ab8f4f2a52a?w=400'
  },
  {
    id: '6',
    name: 'Épilation à la cire',
    description: 'Épilation complète jambes et maillot',
    duration: 45,
    price: 35,
    category: SERVICE_CATEGORIES[4],
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400'
  },
  {
    id: '7',
    name: 'Soin du visage',
    description: 'Soin hydratant et anti-âge',
    duration: 75,
    price: 55,
    category: SERVICE_CATEGORIES[5],
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400'
  },
  {
    id: '8',
    name: 'Extensions de cils',
    description: 'Pose d\'extensions cils par cils',
    duration: 120,
    price: 90,
    category: SERVICE_CATEGORIES[2],
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400'
  },
  {
    id: '9',
    name: 'Pédicure',
    description: 'Soin complet des pieds avec vernis',
    duration: 60,
    price: 30,
    category: SERVICE_CATEGORIES[1],
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400'
  },
  {
    id: '10',
    name: 'Massage aux pierres chaudes',
    description: 'Massage relaxant avec pierres volcaniques',
    duration: 90,
    price: 85,
    category: SERVICE_CATEGORIES[3],
    image: 'https://images.unsplash.com/photo-1544161512-4ab8f4f2a52a?w=400'
  }
];

export const SERVICE_PROVIDERS: ServiceProvider[] = [
  {
    id: '1',
    name: 'Marie Dubois',
    email: 'marie.dubois@email.com',
    phone: '06 12 34 56 78',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200',
    isProvider: true,
    rating: 4.8,
    reviewCount: 127,
    location: {
      latitude: 48.8566,
      longitude: 2.3522,
      address: '15 rue de la Paix, Paris'
    },
    services: ['1', '2'],
    availability: {
      monday: { start: '09:00', end: '18:00' },
      tuesday: { start: '09:00', end: '18:00' },
      wednesday: { start: '09:00', end: '18:00' },
      thursday: { start: '09:00', end: '18:00' },
      friday: { start: '09:00', end: '18:00' },
      saturday: { start: '09:00', end: '16:00' },
      sunday: { start: null, end: null }
    }
  },
  {
    id: '2',
    name: 'Sophie Martin',
    email: 'sophie.martin@email.com',
    phone: '06 23 45 67 89',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    isProvider: true,
    rating: 4.9,
    reviewCount: 89,
    location: {
      latitude: 48.8606,
      longitude: 2.3376,
      address: '8 avenue des Champs-Élysées, Paris'
    },
    services: ['3', '9'],
    availability: {
      monday: { start: '10:00', end: '19:00' },
      tuesday: { start: '10:00', end: '19:00' },
      wednesday: { start: '10:00', end: '19:00' },
      thursday: { start: '10:00', end: '19:00' },
      friday: { start: '10:00', end: '19:00' },
      saturday: { start: '10:00', end: '17:00' },
      sunday: { start: null, end: null }
    }
  },
  {
    id: '3',
    name: 'Emma Wilson',
    email: 'emma.wilson@email.com',
    phone: '06 34 56 78 90',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
    isProvider: true,
    rating: 4.7,
    reviewCount: 156,
    location: {
      latitude: 48.8706,
      longitude: 2.3236,
      address: '22 rue du Faubourg Saint-Honoré, Paris'
    },
    services: ['4', '8'],
    availability: {
      monday: { start: '11:00', end: '20:00' },
      tuesday: { start: '11:00', end: '20:00' },
      wednesday: { start: '11:00', end: '20:00' },
      thursday: { start: '11:00', end: '20:00' },
      friday: { start: '11:00', end: '20:00' },
      saturday: { start: '11:00', end: '18:00' },
      sunday: { start: '12:00', end: '16:00' }
    }
  },
  {
    id: '4',
    name: 'Julie Bernard',
    email: 'julie.bernard@email.com',
    phone: '06 45 67 89 01',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    isProvider: true,
    rating: 4.6,
    reviewCount: 203,
    location: {
      latitude: 48.8506,
      longitude: 2.3666,
      address: '5 boulevard Haussmann, Paris'
    },
    services: ['5', '10'],
    availability: {
      monday: { start: '08:00', end: '17:00' },
      tuesday: { start: '08:00', end: '17:00' },
      wednesday: { start: '08:00', end: '17:00' },
      thursday: { start: '08:00', end: '17:00' },
      friday: { start: '08:00', end: '17:00' },
      saturday: { start: '08:00', end: '15:00' },
      sunday: { start: null, end: null }
    }
  },
  {
    id: '5',
    name: 'Camille Leroy',
    email: 'camille.leroy@email.com',
    phone: '06 56 78 90 12',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200',
    isProvider: true,
    rating: 4.5,
    reviewCount: 78,
    location: {
      latitude: 48.8406,
      longitude: 2.3522,
      address: '12 rue de Rivoli, Paris'
    },
    services: ['6', '7'],
    availability: {
      monday: { start: '09:30', end: '18:30' },
      tuesday: { start: '09:30', end: '18:30' },
      wednesday: { start: '09:30', end: '18:30' },
      thursday: { start: '09:30', end: '18:30' },
      friday: { start: '09:30', end: '18:30' },
      saturday: { start: '09:30', end: '16:30' },
      sunday: { start: null, end: null }
    }
  }
];

// Données de distance simulées (en km) depuis la position de l'utilisateur
export const SERVICE_DISTANCES = {
  '1': 0.8, // Marie Dubois - Coupe + Brushing
  '2': 0.8, // Marie Dubois - Coloration
  '3': 1.2, // Sophie Martin - Manucure classique
  '4': 1.5, // Emma Wilson - Maquillage de soirée
  '5': 1.8, // Julie Bernard - Massage relaxant
  '6': 2.1, // Camille Leroy - Épilation à la cire
  '7': 2.1, // Camille Leroy - Soin du visage
  '8': 1.5, // Emma Wilson - Extensions de cils
  '9': 1.2, // Sophie Martin - Pédicure
  '10': 1.8, // Julie Bernard - Massage aux pierres chaudes
};

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: '1',
    userId: 'user1',
    providerId: '1',
    serviceId: '1',
    date: '2024-01-15',
    time: '14:00',
    duration: 60,
    totalPrice: 45,
    status: BookingStatus.CONFIRMED,
    notes: 'Coupe courte avec brushing',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z'
  },
  {
    id: '2',
    userId: 'user1',
    providerId: '2',
    serviceId: '3',
    date: '2024-01-18',
    time: '16:00',
    duration: 45,
    totalPrice: 25,
    status: BookingStatus.PENDING,
    notes: 'Vernis rouge',
    createdAt: '2024-01-12T15:30:00Z',
    updatedAt: '2024-01-12T15:30:00Z'
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    userId: 'user1',
    providerId: '1',
    serviceId: '1',
    rating: 5,
    comment: 'Excellente prestation, très professionnelle !',
    createdAt: '2024-01-10T10:00:00Z'
  },
  {
    id: '2',
    userId: 'user2',
    providerId: '2',
    serviceId: '3',
    rating: 4,
    comment: 'Très satisfaite du résultat',
    createdAt: '2024-01-09T14:30:00Z'
  }
]; 