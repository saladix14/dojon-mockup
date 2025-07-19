import React, { useEffect, useState } from 'react';
import { Image, View, StyleSheet } from 'react-native';

const frames = [
  require('./assets/web/images/slash1.png'),
  require('./assets/web/images/slash2.png'),
  require('./assets/web/images/slash3.png'),
  require('./assets/web/images/slash4.png'),
  require('./assets/web/images/slash5.png'),
  require('./assets/web/images/slash6.png'),
];

export default function SlashAnimation({ play }) {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    if (!play) return;

    let i = 0;
    const interval = setInterval(() => {
      setFrameIndex(i);
      i++;

      if (i >= frames.length) {
        clearInterval(interval);
        setTimeout(() => setFrameIndex(null), 100); // Oculta al terminar
      }
    }, 80); // velocidad por fotograma (ms)

    return () => clearInterval(interval);
  }, [play]);

  if (frameIndex === null) return null;

  return (
    <View style={styles.container}>
      <Image source={frames[frameIndex]} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute', // Para que se sobreponga al ataque
    top: 100,
    left: 100,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
});
