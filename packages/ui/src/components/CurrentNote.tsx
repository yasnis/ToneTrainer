'use client';

import React from 'react';

interface CurrentNoteProps {
  /**
   * 表示する音名
   */
  note: string;
  /**
   * 再生中かどうか
   */
  isPlaying?: boolean;
  /**
   * タップ時のコールバック関数
   */
  onTap?: () => void;
  /**
   * オプションのカスタムクラス名
   */
  className?: string;
  /**
   * サイズ調整用のプロパティ
   */
  size?: 'normal' | 'large' | 'xlarge';
}

/**
 * 現在の音符を表示するコンポーネント
 */
export const CurrentNote: React.FC<CurrentNoteProps> = ({ 
  note, 
  isPlaying = false, 
  onTap, 
  className = '',
  size = 'normal'
}) => {
  // サイズに基づいてフォントサイズクラスを決定
  const fontSizeClass = {
    'normal': 'text-6xl',
    'large': 'text-7xl',
    'xlarge': 'text-8xl'
  }[size];
  
  // サイズに基づいてヒントテキストのフォントサイズを決定
  const hintSizeClass = {
    'normal': 'text-xs',
    'large': 'text-sm',
    'xlarge': 'text-base'
  }[size];
  
  return (
    <div className={`relative ${className}`}>
      {/* メインコンテンツ - 音名と使い方のヒント */}
      <div 
        className="flex flex-col items-center justify-center z-10"
        onClick={onTap}
      >
        {/* 音名表示 - サイズに応じたフォントサイズクラスを適用 */}
        <div className={`${fontSizeClass} font-bold`}>
          {note}
        </div>
        
        {/* ヒント表示 - サイズに応じたフォントサイズクラスを適用 */}
        <div className={`${hintSizeClass} text-gray-400 mt-2`}>
          {isPlaying ? "Tap to Pause" : "Tap to Start"}
        </div>
      </div>
    </div>
  );
};