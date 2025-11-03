# 🔄 User Flows ADM

## Flow Client

### 1. Inscription / Connexion
```
AuthScreen
├── Sélection Client/Prestataire
├── Formulaire (Email, Password, Nom)
├── Bouton "Se connecter" / "S'inscrire"
└── Bouton "Accès prestataires" (Mode test)
```

### 2. Accueil Client
```
HomeScreen
├── Header avec avatar et recherche
├── Catégories de services (carousel)
├── Prestataires populaires (cartes)
│   ├── Badge Premium (si applicable)
│   ├── Badge Urgence (si disponible)
│   └── Note et avis
├── Services en promotion
└── Actions rapides
```

### 3. Recherche
```
SearchScreen
├── Barre de recherche
├── Filtres
│   ├── Catégorie
│   ├── Niveau (Débutant, Intermédiaire, Avancé, Pro)
│   ├── Prix
│   ├── Distance
│   ├── Premium uniquement
│   └── Disponible en urgence
├── Résultats (Liste/Grille)
│   ├── Carte de service avec:
│   │   ├── Image
│   │   ├── Badge niveau
│   │   ├── Nom et description
│   │   ├── Prix et durée
│   │   └── Bouton favori
│   └── Navigation → ProviderDetail
└── Vue détail prestataire
    ├── Galerie photos
    ├── Services disponibles
    ├── Avis clients
    ├── Horaires
    └── Bouton "Réserver"
```

### 4. Réservation
```
BookingScreen
├── Détails service et prestataire
├── Sélection date (calendrier)
├── Sélection heure (créneaux disponibles)
├── Notes optionnelles
├── Méthode de paiement
└── Confirmation
    └── Navigation → BookingConfirmationScreen
```

### 5. Confirmation Réservation
```
BookingConfirmationScreen
├── Icône succès
├── Détails complets de la réservation
├── Actions rapides
│   ├── Appeler prestataire
│   ├── Envoyer message
│   └── Ajouter au calendrier
└── Bouton "Voir mes réservations"
```

### 6. Mes Réservations
```
BookingsScreen
├── Onglets (À venir / Passées)
├── Cartes de réservation
│   ├── Informations service
│   ├── Date et heure
│   ├── Statut
│   └── Actions (Détails, Annuler, Noter)
└── Empty state si vide
```

### 7. Favoris
```
FavoritesScreen
├── Liste des prestataires favoris
├── Filtres
└── Navigation vers détails
```

### 8. Messages
```
MessagesScreen
├── Liste des conversations
│   ├── Avatar prestataire
│   ├── Dernier message
│   ├── Badge non lu
│   └── Timestamp
└── Navigation → ChatScreen
    ├── Historique des messages
    ├── Champ de saisie
    └── Envoi
```

### 9. Profil
```
ProfileScreen
├── Informations utilisateur
├── Statistiques (réservations, favoris)
└── Menu options
    ├── Modifier profil
    ├── Notifications
    ├── Sécurité
    ├── Paiements
    ├── Aide
    └── Déconnexion
```

## Flow Prestataire

### 1. Connexion Prestataire
```
AuthScreen
└── Bouton "Accès prestataires" → ProviderHomeScreen
```

### 2. Accueil Prestataire
```
ProviderHomeScreen
├── Header avec profil
├── Statistiques rapides
│   ├── Réservations en attente
│   ├── Messages non lus
│   └── Revenus du mois
├── Actions rapides
│   ├── Réservations
│   ├── Messages
│   ├── Mes Services
│   ├── Planning
│   ├── Boutique
│   ├── Avis
│   ├── Diplômes ✨
│   ├── Premium ✨
│   └── Urgence ✨
├── Réservations du jour
└── Revenus mensuels
```

### 3. Gestion Services
```
ProviderServicesManagementScreen
├── Liste des services
│   ├── Image
│   ├── Nom et catégorie
│   ├── Badge niveau ✨
│   ├── Prix et durée
│   ├── Statut (actif/inactif)
│   └── Actions (Modifier/Supprimer)
└── Modal Ajout/Modification
    ├── Upload photo
    ├── Nom et description
    ├── Catégorie
    ├── Prix et durée
    ├── Sélection niveau ✨
    └── Statut actif
```

### 4. Diplômes / Certificats ✨
```
ProviderCertificatesScreen
├── Liste des diplômes
│   ├── Photo du diplôme
│   ├── Nom et organisme
│   ├── Date d'obtention
│   └── Badge de vérification
│       ├── "Vérifié" (vert)
│       ├── "En attente" (orange)
│       └── "Refusé" (rouge)
└── Modal Ajout
    ├── Upload photo/PDF
    ├── Nom du diplôme
    ├── Organisme émetteur
    └── Date d'obtention
```

### 5. Abonnement Premium ✨
```
ProviderPremiumScreen
├── Statut Premium actuel
├── Liste des avantages
│   ├── Mise en avant
│   ├── Badge Premium
│   ├── Statistiques avancées
│   ├── Support prioritaire
│   └── Plus de visibilité
├── Tarification
└── Bouton Activation/Désactivation
```

### 6. Mode Urgence ✨
```
ProviderEmergencyScreen
├── Statut actuel
├── Toggle "Accepter les urgences"
├── Crédits disponibles
│   ├── Compteur de crédits
│   └── Bouton "Acheter des crédits"
└── Documentation
    ├── Comment ça marche
    ├── Étapes du processus
    └── Avantages (tarifs majorés)
```

### 7. Dashboard Avancé
```
ProviderDashboardScreen
├── Sélecteur période (Semaine/Mois/Année)
├── Statistiques principales
│   ├── Réservations totales
│   ├── Terminées
│   ├── En attente
│   └── Annulées
├── Graphique revenus (LineChart)
├── Répartition réservations (PieChart)
├── Indicateurs performance
│   ├── Taux d'acceptation
│   ├── Prix moyen
│   ├── Durée moyenne
│   └── Service le plus demandé
└── Évolution mensuelle (BarChart)
```

### 8. Planning
```
ProviderCalendarScreen
├── Sélecteur vue (Semaine/Mois)
├── Navigation dates
└── Calendrier
    ├── Vue semaine : Timeline horaire
    ├── Vue mois : Grille mensuelle
    └── Indicateurs réservations
```

### 9. Gestion Réservations
```
ProviderBookingsScreen
├── Onglets (À venir, En attente, Terminées, Annulées)
├── Badge notifications sur "En attente" ✨
├── Cartes de réservation
│   ├── Informations client
│   ├── Service et date/heure
│   ├── Statut avec badge
│   └── Actions
│       ├── Accepter/Refuser (avec raison) ✨
│       ├── Modifier ✨
│       ├── Message
│       ├── Appel
│       └── Détails
└── Empty states contextuels
```

### 10. Profil Prestataire
```
ProviderProfileManagementScreen
├── Photo de profil (upload)
├── Informations personnelles
│   ├── Nom, Email, Téléphone
│   ├── Adresse
│   ├── Zone de déplacement (km)
│   └── Bio/Description
├── Horaires d'ouverture (7 jours)
└── Galerie de réalisations (portfolio)
```

### 11. Boutique
```
ProviderShopScreen
├── Informations prestataire
├── Recherche de services
├── Liste des services
├── Avis clients
└── Informations de contact
```

### 12. Messages
```
ProviderMessagesScreen
├── Liste des conversations
├── Recherche
├── Onglets (Tous, Non lus, Réservations)
└── Navigation → ChatScreen
```

## Points d'Entrée Principaux

### Pour les Clients
1. **Page d'accueil** → Recherche → Réservation
2. **Recherche** → Détails prestataire → Réservation
3. **Promotions** → Service → Réservation
4. **Favoris** → Prestataire → Réservation

### Pour les Prestataires
1. **Accueil** → Actions rapides → Fonctionnalités
2. **Dashboard** → Statistiques et graphiques
3. **Services** → Gestion CRUD avec niveaux ✨
4. **Réservations** → Acceptation/Refus avec raison ✨

## Fonctionnalités Nouvelles ✨

### Système de Niveaux
- **Sélection** : ProviderServicesManagementScreen (modal)
- **Affichage** : Cartes de services avec LevelBadge
- **Filtre** : SearchScreen (à implémenter)

### Diplômes/Certificats
- **Gestion** : ProviderCertificatesScreen
- **Upload** : ImagePicker avec prévisualisation
- **Statuts** : Badges de vérification visibles

### Premium
- **Gestion** : ProviderPremiumScreen
- **Affichage** : PremiumBadge sur profils
- **Avantages** : Liste détaillée avec tarification

### Mode Urgence
- **Configuration** : ProviderEmergencyScreen
- **Toggle** : Activer/Désactiver acceptation urgences
- **Crédits** : Système de crédits (simulation)
- **Affichage** : EmergencyBadge sur profils

## Navigation Principale

```
AuthScreen
├── Client
│   └── MainStack
│       ├── MainTabs
│       │   ├── HomeScreen
│       │   ├── SearchStack
│       │   ├── FavoritesScreen
│       │   ├── BookingsScreen
│       │   ├── MessagesStack
│       │   └── ProfileScreen
│       └── BookingConfirmationScreen
└── Prestataire
    └── ProviderModeStack
        ├── ProviderHomeScreen
        ├── ProviderBookingsScreen
        ├── ProviderMessagesScreen
        ├── ProviderShopScreen
        ├── ProviderReviewsScreen
        ├── ProviderDashboardScreen
        ├── ProviderServicesManagementScreen
        ├── ProviderProfileManagementScreen
        ├── ProviderCalendarScreen
        ├── ProviderCertificatesScreen ✨
        ├── ProviderPremiumScreen ✨
        └── ProviderEmergencyScreen ✨
```


