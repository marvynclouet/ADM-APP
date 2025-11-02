import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  refreshing?: boolean;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  refreshing = false,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      {children}
      <RefreshControl
        refreshing={isRefreshing || refreshing}
        onRefresh={handleRefresh}
        colors={[COLORS.primary]}
        tintColor={COLORS.primary}
        title="Actualisation..."
        titleColor={COLORS.textSecondary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PullToRefresh;


