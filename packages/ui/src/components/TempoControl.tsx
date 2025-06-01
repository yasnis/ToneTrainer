'use client';

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { styled } from 'nativewind';

// NativeWindでスタイル付けするためにコンポーネントをラップ
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);

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
    <StyledView className="flex flex-row items-center gap-4">
      <StyledPressable
        onPress={decreaseTempo}
        className="w-12 h-12 bg-surface rounded-full flex items-center justify-center"
      >
        <StyledText className="text-text text-2xl font-bold">-</StyledText>
      </StyledPressable>
      
      <StyledView className="flex items-center">
        <StyledText className="text-text text-xl font-medium">テンポ</StyledText>
        <StyledText className="text-text text-3xl font-bold">{tempo}</StyledText>
        <StyledText className="text-text text-sm">BPM</StyledText>
      </StyledView>
      
      <StyledPressable
        onPress={increaseTempo}
        className="w-12 h-12 bg-surface rounded-full flex items-center justify-center"
      >
        <StyledText className="text-text text-2xl font-bold">+</StyledText>
      </StyledPressable>
    </StyledView>
  );
};

export default TempoControl;