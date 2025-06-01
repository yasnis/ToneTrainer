'use client';

import React from 'react';
import { View, Text } from 'react-native';
import { styled } from 'nativewind';

// NativeWindでスタイル付けするためにコンポーネントをラップ
const StyledView = styled(View);
const StyledText = styled(Text);

type FretboardDisplayProps = {
  selectedString?: number;
  selectedFret?: number;
  maxFrets?: number;
};

export const FretboardDisplay: React.FC<FretboardDisplayProps> = ({
  selectedString,
  selectedFret,
  maxFrets = 12,
}) => {
  // 標準チューニングでの弦の名前（低音から高音へ）
  const strings = ['E', 'A', 'D', 'G', 'B', 'E'];
  
  return (
    <StyledView className="w-full overflow-x-auto">
      <StyledView className="flex flex-col">
        {/* 弦を描画 */}
        {strings.map((stringName, stringIndex) => (
          <StyledView key={stringIndex} className="flex flex-row h-10 items-center border-b border-gray-600">
            {/* 開放弦（0フレット）*/}
            <StyledView className={`w-12 h-10 flex items-center justify-center border-r border-gray-600 ${
              selectedString === stringIndex + 1 && selectedFret === 0
                ? 'bg-primary bg-opacity-50'
                : ''
            }`}>
              <StyledText className="text-text">{stringName}</StyledText>
            </StyledView>
            
            {/* フレットを描画 */}
            {Array.from({ length: maxFrets }).map((_, fretIndex) => (
              <StyledView
                key={fretIndex}
                className={`w-12 h-10 flex items-center justify-center border-r border-gray-600 ${
                  selectedString === stringIndex + 1 && selectedFret === fretIndex + 1
                    ? 'bg-primary bg-opacity-50'
                    : ''
                }`}
              >
                <StyledText className="text-text">{fretIndex + 1}</StyledText>
              </StyledView>
            ))}
          </StyledView>
        ))}
      </StyledView>
    </StyledView>
  );
};

export default FretboardDisplay;