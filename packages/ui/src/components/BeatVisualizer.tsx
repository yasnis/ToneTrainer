'use client';

import React, { useEffect, useState } from 'react';

interface BeatVisualizerProps {
  /**
   * 現在再生中かどうか
   */
  isPlaying?: boolean;
  
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
  currentBeat = 1,
  bpm = 120,
  className = '',
}) => {
  // パルスアニメーションの状態
  const [isPulsing, setIsPulsing] = useState(false);
  // コンポーネント全体のサイズアニメーション状態
  const [isExpanding, setIsExpanding] = useState(false);
  
  // BPMからミリ秒単位の拍の長さを計算
  const beatDuration = 60000 / bpm;
  
  // 再生中かつ有効なBPMの場合にパルスアニメーションを処理
  useEffect(() => {
    if (!isPlaying || bpm <= 0) return;
    
    // 拍の開始時にパルスとサイズ拡大を開始
    setIsPulsing(true);
    setIsExpanding(true);
    
    // パルスアニメーションを終了するタイマー
    const pulseTimer = setTimeout(() => {
      setIsPulsing(false);
    }, beatDuration * 0.5);
    
    // サイズ拡大アニメーションを終了するタイマー
    const expandTimer = setTimeout(() => {
      setIsExpanding(false);
    }, beatDuration * 0.35);
    
    return () => {
      clearTimeout(pulseTimer);
      clearTimeout(expandTimer);
    };
  }, [isPlaying, currentBeat, bpm, beatDuration]);
  
  return (
    <div className={`relative ${className} transition-transform duration-200 
                    ${isExpanding ? 'scale-105' : 'scale-100'}`}>
      {/* 外側のリング - 上部をより薄くしたシャドウ */}
      <div 
        className={`w-full h-full rounded-full shadow-[0_8px_12px_rgba(0,0,0,0.05)]
                   flex items-center justify-center transition-all duration-500
                   ${currentBeat === 1 && isPulsing ? 'shadow-[0_0_20px_rgba(var(--color-primary),0.2)]' : ''}`}
      >
        {/* パルスリング - シャドウのみのアニメーションを使用 */}
        <div 
          className={`absolute inset-0 w-full h-full rounded-full
                     transition-all duration-300 
                     ${isPulsing ? 'shadow-[0_2px_14px_rgba(var(--color-primary),0.3)] opacity-80' : 'opacity-0'}`}
        />
        
        {/* 最初の拍を強調するリング - 最初の拍の場合に背景色とシャドウを表示 */}
        <div 
          className={`absolute inset-0 w-full h-full rounded-full
                     transition-all duration-300
                     ${currentBeat === 1 && isPulsing ? 'bg-primary/25 shadow-[0_2px_20px_rgba(var(--color-primary),0.4)] opacity-70' : 'bg-transparent opacity-0'}`}
        />
        
        {/* 中央の拍子表示用のスペース - BeatPositionDisplayを配置する場所 */}
        <div className={`w-full h-full flex items-center justify-center
                        ${currentBeat === 1 && isPulsing ? 'bg-primary/10 rounded-full' : ''}`}>
          {/* ここには別途BeatPositionDisplayコンポーネントが配置される想定 */}
        </div>
      </div>
    </div>
  );
};