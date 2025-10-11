# 🚀 Déploiement Vercel - ADM App

## 📋 Prérequis
- Compte Vercel (gratuit) : https://vercel.com
- Repository GitHub : https://github.com/marvynclouet/ADM-APP

---

## 🎯 Option 1 : Déploiement via Interface Vercel (RECOMMANDÉ)

### Étape 1 : Connecter le Repository
1. Va sur https://vercel.com/new
2. Connecte-toi avec ton compte GitHub
3. Clique sur **"Import Project"**
4. Sélectionne le repository **ADM-APP**
5. Clique sur **"Import"**

### Étape 2 : Configuration du Projet
Dans la page de configuration :

**Root Directory** :
```
BeautyBookingApp
```

**Build & Development Settings** :
- **Framework Preset** : Other
- **Build Command** : 
```bash
npx expo export --platform web
```
- **Output Directory** : 
```
dist
```
- **Install Command** : 
```bash
npm install
```

### Étape 3 : Variables d'Environnement (Optionnel)
Pas de variables nécessaires pour l'instant (tout est en mock data)

### Étape 4 : Déployer !
1. Clique sur **"Deploy"**
2. Attends 2-3 minutes ⏳
3. Ton app sera disponible sur une URL type : `https://adm-app-xxx.vercel.app`

---

## 🎯 Option 2 : Déploiement via CLI Vercel

### Étape 1 : Installer Vercel CLI
```bash
npm install -g vercel
```

### Étape 2 : Se connecter
```bash
vercel login
```

### Étape 3 : Déployer
```bash
# Depuis le dossier BeautyBookingApp
cd BeautyBookingApp

# Build l'app
npm run build:web

# Déployer en production
vercel --prod
```

### Répondre aux questions :
```
? Set up and deploy "~/ADM App Mobile/BeautyBookingApp"? [Y/n] y
? Which scope do you want to deploy to? [Ton compte]
? Link to existing project? [N/y] n
? What's your project's name? adm-app
? In which directory is your code located? ./
? Want to override the settings? [y/N] y
? Output Directory: dist
? Build Command: npx expo export --platform web
```

---

## ✅ Vérifications Post-Déploiement

### Teste ces fonctionnalités :
- [ ] Page d'authentification charge
- [ ] Navigation entre les onglets
- [ ] Recherche de services
- [ ] Ajout aux favoris (AsyncStorage web)
- [ ] Réservation d'un service
- [ ] Export au calendrier
- [ ] Responsive mobile/desktop

---

## 🔄 Redéploiements Automatiques

Une fois configuré, chaque `git push` sur la branche `main` déclenchera automatiquement un nouveau déploiement !

```bash
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin main
```

Vercel rebuildera et déploiera automatiquement. ✨

---

## 🌐 URLs

Après déploiement, tu auras :
- **URL Production** : `https://adm-app.vercel.app` (ou similaire)
- **URLs Preview** : Une URL unique pour chaque commit

---

## 🐛 Dépannage

### Problème : Build échoue
**Solution** : Vérifie que le `Build Command` est bien :
```bash
npx expo export --platform web
```

### Problème : Page blanche
**Solution** : Vérifie que `Output Directory` est bien `dist`

### Problème : Erreur 404 sur les routes
**Solution** : Le fichier `vercel.json` avec les rewrites est déjà configuré

### Problème : Assets non chargés
**Solution** : Vérifie les chemins dans le build (ils doivent être relatifs)

---

## 📊 Monitoring

Une fois déployé :
- **Analytics** : https://vercel.com/[ton-compte]/adm-app/analytics
- **Logs** : https://vercel.com/[ton-compte]/adm-app/logs
- **Settings** : https://vercel.com/[ton-compte]/adm-app/settings

---

## 🎉 C'est tout !

Ton app ADM est maintenant en ligne et accessible depuis n'importe où ! 🚀

**Partage l'URL** avec tes testeurs et récupère du feedback ! 📱✨

