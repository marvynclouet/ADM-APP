# 🚀 Guide de Déploiement - ADM Beauty Booking App

## 📋 Prérequis

- Compte GitHub
- Compte Netlify (gratuit) ou Vercel (gratuit)
- Node.js 18+ installé

## 🎯 Déploiement Rapide (5 minutes)

### Option 1: Netlify (Recommandé)

1. **Poussez votre code sur GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connectez-vous à Netlify**
   - Allez sur [netlify.com](https://netlify.com)
   - Cliquez sur "Sign up" avec votre compte GitHub

3. **Déployez**
   - Cliquez sur "New site from Git"
   - Sélectionnez votre repository
   - Configurez :
     - **Build command**: `npx expo export --platform web`
     - **Publish directory**: `dist`
   - Cliquez sur "Deploy site"

4. **Votre site est en ligne !**
   - URL : `https://votre-app.netlify.app`
   - Partagez cette URL avec votre client

### Option 2: Vercel (Alternative)

1. **Installez Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Déployez**
   ```bash
   vercel login
   vercel --prod
   ```

3. **Votre site est en ligne !**
   - URL : `https://votre-app.vercel.app`

## 🔧 Déploiement Manuel

Si vous préférez déployer manuellement :

1. **Build l'application**
   ```bash
   npm run build:web
   ```

2. **Le dossier `dist/` contient votre site**
   - Uploadez le contenu de `dist/` sur votre hébergeur
   - Configurez les redirections SPA (Single Page App)

## 📱 Test de l'Application

### Fonctionnalités à tester :

#### Mode Client
- [ ] Connexion/Inscription
- [ ] Navigation entre les onglets
- [ ] Recherche de services
- [ ] Vue carte et liste
- [ ] Réservation d'un service
- [ ] Profil utilisateur

#### Mode Prestataire
- [ ] Inscription en tant que prestataire
- [ ] Tableau de bord
- [ ] Gestion des réservations
- [ ] Messagerie
- [ ] Boutique
- [ ] Déconnexion

## 🎨 Personnalisation

### Changer le nom de l'app
- Modifiez `app.json` : `"name": "ADM Beauty Booking"`
- Modifiez `index.html` : `<title>ADM Beauty Booking</title>`

### Changer les couleurs
- Modifiez `src/constants/colors.ts`
- Rebuild : `npm run build:web`

### Ajouter votre logo
- Remplacez `src/assets/images/Logo ADM V1.png`
- Rebuild : `npm run build:web`

## 🔄 Mise à jour

Pour mettre à jour l'application en ligne :

1. **Modifiez votre code**
2. **Poussez sur GitHub**
   ```bash
   git add .
   git commit -m "Update app"
   git push origin main
   ```
3. **Netlify/Vercel se met à jour automatiquement**

## 📊 Analytics (Optionnel)

### Google Analytics
Ajoutez dans `index.html` :
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🛠️ Dépannage

### Erreur de build
```bash
# Nettoyez le cache
rm -rf node_modules
npm install
npm run build:web
```

### Problème de navigation
- Vérifiez que `netlify.toml` ou `vercel.json` est présent
- Les redirections SPA doivent être configurées

### Images qui ne s'affichent pas
- Vérifiez les URLs dans `mockData.ts`
- Assurez-vous que les images sont accessibles publiquement

## 📞 Support

- **Netlify** : [docs.netlify.com](https://docs.netlify.com)
- **Vercel** : [vercel.com/docs](https://vercel.com/docs)
- **Expo** : [docs.expo.dev](https://docs.expo.dev)

---

**Votre application est maintenant prête pour les tests clients ! 🎉** 