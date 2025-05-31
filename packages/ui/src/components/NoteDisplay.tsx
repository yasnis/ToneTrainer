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
 * コード名を分解して、ルート音とコードタイプに分ける
 * 例: "Cmaj7" -> { root: "C", chordType: "maj7" }
 */
const splitChordName = (noteName: string): { root: string; chordType: string | null } => {
  // コードタイプの一覧 - 長いものから順に検索するため、長さでソート
  const chordTypes = ['m7(b5)', 'maj7', 'dim7', 'm7', '7'];
  
  // コードタイプを検出
  for (const type of chordTypes) {
    if (noteName.endsWith(type)) {
      return {
        root: noteName.substring(0, noteName.length - type.length),
        chordType: type,
      };
    }
  }
  
  // コードタイプが見つからない場合は単音として扱う
  return {
    root: noteName,
    chordType: null,
  };
};

/**
 * 音名を分解して、基本音と修飾子（#やb）に分ける
 * 例: "C#" -> { base: "C", modifier: "#" }
 */
const splitNoteName = (name: string): { base: string; modifier: string | null } => {
  // #やbを含む場合
  if (name.includes('#') || name.includes('b')) {
    return {
      base: name.charAt(0),
      modifier: name.substring(1)
    };
  }
  
  // 修飾子なしの場合
  return {
    base: name,
    modifier: null
  };
};

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
    normal: 'text-2xl',
    large: 'text-3xl',
    xlarge: 'text-4xl',
  }[size];
  
  // サイズに基づいてコードタイプのフォントサイズを決定
  const chordTypeSizeClass = {
    normal: 'text-4xl',
    large: 'text-5xl',
    xlarge: 'text-6xl',
  }[size];

  // 現在の音名を分解
  const { root: currentRoot, chordType: currentChordType } = splitChordName(currentNote);
  
  // 次の音名を分解（存在する場合）
  const { root: nextRoot, chordType: nextChordType } = nextNote ? splitChordName(nextNote) : { root: '', chordType: null };

  return (
    <div className={`relative ${className}`}>
      {/* メインコンテンツ - 現在の音名とヒント */}
      <div
        className="flex flex-col items-center justify-center z-10"
        onClick={onTap}
      >
        {/* 現在の音名表示 */}
        <div className="flex items-baseline">
          <span className={`${fontSizeClass} font-bold tracking-tighter`}>
            {currentRoot}
          </span>
          {currentChordType && (
            <span className={`${chordTypeSizeClass} font-medium ml-1 text-gray-300`}>
              {currentChordType}
            </span>
          )}
        </div>

        {/* 次の音名表示（showNextNoteがtrueの場合のみ表示） */}
        {showNextNote && nextNote && (
          <div className="mt-1 flex items-baseline">
            <span className={`${nextNoteSizeClass} font-medium flex items-baseline tracking-tighter`}>
              {nextRoot}
              {nextChordType && (
                <span className="text-xl ml-0.5 text-gray-500">
                  {nextChordType}
                </span>
              )}
            </span>
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