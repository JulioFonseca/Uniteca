import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const Overlay = () => {
  const scanAreaSize = 300;
  const scanAreaTop = (height - scanAreaSize) / 2;
  const scanAreaLeft = (width - scanAreaSize) / 2;

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Top */}
      <View style={{ ...styles.overlay, height: scanAreaTop }} />

      {/* Middle */}
      <View style={{ flexDirection: 'row' }}>
        <View style={{ ...styles.overlay, width: scanAreaLeft, height: scanAreaSize }} />
        <View style={{ width: scanAreaSize, height: scanAreaSize }} />
        <View style={{ ...styles.overlay, width: scanAreaLeft, height: scanAreaSize }} />
      </View>

      {/* Bottom */}
      <View style={{ ...styles.overlay, height: scanAreaTop }} />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
