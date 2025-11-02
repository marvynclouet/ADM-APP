import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import FormField from '../components/FormField';
import LoadingSpinner from '../components/LoadingSpinner';
import Logo from '../components/Logo';

interface AuthScreenProps {
  navigation?: any;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<'client' | 'provider'>('client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Animations pour le logo de chargement
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (isProcessing) {
      // Démarrer l'animation de rotation
      const rotateAnimation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      );
      
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        rotateAnimation,
      ]).start();
      
      return () => {
        rotateAnimation.stop();
      };
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isProcessing]);
  
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const isFormValid = () => {
    // Validation simple : au moins un caractère dans email et mot de passe
    if (isLogin) {
      return email.trim() !== '' && password.trim() !== '';
    } else {
      return name.trim() !== '' && email.trim() !== '' && password.trim() !== '' && confirmPassword.trim() !== '';
    }
  };

  const handleAuth = () => {
    // Protection contre les clics multiples
    if (isProcessing) {
      console.log('Already processing, ignoring click');
      return;
    }

    console.log('Auth button pressed');
    console.log('Navigation object:', navigation);
    console.log('User type:', userType);
    
    setIsProcessing(true);

    // Délai pour afficher l'animation de chargement
    setTimeout(() => {
      // Navigation directe sans alert pour tester
      if (navigation) {
        console.log('Attempting to navigate...');
        try {
          // Naviguer vers le bon mode selon le type d'utilisateur
          if (userType === 'provider') {
            console.log('Navigating to Provider mode');
            navigation.navigate('Provider');
          } else {
            console.log('Navigating to Client mode');
            navigation.navigate('Main');
          }
          console.log('Navigation successful');
        } catch (error) {
          console.log('Navigation error:', error);
          Alert.alert('Erreur', 'Erreur de navigation: ' + error);
          setIsProcessing(false);
        }
      } else {
        console.log('Navigation object is null or undefined');
        Alert.alert('Erreur', 'Navigation non disponible');
        setIsProcessing(false);
      }
      
      // Reset processing state après la navigation
      setTimeout(() => {
        setIsProcessing(false);
      }, 500);
    }, 1500);
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Mot de passe oublié',
      'Un email de réinitialisation sera envoyé à votre adresse email.',
      [
        {
          text: 'OK',
          onPress: () => {
            // Simulation d'envoi d'email
            Alert.alert('Email envoyé', 'Vérifiez votre boîte de réception.');
          },
        },
      ]
    );
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
  };

  const toggleUserType = (type: 'client' | 'provider') => {
    setUserType(type);
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.header}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/images/Logo ADM V1.png')} 
            style={styles.logo}
            resizeMode="cover"
          />
        </View>
        <Text style={styles.welcomeText}>
          {isLogin ? 'Bon retour !' : 'Bienvenue !'}
        </Text>
        <Text style={styles.subtitleText}>
          {isLogin ? 'Connectez-vous à votre compte' : 'Créez votre compte'}
        </Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Sélection du type d'utilisateur */}
        {!isLogin && (
          <View style={styles.userTypeSection}>
            <Text style={styles.sectionTitle}>Type de compte</Text>
            <View style={styles.userTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  userType === 'client' && styles.userTypeButtonActive
                ]}
                onPress={() => toggleUserType('client')}
                activeOpacity={0.8}
              >
                <Ionicons 
                  name="person-outline" 
                  size={24} 
                  color={userType === 'client' ? COLORS.white : COLORS.primary} 
                />
                <Text style={[
                  styles.userTypeText,
                  userType === 'client' && styles.userTypeTextActive
                ]}>
                  Client
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  userType === 'provider' && styles.userTypeButtonActive
                ]}
                onPress={() => toggleUserType('provider')}
                activeOpacity={0.8}
              >
                <Ionicons 
                  name="business-outline" 
                  size={24} 
                  color={userType === 'provider' ? COLORS.white : COLORS.primary} 
                />
                <Text style={[
                  styles.userTypeText,
                  userType === 'provider' && styles.userTypeTextActive
                ]}>
                  Prestataire
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Formulaire */}
        <View style={styles.formSection}>
          {!isLogin && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nom complet *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color={COLORS.textSecondary} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Votre nom complet"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color={COLORS.textSecondary} />
              <TextInput
                style={styles.textInput}
                placeholder="votre@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Mot de passe *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} />
              <TextInput
                style={styles.textInput}
                placeholder="Votre mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color={COLORS.textSecondary} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {!isLogin && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirmer le mot de passe *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Confirmez votre mot de passe"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons 
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color={COLORS.textSecondary} 
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <TouchableOpacity 
            style={[
              styles.authButton,
              isProcessing && styles.authButtonDisabled
            ]} 
            onPress={handleAuth} 
            activeOpacity={0.8}
            disabled={isProcessing}
          >
            <LinearGradient 
              colors={isProcessing ? [COLORS.gray, COLORS.gray] : [COLORS.primary, COLORS.primaryDark]} 
              style={styles.authButtonGradient}
            >
              <Text style={[
                styles.authButtonText,
                isProcessing && styles.authButtonTextDisabled
              ]}>
                {isProcessing ? 'Traitement...' : (isLogin ? 'Se connecter' : 'S\'inscrire')}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Lien pour changer de mode */}
        <View style={styles.switchModeSection}>
          <Text style={styles.switchModeText}>
            {isLogin ? 'Pas encore de compte ?' : 'Déjà un compte ?'}
          </Text>
          <TouchableOpacity onPress={toggleAuthMode}>
            <Text style={styles.switchModeLink}>
              {isLogin ? 'S\'inscrire' : 'Se connecter'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Options supplémentaires */}
        {isLogin && (
          <View style={styles.extraOptionsSection}>
            <TouchableOpacity style={styles.forgotPasswordButton} onPress={handleForgotPassword}>
              <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Bouton Accès Prestataires - Mode Test */}
        <View style={styles.providerAccessSection}>
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>
          <TouchableOpacity
            style={styles.providerAccessButton}
            onPress={() => {
              if (navigation) {
                navigation.navigate('Provider');
              }
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="business" size={20} color={COLORS.primary} />
            <Text style={styles.providerAccessButtonText}>Accès prestataires</Text>
            <Ionicons name="arrow-forward" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.providerAccessHint}>
            Accès direct au mode prestataire (Mode test)
          </Text>
        </View>
      </View>
      
      {/* Overlay de chargement avec logo qui tourne */}
      {isProcessing && (
        <Animated.View 
          style={[
            styles.loadingOverlay,
            {
              opacity: fadeAnim,
            }
          ]}
        >
          <LinearGradient
            colors={[COLORS.gradientStart + 'EE', COLORS.gradientEnd + 'EE']}
            style={styles.loadingGradient}
          >
            <Animated.View
              style={[
                styles.loadingLogoContainer,
                {
                  transform: [{ rotate }],
                },
              ]}
            >
              <Logo size="large" showText={false} />
            </Animated.View>
          </LinearGradient>
        </Animated.View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40, // Add padding to ensure the button is accessible
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  userTypeSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  userTypeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  userTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.border,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  userTypeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  userTypeText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginLeft: 8,
  },
  userTypeTextActive: {
    color: COLORS.white,
  },
  formSection: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
    marginLeft: 12,
  },
  authButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  authButtonDisabled: {
    opacity: 0.7,
  },
  authButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  authButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  authButtonTextDisabled: {
    color: COLORS.gray,
  },
  switchModeSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  switchModeText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  switchModeLink: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 8,
  },
  extraOptionsSection: {
    alignItems: 'center',
  },
  forgotPasswordButton: {
    padding: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  providerAccessSection: {
    marginTop: 24,
    marginBottom: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  providerAccessButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  providerAccessButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  providerAccessHint: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingGradient: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingLogoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AuthScreen; 