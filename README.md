# ADM Beauty Booking App

Application mobile de réservation de services de beauté pour particuliers, développée avec React Native et Expo.

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

## 📱 Fonctionnalités

### Mode Client
- 🔍 Recherche de services par catégorie
- 📍 Géolocalisation et tri par proximité
- 🗺️ Vue carte interactive
- 📅 Système de réservation complet
- 💳 Simulation de paiement
- 👤 Profil utilisateur

### Mode Prestataire
- 🏪 Gestion de boutique
- 📊 Tableau de bord avec statistiques
- 📅 Gestion des réservations
- 💬 Messagerie avec clients
- 💰 Suivi des revenus
- ⚙️ Gestion des services

## 🎨 Design

- **Couleurs** : Palette ADM (bleu foncé et blanc)
- **Logo** : ADM intégré dans toute l'application
- **UI/UX** : Interface moderne et intuitive
- **Responsive** : Adapté mobile et desktop

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
git clone [URL_DU_REPO]

# Installer les dépendances
npm install

# Lancer en mode développement
npx expo start

# Exporter pour le web
npx expo export --platform web
```

## 🔧 Configuration

L'application utilise des données mockées pour la démonstration. Pour une version production, remplacez les données dans `src/constants/mockData.ts` par des appels API réels.

## 📞 Support

Pour toute question ou problème, contactez l'équipe de développement.

---

**ADM Beauty Booking App** - Rendez la beauté accessible à tous ✨ 