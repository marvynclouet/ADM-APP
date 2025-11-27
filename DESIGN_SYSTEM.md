# 🎨 Design System ADM

## Principes de Design

### Philosophie
- **Simplicité** : Interface épurée et intuitive
- **Professionnalisme** : Design soigné pour les prestataires
- **Accessibilité** : Accessible à tous les utilisateurs
- **Performance** : Fluidité et réactivité optimales

## Palette de Couleurs

### Couleurs Principales
```typescript
primary: '#9333EA'      // Violet principal (actions, liens)
secondary: '#EC4899'   // Rose secondaire
accent: '#F59E0B'       // Orange accent
success: '#10B981'      // Vert succès
error: '#EF4444'        // Rouge erreur
warning: '#F59E0B'      // Orange avertissement
```

### Couleurs de Texte
```typescript
textPrimary: '#1F2937'   // Texte principal
textSecondary: '#6B7280'  // Texte secondaire
white: '#FFFFFF'          // Blanc
```

### Couleurs de Fond
```typescript
background: '#F9FAFB'     // Fond principal
lightGray: '#E5E7EB'      // Fond clair
white: '#FFFFFF'          // Fond blanc
```

### Gradients
```typescript
gradientStart: '#9333EA'  // Début gradient
gradientEnd: '#EC4899'    // Fin gradient
```

## Typographie

### Hiérarchie
- **H1** : 28px, Bold - Titres principaux
- **H2** : 24px, Bold - Sous-titres
- **H3** : 20px, Semi-bold - Sections
- **Body** : 16px, Regular - Texte standard
- **Caption** : 12px, Regular - Légendes

### Polices
- Police système par défaut (San Francisco sur iOS, Roboto sur Android)

### Accessibilité
- Support du scaling de texte système
- Contraste WCAG AA minimum (4.5:1)
- Tailles de texte adaptatives

## Composants

### Boutons

#### Bouton Primaire
```tsx
<AccessibleButton
  title="Action"
  variant="primary"
  size="medium"
  onPress={handlePress}
/>
```

#### Bouton Secondaire
```tsx
<AccessibleButton
  title="Action"
  variant="secondary"
  size="medium"
  onPress={handlePress}
/>
```

#### Bouton Outline
```tsx
<AccessibleButton
  title="Action"
  variant="outline"
  size="medium"
  onPress={handlePress}
/>
```

### Badges

#### Badge de Niveau
```tsx
<LevelBadge level={ServiceLevel.PRO} size="medium" />
```

#### Badge Premium
```tsx
<PremiumBadge size="medium" />
```

#### Badge Urgence
```tsx
<EmergencyBadge size="medium" />
```

### Cartes

#### Carte de Service
- Image en haut
- Badge de niveau
- Titre et description
- Prix et durée
- Actions (Modifier/Supprimer)

#### Carte de Prestataire
- Avatar
- Nom et note
- Badges (Premium, Urgence)
- Services disponibles
- Distance

### Formulaires

#### Champs de Texte
- Label clair
- Placeholder informatif
- Validation visuelle
- Messages d'erreur

#### Sélecteurs
- Catégories : Pills cliquables
- Niveaux : Badges sélectionnables
- Dates : DatePicker natif

## Espacements

### Grille
- Padding standard : 16px
- Padding petit : 8px
- Padding grand : 24px
- Gap entre éléments : 12px

### Radius
- Petit : 8px
- Moyen : 12px
- Grand : 16px
- Cercle : 50% ou valeur fixe

## Ombres & Élévations

### Cartes
```typescript
shadowColor: '#000'
shadowOffset: { width: 0, height: 2 }
shadowOpacity: 0.1
shadowRadius: 4
elevation: 2
```

### Boutons Pressés
- Opacity réduite à 0.8
- Animation de feedback

## Animations

### Transitions
- Durée standard : 300ms
- Durée rapide : 200ms
- Easing : ease-in-out

### Types
- Fade In/Out
- Slide Up/Down
- Scale
- Pulse (notifications)

## Accessibilité

### Zones de Touch
- Minimum : 44x44px (iOS) / 48x48px (Android)
- Recommandé : 48x48px

### Contraste
- Texte normal : 4.5:1 minimum
- Texte large : 3:1 minimum

### Screen Reader
- Labels accessibles
- Rôles définis
- États annoncés

## Performance

### Images
- Lazy loading obligatoire
- Cache automatique
- Formats optimisés
- Placeholders pendant chargement

### Animations
- useNativeDriver: true
- 60fps visé
- Pas d'animations si reduceMotion activé

### Rendu
- Mémoization des composants coûteux
- Debounce/Throttle pour les événements
- Virtualisation des listes longues

## États

### Chargement
- Skeleton screens
- Spinners animés
- Messages contextuels

### Vide
- Icône expressive
- Message encourageant
- Action suggérée

### Erreur
- Message clair
- Action de récupération
- Pas de jargon technique

## Responsive

### Breakpoints (Web)
- Mobile : < 768px
- Tablet : 768px - 1024px
- Desktop : > 1024px

### Adaptations
- Grilles flexibles
- Images responsive
- Navigation adaptative





