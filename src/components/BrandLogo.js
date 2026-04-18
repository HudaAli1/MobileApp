import { Image, StyleSheet, View } from 'react-native';

export default function BrandLogo({ width = 200, height = 200, centered = true, style }) {
  return (
    <View style={[centered && styles.centered, style]}>
      <Image
        source={require('../../assets/updatedlogo.png')}
        style={[styles.logo, { width, height }]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
  },
  logo: {},
});
