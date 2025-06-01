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
   * 拍子（例: [4, 4] は4/4拍子）
   */
  meter: [number, number];
  
  /**
   * 何小節ごとに音が変わるか
   */
  changeEvery?: number;
  
  /**
   * オプションのカスタムクラス名
   */
  className?: string;
}

/**
 * 拍子の位置を視覚的に表示するコンポーネント
 * SVGドットを使って小節と拍を表現
 */
export const BeatPositionDisplay: React.FC<BeatPositionDisplayProps> = ({ 
  measure, 
  beat, 
  meter = [4, 4], 
  changeEvery = 1,
  className = '' 
}) => {
  // 小節内の合計拍数
  const totalBeats = meter[0];
  
  // ドットのサイズと間隔の設定
  const dotSize = 10;
  const dotSpacing = 16;
  const dotColor = "currentColor"; // カラーはcurrentColorを使用（親要素から継承）
  
  // 拍子の視覚的表現をSVGで生成
  const renderBeats = () => {
    const dots = [];
    const svgWidth = totalBeats * dotSpacing;
    
    for (let i = 1; i <= totalBeats; i++) {
      // 現在の拍より前または現在の拍なら塗りつぶし、それ以外は空白
      const isFilled = i <= beat;
      const xPosition = ((i - 1) * dotSpacing) + (dotSpacing / 2);
      
      dots.push(
        <circle 
          key={`beat-${i}`} 
          cx={xPosition} 
          cy={dotSize} 
          r={dotSize / 2} 
          stroke={dotColor} 
          strokeWidth="1" 
          fill={isFilled ? dotColor : "none"} 
          className="opacity-80"
        />
      );
    }
    
    return (
      <svg width={svgWidth} height={dotSize * 2} viewBox={`0 0 ${svgWidth} ${dotSize * 2}`}>
        {dots}
      </svg>
    );
  };

  // 小節の視覚的表現をSVGで生成
  const renderMeasures = () => {
    const dots = [];
    // 表示する小節数は changeEvery の値を使用
    const displayMeasures = changeEvery || 1; // 0以下や未定義の場合は1を使用
    const svgWidth = displayMeasures * dotSpacing;
    
    // 現在の小節のモジュロ値を計算（1〜changeEvery）
    const currentModuloMeasure = ((measure - 1) % displayMeasures) + 1;
    
    for (let i = 1; i <= displayMeasures; i++) {
      // シンプルな条件: i番目の丸が現在の小節以下なら塗りつぶす
      const isFilled = i <= currentModuloMeasure;
      
      const xPosition = ((i - 1) * dotSpacing) + (dotSpacing / 2);
      
      dots.push(
        <circle 
          key={`measure-${i}`} 
          cx={xPosition} 
          cy={dotSize} 
          r={dotSize / 2} 
          stroke={dotColor} 
          strokeWidth="1" 
          fill={isFilled ? dotColor : "none"} 
          className="opacity-80"
        />
      );
    }
    
    return (
      <svg width={svgWidth} height={dotSize * 2} viewBox={`0 0 ${svgWidth} ${dotSize * 2}`}>
        {dots}
      </svg>
    );
  };

  return (
    <div className={`font-medium text-text ${className}`}>
      <div className="flex items-center mb-1">
        {renderBeats()}
      </div>
      <div className="flex items-center">
        {renderMeasures()}
      </div>
    </div>
  );
};