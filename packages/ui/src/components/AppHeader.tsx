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
  // Buy me a coffeeボタンのクリックを計測する関数
  const handleBuyMeCoffeeClick = () => {
    // Google Analyticsが利用可能な場合のみイベントを送信
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click', {
        event_category: 'engagement',
        event_label: 'buy_me_coffee',
        value: 1
      });
    }
  };

  return (
    <header className={`flex items-center justify-between p-4 pt-6 ${className}`}>
      {/* 左側のスペースを確保 */}
      <div className="w-7"></div>
      
      {/* ロゴ画像を中央に配置 - サイズを大きく */}
      <div className="flex-grow flex justify-center">
        <img 
          src="/images/logo.svg" 
          alt="Tone Trainer Logo" 
          className="h-10 w-auto"
        />
      </div>
      
      {/* Buy me a coffee リンク */}
      <a 
        href="https://buymeacoffee.com/sinsay" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center hover:opacity-80 transition-opacity mr-2"
        title="Buy me a coffee"
        onClick={handleBuyMeCoffeeClick}
      >
        <img 
          src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg" 
          alt="Buy me a coffee" 
          className="h-7 w-auto" 
        />
      </a>
    </header>
  );
};