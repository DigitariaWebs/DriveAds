import { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../constants/Colors';

const { width } = Dimensions.get('window');

export default function Index() {
  const { role, isLoading } = useAuth();
  const [videoEnded, setVideoEnded] = useState(false);

  const player = useVideoPlayer(require('../assets/publeader.mp4'), (p) => {
    p.loop = false;
    p.muted = true;
    p.play();
  });

  // Fallback in case `playToEnd` never fires (corrupt file, etc.)
  const fallbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    fallbackTimer.current = setTimeout(() => setVideoEnded(true), 5000);
    return () => {
      if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
    };
  }, []);

  useEffect(() => {
    const sub = player.addListener('playToEnd', () => {
      if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
      setVideoEnded(true);
    });
    return () => sub.remove();
  }, [player]);

  useEffect(() => {
    if (isLoading || !videoEnded) return;

    if (!role) {
      router.replace('/(auth)/onboarding');
    } else if (role === 'driver') {
      router.replace('/(driver)/home');
    } else if (role === 'advertiser') {
      router.replace('/(advertiser)/home');
    } else if (role === 'partner') {
      router.replace('/(partner)/home');
    }
  }, [role, isLoading, videoEnded]);

  return (
    <View style={styles.container}>
      <VideoView
        player={player}
        style={styles.video}
        contentFit="contain"
        nativeControls={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1ED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width,
    height: width,
    backgroundColor: '#F1F1ED',
  },
});
