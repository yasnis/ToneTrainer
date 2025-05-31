'use client';

import React from 'react';

interface NextNoteProps {
  /**
   * 次に表示される音名
   */
  note: string;
  
  /**
   * オプションのカスタムクラス名
   */
  className?: string;
}

/**
 * 次に表示される音名を表示するコンポーネント
 */
export const NextNote: React.FC<NextNoteProps> = ({ 
  note, 
  className = '' 
}) => {
  return (
    <div className={`text-gray-400 ${className}`}>
      Next: <span className="font-medium">{note}</span>
    </div>
  );
};