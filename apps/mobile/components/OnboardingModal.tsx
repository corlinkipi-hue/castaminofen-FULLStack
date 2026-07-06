import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ONBOARDING_SLIDES,
  getOnboardingStepState,
  isOnboardingComplete,
  markOnboardingComplete,
} from '@/lib/onboarding';
import { spacing, radius, fonts } from '@/constants/theme';
import { useAppTheme } from '@/context/ThemeContext';
import { useThemedStyles, type ThemeColors } from '@/hooks/useThemedStyles';

type IconName = keyof typeof Ionicons.glyphMap;

function createStyles(colors: ThemeColors) {
  return {
    backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'flex-end' as const },
    sheet: {
      backgroundColor: colors.bgCard,
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
    },
    progressWrap: { marginBottom: spacing.md },
    progressTrack: {
      height: 6,
      borderRadius: radius.full,
      backgroundColor: colors.border,
      overflow: 'hidden' as const,
    },
    progressFill: {
      height: '100%' as const,
      backgroundColor: colors.accent,
      borderRadius: radius.full,
    },
    progressText: {
      color: colors.textMuted,
      fontSize: 12,
      marginTop: spacing.xs,
      textAlign: 'center' as const,
    },
    content: { alignItems: 'center' as const },
    dots: { flexDirection: 'row-reverse' as const, justifyContent: 'center' as const, gap: spacing.sm, marginBottom: spacing.lg },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
    dotActive: { backgroundColor: colors.accent, width: 24 },
    iconWrap: {
      alignSelf: 'center' as const,
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor: colors.accentMuted,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      marginBottom: spacing.lg,
    },
    title: { color: colors.textPrimary, fontSize: 22, fontWeight: '700' as const, textAlign: 'center' as const, fontFamily: fonts.bold },
    desc: { color: colors.textSecondary, fontSize: 15, lineHeight: 24, textAlign: 'center' as const, marginTop: spacing.sm, fontFamily: fonts.regular },
    actions: { flexDirection: 'row-reverse' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, marginTop: spacing.xl },
    skipBtn: { padding: spacing.sm },
    skipText: { color: colors.textMuted, fontSize: 14, fontFamily: fonts.medium },
    nextBtn: {
      backgroundColor: colors.accent,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
      borderRadius: radius.full,
      minWidth: 120,
      alignItems: 'center' as const,
    },
    nextText: { color: colors.textOnPrimary, fontWeight: '700' as const, fontSize: 15, fontFamily: fonts.semibold },
  };
}

export function OnboardingModal() {
  const { colors } = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    void isOnboardingComplete().then((done) => {
      if (!done) setVisible(true);
    });
  }, []);

  useEffect(() => {
    if (!visible) return;
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, step, translateY, visible]);

  const finish = async () => {
    await markOnboardingComplete();
    setVisible(false);
  };

  const slide = ONBOARDING_SLIDES[step];
  const { isLast, canGoBack, nextStep } = getOnboardingStepState(step, ONBOARDING_SLIDES.length);

  return (
    <Modal visible={visible} animationType="slide" transparent accessibilityViewIsModal>
      <View style={styles.backdrop}>
        <Animated.View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, spacing.lg), minHeight: height * 0.42, opacity: fadeAnim, transform: [{ translateY }] }]}>
          <View style={styles.progressWrap}>
            <View style={styles.progressTrack}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: `${((step + 1) / ONBOARDING_SLIDES.length) * 100}%`,
                    opacity: fadeAnim,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>{`مرحله ${step + 1} از ${ONBOARDING_SLIDES.length}`}</Text>
          </View>

          <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY }] }]}>
            <View style={styles.dots}>
              {ONBOARDING_SLIDES.map((_, i) => (
                <View key={i} style={[styles.dot, i === step && styles.dotActive]} accessibilityElementsHidden />
              ))}
            </View>

            <View style={styles.iconWrap}>
              <Ionicons name={slide.icon as IconName} size={44} color={colors.accent} accessibilityElementsHidden />
            </View>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.desc}>{slide.description}</Text>
          </Animated.View>

          <View style={styles.actions}>
            {canGoBack ? (
              <TouchableOpacity onPress={() => setStep((s) => Math.max(0, s - 1))} style={styles.skipBtn} accessibilityRole="button" accessibilityLabel="مرحله قبل">
                <Text style={styles.skipText}>قبلی</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => void finish()} style={styles.skipBtn} accessibilityRole="button" accessibilityLabel="رد کردن راهنما">
                <Text style={styles.skipText}>رد کردن</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => (isLast ? void finish() : setStep(() => nextStep ?? 0))}
              style={styles.nextBtn}
              accessibilityRole="button"
              accessibilityLabel={isLast ? 'شروع استفاده' : 'مرحله بعد'}
            >
              <Text style={styles.nextText}>{isLast ? 'شروع کنید' : 'بعدی'}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
