import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
  LayoutChangeEvent,
} from 'react-native';
import { Screen } from '../../components/Screen';
import { AppLogo } from '../../components/AppLogo';
import { Button } from '../../components/Button';
import { COLORS, FONTS } from '../../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingScreenProps {
  onComplete: () => void;
}

type Slide = {
  id: number;
  title: string;
  description: string;
  image: number;
};

const slides: Slide[] = [
  {
    id: 1,
    title: "Gagnez de l'argent avec votre voiture",
    description:
      'Rejoignez des campagnes publicitaires et soyez rémunéré en conduisant normalement.',
    image: require('../../assets/Make-It-Rain--Streamline-Brooklyn.png'),
  },
  {
    id: 2,
    title: 'Recevez des invitations',
    description:
      'Soyez notifié lorsque de nouvelles campagnes sont disponibles dans votre ville.',
    image: require('../../assets/Subscribe-3--Streamline-Brooklyn.png'),
  },
  {
    id: 3,
    title: 'Acceptez et participez',
    description:
      'Choisissez les campagnes qui vous conviennent et commencez à gagner facilement.',
    image: require('../../assets/Mobile-Ads--Streamline-Brooklyn.png'),
  },
  {
    id: 4,
    title: 'Suivez vos gains en direct',
    description:
      'Surveillez vos campagnes terminées et vos paiements en temps réel.',
    image: require('../../assets/Hot-Trending-3--Streamline-Brooklyn.png'),
  },
];

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [listHeight, setListHeight] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  const handleListLayout = (e: LayoutChangeEvent) => {
    setListHeight(e.nativeEvent.layout.height);
  };

  const renderItem = ({ item }: { item: Slide }) => (
    <View
      style={{
        width: SCREEN_WIDTH,
        height: listHeight,
        alignItems: 'center',
        paddingHorizontal: 28,
      }}
    >
      {/* Illustration */}
      <View
        style={{
          width: '100%',
          aspectRatio: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          source={item.image}
          style={{ width: '100%', height: '100%' }}
          resizeMode="contain"
        />
      </View>

      {/* Text */}
      <View style={{ marginTop: 20, alignItems: 'center' }}>
        <Text
          style={{
            fontFamily: FONTS.black,
            fontSize: 26,
            lineHeight: 34,
            color: COLORS.navy,
            textAlign: 'center',
            letterSpacing: -0.5,
          }}
        >
          {item.title}
        </Text>
        <Text
          style={{
            fontFamily: FONTS.regular,
            fontSize: 15,
            lineHeight: 23,
            color: COLORS.gray500,
            textAlign: 'center',
            marginTop: 14,
            paddingHorizontal: 8,
          }}
        >
          {item.description}
        </Text>
      </View>
    </View>
  );

  const isLast = currentIndex === slides.length - 1;

  return (
    <Screen>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: 16,
          paddingRight: 24,
          paddingTop: 4,
          paddingBottom: 4,
        }}
      >
        <AppLogo size="xl" />
        {!isLast && (
          <TouchableOpacity onPress={onComplete} hitSlop={14}>
            <Text
              style={{
                fontFamily: FONTS.semibold,
                color: COLORS.navy,
                fontSize: 14,
                
              }}
            >
              Passer
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Slides */}
      <View style={{ flex: 1 }} onLayout={handleListLayout}>
        {listHeight > 0 && (
          <FlatList
            ref={flatListRef}
            data={slides}
            renderItem={renderItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            bounces={false}
            keyExtractor={(item) => item.id.toString()}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / SCREEN_WIDTH
              );
              setCurrentIndex(index);
            }}
          />
        )}
      </View>

      {/* Footer */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 28 }}>
        {/* Dots */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          {slides.map((_, index) => (
            <View
              key={index}
              style={{
                height: 8,
                width: index === currentIndex ? 28 : 8,
                borderRadius: 4,
                marginHorizontal: 4,
                backgroundColor:
                  index === currentIndex ? COLORS.navy : COLORS.gray200,
              }}
            />
          ))}
        </View>

        {/* CTA */}
        <Button
          fullWidth
          size="lg"
          onPress={handleNext}
          icon="arrow-forward"
          iconPosition="right"
        >
          {isLast ? 'Commencer' : 'Suivant'}
        </Button>
      </View>
    </Screen>
  );
}
