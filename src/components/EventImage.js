import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getEventImageSource } from '../utils/eventImages';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { typography } from '../constants/typography';

export default function EventImage({ event, style, compact = false }) {
  return (
    <ImageBackground source={getEventImageSource(event)} style={[styles.image, style]} imageStyle={styles.imageStyle}>
      <LinearGradient
        colors={['rgba(13, 26, 71, 0.08)', 'rgba(31, 60, 136, 0.72)']}
        style={styles.overlay}
      >
        <View style={styles.content}>
          <Text numberOfLines={compact ? 2 : 1} style={[styles.category, compact && styles.compactCategory]}>
            {event.category}
          </Text>
          <Text numberOfLines={compact ? 2 : 3} style={[styles.title, compact && styles.compactTitle]}>
            {event.title}
          </Text>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  image: {
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  imageStyle: {
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: spacing.md,
  },
  content: {
    gap: spacing.xs,
  },
  category: {
    ...typography.caption,
    color: colors.surface,
    fontWeight: '700',
  },
  compactCategory: {
    fontSize: 11,
  },
  title: {
    ...typography.cardTitle,
    color: colors.surface,
  },
  compactTitle: {
    fontSize: 15,
  },
});
