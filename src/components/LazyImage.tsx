import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, ActivityIndicator, ImageStyle, ViewStyle } from 'react-native';
import { imageCache } from '../utils/imageCache';
import { COLORS } from '../constants/colors';

interface LazyImageProps {
  uri: string;
  style?: ImageStyle | ImageStyle[];
  placeholder?: string;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
}

const LazyImage: React.FC<LazyImageProps> = ({
  uri,
  style,
  placeholder,
  resizeMode = 'cover',
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [loadedUri, setLoadedUri] = useState<string | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      try {
        setLoading(true);
        setError(false);
        
        // Vérifier le cache
        const cachedUri = imageCache.getCachedUri(uri);
        if (cachedUri) {
          setLoadedUri(cachedUri);
          setLoading(false);
          return;
        }

        // Précharger l'image
        await imageCache.preloadImage(uri);
        setLoadedUri(uri);
      } catch (err) {
        console.warn('Failed to load image:', uri, err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (uri) {
      loadImage();
    }
  }, [uri]);

  if (error && placeholder) {
    return <Image source={{ uri: placeholder }} style={style} resizeMode={resizeMode} />;
  }

  if (loading || !loadedUri) {
    return (
      <View style={[style, styles.placeholder]}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <Image
      source={{ uri: loadedUri }}
      style={style}
      resizeMode={resizeMode}
      onError={() => setError(true)}
    />
  );
};

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LazyImage;





