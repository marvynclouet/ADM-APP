import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  providerId: string;
  serviceId?: string;
  serviceName?: string;
  rating: number;
  review: string;
  date: string;
  isVerified: boolean;
  helpful: number;
}

const STORAGE_KEY = 'reviews';

export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Load reviews from storage
  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const storedReviews = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedReviews) {
        setReviews(JSON.parse(storedReviews));
      } else {
        // Initialize with mock data
        const mockReviews: Review[] = [
          {
            id: '1',
            userId: 'user1',
            userName: 'Sophie Martin',
            userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
            providerId: '1',
            serviceId: '1',
            serviceName: 'Coupe et brushing',
            rating: 5,
            review: 'Service impeccable ! Marie est très professionnelle et à l\'écoute. Je recommande vivement.',
            date: '2024-01-15',
            isVerified: true,
            helpful: 3,
          },
          {
            id: '2',
            userId: 'user2',
            userName: 'Claire Dubois',
            providerId: '1',
            serviceId: '2',
            serviceName: 'Coloration',
            rating: 4,
            review: 'Très satisfaite du résultat. La couleur est exactement comme souhaité.',
            date: '2024-01-10',
            isVerified: true,
            helpful: 1,
          },
          {
            id: '3',
            userId: 'user3',
            userName: 'Emma Laurent',
            userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
            providerId: '2',
            serviceId: '3',
            serviceName: 'Manucure',
            rating: 5,
            review: 'Parfait ! Sarah est très douce et le résultat est magnifique.',
            date: '2024-01-12',
            isVerified: true,
            helpful: 2,
          },
          {
            id: '4',
            userId: 'user4',
            userName: 'Julie Moreau',
            providerId: '2',
            serviceId: '4',
            serviceName: 'Pédicure',
            rating: 4,
            review: 'Service de qualité, je reviendrai.',
            date: '2024-01-08',
            isVerified: false,
            helpful: 0,
          },
          {
            id: '5',
            userId: 'user5',
            userName: 'Anna Petit',
            userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
            providerId: '3',
            serviceId: '5',
            serviceName: 'Massage relaxant',
            rating: 5,
            review: 'Moment de détente parfait. Laura a des mains magiques !',
            date: '2024-01-14',
            isVerified: true,
            helpful: 4,
          },
        ];
        setReviews(mockReviews);
        await saveReviews(mockReviews);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveReviews = async (reviewsToSave: Review[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reviewsToSave));
    } catch (error) {
      console.error('Error saving reviews:', error);
    }
  };

  const addReview = async (review: Omit<Review, 'id' | 'date' | 'helpful'>) => {
    const newReview: Review = {
      ...review,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      helpful: 0,
    };

    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);
    await saveReviews(updatedReviews);
    return newReview;
  };

  const getReviewsByProvider = (providerId: string): Review[] => {
    return reviews.filter(review => review.providerId === providerId);
  };

  const getReviewsByService = (serviceId: string): Review[] => {
    return reviews.filter(review => review.serviceId === serviceId);
  };

  const getAverageRating = (providerId: string): number => {
    const providerReviews = getReviewsByProvider(providerId);
    if (providerReviews.length === 0) return 0;
    
    const totalRating = providerReviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / providerReviews.length;
  };

  const getRatingStats = (providerId: string) => {
    const providerReviews = getReviewsByProvider(providerId);
    const stats = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    providerReviews.forEach(review => {
      stats[review.rating as keyof typeof stats]++;
    });

    return stats;
  };

  const getRecentReviews = (limit: number = 5): Review[] => {
    return reviews
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  };

  const markAsHelpful = async (reviewId: string) => {
    const updatedReviews = reviews.map(review =>
      review.id === reviewId
        ? { ...review, helpful: review.helpful + 1 }
        : review
    );
    setReviews(updatedReviews);
    await saveReviews(updatedReviews);
  };

  const deleteReview = async (reviewId: string) => {
    const updatedReviews = reviews.filter(review => review.id !== reviewId);
    setReviews(updatedReviews);
    await saveReviews(updatedReviews);
  };

  return {
    reviews,
    loading,
    addReview,
    getReviewsByProvider,
    getReviewsByService,
    getAverageRating,
    getRatingStats,
    getRecentReviews,
    markAsHelpful,
    deleteReview,
  };
};
