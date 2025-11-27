import { ServiceCategory, ServiceProvider, Service, Booking, Review, BookingStatus, ServiceSubcategory } from '../types';
import { COLORS } from './colors';
import { getCategoryIcon } from './icons';

// Sous-catégories pour chaque catégorie principale
const BEAUTE_COIFFURE_SUBCATEGORIES: ServiceSubcategory[] = [
  { id: '1-1', name: 'Coiffure Femme', parentCategoryId: '1' },
  { id: '1-2', name: 'Brushing / coupe / lissage', parentCategoryId: '1' },
  { id: '1-3', name: 'Pose de perruque / lace / baby hair', parentCategoryId: '1' },
  { id: '1-4', name: 'Pose de tissage / extensions', parentCategoryId: '1' },
  { id: '1-5', name: 'Coloration / mèches / soins capillaires', parentCategoryId: '1' },
  { id: '1-6', name: 'Coiffure Homme', parentCategoryId: '1' },
  { id: '1-7', name: 'Coupe / dégradé / contour', parentCategoryId: '1' },
  { id: '1-8', name: 'Barbe / soin barbe', parentCategoryId: '1' },
  { id: '1-9', name: 'Coloration homme', parentCategoryId: '1' },
  { id: '1-10', name: 'Tresses & Locks', parentCategoryId: '1' },
  { id: '1-11', name: 'Tresses simples / vanilles / box braids', parentCategoryId: '1' },
  { id: '1-12', name: 'Cornrows / nattes collées', parentCategoryId: '1' },
  { id: '1-13', name: 'Pose de locks / retwist / nettoyage / coiffure finition', parentCategoryId: '1' },
  { id: '1-14', name: 'Crochet braids / bantu knots', parentCategoryId: '1' },
  { id: '1-15', name: 'Coiffure Enfant', parentCategoryId: '1' },
  { id: '1-16', name: 'Tresses fille / garçon', parentCategoryId: '1' },
  { id: '1-17', name: 'Vanilles / chignons', parentCategoryId: '1' },
];

const MAQUILLAGE_ESTHETIQUE_SUBCATEGORIES: ServiceSubcategory[] = [
  { id: '2-1', name: 'Maquillage', parentCategoryId: '2' },
  { id: '2-2', name: 'Jour / soirée / mariage', parentCategoryId: '2' },
  { id: '2-3', name: 'Professionnel / shooting / artistique', parentCategoryId: '2' },
  { id: '2-4', name: 'Semi-permanent (sourcils, lèvres)', parentCategoryId: '2' },
  { id: '2-5', name: 'Soins du visage', parentCategoryId: '2' },
  { id: '2-6', name: 'Nettoyage / gommage / masque', parentCategoryId: '2' },
  { id: '2-7', name: 'Hydratant / anti-acné / purifiant', parentCategoryId: '2' },
  { id: '2-8', name: 'Épilation', parentCategoryId: '2' },
  { id: '2-9', name: 'Sourcils / lèvres / jambes / aisselles', parentCategoryId: '2' },
  { id: '2-10', name: 'Cire / fil / pince', parentCategoryId: '2' },
  { id: '2-11', name: 'Tatouage & Henné', parentCategoryId: '2' },
  { id: '2-12', name: 'Henné mains / bras / jambes / visage', parentCategoryId: '2' },
  { id: '2-13', name: 'Tatouage éphémère artistique', parentCategoryId: '2' },
];

const ONGLES_CILS_SUBCATEGORIES: ServiceSubcategory[] = [
  { id: '3-1', name: 'Ongles', parentCategoryId: '3' },
  { id: '3-2', name: 'Pose capsules / gel / acrygel', parentCategoryId: '3' },
  { id: '3-3', name: 'Remplissage / dépose', parentCategoryId: '3' },
  { id: '3-4', name: 'Nail art / french / baby boomer', parentCategoryId: '3' },
  { id: '3-5', name: 'Beauté mains et pieds', parentCategoryId: '3' },
  { id: '3-6', name: 'Cils', parentCategoryId: '3' },
  { id: '3-7', name: 'Extensions (classique, volume russe, mixte)', parentCategoryId: '3' },
  { id: '3-8', name: 'Rehaussement / teinture / dépose', parentCategoryId: '3' },
];

const MODE_COUTURE_SUBCATEGORIES: ServiceSubcategory[] = [
  { id: '4-1', name: 'Retouches / Réparations', parentCategoryId: '4' },
  { id: '4-2', name: 'Reprise couture / ourlet / fermeture / bouton', parentCategoryId: '4' },
  { id: '4-3', name: 'Ajustement taille / coupe / manches', parentCategoryId: '4' },
  { id: '4-4', name: 'Création sur mesure', parentCategoryId: '4' },
  { id: '4-5', name: 'Tenues africaines / robes / costumes', parentCategoryId: '4' },
  { id: '4-6', name: 'Tricot / crochet / création laine', parentCategoryId: '4' },
  { id: '4-7', name: 'Design personnalisé', parentCategoryId: '4' },
  { id: '4-8', name: 'Customisation', parentCategoryId: '4' },
  { id: '4-9', name: 'Peinture sur vêtements', parentCategoryId: '4' },
  { id: '4-10', name: 'Strass / broderie / flocage / perles', parentCategoryId: '4' },
];

const ACCESSOIRES_CHAUSSURES_SUBCATEGORIES: ServiceSubcategory[] = [
  { id: '5-1', name: 'Entretien / Nettoyage', parentCategoryId: '5' },
  { id: '5-2', name: 'Nettoyage baskets, talons, mocassins', parentCategoryId: '5' },
  { id: '5-3', name: 'Détachage, désodorisation, cirage', parentCategoryId: '5' },
  { id: '5-4', name: 'Rénovation / recoloration', parentCategoryId: '5' },
  { id: '5-5', name: 'Customisation', parentCategoryId: '5' },
  { id: '5-6', name: 'Peinture personnalisée sur chaussures', parentCategoryId: '5' },
  { id: '5-7', name: 'Custom sacs / ceintures / bijoux', parentCategoryId: '5' },
];

const BIENETRE_CORPS_SUBCATEGORIES: ServiceSubcategory[] = [
  { id: '6-1', name: 'Soins du corps', parentCategoryId: '6' },
  { id: '6-2', name: 'Massage relaxant / sportif / tonifiant', parentCategoryId: '6' },
  { id: '6-3', name: 'Gommage / soins minceur', parentCategoryId: '6' },
  { id: '6-4', name: 'Coaching', parentCategoryId: '6' },
  { id: '6-5', name: 'Coaching sportif (fitness, musculation, perte de poids)', parentCategoryId: '6' },
  { id: '6-6', name: 'Coaching nutritionnel / santé', parentCategoryId: '6' },
];

const CUISINE_EVENEMENTIEL_SUBCATEGORIES: ServiceSubcategory[] = [
  { id: '7-1', name: 'Traiteurs indépendants', parentCategoryId: '7' },
  { id: '7-2', name: 'Plats africains / orientaux / européens', parentCategoryId: '7' },
  { id: '7-3', name: 'Pâtisseries maison / desserts', parentCategoryId: '7' },
  { id: '7-4', name: 'Buffets pour petits événements', parentCategoryId: '7' },
  { id: '7-5', name: 'Décoration & Organisation', parentCategoryId: '7' },
  { id: '7-6', name: 'Décoration baby shower / anniversaire / mariage', parentCategoryId: '7' },
  { id: '7-7', name: 'Location de déco / création personnalisée', parentCategoryId: '7' },
];

const PHOTO_IMAGE_SUBCATEGORIES: ServiceSubcategory[] = [
  { id: '8-1', name: 'Photographe', parentCategoryId: '8' },
  { id: '8-2', name: 'Shooting studio / extérieur', parentCategoryId: '8' },
  { id: '8-3', name: 'Mariage / anniversaire / événement', parentCategoryId: '8' },
  { id: '8-4', name: 'Portraits / produits / mode', parentCategoryId: '8' },
  { id: '8-5', name: 'Retouche / Visuel', parentCategoryId: '8' },
  { id: '8-6', name: 'Retouche photo', parentCategoryId: '8' },
  { id: '8-7', name: 'Création visuelle / montage', parentCategoryId: '8' },
];

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: '1',
    name: 'Beauté & Coiffure',
    icon: getCategoryIcon('Coiffure'),
    color: COLORS.categoryColors.coiffure,
    subcategories: BEAUTE_COIFFURE_SUBCATEGORIES
  },
  {
    id: '2',
    name: 'Maquillage & Esthétique',
    icon: getCategoryIcon('Maquillage'),
    color: COLORS.categoryColors.maquillage,
    subcategories: MAQUILLAGE_ESTHETIQUE_SUBCATEGORIES
  },
  {
    id: '3',
    name: 'Ongles & Cils',
    icon: getCategoryIcon('Manucure'),
    color: COLORS.categoryColors.manucure,
    subcategories: ONGLES_CILS_SUBCATEGORIES
  },
  {
    id: '4',
    name: 'Mode & Couture',
    icon: 'shirt-outline',
    color: '#FF6B9D',
    subcategories: MODE_COUTURE_SUBCATEGORIES
  },
  {
    id: '5',
    name: 'Accessoires & Chaussures',
    icon: 'footsteps-outline',
    color: '#9B59B6',
    subcategories: ACCESSOIRES_CHAUSSURES_SUBCATEGORIES
  },
  {
    id: '6',
    name: 'Bien-être & Corps',
    icon: getCategoryIcon('Massage'),
    color: COLORS.categoryColors.massage,
    subcategories: BIENETRE_CORPS_SUBCATEGORIES
  },
  {
    id: '7',
    name: 'Cuisine & Événementiel',
    icon: 'restaurant-outline',
    color: '#E67E22',
    subcategories: CUISINE_EVENEMENTIEL_SUBCATEGORIES
  },
  {
    id: '8',
    name: 'Photo & Image',
    icon: 'camera-outline',
    color: '#3498DB',
    subcategories: PHOTO_IMAGE_SUBCATEGORIES
  }
];

export const SERVICES: Service[] = [
  // Beauté & Coiffure
  {
    id: '1',
    name: 'Coupe + Brushing',
    description: 'Coupe personnalisée avec brushing professionnel',
    duration: 60,
    price: 45,
    category: SERVICE_CATEGORIES[0],
    subcategory: BEAUTE_COIFFURE_SUBCATEGORIES[1], // Brushing / coupe / lissage
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400'
  },
  {
    id: '2',
    name: 'Coloration complète',
    description: 'Coloration complète avec produits professionnels',
    duration: 120,
    price: 80,
    category: SERVICE_CATEGORIES[0],
    subcategory: BEAUTE_COIFFURE_SUBCATEGORIES[4], // Coloration / mèches / soins capillaires
    image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400'
  },
  {
    id: '3',
    name: 'Box Braids',
    description: 'Pose de box braids professionnelles',
    duration: 240,
    price: 120,
    category: SERVICE_CATEGORIES[0],
    subcategory: BEAUTE_COIFFURE_SUBCATEGORIES[10], // Tresses simples / vanilles / box braids
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400'
  },
  // Ongles & Cils
  {
    id: '4',
    name: 'Manucure classique',
    description: 'Soin complet des mains avec vernis',
    duration: 45,
    price: 25,
    category: SERVICE_CATEGORIES[2],
    subcategory: ONGLES_CILS_SUBCATEGORIES[4], // Beauté mains et pieds
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400'
  },
  {
    id: '5',
    name: 'Pose capsules gel',
    description: 'Pose de capsules avec gel UV',
    duration: 90,
    price: 50,
    category: SERVICE_CATEGORIES[2],
    subcategory: ONGLES_CILS_SUBCATEGORIES[1], // Pose capsules / gel / acrygel
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400'
  },
  {
    id: '6',
    name: 'Extensions de cils volume russe',
    description: 'Pose d\'extensions cils volume russe',
    duration: 120,
    price: 90,
    category: SERVICE_CATEGORIES[2],
    subcategory: ONGLES_CILS_SUBCATEGORIES[6], // Extensions (classique, volume russe, mixte)
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400'
  },
  // Maquillage & Esthétique
  {
    id: '7',
    name: 'Maquillage de soirée',
    description: 'Maquillage professionnel pour événements',
    duration: 90,
    price: 60,
    category: SERVICE_CATEGORIES[1],
    subcategory: MAQUILLAGE_ESTHETIQUE_SUBCATEGORIES[1], // Jour / soirée / mariage
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400'
  },
  {
    id: '8',
    name: 'Soin du visage hydratant',
    description: 'Soin hydratant et anti-âge',
    duration: 75,
    price: 55,
    category: SERVICE_CATEGORIES[1],
    subcategory: MAQUILLAGE_ESTHETIQUE_SUBCATEGORIES[6], // Hydratant / anti-acné / purifiant
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400'
  },
  {
    id: '9',
    name: 'Épilation à la cire',
    description: 'Épilation complète jambes et maillot',
    duration: 45,
    price: 35,
    category: SERVICE_CATEGORIES[1],
    subcategory: MAQUILLAGE_ESTHETIQUE_SUBCATEGORIES[9], // Cire / fil / pince
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400'
  },
  // Bien-être & Corps
  {
    id: '10',
    name: 'Massage relaxant',
    description: 'Massage corporel complet 1h',
    duration: 60,
    price: 70,
    category: SERVICE_CATEGORIES[5],
    subcategory: BIENETRE_CORPS_SUBCATEGORIES[1], // Massage relaxant / sportif / tonifiant
    image: 'https://images.unsplash.com/photo-1544161512-4ab8f4f2a52a?w=400'
  },
  {
    id: '11',
    name: 'Massage aux pierres chaudes',
    description: 'Massage relaxant avec pierres volcaniques',
    duration: 90,
    price: 85,
    category: SERVICE_CATEGORIES[5],
    subcategory: BIENETRE_CORPS_SUBCATEGORIES[1],
    image: 'https://images.unsplash.com/photo-1544161512-4ab8f4f2a52a?w=400'
  },
  {
    id: '12',
    name: 'Pédicure',
    description: 'Soin complet des pieds avec vernis',
    duration: 60,
    price: 30,
    category: SERVICE_CATEGORIES[2],
    subcategory: ONGLES_CILS_SUBCATEGORIES[4], // Beauté mains et pieds
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400'
  }
];

export const SERVICE_PROVIDERS: ServiceProvider[] = [
  {
    id: '1',
    name: 'Marie Dubois',
    firstName: 'Marie',
    lastName: 'Dubois',
    email: 'marie.dubois@email.com',
    phone: '06 12 34 56 78',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200',
    isProvider: true,
    age: 32,
    rating: 4.8,
    reviewCount: 127,
    // Localisation
    city: 'Paris',
    activityZone: 'Paris 15e',
    location: {
      latitude: 48.8566,
      longitude: 2.3522,
      address: '15 rue de la Paix, Paris',
      city: 'Paris',
      postalCode: '75001'
    },
    // Informations professionnelles
    mainSkills: ['coiffure', 'coloration', 'tresses'],
    description: 'Coiffeuse professionnelle avec 10 ans d\'expérience, spécialisée en coiffure afro et tresses',
    experience: 10,
    experienceLevel: 'expert',
    // Services
    services: SERVICES.filter(s => ['1', '2', '3'].includes(s.id)),
    priceRange: { min: 25, max: 120 },
    // Disponibilités
    availability: [
      { dayOfWeek: 1, startTime: '09:00', endTime: '18:00', isAvailable: true },
      { dayOfWeek: 2, startTime: '09:00', endTime: '18:00', isAvailable: true },
      { dayOfWeek: 3, startTime: '09:00', endTime: '18:00', isAvailable: true },
      { dayOfWeek: 4, startTime: '09:00', endTime: '18:00', isAvailable: true },
      { dayOfWeek: 5, startTime: '09:00', endTime: '18:00', isAvailable: true },
      { dayOfWeek: 6, startTime: '09:00', endTime: '16:00', isAvailable: true },
    ],
    // Portfolio
    portfolio: [
      {
        id: 'p1-1',
        type: 'photo',
        url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400',
        title: 'Box Braids',
        category: 'coiffure',
        createdAt: '2024-01-01T10:00:00Z'
      },
      {
        id: 'p1-2',
        type: 'photo',
        url: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400',
        title: 'Coloration mèches',
        category: 'coiffure',
        createdAt: '2024-01-05T10:00:00Z'
      }
    ],
    // Réseaux sociaux
    socialMedia: {
      instagram: '@marie_coiffure',
      tiktok: '@marie_dubois'
    },
    // Statut/Abonnement
    isPremium: true,
    subscriptionType: 'premium',
    subscriptionStartDate: '2024-01-01',
    subscriptionExpiryDate: '2024-12-31',
    // Urgence
    acceptsEmergency: true,
    emergencyCredits: 10,
    // Certifications
    certifications: [],
    verified: true
  },
  {
    id: '2',
    name: 'Sophie Martin',
    firstName: 'Sophie',
    lastName: 'Martin',
    email: 'sophie.martin@email.com',
    phone: '06 23 45 67 89',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    isProvider: true,
    age: 28,
    rating: 4.9,
    reviewCount: 89,
    // Localisation
    city: 'Paris',
    activityZone: 'Paris 8e',
    location: {
      latitude: 48.8606,
      longitude: 2.3376,
      address: '8 avenue des Champs-Élysées, Paris',
      city: 'Paris',
      postalCode: '75008'
    },
    // Informations professionnelles
    mainSkills: ['manucure', 'pédicure', 'nail art'],
    description: 'Spécialiste en manucure et pédicure, experte en nail art',
    experience: 5,
    experienceLevel: 'intermediate',
    // Services
    services: SERVICES.filter(s => ['4', '5', '12'].includes(s.id)),
    priceRange: { min: 25, max: 50 },
    // Disponibilités
    availability: [
      { dayOfWeek: 1, startTime: '10:00', endTime: '19:00', isAvailable: true },
      { dayOfWeek: 2, startTime: '10:00', endTime: '19:00', isAvailable: true },
      { dayOfWeek: 3, startTime: '10:00', endTime: '19:00', isAvailable: true },
      { dayOfWeek: 4, startTime: '10:00', endTime: '19:00', isAvailable: true },
      { dayOfWeek: 5, startTime: '10:00', endTime: '19:00', isAvailable: true },
      { dayOfWeek: 6, startTime: '10:00', endTime: '17:00', isAvailable: true },
    ],
    // Portfolio
    portfolio: [
      {
        id: 'p2-1',
        type: 'photo',
        url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400',
        title: 'Nail Art French',
        category: 'ongles',
        createdAt: '2024-01-02T10:00:00Z'
      }
    ],
    // Réseaux sociaux
    socialMedia: {
      instagram: '@sophie_nails'
    },
    // Statut/Abonnement
    isPremium: true,
    subscriptionType: 'premium',
    subscriptionStartDate: '2024-01-15',
    subscriptionExpiryDate: '2024-12-31',
    // Urgence
    acceptsEmergency: false,
    // Certifications
    certifications: [],
    verified: true
  },
  {
    id: '3',
    name: 'Emma Wilson',
    firstName: 'Emma',
    lastName: 'Wilson',
    email: 'emma.wilson@email.com',
    phone: '06 34 56 78 90',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
    isProvider: true,
    age: 30,
    rating: 4.7,
    reviewCount: 156,
    // Localisation
    city: 'Paris',
    activityZone: 'Paris 8e',
    location: {
      latitude: 48.8706,
      longitude: 2.3236,
      address: '22 rue du Faubourg Saint-Honoré, Paris',
      city: 'Paris',
      postalCode: '75008'
    },
    // Informations professionnelles
    mainSkills: ['maquillage', 'soins visage', 'extensions cils'],
    description: 'Maquilleuse professionnelle spécialisée en maquillage de soirée et événements',
    experience: 7,
    experienceLevel: 'expert',
    // Services
    services: SERVICES.filter(s => ['6', '7', '8'].includes(s.id)),
    priceRange: { min: 40, max: 90 },
    // Disponibilités
    availability: [
      { dayOfWeek: 1, startTime: '11:00', endTime: '20:00', isAvailable: true },
      { dayOfWeek: 2, startTime: '11:00', endTime: '20:00', isAvailable: true },
      { dayOfWeek: 3, startTime: '11:00', endTime: '20:00', isAvailable: true },
      { dayOfWeek: 4, startTime: '11:00', endTime: '20:00', isAvailable: true },
      { dayOfWeek: 5, startTime: '11:00', endTime: '20:00', isAvailable: true },
      { dayOfWeek: 6, startTime: '11:00', endTime: '18:00', isAvailable: true },
      { dayOfWeek: 0, startTime: '12:00', endTime: '16:00', isAvailable: true },
    ],
    // Portfolio
    portfolio: [
      {
        id: 'p3-1',
        type: 'photo',
        url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400',
        title: 'Maquillage soirée',
        category: 'maquillage',
        createdAt: '2024-01-03T10:00:00Z'
      }
    ],
    // Réseaux sociaux
    socialMedia: {
      instagram: '@emma_makeup',
      tiktok: '@emma_wilson'
    },
    // Statut/Abonnement
    subscriptionType: 'free',
    // Urgence
    acceptsEmergency: true,
    emergencyCredits: 5,
    // Certifications
    certifications: [],
    verified: true
  },
  {
    id: '4',
    name: 'Julie Bernard',
    firstName: 'Julie',
    lastName: 'Bernard',
    email: 'julie.bernard@email.com',
    phone: '06 45 67 89 01',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    isProvider: true,
    age: 35,
    rating: 4.6,
    reviewCount: 203,
    // Localisation
    city: 'Paris',
    activityZone: 'Paris 9e',
    location: {
      latitude: 48.8506,
      longitude: 2.3666,
      address: '5 boulevard Haussmann, Paris',
      city: 'Paris',
      postalCode: '75009'
    },
    // Informations professionnelles
    mainSkills: ['massage', 'bien-être', 'relaxation'],
    description: 'Masseuse thérapeutique avec 12 ans d\'expérience',
    experience: 12,
    experienceLevel: 'expert',
    // Services
    services: SERVICES.filter(s => ['10', '11'].includes(s.id)),
    priceRange: { min: 60, max: 90 },
    // Disponibilités
    availability: [
      { dayOfWeek: 1, startTime: '08:00', endTime: '17:00', isAvailable: true },
      { dayOfWeek: 2, startTime: '08:00', endTime: '17:00', isAvailable: true },
      { dayOfWeek: 3, startTime: '08:00', endTime: '17:00', isAvailable: true },
      { dayOfWeek: 4, startTime: '08:00', endTime: '17:00', isAvailable: true },
      { dayOfWeek: 5, startTime: '08:00', endTime: '17:00', isAvailable: true },
      { dayOfWeek: 6, startTime: '08:00', endTime: '15:00', isAvailable: true },
    ],
    // Portfolio
    portfolio: [],
    // Réseaux sociaux
    socialMedia: {},
    // Statut/Abonnement
    subscriptionType: 'free',
    // Urgence
    acceptsEmergency: false,
    // Certifications
    certifications: [],
    verified: true
  },
  {
    id: '5',
    name: 'Camille Leroy',
    firstName: 'Camille',
    lastName: 'Leroy',
    email: 'camille.leroy@email.com',
    phone: '06 56 78 90 12',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200',
    isProvider: true,
    age: 26,
    rating: 4.5,
    reviewCount: 78,
    // Localisation
    city: 'Paris',
    activityZone: 'Paris 4e',
    location: {
      latitude: 48.8406,
      longitude: 2.3522,
      address: '12 rue de Rivoli, Paris',
      city: 'Paris',
      postalCode: '75004'
    },
    // Informations professionnelles
    mainSkills: ['épilation', 'soins visage', 'esthétique'],
    description: 'Esthéticienne et épilatrice, spécialisée en soins du visage',
    experience: 4,
    experienceLevel: 'intermediate',
    // Services
    services: SERVICES.filter(s => ['8', '9'].includes(s.id)),
    priceRange: { min: 30, max: 55 },
    // Disponibilités
    availability: [
      { dayOfWeek: 1, startTime: '09:30', endTime: '18:30', isAvailable: true },
      { dayOfWeek: 2, startTime: '09:30', endTime: '18:30', isAvailable: true },
      { dayOfWeek: 3, startTime: '09:30', endTime: '18:30', isAvailable: true },
      { dayOfWeek: 4, startTime: '09:30', endTime: '18:30', isAvailable: true },
      { dayOfWeek: 5, startTime: '09:30', endTime: '18:30', isAvailable: true },
      { dayOfWeek: 6, startTime: '09:30', endTime: '16:30', isAvailable: true },
    ],
    // Portfolio
    portfolio: [],
    // Réseaux sociaux
    socialMedia: {},
    // Statut/Abonnement
    subscriptionType: 'free',
    // Urgence
    acceptsEmergency: false,
    // Certifications
    certifications: [],
    verified: false
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