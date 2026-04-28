import { Image, StyleSheet, View } from 'react-native';

const logoSource = require('../../assets/updatedlogo.png');

export default function BrandLogo({ width = 300, height = 300, centered = true, style }) {
  return (
    <View style={[centered && styles.centered, style]}>
      <View style={[styles.frame, { width, height }]}>
      <Image
        source={logoSource}
        fadeDuration={0}
        style={[
          styles.logo,
          {
            width: width * 1.42,
            height: height * 1.42,
            marginTop: -height * 0.16,
            marginLeft: -width * 0.06,
          },
        ]}
        resizeMode="contain"
      />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
  },
  frame: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    alignSelf: 'center',
  },
});
