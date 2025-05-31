'use client';

import React, { useState } from 'react';
import { NoteSelectorModal } from './NoteSelectorModal';

interface ControlsCardProps {
  /**
   * オプションのカスタムクラス名
   */
  className?: string;
}

/**
 * アプリケーションのコントロール部分を含むコンポーネント
 * BPMスライダー、拍子選択、音声選択、アクセント切り替え、ChangeEveryステッパーなどを含む
 */
export const ControlsCard: React.FC<ControlsCardProps> = ({ className = '' }) => {
  // 選択済み音名リスト（実際の実装ではZustandから取得）
  const [selectedNotes, setSelectedNotes] = useState(['C', 'D♯', 'G', 'A']);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openNoteSelector = () => {
    setIsModalOpen(true);
  };

  const closeNoteSelector = () => {
    setIsModalOpen(false);
  };

  const handleSaveNotes = (notes: string[]) => {
    setSelectedNotes(notes);
    // 実際の実装ではZustandストアに保存
  };

  return (
    <div className={`bg-surface rounded-lg p-4 shadow-md ${className}`}>
      {/* NotesとEditButtonを1行に配置 */}
      <div className="flex items-center gap-2 mb-3">
        <label className="text-xs font-medium text-gray-400 w-16">
          Notes
        </label>
        <div className="flex-1 flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {selectedNotes.map((note) => (
              <span key={note} className="bg-primary bg-opacity-20 px-2 py-1 rounded text-sm">
                {note}
              </span>
            ))}
          </div>
          <button 
            onClick={openNoteSelector}
            className="bg-surface hover:bg-gray-700 p-2 rounded-full transition-colors ml-2"
            aria-label="Edit notes"
          >
            ✏️
          </button>
        </div>
      </div>
      
      {/* その他のコントロール（仮実装） - ラベルとUIを左右に配置 */}
      <div className="space-y-3">
        {/* BPM スライダー */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-400 w-16">
            Tempo
          </label>
          <div className="flex-1 flex items-center">
            <input 
              type="range" 
              min="20" 
              max="240" 
              defaultValue="120"
              className="flex-1 accent-primary"
            />
            <span className="text-xs ml-2 w-12">120 BPM</span>
          </div>
        </div>
        
        {/* Meter と Voice を1行に配置 */}
        <div className="flex gap-4">
          {/* 拍子選択 */}
          <div className="flex items-center gap-2 flex-1">
            <label className="text-xs font-medium text-gray-400 w-16">
              Meter
            </label>
            <select className="flex-1 bg-surface border border-gray-600 rounded px-2 py-1 text-sm">
              <option value="4/4">4/4</option>
              <option value="3/4">3/4</option>
              <option value="2/4">2/4</option>
            </select>
          </div>
          
          {/* 音声選択 */}
          <div className="flex items-center gap-2 flex-1">
            <label className="text-xs font-medium text-gray-400 w-16">
              Voice
            </label>
            <select className="flex-1 bg-surface border border-gray-600 rounded px-2 py-1 text-sm">
              <option value="click">Click</option>
              <option value="wood">Wood</option>
              <option value="beep">Beep</option>
            </select>
          </div>
        </div>
        
        {/* Accent と ChangeEvery を1行に配置 */}
        <div className="flex gap-4">
          {/* アクセント切り替え */}
          <div className="flex items-center gap-2 flex-1">
            <label className="text-xs font-medium text-gray-400 w-16">
              Accent
            </label>
            <div className="flex-1">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
          
          {/* ChangeEvery */}
          <div className="flex items-center gap-2 flex-1">
            <label className="text-xs font-medium text-gray-400 w-16">
              Change
            </label>
            <div className="flex flex-1">
              <button className="bg-surface border border-gray-600 px-2 py-0 rounded-l text-sm">-</button>
              <span className="bg-surface border-t border-b border-gray-600 px-3 py-0 flex items-center text-sm">1</span>
              <button className="bg-surface border border-gray-600 px-2 py-0 rounded-r text-sm">+</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 分離したNoteSelectorModalコンポーネントを使用 */}
      <NoteSelectorModal
        selectedNotes={selectedNotes}
        isOpen={isModalOpen}
        onClose={closeNoteSelector}
        onSave={handleSaveNotes}
      />
    </div>
  );
};