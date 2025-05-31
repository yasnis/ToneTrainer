'use client';

import React from 'react';

interface AppHeaderProps {
  /**
   * オプションのカスタムクラス名
   */
  className?: string;
}

/**
 * アプリケーションのヘッダーコンポーネント。
 * ロゴとTone Trainerのタイトルを表示します。
 */
export const AppHeader: React.FC<AppHeaderProps> = ({ className = '' }) => {
  return (
    <header className={`flex items-center p-4 bg-surface ${className}`}>
      {/* ロゴ - シンプルな音符アイコン */}
      <div className="mr-3 text-2xl text-primary">
        ♪
      </div>
      
      {/* アプリケーションタイトル */}
      <h1 className="text-xl font-bold text-text">Random Tone Trainer</h1>
    </header>
  );
};