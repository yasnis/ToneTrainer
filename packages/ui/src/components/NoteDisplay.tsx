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
    normal: 'text-5xl', // 1段階大きく
    large: 'text-7xl',  // 1段階大きく
    xlarge: 'text-8xl', // 1段階大きく
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
    normal: 'text-2xl', // 1段階大きく
    large: 'text-3xl',  // 1段階大きく
    xlarge: 'text-5xl', // 1段階大きく
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
        {/* 次の音名表示（showNextNoteがtrueの場合のみ表示） - Baloo 2フォントを適用（400ウェイト） */}
        {showNextNote && nextNote && (
          <div className="flex items-baseline">
            <span 
              className={`${nextNoteSizeClass} font-normal flex items-baseline tracking-tighter text-text font-baloo`}
              style={{ fontFamily: "var(--font-baloo-2), cursive", fontWeight: 400 }}
            >
              {nextRoot}
              {nextChordType && (
                <span 
                  className="text-xl ml-0.5 text-text opacity-70 font-baloo"
                  style={{ fontFamily: "var(--font-baloo-2), cursive", fontWeight: 400 }}
                >
                  {nextChordType}
                </span>
              )}
            </span>
          </div>
        )}

        {/* 現在の音名表示 - Baloo 2フォントを適用（400ウェイト） */}
        <div className="flex items-baseline">
          <span 
            className={`${fontSizeClass} font-normal tracking-tighter text-textDark font-baloo`}
            style={{ fontFamily: "var(--font-baloo-2), cursive", fontWeight: 400 }}
          >
            {currentRoot}
          </span>
          {currentChordType && (
            <span 
              className={`${chordTypeSizeClass} font-normal text-text font-baloo`}
              style={{ fontFamily: "var(--font-baloo-2), cursive", fontWeight: 400 }}
            >
              {currentChordType}
            </span>
          )}
        </div>

        {/* ヒント表示 - より小さく、透明度を上げて控えめに */}
        <div className={`${hintSizeClass} text-text opacity-60`}>
          {isPlaying ? 'Tap to Pause' : 'Tap to Start'}
        </div>
      </div>
    </div>
  );
};

export default NoteDisplay;