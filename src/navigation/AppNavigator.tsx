import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
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
import { COLORS } from '../constants/colors';
import { SERVICE_PROVIDERS } from '../constants/mockData';
import { Alert } from 'react-native';
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

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Wrapper pour HomeScreen avec navigation
const HomeScreenWrapper: React.FC<any> = ({ navigation }) => {
  const handleNavigateToSearch = () => {
    navigation.navigate('Search');
  };

  const handleNavigateToProvider = (providerId: string) => {
    // Trouver le prestataire par ID
    const provider = SERVICE_PROVIDERS.find(p => p.id === providerId);
    if (provider) {
      // Naviguer vers la page de détail du prestataire dans SearchStack
      navigation.navigate('Search', { 
        screen: 'ProviderDetail',
        params: { provider }
      });
    } else {
      // Fallback vers la recherche
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

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Auth' }],
    });
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
        component={(props) => <ProfileScreen {...props} />}
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
  console.log('AppNavigator rendering');
  
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ headerShown: false }}
        initialRouteName="Auth"
      >
        <Stack.Screen 
          name="Auth" 
          component={(props) => {
            console.log('AuthScreen props:', props);
            return <AuthScreen {...props} />;
          }} 
        />
        <Stack.Screen 
          name="Main" 
          component={(props) => {
            console.log('MainStack props:', props);
            return <MainStack {...props} />;
          }} 
        />
        <Stack.Screen 
          name="Provider" 
          component={(props) => {
            console.log('ProviderModeStack props:', props);
            return <ProviderModeStack {...props} />;
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 