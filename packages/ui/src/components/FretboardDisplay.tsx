'use client';

import React from 'react';
import { View, Text } from 'react-native';

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
    <View className="w-full overflow-x-auto">
      <View className="flex flex-col">
        {/* 弦を描画 */}
        {strings.map((stringName, stringIndex) => (
          <View key={stringIndex} className="flex flex-row h-10 items-center border-b border-gray-600">
            {/* 開放弦（0フレット）*/}
            <View className={`w-12 h-10 flex items-center justify-center border-r border-gray-600 ${
              selectedString === stringIndex + 1 && selectedFret === 0
                ? 'bg-primary bg-opacity-50'
                : ''
            }`}>
              <Text className="text-text">{stringName}</Text>
            </View>
            
            {/* フレットを描画 */}
            {Array.from({ length: maxFrets }).map((_, fretIndex) => (
              <View
                key={fretIndex}
                className={`w-12 h-10 flex items-center justify-center border-r border-gray-600 ${
                  selectedString === stringIndex + 1 && selectedFret === fretIndex + 1
                    ? 'bg-primary bg-opacity-50'
                    : ''
                }`}
              >
                <Text className="text-text">{fretIndex + 1}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

export default FretboardDisplay;