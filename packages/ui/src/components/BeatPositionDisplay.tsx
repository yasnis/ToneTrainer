'use client';

import React from 'react';

interface BeatPositionDisplayProps {
  /**
   * 現在の小節番号
   */
  measure: number;
  
  /**
   * 現在の拍子位置
   */
  beat: number;
  
  /**
   * オプションのカスタムクラス名
   */
  className?: string;
}

/**
 * 拍子の位置を表示するコンポーネント
 * 「M 1 | B 1」形式で小節と拍を表示
 */
export const BeatPositionDisplay: React.FC<BeatPositionDisplayProps> = ({ 
  measure, 
  beat, 
  className = '' 
}) => {
  return (
    <div className={`text-lg font-medium ${className}`}>
      M {measure} | B {beat}
    </div>
  );
};