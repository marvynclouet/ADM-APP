import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import FormField from '../components/FormField';
import LoadingSpinner from '../components/LoadingSpinner';
import Logo from '../components/Logo';
import { AuthService, SignUpData, SignInData } from '../../backend/services/auth.service';

interface AuthScreenProps {
  navigation?: any;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<'client' | 'provider'>('client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Animations pour le logo de chargement
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // useNativeDriver n'est pas supporté sur web
    const canUseNativeDriver = Platform.OS !== 'web';
    
    if (isProcessing) {
      // Démarrer l'animation de rotation
      const rotateAnimation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: canUseNativeDriver,
        })
      );
      
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: canUseNativeDriver,
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
        useNativeDriver: canUseNativeDriver,
      }).start();
    }
  }, [isProcessing]);
  
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    // Au moins 6 caractères
    return password.length >= 6;
  };

  const isFormValid = () => {
    if (isLogin) {
      return email.trim() !== '' && password.trim() !== '' && validateEmail(email.trim());
    } else {
      return (
        firstName.trim() !== '' &&
        lastName.trim() !== '' &&
        email.trim() !== '' &&
        validateEmail(email.trim()) &&
        password.trim() !== '' &&
        validatePassword(password) &&
        confirmPassword.trim() !== '' &&
        password === confirmPassword
      );
    }
  };

  const handleAuth = async () => {
    // Protection contre les clics multiples
    if (isProcessing) {
      console.log('Already processing, ignoring click');
      return;
    }

    // Validation stricte AVANT tout traitement
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    console.log('🔍 Validation - Email:', trimmedEmail, 'Password:', trimmedPassword ? '***' : 'VIDE', 'isLogin:', isLogin);

    // Validation des champs obligatoires
    if (isLogin) {
      // Connexion : email et mot de passe requis
      if (!trimmedEmail) {
        Alert.alert('Erreur', 'Veuillez entrer votre adresse email');
        return;
      }
      if (!trimmedPassword) {
        Alert.alert('Erreur', 'Veuillez entrer votre mot de passe');
        return;
      }
      if (!validateEmail(trimmedEmail)) {
        Alert.alert('Erreur', 'Veuillez entrer une adresse email valide');
        return;
      }
    } else {
      // Inscription : tous les champs requis
      const trimmedFirstName = firstName.trim();
      const trimmedLastName = lastName.trim();
      
      if (!trimmedFirstName) {
        Alert.alert('Erreur', 'Veuillez entrer votre prénom');
        return;
      }
      if (!trimmedLastName) {
        Alert.alert('Erreur', 'Veuillez entrer votre nom');
        return;
      }
      if (!trimmedEmail) {
        Alert.alert('Erreur', 'Veuillez entrer votre adresse email');
        return;
      }
      if (!validateEmail(trimmedEmail)) {
        Alert.alert('Erreur', 'Veuillez entrer une adresse email valide');
        return;
      }
      if (!trimmedPassword) {
        Alert.alert('Erreur', 'Veuillez entrer un mot de passe');
        return;
      }
      if (!validatePassword(trimmedPassword)) {
        Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
        return;
      }
      if (!trimmedConfirmPassword) {
        Alert.alert('Erreur', 'Veuillez confirmer votre mot de passe');
        return;
      }
      if (trimmedPassword !== trimmedConfirmPassword) {
        Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
        return;
      }
    }

    // Si on arrive ici, tous les champs sont valides
    setIsProcessing(true);

    try {
      let userData;

      if (isLogin) {
        // Connexion
        const signInData: SignInData = {
          email: trimmedEmail,
          password: trimmedPassword,
        };

        console.log('Tentative de connexion avec:', { email: trimmedEmail, hasPassword: !!trimmedPassword });
        const result = await AuthService.signIn(signInData);
        
        if (!result || !result.user) {
          throw new Error('Erreur lors de la connexion : aucune donnée utilisateur reçue');
        }
        
        userData = result.user;
      } else {
        // Inscription
        const trimmedFirstName = firstName.trim();
        const trimmedLastName = lastName.trim();

        if (!trimmedFirstName) {
          throw new Error('Le prénom est requis');
        }

        if (!trimmedLastName) {
          throw new Error('Le nom est requis');
        }

        const signUpData: SignUpData = {
          email: trimmedEmail,
          password: trimmedPassword,
          firstName: trimmedFirstName,
          lastName: trimmedLastName,
          isProvider: userType === 'provider',
        };

        console.log('Tentative d\'inscription avec:', { email: trimmedEmail, hasPassword: !!trimmedPassword, isProvider: userType === 'provider' });
        const result = await AuthService.signUp(signUpData);
        
        if (!result || !result.user) {
          throw new Error('Erreur lors de l\'inscription : aucune donnée utilisateur reçue');
        }
        
        userData = result.user;
      }

      // Vérifier que nous avons bien un utilisateur avant de rediriger
      if (!userData) {
        throw new Error('Aucune donnée utilisateur disponible après authentification');
      }

      // Vérifier le type d'utilisateur et rediriger
      if (!navigation) {
        throw new Error('Navigation non disponible');
      }

      const isProvider = userData.is_provider || false;
      console.log('Authentification réussie, redirection vers:', isProvider ? 'Provider' : 'Main');
      
      // Utiliser reset pour éviter de revenir en arrière
      navigation.reset({
        index: 0,
        routes: [{ 
          name: isProvider ? 'Provider' : 'Main' 
        }],
      });
    } catch (error: any) {
      console.error('Erreur authentification:', error);
      
      // Messages d'erreur plus clairs
      let errorMessage = 'Une erreur est survenue lors de l\'authentification';
      
      if (error.message) {
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Email ou mot de passe incorrect';
        } else if (error.message.includes('User already registered')) {
          errorMessage = 'Cet email est déjà utilisé. Connectez-vous ou utilisez un autre email';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Veuillez confirmer votre email avant de vous connecter';
        } else if (error.message.includes('Password')) {
          errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
        } else {
          errorMessage = error.message;
        }
      }
      
      Alert.alert('Erreur', errorMessage);
      setIsProcessing(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim() || !validateEmail(email.trim())) {
      Alert.alert(
        'Email requis',
        'Veuillez entrer votre adresse email pour réinitialiser votre mot de passe.',
        [
          {
            text: 'OK',
          },
        ]
      );
      return;
    }

    try {
      setIsProcessing(true);
      await AuthService.resetPassword(email.trim());
      Alert.alert(
        'Email envoyé',
        'Un email de réinitialisation a été envoyé à votre adresse email. Vérifiez votre boîte de réception.',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      console.error('Erreur resetPassword:', error);
      Alert.alert(
        'Erreur',
        error.message || 'Impossible d\'envoyer l\'email de réinitialisation'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFirstName('');
    setLastName('');
  };

  const toggleUserType = (type: 'client' | 'provider') => {
    setUserType(type);
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
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
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Prénom *</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="person-outline" size={20} color={COLORS.textSecondary} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Votre prénom"
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCapitalize="words"
                  />
                </View>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Nom *</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="person-outline" size={20} color={COLORS.textSecondary} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Votre nom"
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="words"
                  />
                </View>
              </View>
            </>
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
                placeholder={isLogin ? "Votre mot de passe" : "Au moins 6 caractères"}
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
            {!isLogin && password.length > 0 && (
              <Text style={[
                styles.passwordHint,
                validatePassword(password) ? styles.passwordHintValid : styles.passwordHintInvalid
              ]}>
                {validatePassword(password) 
                  ? '✓ Mot de passe valide' 
                  : 'Le mot de passe doit contenir au moins 6 caractères'}
              </Text>
            )}
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
              pointerEvents: 'auto' as const,
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
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
    minHeight: '100%',
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
    padding: 20,
    minHeight: 600,
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
  passwordHint: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  passwordHintValid: {
    color: '#10b981',
  },
  passwordHintInvalid: {
    color: '#ef4444',
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
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
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