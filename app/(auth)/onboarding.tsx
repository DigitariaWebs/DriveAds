import { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ViewToken,
  Image,
  Animated,
  Easing,
} from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { FontFamily } from '../../constants/Typography';
import { Spacing } from '../../constants/Spacing';

const { width, height } = Dimensions.get('window');

// ─── Slide data ─────────────────────────────────────────────
type TitlePart = { text: string; bold: boolean };

type Slide = {
  id: string;
  titleParts: TitlePart[];
  emoji: any;
  fallbackEmoji: string;
};

const slides: Slide[] = [
  {
    id: '1',
    titleParts: [
      { text: 'Transformez', bold: true },
      { text: '\nVotre Véhicule', bold: false },
      { text: '\nEn ', bold: false },
      { text: 'Revenu', bold: true },
    ],
    emoji: require('../../assets/emoji1.png'),
    fallbackEmoji: '🚗',
  },
  {
    id: '2',
    titleParts: [
      { text: 'Recevez', bold: true },
      { text: '\nDes Campagnes', bold: false },
      { text: '\nDans ', bold: false },
      { text: 'Votre\nVille', bold: true },
    ],
    emoji: require('../../assets/emoji2.png'),
    fallbackEmoji: '📣',
  },
  {
    id: '3',
    titleParts: [
      { text: 'Suivez', bold: false },
      { text: '\nVos ', bold: false },
      { text: 'Gains', bold: true },
      { text: '\nEn ', bold: false },
      { text: 'Temps\nRéel', bold: true },
    ],
    emoji: require('../../assets/emoji3.png'),
    fallbackEmoji: '💰',
  },
];

// ─── Floating emoji ─────────────────────────────────────────
function FloatingEmoji({ emoji, fallbackEmoji }: { emoji: any; fallbackEmoji: string }) {
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: -8,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 8,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.emojiWrap, { transform: [{ translateY: float }] }]}>
      {emoji ? (
        <Image source={emoji} style={styles.emojiImage} resizeMode="contain" />
      ) : (
        <Text style={styles.emojiText}>{fallbackEmoji}</Text>
      )}
    </Animated.View>
  );
}

// ─── Main ───────────────────────────────────────────────────
export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
  ).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const goToLogin = () => router.replace('/(auth)/login');

  const goNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      goToLogin();
    }
  };

  const isLast = currentIndex === slides.length - 1;

  const renderSlide = ({ item }: { item: Slide }) => (
    <View style={styles.slide}>
      {/* Soft background blobs */}
      <View style={styles.blob1} />
      <View style={styles.blob2} />
      <View style={styles.blob3} />

      {/* Logo — tiny, center top */}
      <View style={styles.logoArea}>
        <Image source={require('../../assets/logo.png')} style={styles.logoImg} resizeMode="contain" />
      </View>

      {/* Title — upper left area */}
      <View style={styles.titleArea}>
        <Text style={styles.titleWrap}>
          {item.titleParts.map((part, i) => (
            <Text
              key={i}
              style={part.bold ? styles.titleBold : styles.titleLight}
            >
              {part.text}
            </Text>
          ))}
        </Text>
      </View>

      {/* Emoji — overflow bottom right */}
      <View style={styles.emojiArea}>
        <FloatingEmoji emoji={item.emoji} fallbackEmoji={item.fallbackEmoji} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      {/* Fixed controls overlay */}
      <View style={styles.controls}>
        {/* Next circle button */}
        <TouchableOpacity onPress={goNext} style={styles.nextBtn} activeOpacity={0.8}>
          <Feather
            name={isLast ? 'check' : 'arrow-right'}
            size={18}
            color={Colors.white}
          />
        </TouchableOpacity>

        {/* Bottom row: Skip + dots */}
        <View style={styles.bottomRow}>
          {!isLast ? (
            <TouchableOpacity onPress={goToLogin}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}
          <View style={styles.dotsRow}>
            {slides.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === currentIndex ? styles.dotActive : styles.dotInactive]}
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  logoArea: {
    position: 'absolute',
    top: 56,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1,
  },
  logoImg: {
    width: 36,
    height: 36,
  },
  slide: {
    width,
    height,
    backgroundColor: Colors.white,
    overflow: 'hidden',
  },

  // Large opaque shade blobs
  blob1: {
    position: 'absolute',
    width: width * 1.6,
    height: width * 1.6,
    borderRadius: width * 0.8,
    backgroundColor: '#E0E4F0',
    opacity: 0.85,
    top: -width * 0.6,
    left: -width * 0.5,
  },
  blob2: {
    position: 'absolute',
    width: width * 1.4,
    height: width * 1.4,
    borderRadius: width * 0.7,
    backgroundColor: '#E8EAF4',
    opacity: 0.8,
    top: height * 0.2,
    right: -width * 0.5,
  },
  blob3: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: '#DEE2F0',
    opacity: 0.7,
    bottom: -width * 0.3,
    left: -width * 0.2,
  },

  // Title — top left
  titleArea: {
    position: 'absolute',
    top: height * 0.14,
    left: Spacing.xxl,
    right: width * 0.2,
  },
  titleWrap: {
    fontSize: 36,
    lineHeight: 44,
  },
  titleBold: {
    fontFamily: FontFamily.black,
    fontSize: 36,
    lineHeight: 44,
    color: Colors.navy,
  },
  titleLight: {
    fontFamily: FontFamily.regular,
    fontSize: 36,
    lineHeight: 44,
    color: Colors.navy,
  },

  // Emoji — dead center of screen, slightly below middle
  emojiArea: {
    position: 'absolute',
    top: height * 0.35,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiImage: {
    width: width * 0.95,
    height: width * 0.95,
  },
  emojiText: {
    fontSize: 180,
    opacity: 0.25,
  },

  // Fixed controls
  controls: {
    position: 'absolute',
    left: Spacing.xxl,
    right: Spacing.xxl,
    bottom: 0,
    paddingBottom: Spacing.huge + 16,
  },
  nextBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginBottom: Spacing.huge,
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipText: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: Colors.gray500,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    height: 4,
    borderRadius: 2,
  },
  dotActive: {
    width: 20,
    backgroundColor: Colors.navy,
  },
  dotInactive: {
    width: 8,
    backgroundColor: Colors.gray300,
  },
});
