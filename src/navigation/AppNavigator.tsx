import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Platform, ActivityIndicator, View, Alert } from 'react-native';
import { AuthService } from '../../backend/services/auth.service';
import { COLORS } from '../constants/colors';
import { SERVICE_PROVIDERS } from '../constants/mockData';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import BookingsScreen from '../screens/BookingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProviderDetailScreen from '../screens/ProviderDetailScreen';
import BookingScreen from '../screens/BookingScreen';
import BookingConfirmationScreen from '../screens/BookingConfirmationScreen';
import AuthScreen from '../screens/AuthScreen';
import ProviderHomeScreen from '../screens/ProviderHomeScreen';
import ProviderMessagesScreen from '../screens/ProviderMessagesScreen';
import ProviderBookingsScreen from '../screens/ProviderBookingsScreen';
import ProviderShopScreen from '../screens/ProviderShopScreen';
import CustomTabBar from '../components/CustomTabBar';
import MessagesScreen from '../screens/MessagesScreen';
import ChatScreen from '../screens/ChatScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProviderReviewsScreen from '../screens/ProviderReviewsScreen';
import ProviderDashboardScreen from '../screens/ProviderDashboardScreen';
import ProviderServicesManagementScreen from '../screens/ProviderServicesManagementScreen';
import ProviderProfileManagementScreen from '../screens/ProviderProfileManagementScreen';
import ProviderCalendarScreen from '../screens/ProviderCalendarScreen';
import ProviderCertificatesScreen from '../screens/ProviderCertificatesScreen';
import ProviderPremiumScreen from '../screens/ProviderPremiumScreen';
import ProviderEmergencyScreen from '../screens/ProviderEmergencyScreen';
import EmergencyBookingScreen from '../screens/EmergencyBookingScreen';
import SelectProviderScreen from '../screens/SelectProviderScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import { UsersService } from '../../backend/services/users.service';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Wrapper pour HomeScreen avec navigation
const HomeScreenWrapper: React.FC<any> = ({ navigation }) => {
  const handleNavigateToSearch = () => {
    navigation.navigate('Search');
  };

  const handleNavigateToProvider = async (providerId: string) => {
    try {
      // Charger le prestataire depuis Supabase
      const providers = await UsersService.getProviders({
        limit: 100, // Augmenter la limite pour trouver le bon prestataire
      });
      const provider = providers.find((p: any) => p.id === providerId);
      
      if (provider) {
        // Transformer au format ServiceProvider
        const transformedProvider = {
          id: provider.id,
          name: `${provider.first_name || ''} ${provider.last_name || ''}`.trim() || provider.email || 'Prestataire',
          firstName: provider.first_name,
          lastName: provider.last_name,
          email: provider.email,
          phone: provider.phone,
          avatar: provider.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(provider.email || provider.id)}&backgroundColor=b6e3f4`,
          isProvider: provider.is_provider,
          rating: provider.rating || 0,
          reviewCount: provider.review_count || 0,
          city: provider.city,
          activityZone: provider.activity_zone,
          description: provider.bio || provider.description,
          mainSkills: provider.main_skills || [],
          isPremium: provider.is_premium || false,
          acceptsEmergency: provider.accepts_emergency || false,
          location: {
            latitude: provider.latitude || 0,
            longitude: provider.longitude || 0,
            address: provider.address || provider.city || '',
            city: provider.city || '',
            postalCode: provider.postal_code || '',
          },
          services: [],
          experience: provider.experience || 0,
          certifications: [],
          availability: [],
          priceRange: { min: 0, max: 0 },
        };
        
        // Naviguer vers la boutique du prestataire (ProviderDetailScreen)
        navigation.navigate('Search', { 
          screen: 'ProviderDetail',
          params: { provider: transformedProvider }
        });
      } else {
        // Fallback vers la recherche
        navigation.navigate('Search');
      }
    } catch (error) {
      console.error('Erreur chargement prestataire:', error);
      navigation.navigate('Search');
    }
  };

  const handleNavigateToEmergency = (provider: any) => {
    if (provider && provider.acceptsEmergency) {
      navigation.navigate('EmergencyBooking', {
        provider: provider,
      });
    }
  };

  const handleNavigateToCategory = (categoryId: string) => {
    // Naviguer vers la recherche avec la catégorie sélectionnée
    navigation.navigate('Search');
  };

  const handleNavigateToService = (serviceId: string) => {
    // Naviguer vers la recherche avec le service sélectionné
    navigation.navigate('Search');
  };

  const handleNavigateToProfile = () => {
    navigation.navigate('Profil');
  };

  const handleNavigateToBookings = () => {
    navigation.navigate('Bookings');
  };

  return (
    <HomeScreen
      onNavigateToSearch={handleNavigateToSearch}
      onNavigateToProvider={handleNavigateToProvider}
      onNavigateToCategory={handleNavigateToCategory}
      onNavigateToService={handleNavigateToService}
      onNavigateToProfile={handleNavigateToProfile}
      onNavigateToBookings={handleNavigateToBookings}
      onNavigateToEmergency={handleNavigateToEmergency}
    />
  );
};

// Wrapper pour ProviderHomeScreen avec navigation
const ProviderHomeScreenWrapper: React.FC<any> = ({ navigation }) => {
  const handleNavigateToBookings = () => {
    navigation.navigate('ProviderBookings');
  };

  const handleNavigateToMessages = () => {
    navigation.navigate('ProviderMessages');
  };

  const handleNavigateToServices = () => {
    navigation.navigate('ProviderServicesManagement');
  };

  const handleNavigateToProfile = () => {
    navigation.navigate('ProviderProfileManagement');
  };

  const handleNavigateToEarnings = () => {
    navigation.navigate('ProviderDashboard');
  };

  const handleNavigateToSchedule = () => {
    navigation.navigate('ProviderCalendar');
  };

  const handleNavigateToShop = () => {
    navigation.navigate('ProviderShop');
  };

  const handleNavigateToReviews = () => {
    navigation.navigate('ProviderReviews');
  };

  const handleLogout = async () => {
    try {
      await AuthService.signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      });
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Erreur lors de la déconnexion');
    }
  };

  return (
    <ProviderHomeScreen
      onNavigateToBookings={handleNavigateToBookings}
      onNavigateToMessages={handleNavigateToMessages}
      onNavigateToServices={handleNavigateToServices}
      onNavigateToProfile={handleNavigateToProfile}
      onNavigateToEarnings={handleNavigateToEarnings}
      onNavigateToSchedule={handleNavigateToSchedule}
      onNavigateToShop={handleNavigateToShop}
      onNavigateToReviews={handleNavigateToReviews}
      onLogout={handleLogout}
      navigation={navigation}
    />
  );
};

// Wrapper pour MessagesScreen avec navigation
const MessagesScreenWrapper: React.FC<any> = ({ navigation }) => {
  return <MessagesScreen navigation={navigation} />;
};

// Wrapper pour SearchScreen avec navigation
const SearchScreenWrapper: React.FC<any> = ({ navigation }) => {
  return <SearchScreen navigation={navigation} />;
};

// Wrapper pour BookingsScreen avec navigation
const BookingsScreenWrapper: React.FC<any> = ({ navigation }) => {
  return <BookingsScreen navigation={navigation} />;
};

// Wrapper pour FavoritesScreen avec navigation
const FavoritesScreenWrapper: React.FC<any> = ({ navigation }) => {
  const handleNavigateToProvider = (providerId: string) => {
    const provider = SERVICE_PROVIDERS.find(p => p.id === providerId);
    if (provider) {
      navigation.navigate('Search', { 
        screen: 'ProviderDetail',
        params: { provider }
      });
    }
  };

  return <FavoritesScreen navigation={navigation} onNavigateToProvider={handleNavigateToProvider} />;
};

// Stack pour les messages
const MessagesStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MessagesList" component={MessagesScreenWrapper} />
      <Stack.Screen name="SelectProvider" component={SelectProviderScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
};

// Stack pour les écrans de recherche avec détails
const SearchStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SearchMain" component={SearchScreenWrapper} />
      <Stack.Screen name="ProviderDetail" component={ProviderDetailScreen} />
      <Stack.Screen name="Réservation" component={BookingScreen} />
      <Stack.Screen name="EmergencyBooking" component={EmergencyBookingScreen} />
      <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
};

// Stack pour les prestataires
const ProviderStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProviderMain" component={ProviderDetailScreen} />
      <Stack.Screen name="Réservation" component={BookingScreen} />
      <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
    </Stack.Navigator>
  );
};

// Tab Navigator pour le mode client
const MainTabs = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen 
        name="Accueil" 
        component={HomeScreenWrapper}
        options={{
          tabBarLabel: 'Accueil',
          tabBarTestID: 'home-tab',
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchStack}
        options={{
          tabBarLabel: 'Rechercher',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreenWrapper}
        options={{
          tabBarLabel: 'Favoris',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={BookingsScreenWrapper}
        options={{
          tabBarLabel: 'Réservations',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profil" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil',
          tabBarTestID: 'profile-tab',
        }}
      />
    </Tab.Navigator>
  );
};

// Stack principal de l'application avec tab bar (Mode Client)
const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="EmergencyBooking" component={EmergencyBookingScreen} />
      <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
      <Stack.Screen name="SelectProvider" component={SelectProviderScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
};

// Stack pour les prestataires (Mode Prestataire)
const ProviderModeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProviderHome" component={ProviderHomeScreenWrapper} />
      <Stack.Screen name="ProviderBookings" component={ProviderBookingsScreen} />
      <Stack.Screen name="ProviderMessages" component={ProviderMessagesScreen} />
      <Stack.Screen name="ProviderShop" component={ProviderShopScreen} />
      <Stack.Screen name="ProviderReviews" component={ProviderReviewsScreen} />
      <Stack.Screen name="ProviderDashboard" component={ProviderDashboardScreen} />
      <Stack.Screen name="ProviderServicesManagement" component={ProviderServicesManagementScreen} />
      <Stack.Screen name="ProviderProfileManagement" component={ProviderProfileManagementScreen} />
      <Stack.Screen name="ProviderCalendar" component={ProviderCalendarScreen} />
      <Stack.Screen name="ProviderCertificates" component={ProviderCertificatesScreen} />
      <Stack.Screen name="ProviderPremium" component={ProviderPremiumScreen} />
      <Stack.Screen name="ProviderEmergency" component={ProviderEmergencyScreen} />
    </Stack.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    checkAuthAndRedirect();
  }, []);

  const checkAuthAndRedirect = async () => {
    try {
      // Vérifier si l'utilisateur est authentifié
      const isAuthenticated = await AuthService.isAuthenticated();
      
      if (isAuthenticated) {
        // Récupérer les données de l'utilisateur
        const userData = await AuthService.getCurrentUser();
        
        if (userData) {
          // Rediriger selon le type d'utilisateur
          const isProvider = userData.is_provider || false;
          setInitialRoute(isProvider ? 'Provider' : 'Main');
        } else {
          setInitialRoute('Auth');
        }
      } else {
        setInitialRoute('Auth');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
      setInitialRoute('Auth');
    } finally {
      setIsLoading(false);
    }
  };

  // Afficher un loader pendant la vérification
  if (isLoading || !initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ headerShown: false }}
        initialRouteName={initialRoute}
      >
        <Stack.Screen 
          name="Auth" 
          component={AuthScreen}
        />
        <Stack.Screen 
          name="Main" 
          component={MainStack}
        />
        <Stack.Screen 
          name="Provider" 
          component={ProviderModeStack}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 