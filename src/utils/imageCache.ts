import { Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = 'image_cache';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 jours

interface CachedImage {
  uri: string;
  timestamp: number;
}

class ImageCache {
  private cache: Map<string, string> = new Map();

  async preloadImage(uri: string): Promise<void> {
    if (this.cache.has(uri)) {
      return;
    }

    try {
      await new Promise((resolve, reject) => {
        Image.prefetch(uri)
          .then(() => {
            this.cache.set(uri, uri);
            resolve(undefined);
          })
          .catch(reject);
      });
    } catch (error) {
      console.warn('Failed to preload image:', uri, error);
    }
  }

  async preloadImages(uris: string[]): Promise<void> {
    await Promise.all(uris.map(uri => this.preloadImage(uri)));
  }

  getCachedUri(uri: string): string | null {
    return this.cache.get(uri) || null;
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const imageCache = new ImageCache();

