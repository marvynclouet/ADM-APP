#!/bin/bash

# 🚀 Script de déploiement automatique - ADM Beauty Booking App
# Usage: ./deploy.sh [netlify|vercel|manual]

echo "🎯 ADM Beauty Booking App - Déploiement"
echo "========================================"

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    print_error "Ce script doit être exécuté depuis le répertoire racine du projet"
    exit 1
fi

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    print_error "Node.js n'est pas installé"
    exit 1
fi

# Vérifier que npm est installé
if ! command -v npm &> /dev/null; then
    print_error "npm n'est pas installé"
    exit 1
fi

print_status "Vérification des dépendances..."
if [ ! -d "node_modules" ]; then
    print_warning "Installation des dépendances..."
    npm install
    if [ $? -ne 0 ]; then
        print_error "Erreur lors de l'installation des dépendances"
        exit 1
    fi
fi

print_status "Build de l'application..."
npm run build:web
if [ $? -ne 0 ]; then
    print_error "Erreur lors du build"
    exit 1
fi

print_success "Build terminé avec succès !"

# Vérifier que le dossier dist existe
if [ ! -d "dist" ]; then
    print_error "Le dossier dist n'existe pas après le build"
    exit 1
fi

print_status "Contenu du dossier dist :"
ls -la dist/

# Déploiement selon l'argument
case "${1:-manual}" in
    "netlify")
        print_status "Déploiement sur Netlify..."
        if command -v netlify &> /dev/null; then
            netlify deploy --prod --dir=dist
        else
            print_warning "Netlify CLI n'est pas installé"
            print_status "Installez-le avec: npm install -g netlify-cli"
            print_status "Ou déployez manuellement sur netlify.com"
        fi
        ;;
    "vercel")
        print_status "Déploiement sur Vercel..."
        if command -v vercel &> /dev/null; then
            vercel --prod
        else
            print_warning "Vercel CLI n'est pas installé"
            print_status "Installez-le avec: npm install -g vercel"
        fi
        ;;
    "manual")
        print_success "Build terminé !"
        print_status "Pour déployer :"
        echo "1. Uploadez le contenu du dossier 'dist/' sur votre hébergeur"
        echo "2. Ou utilisez : ./deploy.sh netlify"
        echo "3. Ou utilisez : ./deploy.sh vercel"
        ;;
    *)
        print_error "Option invalide. Utilisez: netlify, vercel, ou manual"
        exit 1
        ;;
esac

print_success "Déploiement terminé ! 🎉"
print_status "Votre application est maintenant en ligne !" 