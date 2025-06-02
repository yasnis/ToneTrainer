'use client';

import React from 'react';
import { getAssetPath } from '@tone-trainer/core/src/utils';

interface AppHeaderProps {
  /**
   * オプションのカスタムクラス名
   */
  className?: string;
  /**
   * ヘルプボタンがクリックされたときに呼び出される関数
   */
  onHelpClick?: () => void;
}

/**
 * アプリケーションのヘッダーコンポーネント。
 * ロゴとTone Trainerのタイトル、ヘルプボタンを表示します。
 */
export const AppHeader: React.FC<AppHeaderProps> = ({ 
  className = '', 
  onHelpClick 
}) => {
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
    <header className={`relative flex items-center justify-between p-4 pt-6 ${className}`}>
      {/* 左側には何も置かない（スペース確保） */}
      <div className="w-7"></div>
      
      {/* ロゴ画像を画面中央に絶対配置 */}
      <div className="absolute left-0 right-0 top-6 flex justify-center pointer-events-none">
        <img 
          src={getAssetPath('/images/logo.svg')} 
          alt="Tone Trainer Logo" 
          className="h-10 w-auto"
        />
      </div>
      
      {/* 右側: ヘルプボタンとBuy me a coffeeリンク */}
      <div className="flex items-center gap-6 ml-auto">
        {/* ヘルプボタン - 背景を削除し、テキストのみに */}
        {onHelpClick && (
          <button 
            onClick={onHelpClick}
            className="text-gray-700 text-xl font-medium hover:text-gray-900 transition-colors"
            aria-label="ヘルプ"
            title="ヘルプを表示"
          >
            ?
          </button>
        )}
        
        {/* Buy me a coffee リンク */}
        <a 
          href="https://buymeacoffee.com/sinsay" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center hover:opacity-80 transition-opacity"
          title="Buy me a coffee"
          onClick={handleBuyMeCoffeeClick}
        >
          <img 
            src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg" 
            alt="Buy me a coffee" 
            className="h-7 w-auto" 
          />
        </a>
      </div>
    </header>
  );
};