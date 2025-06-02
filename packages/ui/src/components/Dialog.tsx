"use client";

import React from 'react';
import { View, Modal, Pressable, StyleSheet, useWindowDimensions } from 'react-native';

type DialogProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export const Dialog: React.FC<DialogProps> = ({ open, onClose, children }) => {
  const { width, height } = useWindowDimensions();

  return (
    <Modal
      visible={open}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={[styles.content, { maxWidth: width, maxHeight: height * 0.9 }]}>
          {children}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  content: {
    zIndex: 1,
    elevation: 5,
    overflow: 'hidden',
  },
});