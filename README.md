# ADM - Autour de Moi

**ADM (Autour de Moi)** est une application mobile de mise en relation entre clients et prestataires indépendants dans les domaines de la beauté et des services urbains (coiffure, maquillage, ongles, perruques, cils, etc.).

🔗 **Repository**: https://github.com/marvynclouet/ADM-APP

## 🎯 Objectifs de l'application

### Pour les clients
- Trouver facilement un prestataire disponible à proximité
- Réserver une prestation rapidement
- Système de réservation d'urgence (sous 30 minutes)
- Paiement sécurisé intégré

### Pour les prestataires
- Gagner en visibilité
- Gérer leurs rendez-vous
- Développer leur activité
- Professionnaliser leur service

**Public cible** : Jeunes adultes, particuliers cherchant praticité et rapidité, prestataires indépendants souhaitant professionnaliser leur activité.

## 🚀 Déploiement

### Option 1: Netlify (Recommandé)

1. **Fork ou clone** ce repository
2. **Connectez-vous** à [Netlify](https://netlify.com)
3. **Cliquez** sur "New site from Git"
4. **Sélectionnez** votre repository
5. **Configurez** les paramètres :
   - Build command: `npx expo export --platform web`
   - Publish directory: `dist`
6. **Cliquez** sur "Deploy site"

### Option 2: Vercel

1. **Installez** Vercel CLI: `npm i -g vercel`
2. **Connectez-vous** : `vercel login`
3. **Déployez** : `vercel --prod`

### Option 3: GitHub Pages

1. **Ajoutez** ce script dans `package.json`:
   ```json
   "scripts": {
     "deploy": "npx expo export --platform web && gh-pages -d dist"
   }
   ```
2. **Installez** gh-pages: `npm install --save-dev gh-pages`
3. **Déployez** : `npm run deploy`

## 📱 Fonctionnalités (Version Actuelle - MVP)

### Mode Client ✅
- ✅ **Recherche avancée** : Par catégorie, prix, distance, disponibilité
- ✅ **Géolocalisation** : Tri par proximité
- ✅ **Vue carte interactive** : Visualisation des prestataires sur une carte
- ✅ **Système de réservation** : Sélection de service, date/heure, notes
- ✅ **Paiement intégré** : Simulation de paiement (CB, PayPal, Apple Pay)
- ✅ **Profil utilisateur** : Gestion des informations personnelles
- ✅ **Favoris** : Sauvegarde des prestataires préférés
- ✅ **Messagerie** : Communication avec les prestataires
- ✅ **Historique** : Suivi des réservations passées et à venir
- ✅ **Notifications visuelles** : Toast pour feedback immédiat
- ✅ **Ajout au calendrier** : Export vers Google/Apple Calendar

### Mode Prestataire ✅
- ✅ **Tableau de bord** : Vue d'ensemble de l'activité
- ✅ **Gestion de boutique** : Services proposés, prix, descriptions
- ✅ **Gestion des réservations** : Accepter/refuser les demandes
- ✅ **Messagerie intégrée** : Communication avec les clients
- ✅ **Statistiques** : Revenus, nombre de clients, réservations
- ✅ **Profil professionnel** : Photo, description, services, localisation

## 🚧 Fonctionnalités à venir (Feuille de route)

### Phase 2 - Système avancé
- ⏳ **Réservations d'urgence** (sous 30 minutes)
  - Crédits pour clients
  - Mode urgence pour prestataires Premium
- ⏳ **Système de niveaux** : Débutant, Intermédiaire, Avancé, Professionnel
- ⏳ **Diplômes vérifiés** : Upload et validation des certifications
- ⏳ **Abonnements Premium** : Pour clients et prestataires
- ⏳ **Paiement espèces** : Avec système de commission différée

### Phase 3 - Collaboration & Marketing
- ⏳ **Associations entre prestataires** : Services complémentaires
- ⏳ **Promotions & codes réduction** : Outils marketing
- ⏳ **Boost de visibilité** : Mise en avant temporaire
- ⏳ **Système de points de fidélité** : Récompenses clients

### Phase 4 - Extensions
- ⏳ **Interface web** : Version desktop pour prestataires
- ⏳ **Partenariats** : Marques de beauté, événements
- ⏳ **Nouvelles catégories** : Extension des services

## 🎨 Catégories de services

### Beauté & Coiffure
- Coiffure (hommes, femmes, enfants, locks, tresses, brushing)
- Maquillage
- Ongles
- Cils
- Perruques / Lace
- Barber (barbe, contours)

### Services urbains complémentaires (à venir)
- Grillz (pose et entretien)
- Nettoyage chaussures
- Nettoyage habits
- Couture / retouches
- Soins visage & corps (massage, gommage)

## 🎨 Design & Interface

- **Couleurs principales** : Bleu (#003366) et Blanc
- **Logo ADM** : Intégré dans toute l'application
- **UI/UX** : Interface claire et intuitive, inspirée d'Airbnb et Uber
- **Navigation** : 5 onglets principaux
  1. 🏠 Accueil (promotions, mises en avant)
  2. 🔍 Recherche & filtres
  3. ❤️ Favoris
  4. 💬 Messagerie
  5. 👤 Profil utilisateur
- **Responsive** : Optimisé mobile et compatible web
- **Animations** : Transitions fluides et feedback visuel immédiat

## 🛠️ Technologies

- **React Native** avec Expo
- **TypeScript** pour le typage
- **React Navigation** pour la navigation
- **Expo Linear Gradient** pour les effets visuels
- **React Native Vector Icons** pour les icônes

## 📋 Prérequis

- Node.js 18+
- npm ou yarn
- Expo CLI

## 🚀 Installation locale

```bash
# Cloner le repository
git clone https://github.com/marvynclouet/ADM-APP.git

# Naviguer dans le dossier
cd ADM-APP/BeautyBookingApp

# Installer les dépendances
npm install

# Lancer en mode développement
npx expo start

# Exporter pour le web
npx expo export --platform web
```

## 🔧 Configuration & Développement

### État actuel
L'application utilise des **données mockées** pour la démonstration (MVP/Prototype).

### Pour passer en production
1. Remplacer les données mock dans `src/constants/mockData.ts` par des appels API
2. Intégrer un système d'authentification réel (Firebase, Auth0, custom backend)
3. Connecter à une base de données (PostgreSQL, MongoDB)
4. Intégrer les passerelles de paiement (Stripe, PayPal)
5. Configurer les notifications push (Expo Notifications, Firebase)
6. Implémenter la géolocalisation réelle (Google Maps API)

### Développement par phases
```
Phase 1 (Actuelle) : MVP fonctionnel avec données mock ✅
Phase 2 : Backend + API + Base de données
Phase 3 : Système d'urgence + Abonnements Premium
Phase 4 : Fonctionnalités avancées (associations, marketing)
Phase 5 : Extensions (web, partenariats)
```

## 💰 Modèle économique (À implémenter)

### Commissions
- Commission sur chaque transaction (via l'app)
- Système hybride : paiement espèces + commission différée

### Abonnements
- **Client Premium** : Accès urgences illimité, notifications prioritaires
- **Prestataire Premium** : Visibilité renforcée, accès urgences, outils marketing

### Crédits
- Crédits ponctuels pour urgences (clients non Premium)
- Boost de visibilité temporaire (prestataires non Premium)

## 📞 Contact & Support

Pour toute question ou suggestion concernant le développement :
- **Repository** : https://github.com/marvynclouet/ADM-APP
- **Issues** : Utilisez l'onglet "Issues" du repository

## 🎯 Vision & Mission

**ADM (Autour de Moi)** a pour mission de :
- Démocratiser l'accès aux services de beauté
- Professionnaliser l'activité des prestataires indépendants
- Créer une communauté de confiance entre clients et prestataires
- Faciliter la mise en relation rapide et géolocalisée

---

**ADM - Autour de Moi** 💈 ✨ 💅  
*Trouvez votre prestataire idéal, autour de vous, en quelques clics* 