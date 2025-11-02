# ✅ TODO - Prochaines Fonctionnalités (Semaine 3)

## 🎯 Objectif : Amélioration UX/UI Client

---

## 1️⃣ Système de Favoris Complet

### À faire :
- [ ] Créer page Favoris dédiée (`FavoritesScreen.tsx`)
- [ ] Ajouter animation coeur sur ajout/retrait
- [ ] Système de sauvegarde local (AsyncStorage)
- [ ] Filtres dans les favoris (catégorie, prix, distance)
- [ ] Organisation par dossiers/tags
- [ ] Partage de favoris

### Fichiers à modifier/créer :
- `src/screens/FavoritesScreen.tsx` (nouveau)
- `src/constants/mockData.ts` (ajouter FAVORITES)
- `src/components/ProviderCard.tsx` (ajouter bouton favori)
- Navigation : ajouter l'écran Favoris

### Priorité : 🔴 Haute

---

## 2️⃣ Système de Notation et Avis

### À faire :
- [ ] Modal de notation après service (`RatingModal.tsx`)
- [ ] Sélection étoiles (1-5) avec animation
- [ ] Formulaire d'avis détaillé (texte + photos optionnelles)
- [ ] Affichage des avis sur profil prestataire
- [ ] Tri des avis (récents, mieux notés, moins bien notés)
- [ ] Statistiques de notes (moyenne, distribution)
- [ ] Réponse du prestataire aux avis

### Fichiers à modifier/créer :
- `src/components/RatingModal.tsx` (nouveau)
- `src/components/ReviewCard.tsx` (nouveau)
- `src/screens/ProviderProfileScreen.tsx` (ajouter onglet avis)
- `src/constants/mockData.ts` (ajouter REVIEWS)

### Mockup de données :
```typescript
interface Review {
  id: string;
  bookingId: string;
  providerId: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  rating: number; // 1-5
  comment: string;
  photos?: string[];
  date: string;
  providerResponse?: {
    text: string;
    date: string;
  };
}
```

### Priorité : 🔴 Haute

---

## 3️⃣ Amélioration de la Recherche

### À faire :
- [ ] Barre de recherche avec suggestions en temps réel
- [ ] Recherche vocale (Expo Speech)
- [ ] Historique des recherches
- [ ] Recherche par nom de prestataire
- [ ] Autocomplétion
- [ ] Filtres sauvegardés (mes filtres préférés)

### Fichiers à modifier :
- `src/screens/SearchScreen.tsx`
- `src/components/SearchBar.tsx` (nouveau composant dédié)
- Utiliser AsyncStorage pour historique

### Priorité : 🟡 Moyenne

---

## 4️⃣ Galerie Photos des Prestataires

### À faire :
- [ ] Section "Réalisations" sur profil prestataire
- [ ] Carrousel de photos par service
- [ ] Modal plein écran avec zoom
- [ ] Swipe entre photos
- [ ] Tags sur photos (type de service)
- [ ] Upload photo côté prestataire

### Composants à créer :
- `src/components/PhotoGallery.tsx`
- `src/components/PhotoModal.tsx`
- `src/screens/ProviderPhotosScreen.tsx`

### Mockup de données :
```typescript
interface ProviderPhoto {
  id: string;
  providerId: string;
  url: string;
  serviceId?: string;
  description?: string;
  tags: string[];
  uploadDate: string;
  likes: number;
}
```

### Priorité : 🟡 Moyenne

---

## 5️⃣ Amélioration de la Messagerie

### À faire :
- [ ] Indicateur "en train d'écrire..."
- [ ] Envoi de photos
- [ ] Réactions aux messages (emoji)
- [ ] Lecture des messages (vu/non vu)
- [ ] Notifications de nouveaux messages
- [ ] Archivage de conversations

### Fichiers à modifier :
- `src/screens/ChatScreen.tsx`
- `src/screens/MessagesScreen.tsx`
- `src/components/MessageBubble.tsx` (nouveau)

### Priorité : 🟢 Basse (Fonctionnel pour MVP)

---

## 6️⃣ Optimisations Performance

### À faire :
- [ ] Lazy loading des images
- [ ] Pagination des listes (infinite scroll)
- [ ] Cache des données (React Query ou SWR)
- [ ] Optimisation des re-renders (React.memo)
- [ ] Réduction taille bundle
- [ ] Splash screen personnalisée

### Priorité : 🟡 Moyenne

---

## 7️⃣ Tests Utilisateurs

### À faire :
- [ ] Recruter 5-10 testeurs
- [ ] Créer questionnaire de feedback
- [ ] Observer les sessions (enregistrement écran)
- [ ] Analyser les points de friction
- [ ] Implémenter les améliorations critiques

### Priorité : 🔴 Haute (après développement)

---

## 📅 Planning Semaine 3 (5 jours)

### Jour 1-2 : Système de Favoris
- Développement complet
- Tests
- Intégration

### Jour 3-4 : Système de Notation
- Modal de notation
- Affichage des avis
- Statistiques

### Jour 5 : Galerie Photos
- Composants de base
- Intégration profil prestataire

---

## 🎨 Design à respecter

### Favoris
- Coeur rouge pour favori actif
- Animation de "battement" au clic
- Liste claire avec photos prestataires

### Notation
- Étoiles jaunes/or
- Modal élégante et simple
- Clavier qui ne cache pas le formulaire

### Galerie
- Grille 2 ou 3 colonnes
- Effet hover/press subtil
- Modal avec fond noir semi-transparent

---

## 🚀 Commandes Git

```bash
# Après chaque fonctionnalité majeure
git add .
git commit -m "feat: add favorites system with animations"
git push origin main

# Exemple de messages de commit
git commit -m "feat: add rating modal with star selection"
git commit -m "feat: add photo gallery component"
git commit -m "fix: improve search performance"
git commit -m "style: update favorites page design"
```

---

## ⚡ Quick Start - Par où commencer ?

1. **Créer le système de Favoris** (2 jours)
   - Commencer simple : juste ajouter/retirer
   - Puis ajouter animations
   - Enfin ajouter filtres

2. **Système de Notation** (2 jours)
   - Modal d'abord
   - Affichage ensuite
   - Stats à la fin

3. **Tester avec utilisateurs** (1 jour)
   - Collecter feedback
   - Ajuster

---

**Objectif fin Semaine 3** : Application avec favoris fonctionnels et système de notation complet ⭐




