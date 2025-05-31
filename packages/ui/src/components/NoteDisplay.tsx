'use client';

import React from 'react';

interface NoteDisplayProps {
  /**
   * 表示する音名
   */
  currentNote: string;

  /**
   * 次に表示される音名（オプション）
   */
  nextNote?: string;

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

  /**
   * 次の音名を表示するかどうか
   */
  showNextNote?: boolean;
}

/**
 * 音名を表示するコンポーネント
 * 現在の音名と次の音名（オプション）を表示します
 */
export const NoteDisplay: React.FC<NoteDisplayProps> = ({
  currentNote,
  nextNote,
  isPlaying = false,
  onTap,
  className = '',
  size = 'normal',
  showNextNote = true,
}) => {
  // サイズに基づいてフォントサイズクラスを決定
  const fontSizeClass = {
    normal: 'text-6xl',
    large: 'text-8xl',
    xlarge: 'text-9xl',
  }[size];

  // サイズに基づいてヒントテキストのフォントサイズを決定 - より小さく
  const hintSizeClass = {
    normal: 'text-2xs',
    large: 'text-xs',
    xlarge: 'text-xs',
  }[size];

  // サイズに基づいて次の音名のフォントサイズを決定
  const nextNoteSizeClass = {
    normal: 'text-xs',
    large: 'text-sm',
    xlarge: 'text-base',
  }[size];

  return (
    <div className={`relative ${className}`}>
      {/* メインコンテンツ - 現在の音名とヒント */}
      <div
        className="flex flex-col items-center justify-center z-10"
        onClick={onTap}
      >
        {/* 現在の音名表示 */}
        <div className={`${fontSizeClass} font-bold tracking-wider`}>
          {currentNote}
        </div>

        {/* 次の音名表示（showNextNoteがtrueの場合のみ表示） */}
        {showNextNote && nextNote && (
          <div className={`${nextNoteSizeClass} text-gray-400 mt-4`}>
            Next: <span className="font-medium">{nextNote}</span>
          </div>
        )}

        {/* ヒント表示 - より小さく、透明度を上げて控えめに */}
        <div className={`${hintSizeClass} text-gray-400 opacity-60 mt-1`}>
          {isPlaying ? 'Tap to Pause' : 'Tap to Start'}
        </div>
      </div>
    </div>
  );
};

export default NoteDisplay;