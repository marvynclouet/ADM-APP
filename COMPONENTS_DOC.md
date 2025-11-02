# 📚 Documentation des Composants

## Composants UI de Base

### AccessibleText
Composant de texte avec support d'accessibilité automatique.

**Props:**
- `variant`: 'h1' | 'h2' | 'h3' | 'body' | 'caption' - Style de texte
- `accessible`: boolean - Active l'accessibilité (défaut: true)
- `accessibilityLabel`: string - Label pour le lecteur d'écran

**Usage:**
```tsx
<AccessibleText variant="h1">Titre Principal</AccessibleText>
<AccessibleText variant="body" accessibilityLabel="Description du service">
  Texte descriptif
</AccessibleText>
```

### AccessibleButton
Bouton accessible avec support clavier et lecteur d'écran.

**Props:**
- `title`: string - Texte du bouton (requis)
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' - Style
- `size`: 'small' | 'medium' | 'large' - Taille
- `loading`: boolean - État de chargement
- `icon`: string - Nom de l'icône Ionicons
- `iconPosition`: 'left' | 'right' - Position de l'icône
- `fullWidth`: boolean - Pleine largeur

**Usage:**
```tsx
<AccessibleButton
  title="Valider"
  variant="primary"
  size="medium"
  onPress={handleSubmit}
/>
```

### LazyImage
Composant d'image avec lazy loading et cache automatique.

**Props:**
- `uri`: string - URL de l'image (requis)
- `style`: StyleSheet - Styles personnalisés
- `placeholder`: string - URL de l'image de remplacement
- `resizeMode`: 'cover' | 'contain' | 'stretch' | 'center'

**Usage:**
```tsx
<LazyImage
  uri="https://example.com/image.jpg"
  style={styles.image}
  resizeMode="cover"
/>
```

## Badges

### LevelBadge
Affiche le niveau d'un service (Débutant, Intermédiaire, Avancé, Pro).

**Props:**
- `level`: ServiceLevel - Niveau du service (requis)
- `size`: 'small' | 'medium' | 'large' - Taille du badge

**Usage:**
```tsx
<LevelBadge level={ServiceLevel.PRO} size="medium" />
```

### PremiumBadge
Badge Premium avec gradient doré.

**Props:**
- `size`: 'small' | 'medium' | 'large' - Taille du badge

**Usage:**
```tsx
<PremiumBadge size="medium" />
```

### EmergencyBadge
Badge pour indiquer la disponibilité en urgence.

**Props:**
- `size`: 'small' | 'medium' | 'large' - Taille du badge

**Usage:**
```tsx
<EmergencyBadge size="small" />
```

## États & Feedback

### LoadingSpinner
Indicateur de chargement animé.

**Props:**
- `size`: 'small' | 'medium' | 'large' - Taille
- `text`: string - Texte optionnel
- `color`: string - Couleur personnalisée

**Usage:**
```tsx
<LoadingSpinner size="large" text="Chargement..." />
```

### SkeletonCard
Placeholder animé pour les contenus en chargement.

**Props:**
- `width`: number | string - Largeur
- `height`: number - Hauteur
- `borderRadius`: number - Rayon des bords

**Usage:**
```tsx
<SkeletonCard width="100%" height={200} borderRadius={12} />
```

### EmptyState
État vide avec message et action suggérée.

**Props:**
- `icon`: string - Nom de l'icône Ionicons
- `title`: string - Titre (requis)
- `description`: string - Description (requis)
- `actionText`: string - Texte du bouton d'action
- `onAction`: () => void - Callback du bouton

**Usage:**
```tsx
<EmptyState
  icon="calendar-outline"
  title="Aucune réservation"
  description="Vous n'avez pas encore de réservations"
  actionText="Réserver un service"
  onAction={handleReserve}
/>
```

### Toast
Notification toast animée.

**Props:**
- `visible`: boolean - Visibilité
- `message`: string - Message
- `type`: 'success' | 'error' | 'warning' | 'info' - Type
- `onHide`: () => void - Callback de fermeture

**Usage:**
```tsx
<Toast
  visible={showToast}
  message="Action réussie !"
  type="success"
  onHide={handleHideToast}
/>
```

## Navigation

### CustomTabBar
Barre de navigation personnalisée avec badges.

**Props:**
- `state`: NavigationState - État de navigation
- `descriptors`: Descriptors - Descripteurs des routes
- `navigation`: Navigation - Objet de navigation

**Fonctionnalités:**
- Badge de notification sur Messages
- Icons dynamiques
- Animations de transition

## Formulaires

### FormField
Champ de formulaire avec validation visuelle.

**Props:**
- `label`: string - Label (requis)
- `value`: string - Valeur
- `onChangeText`: (text: string) => void - Callback
- `placeholder`: string - Placeholder
- `secureTextEntry`: boolean - Mode password
- `error`: string - Message d'erreur
- `required`: boolean - Champ obligatoire
- `multiline`: boolean - Zone de texte multiline
- `maxLength`: number - Longueur maximum

**Usage:**
```tsx
<FormField
  label="Email"
  value={email}
  onChangeText={setEmail}
  placeholder="votre@email.com"
  keyboardType="email-address"
  required
/>
```

### RatingModal
Modal de notation et avis.

**Props:**
- `visible`: boolean - Visibilité
- `onClose`: () => void - Callback de fermeture
- `onSubmit`: (rating: number, review: string) => void - Callback de soumission
- `providerName`: string - Nom du prestataire
- `serviceName`: string - Nom du service

**Usage:**
```tsx
<RatingModal
  visible={showModal}
  onClose={() => setShowModal(false)}
  onSubmit={handleSubmitRating}
  providerName="Marie Dubois"
  serviceName="Coiffure"
/>
```

## Hooks Utilitaires

### useToast
Hook pour gérer les notifications toast.

**Fonctions:**
- `showToast(message, type, duration)`
- `showSuccess(message)`
- `showError(message)`
- `showWarning(message)`
- `showInfo(message)`
- `hideToast()`

**Usage:**
```tsx
const { showSuccess, showError } = useToast();

showSuccess('Action réussie !');
showError('Une erreur est survenue');
```

### useFavorites
Hook pour gérer les favoris avec AsyncStorage.

**Fonctions:**
- `toggleFavorite(providerId)`
- `isFavorite(providerId)`: boolean
- `clearFavorites()`

**Usage:**
```tsx
const { toggleFavorite, isFavorite } = useFavorites();

<FavoriteButton
  isFavorite={isFavorite(provider.id)}
  onToggle={() => toggleFavorite(provider.id)}
/>
```

### useAccessibility
Hook pour détecter les paramètres d'accessibilité.

**Retourne:**
- `isScreenReaderEnabled`: boolean
- `preferredFontScale`: number
- `isReduceMotionEnabled`: boolean

**Usage:**
```tsx
const { isScreenReaderEnabled, preferredFontScale } = useAccessibility();
```

### usePerformance
Hook pour optimiser les callbacks.

**Fonctions:**
- `useOptimizedCallback(callback, delay, mode)`

**Usage:**
```tsx
const handleSearch = useOptimizedCallback(
  (text: string) => {
    // Recherche
  },
  300,
  'debounce'
);
```

## Utilitaires

### imageCache
Cache d'images avec préchargement.

**Fonctions:**
- `preloadImage(uri)`: Promise<void>
- `preloadImages(uris)`: Promise<void>
- `getCachedUri(uri)`: string | null
- `clearCache()`

### performance
Utilitaires de performance.

**Fonctions:**
- `debounce(func, wait)`
- `throttle(func, limit)`
- `memoize(fn)`
- `measurePerformance(fn, label)`

### accessibility
Utilitaires d'accessibilité.

**Fonctions:**
- `getScaledFontSize(baseSize, scale)`: number
- `checkContrast(foreground, background)`: boolean
- `getAccessibleColor(baseColor, backgroundColor, fallback)`: string
- `createAccessibleStyles(baseStyles)`: StyleSheet

