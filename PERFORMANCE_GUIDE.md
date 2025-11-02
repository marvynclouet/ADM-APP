# ⚡ Guide de Performance ADM

## Optimisations Implémentées

### 1. Lazy Loading des Images

**Composant:** `LazyImage`

**Avantages:**
- Chargement à la demande
- Cache automatique
- Placeholder pendant chargement
- Gestion des erreurs

**Usage:**
```tsx
// Au lieu de:
<Image source={{ uri: imageUrl }} />

// Utiliser:
<LazyImage uri={imageUrl} style={styles.image} />
```

### 2. Cache d'Images

**Utilitaire:** `imageCache`

**Fonctionnalités:**
- Préchargement automatique
- Cache mémoire
- Préchargement en batch

**Usage:**
```tsx
import { imageCache } from '../utils/imageCache';

// Précharger une image
await imageCache.preloadImage(imageUrl);

// Précharger plusieurs images
await imageCache.preloadImages([url1, url2, url3]);
```

### 3. Optimisation des Callbacks

**Hook:** `useOptimizedCallback`

**Avantages:**
- Debounce pour les recherches
- Throttle pour les scrolls
- Réduction des re-renders

**Usage:**
```tsx
const handleSearch = useOptimizedCallback(
  (text: string) => {
    // Recherche
  },
  300, // délai en ms
  'debounce'
);
```

### 4. Mémoization

**Utilitaire:** `memoize`

**Usage:**
```tsx
import { memoize } from '../utils/performance';

const expensiveCalculation = memoize((input: number) => {
  // Calcul coûteux
  return result;
});
```

### 5. Mesure de Performance

**Utilitaire:** `measurePerformance`

**Usage:**
```tsx
import { measurePerformance } from '../utils/performance';

const optimizedFunction = measurePerformance(
  (data: any) => {
    // Fonction à mesurer
  },
  'Function Name'
);
```

## Bonnes Pratiques

### Images
✅ **À faire:**
- Utiliser `LazyImage` partout
- Précharger les images critiques
- Optimiser la taille des images
- Utiliser des formats modernes (WebP)

❌ **À éviter:**
- Charger toutes les images au démarrage
- Images non optimisées
- Pas de placeholder

### Animations
✅ **À faire:**
- Utiliser `useNativeDriver: true`
- Limiter les animations coûteuses
- Respecter `reduceMotion`

❌ **À éviter:**
- Animations sur le thread JS
- Trop d'animations simultanées

### Rendu
✅ **À faire:**
- Utiliser `React.memo` pour les composants lourds
- Virtualiser les longues listes
- Lazy load les composants

❌ **À éviter:**
- Re-renders inutiles
- Listes non virtualisées
- Trop de composants lourds

### État
✅ **À faire:**
- Localiser l'état au plus bas niveau
- Utiliser `useMemo` et `useCallback`
- Débounce les inputs

❌ **À éviter:**
- État global excessif
- Callbacks non mémorisés

## Objectifs de Performance

### Temps de Chargement
- **Initial Load:** < 2s
- **Page Transition:** < 300ms
- **Image Load:** < 1s

### Frame Rate
- **Target:** 60fps
- **Minimum:** 30fps
- **Animations:** 60fps constant

### Taille Bundle
- **Initial:** < 500KB
- **Total:** < 2MB
- **Code Splitting:** Par route

## Monitoring

### En Développement
```tsx
import { useRenderTime } from '../hooks/usePerformance';

const MyComponent = () => {
  useRenderTime('MyComponent');
  // ...
};
```

### Métriques à Surveiller
- Temps de rendu par composant
- Nombre de re-renders
- Taille du bundle
- Temps de chargement des images
- Performance des animations

## Checklist Performance

- [x] Lazy loading des images
- [x] Cache des images
- [x] Optimisation des callbacks
- [x] Mesure de performance
- [ ] Virtualisation des listes
- [ ] Code splitting
- [ ] Optimisation des animations
- [ ] Réduction de la taille du bundle

