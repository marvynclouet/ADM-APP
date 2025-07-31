export const ICONS = {
  // Navigation
  home: 'home',
  homeOutline: 'home-outline',
  search: 'search',
  searchOutline: 'search-outline',
  calendar: 'calendar',
  calendarOutline: 'calendar-outline',
  person: 'person',
  personOutline: 'person-outline',
  
  // Actions
  arrowBack: 'arrow-back',
  heart: 'heart',
  heartOutline: 'heart-outline',
  call: 'call',
  chatbubble: 'chatbubble',
  chevronForward: 'chevron-forward',
  
  // Services
  cut: 'cut',
  handSparkles: 'hand-sparkles',
  paintBrush: 'paint-brush',
  spa: 'spa',
  razor: 'razor',
  leaf: 'leaf',
  
  // Informations
  star: 'star',
  starOutline: 'star-outline',
  location: 'location',
  time: 'time',
  timeOutline: 'time-outline',
  pricetag: 'pricetag',
  pricetagOutline: 'pricetag-outline',
  
  // Interface
  filter: 'filter',
  personCircle: 'person-circle',
} as const; 

// Mapping des icônes pour les catégories de services
export const CATEGORY_ICONS = {
  coiffure: 'cut-outline',
  manucure: 'hand-left-outline',
  maquillage: 'color-palette-outline',
  massage: 'fitness-outline',
  epilation: 'remove-outline',
  soins: 'leaf-outline',
  // Icônes alternatives si les principales ne fonctionnent pas
  coiffure_alt: 'scissors-outline',
  manucure_alt: 'hand-right-outline',
  maquillage_alt: 'brush-outline',
  massage_alt: 'body-outline',
  epilation_alt: 'close-circle-outline',
  soins_alt: 'flower-outline',
} as const;

// Fonction pour obtenir l'icône d'une catégorie
export const getCategoryIcon = (categoryName: string): string => {
  const normalizedName = categoryName.toLowerCase();
  
  switch (normalizedName) {
    case 'coiffure':
      return CATEGORY_ICONS.coiffure;
    case 'manucure':
      return CATEGORY_ICONS.manucure;
    case 'maquillage':
      return CATEGORY_ICONS.maquillage;
    case 'massage':
      return CATEGORY_ICONS.massage;
    case 'épilation':
    case 'epilation':
      return CATEGORY_ICONS.epilation;
    case 'soins':
      return CATEGORY_ICONS.soins;
    default:
      return CATEGORY_ICONS.coiffure; // Icône par défaut
  }
}; 