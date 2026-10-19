import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';

interface SplashScreenProps {
  onFinish: () => void;
}

const { width } = Dimensions.get('window');

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Fade and scale in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();

    // Auto-transition to main app after 2.2s
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 2200);

    return () => {
      clearTimeout(timer);
      pulseLoop.stop();
    };
  }, [fadeAnim, scaleAnim, pulseAnim, onFinish]);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onFinish}
      style={styles.container}
    >
      <LinearGradient
        colors={['#090D16', '#0F172A', '#1E1B4B']}
        style={StyleSheet.absoluteFill}
      />

      {/* Background Decorative Rings */}
      <View style={styles.glowRingOuter} />
      <View style={styles.glowRingInner} />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Glowing App Icon Container */}
        <Animated.View
          style={[
            styles.logoContainer,
            { transform: [{ scale: pulseAnim }] },
          ]}
        >
          <LinearGradient
            colors={['#6366F1', '#4F46E5', '#3B82F6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoGradient}
          >
            <Ionicons name="sparkles" size={44} color="#FFFFFF" />
          </LinearGradient>
        </Animated.View>

        {/* Brand Name */}
        <Text style={styles.title}>MoneyTrack</Text>

        {/* Tagline */}
        <Text style={styles.tagline}>
          Smart & Minimalist Financial Freedom
        </Text>

        {/* Feature Highlights Pills */}
        <View style={styles.featuresRow}>
          <View style={styles.featurePill}>
            <Ionicons name="shield-checkmark-outline" size={12} color={Colors.income} />
            <Text style={styles.featurePillText}>100% Offline</Text>
          </View>
          <View style={styles.featurePill}>
            <Ionicons name="eye-outline" size={12} color={Colors.primaryLight} />
            <Text style={styles.featurePillText}>Private</Text>
          </View>
          <View style={styles.featurePill}>
            <Ionicons name="flash-outline" size={12} color={Colors.warning} />
            <Text style={styles.featurePillText}>Cepat & Ringan</Text>
          </View>
        </View>
      </Animated.View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerVersion}>v1.0.0 • Personal Edition</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glowRingOuter: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: (width * 1.2) / 2,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.08)',
  },
  glowRingInner: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: (width * 0.8) / 2,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.12)',
  },
  content: {
    alignItems: 'center',
    zIndex: 2,
    paddingHorizontal: Spacing.xl,
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 32,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
    marginBottom: Spacing.xl,
  },
  logoGradient: {
    flex: 1,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  title: {
    fontSize: Typography.sizes.hero,
    fontWeight: Typography.weights.heavy,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  featuresRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginTop: Spacing.xxl,
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  featurePillText: {
    fontSize: 10,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSecondary,
  },
  footer: {
    position: 'absolute',
    bottom: Spacing.xxl,
    alignItems: 'center',
  },
  footerVersion: {
    fontSize: Typography.sizes.xs,
    color: Colors.textTertiary,
    fontWeight: Typography.weights.medium,
  },
});
