import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { AuthService } from '../../backend/services/auth.service';
import { Linking } from 'react-native';
import { supabase } from '../../backend/supabase/config';

interface EmailVerificationScreenProps {
  navigation?: any;
  route?: any;
}

const EmailVerificationScreen: React.FC<EmailVerificationScreenProps> = ({ navigation, route }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [email, setEmail] = useState(route?.params?.email || '');
  const [isVerified, setIsVerified] = useState(false);

  const handleAutoLogin = async () => {
    try {
      setIsChecking(true);
      
      // Récupérer l'utilisateur actuel
      const userData = await AuthService.getCurrentUser();
      
      if (!userData) {
        throw new Error('Impossible de récupérer les données utilisateur');
      }

      if (!navigation) {
        throw new Error('Navigation non disponible');
      }

      const isProvider = userData.is_provider || false;
      
      // Rediriger vers l'écran approprié
      navigation.reset({
        index: 0,
        routes: [{ 
          name: isProvider ? 'Provider' : 'Main' 
        }],
      });
    } catch (error: any) {
      console.error('Erreur auto-login:', error);
      // En cas d'erreur, rediriger vers l'écran de connexion
      if (navigation) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Auth' }],
        });
      }
    } finally {
      setIsChecking(false);
    }
  };

  // Vérifier périodiquement si l'email est confirmé
  useEffect(() => {
    if (!email) return;

    const checkEmailVerification = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user && user.email_confirmed_at) {
          // Email confirmé, connecter automatiquement
          setIsVerified(true);
          await handleAutoLogin();
        }
      } catch (error) {
        console.error('Erreur vérification email:', error);
      }
    };

    // Vérifier immédiatement
    checkEmailVerification();

    // Vérifier toutes les 3 secondes
    const interval = setInterval(checkEmailVerification, 3000);

    return () => clearInterval(interval);
  }, [email]);

  // Écouter les deep links (quand l'utilisateur clique sur le lien de confirmation)
  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      const { url } = event;
      
      // Vérifier si c'est un lien de confirmation Supabase
      if (url.includes('#access_token=') || url.includes('type=email')) {
        setIsChecking(true);
        
        try {
          // Attendre un peu pour que Supabase traite le token
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Vérifier si l'utilisateur est maintenant confirmé
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user && user.email_confirmed_at) {
            setIsVerified(true);
            await handleAutoLogin();
          }
        } catch (error) {
          console.error('Erreur traitement deep link:', error);
        } finally {
          setIsChecking(false);
        }
      }
    };

    // Écouter les liens entrants
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Vérifier si l'app a été ouverte via un lien
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    }).catch((error) => {
      console.error('Erreur getInitialURL:', error);
    });

    return () => {
      if (subscription && subscription.remove) {
        subscription.remove();
      }
    };
  }, []);

  const handleResendEmail = async () => {
    if (!email) return;

    try {
      setIsChecking(true);
      
      // Renvoyer l'email de confirmation
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) throw error;

      alert('Email de confirmation renvoyé ! Vérifiez votre boîte mail.');
    } catch (error: any) {
      console.error('Erreur renvoi email:', error);
      alert(error.message || 'Erreur lors du renvoi de l\'email');
    } finally {
      setIsChecking(false);
    }
  };

  const handleBackToLogin = () => {
    if (navigation) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      });
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="mail-outline" size={80} color={COLORS.white} />
        </View>
        <Text style={styles.title}>Vérification de votre email</Text>
        <Text style={styles.subtitle}>
          {isVerified 
            ? 'Email confirmé ! Connexion en cours...' 
            : 'En attente de validation de votre compte'}
        </Text>
      </LinearGradient>

      <View style={styles.content}>
        {isVerified ? (
          <View style={styles.verifiedContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.verifiedText}>
              Connexion automatique en cours...
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.messageContainer}>
              <Text style={styles.messageText}>
                Un email de confirmation a été envoyé à :
              </Text>
              <Text style={styles.emailText}>{email}</Text>
              <Text style={styles.instructionText}>
                Veuillez cliquer sur le lien dans l'email pour confirmer votre compte.
                Une fois validé, vous serez connecté automatiquement.
              </Text>
            </View>

            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={styles.resendButton}
                onPress={handleResendEmail}
                disabled={isChecking}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[COLORS.primary, COLORS.primaryDark]}
                  style={styles.resendButtonGradient}
                >
                  <Ionicons name="mail" size={20} color={COLORS.white} />
                  <Text style={styles.resendButtonText}>
                    {isChecking ? 'Envoi...' : 'Renvoyer l\'email'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackToLogin}
                disabled={isChecking}
                activeOpacity={0.8}
              >
                <Text style={styles.backButtonText}>Retour à la connexion</Text>
              </TouchableOpacity>
            </View>

            {isChecking && (
              <View style={styles.checkingContainer}>
                <ActivityIndicator size="small" color={COLORS.primary} />
                <Text style={styles.checkingText}>Vérification en cours...</Text>
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  messageContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 3,
      },
    }),
  },
  messageText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  emailText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  actionsContainer: {
    gap: 12,
  },
  resendButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  resendButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  resendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  backButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '500',
  },
  checkingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
  },
  checkingText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  verifiedContainer: {
    alignItems: 'center',
    gap: 16,
  },
  verifiedText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
});

export default EmailVerificationScreen;

