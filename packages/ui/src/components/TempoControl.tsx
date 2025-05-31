'use client';

import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';

type TempoControlProps = {
  tempo: number;
  minTempo?: number;
  maxTempo?: number;
  onChange: (tempo: number) => void;
};

export const TempoControl: React.FC<TempoControlProps> = ({
  tempo,
  minTempo = 20,
  maxTempo = 240,
  onChange,
}) => {
  // テンポの増減
  const increaseTempo = () => {
    if (tempo < maxTempo) {
      onChange(tempo + 1);
    }
  };

  const decreaseTempo = () => {
    if (tempo > minTempo) {
      onChange(tempo - 1);
    }
  };

  return (
    <View className="flex flex-row items-center gap-4">
      <Pressable
        onPress={decreaseTempo}
        className="w-12 h-12 bg-surface rounded-full flex items-center justify-center"
      >
        <Text className="text-text text-2xl font-bold">-</Text>
      </Pressable>
      
      <View className="flex items-center">
        <Text className="text-text text-xl font-medium">テンポ</Text>
        <Text className="text-text text-3xl font-bold">{tempo}</Text>
        <Text className="text-text text-sm">BPM</Text>
      </View>
      
      <Pressable
        onPress={increaseTempo}
        className="w-12 h-12 bg-surface rounded-full flex items-center justify-center"
      >
        <Text className="text-text text-2xl font-bold">+</Text>
      </Pressable>
    </View>
  );
};

export default TempoControl;