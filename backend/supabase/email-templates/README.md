# 📧 Templates d'Email ADM pour Supabase

Ce dossier contient les templates d'email personnalisés pour l'application ADM.

## 📋 Templates disponibles

### 1. Confirmation d'inscription (`confirm-signup.html` et `confirm-signup.txt`)
- **HTML** : Version riche avec design moderne et branding ADM
- **TXT** : Version texte simple pour les clients email qui ne supportent pas HTML

## 🚀 Configuration dans Supabase

### Étape 1 : Accéder aux paramètres d'email
1. Allez sur https://supabase.com
2. Ouvrez votre projet
3. Allez dans **Authentication** → **Email Templates**
4. Sélectionnez **Confirm signup**

### Étape 2 : Configurer le template HTML
1. Dans l'éditeur de template, sélectionnez **HTML**
2. Copiez le contenu de `confirm-signup.html`
3. Collez-le dans l'éditeur Supabase
4. Cliquez sur **Save**

### Étape 3 : Configurer le template texte
1. Dans l'éditeur de template, sélectionnez **Plain text**
2. Copiez le contenu de `confirm-signup.txt`
3. Collez-le dans l'éditeur Supabase
4. Cliquez sur **Save**

## 📝 Variables disponibles

Les templates utilisent les variables suivantes de Supabase :

- `{{ .ConfirmationURL }}` : Lien de confirmation unique pour l'utilisateur
- `{{ .Email }}` : Adresse email de l'utilisateur (si disponible)
- `{{ .Token }}` : Token de confirmation (si nécessaire)

## 🎨 Personnalisation

### Couleurs
Les couleurs utilisées dans le template sont :
- **Primary** : `#667eea` (violet/bleu)
- **Secondary** : `#764ba2` (violet foncé)
- **Background** : `#f5f5f5` (gris clair)
- **Text** : `#333333` (gris foncé)

### Logo
Le template utilise actuellement le texte "ADM" dans un cercle. Pour utiliser un logo :
1. Remplacez le `<div class="logo">ADM</div>` par une balise `<img>`
2. Hébergez votre logo sur un CDN ou Supabase Storage
3. Mettez à jour le `src` de l'image

### Exemple avec logo :
```html
<img src="https://votre-domaine.com/logo-adm.png" alt="ADM Logo" class="logo" style="width: 120px; height: auto;">
```

## ✅ Test

Pour tester le template :
1. Créez un nouveau compte utilisateur
2. Vérifiez votre boîte email
3. L'email devrait afficher le design personnalisé ADM

## 🔧 Dépannage

### L'email n'affiche pas le design
- Vérifiez que vous avez bien sauvegardé le template HTML
- Assurez-vous que votre client email supporte HTML
- Vérifiez les paramètres SMTP dans Supabase

### Le lien ne fonctionne pas
- Vérifiez que `{{ .ConfirmationURL }}` est bien présent dans le template
- Assurez-vous que les URLs de redirection sont configurées dans Supabase

### L'email n'est pas envoyé
- Vérifiez les paramètres SMTP dans Supabase
- Consultez les logs dans **Authentication** → **Logs**
- Vérifiez que l'email de confirmation est activé dans les paramètres

## 📚 Documentation Supabase

Pour plus d'informations sur les templates d'email Supabase :
- https://supabase.com/docs/guides/auth/auth-email-templates
- https://supabase.com/docs/guides/auth/auth-smtp

## 🎯 Prochaines étapes

D'autres templates peuvent être créés :
- **Reset password** : Réinitialisation de mot de passe
- **Magic link** : Connexion sans mot de passe
- **Change email** : Changement d'adresse email
- **Invite user** : Invitation d'utilisateur

