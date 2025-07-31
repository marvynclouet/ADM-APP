import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

const { width: screenWidth } = Dimensions.get('window');

interface ServiceSlide {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
}

interface ServiceCarouselProps {
  onServicePress?: (serviceId: string) => void;
  onSeeAllPress?: () => void;
}

const ServiceCarousel: React.FC<ServiceCarouselProps> = ({ 
  onServicePress,
  onSeeAllPress 
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // Données des services avec images d'Unsplash
  const services: ServiceSlide[] = [
    {
      id: '1',
      title: 'Coiffure & Brushing',
      description: 'Coupes modernes et brushing professionnel',
      image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&h=400&fit=crop',
      category: 'Coiffure'
    },
    {
      id: '2',
      title: 'Manucure & Pedicure',
      description: 'Soins complets des mains et pieds',
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&h=400&fit=crop',
      category: 'Manucure'
    },
    {
      id: '3',
      title: 'Maquillage Professionnel',
      description: 'Maquillage pour tous les événements',
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&h=400&fit=crop',
      category: 'Maquillage'
    },
    {
      id: '4',
      title: 'Massage Relaxant',
      description: 'Massage corporel et détente',
      image: 'https://images.unsplash.com/photo-1544161512-4ab8f4f2a52a?w=800&h=400&fit=crop',
      category: 'Massage'
    },
    {
      id: '5',
      title: 'Épilation & Soins',
      description: 'Épilation et soins de la peau',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=400&fit=crop',
      category: 'Soins'
    }
  ];

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    setActiveIndex(roundIndex);
  };

  const scrollToIndex = (index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * screenWidth,
      animated: true,
    });
  };

  const handleServicePress = (serviceId: string) => {
    onServicePress?.(serviceId);
  };

  const handleSeeAllPress = () => {
    if (onSeeAllPress) {
      onSeeAllPress();
    } else {
      Alert.alert('Services', 'Voir tous les services');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Services Populaires</Text>
        <TouchableOpacity onPress={handleSeeAllPress} activeOpacity={0.7}>
          <Text style={styles.seeAllText}>Voir tout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.carousel}
      >
        {services.map((service, index) => (
          <TouchableOpacity
            key={service.id}
            style={styles.slide}
            onPress={() => handleServicePress(service.id)}
            activeOpacity={0.9}
          >
            <Image
              source={{ uri: service.image }}
              style={styles.slideImage}
              resizeMode="cover"
            />
            <View style={styles.slideOverlay}>
              <View style={styles.slideContent}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{service.category}</Text>
                </View>
                <Text style={styles.slideTitle}>{service.title}</Text>
                <Text style={styles.slideDescription}>{service.description}</Text>
                <View style={styles.slideAction}>
                  <Text style={styles.actionText}>Découvrir</Text>
                  <Ionicons name="arrow-forward" size={16} color={COLORS.white} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Indicateurs de pagination */}
      <View style={styles.pagination}>
        {services.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.paginationDot,
              index === activeIndex && styles.paginationDotActive
            ]}
            onPress={() => scrollToIndex(index)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  carousel: {
    height: 200,
  },
  slide: {
    width: screenWidth - 32,
    height: 200,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  slideOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  slideContent: {
    padding: 20,
  },
  categoryBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  categoryText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  slideTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  slideDescription: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: 12,
  },
  slideAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: COLORS.primary,
    width: 24,
  },
});

export default ServiceCarousel; 