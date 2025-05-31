'use client';

import React, { useEffect, useState } from 'react';

interface BeatVisualizerProps {
  /**
   * 現在再生中かどうか
   */
  isPlaying?: boolean;
  
  /**
   * 現在の拍子 (例: [4, 4] は 4/4拍子)
   */
  meter?: [number, number];
  
  /**
   * 現在の拍子位置 (1-indexed)
   */
  currentBeat?: number;
  
  /**
   * BPM (テンポ)
   */
  bpm?: number;
  
  /**
   * オプションのカスタムクラス名
   */
  className?: string;
}

/**
 * 拍子を視覚的に表現するパルスリングコンポーネント
 */
export const BeatVisualizer: React.FC<BeatVisualizerProps> = ({
  isPlaying = false,
  meter = [4, 4],
  currentBeat = 1,
  bpm = 120,
  className = '',
}) => {
  // パルスアニメーションの状態
  const [isPulsing, setIsPulsing] = useState(false);
  
  // BPMからミリ秒単位の拍の長さを計算
  const beatDuration = 60000 / bpm;
  
  // 再生中かつ有効なBPMの場合にパルスアニメーションを処理
  useEffect(() => {
    if (!isPlaying || bpm <= 0) return;
    
    // 拍の開始時にパルスを開始
    setIsPulsing(true);
    
    // パルスアニメーションを終了するタイマー
    const pulseTimer = setTimeout(() => {
      setIsPulsing(false);
    }, beatDuration * 0.3); // パルスは拍の30%の時間で終了
    
    return () => {
      clearTimeout(pulseTimer);
    };
  }, [isPlaying, currentBeat, bpm, beatDuration]);
  
  return (
    <div className={`relative ${className}`}>
      {/* 外側のリング - 常に表示 */}
      <div 
        className={`w-full  h-full  rounded-full border-2 border-gray-600 
                   flex items-center justify-center transition-all duration-300`}
      >
        {/* パルスリング - アニメーションするリング */}
        <div 
          className={`absolute inset-0 w-full  h-full rounded-full border-2
                     transition-all duration-300
                     ${isPulsing ? 'border-primary scale-95 opacity-80' : 'border-primary scale-100 opacity-0'}`}
        />
        
        {/* 最初の拍を強調するリング - 現在が最初の拍の場合に表示 */}
        <div 
          className={`absolute inset-0 w-full  h-full rounded-full border-4
                     transition-all duration-300
                     ${currentBeat === 1 && isPulsing ? 'border-primary scale-95 opacity-50' : 'border-primary scale-100 opacity-0'}`}
        />
        
        {/* 中央の拍子表示用のスペース - BeatPositionDisplayを配置する場所 */}
        <div className="w-24 h-24 flex items-center justify-center">
          {/* ここには別途BeatPositionDisplayコンポーネントが配置される想定 */}
        </div>
      </div>
    </div>
  );
};