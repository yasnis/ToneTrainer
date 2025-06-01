'use client';

import React from 'react';
import { Pressable, Text } from 'react-native';
import { styled } from 'nativewind';

// NativeWindでスタイル付けするためにコンポーネントをラップ
const StyledPressable = styled(Pressable);
const StyledText = styled(Text);

type ButtonProps = {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
};

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'medium',
  disabled = false,
}) => {
  // バリアントに基づいたスタイルクラス
  const variantClasses = {
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    outline: 'bg-transparent border border-primary text-primary',
  };

  // サイズに基づいたスタイルクラス
  const sizeClasses = {
    small: 'py-1 px-2 text-sm',
    medium: 'py-2 px-4 text-base',
    large: 'py-3 px-6 text-lg',
  };

  // 無効状態のスタイル
  const disabledClasses = disabled ? 'opacity-50' : '';

  // ボタンのクラス
  const buttonClasses = `rounded ${variantClasses[variant]} ${disabledClasses}`;

  // テキストのクラス
  const textClasses = `font-medium ${
    variant === 'outline' ? 'text-primary' : 'text-white'
  } ${sizeClasses[size]}`;

  return (
    <StyledPressable
      onPress={onPress}
      disabled={disabled}
      className={buttonClasses}
      style={({ pressed }) => [
        pressed && { opacity: 0.8 },
      ]}
    >
      <StyledText className={textClasses}>{title}</StyledText>
    </StyledPressable>
  );
};

export default Button;