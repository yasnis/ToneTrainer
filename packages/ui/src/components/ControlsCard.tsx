'use client';

import React, { useState, useEffect } from 'react';
import { NoteSelectorModal } from './NoteSelectorModal';

// ローカルストレージのキー
const STORAGE_KEY = 'toneTrainer_settings';

// 設定の型定義
interface Settings {
  bpm: number;
  meter: [number, number];
  voice: 'click' | 'wood' | 'beep';
  accent: boolean;
  changeEvery: number;
  selectedNotes: string[];
}

interface ControlsCardProps {
  /**
   * オプションのカスタムクラス名
   */
  className?: string;
  /**
   * 現在のBPM値
   */
  bpm?: number;
  /**
   * BPM変更時のコールバック
   */
  onBpmChange?: (bpm: number) => void;
  /**
   * 現在の拍子
   */
  meter?: [number, number];
  /**
   * 拍子変更時のコールバック
   */
  onMeterChange?: (meter: [number, number]) => void;
  /**
   * 選択された音声タイプ
   */
  voice?: 'click' | 'wood' | 'beep';
  /**
   * 音声タイプ変更時のコールバック
   */
  onVoiceChange?: (voice: 'click' | 'wood' | 'beep') => void;
  /**
   * アクセント有効フラグ
   */
  accent?: boolean;
  /**
   * アクセント変更時のコールバック
   */
  onAccentChange?: (accent: boolean) => void;
  /**
   * 音符変更間隔（小節単位）
   */
  changeEvery?: number;
  /**
   * 音符変更間隔変更時のコールバック
   */
  onChangeEveryChange?: (measures: number) => void;
  /**
   * 選択された音符リスト
   */
  selectedNotes?: string[];
  /**
   * 音符リスト変更時のコールバック
   */
  onSelectedNotesChange?: (notes: string[]) => void;
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
 * アプリケーションのコントロール部分を含むコンポーネント
 * BPMスライダー、拍子選択、音声選択、アクセント切り替え、ChangeEveryステッパーなどを含む
 */
export const ControlsCard: React.FC<ControlsCardProps> = ({ 
  className = '',
  bpm = 120,
  onBpmChange,
  meter = [4, 4],
  onMeterChange,
  voice = 'click',
  onVoiceChange,
  accent = true,
  onAccentChange,
  changeEvery = 1,
  onChangeEveryChange,
  selectedNotes: externalSelectedNotes,
  onSelectedNotesChange
}) => {
  // ローカルストレージから設定を読み込む
  const loadSettings = (): Settings | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEY);
      if (savedSettings) {
        return JSON.parse(savedSettings) as Settings;
      }
    } catch (error) {
      console.error('Failed to load settings from localStorage:', error);
    }
    return null;
  };

  // ローカルストレージに設定を保存する
  const saveSettings = (settings: Settings) => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings to localStorage:', error);
    }
  };

  // 内部状態と外部状態の連携
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState(externalSelectedNotes || ['C', 'D♯', 'G', 'A']);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bpmValue, setBpmValue] = useState(bpm.toString());
  const [localMeter, setLocalMeter] = useState<[number, number]>(meter);
  const [localVoice, setLocalVoice] = useState<'click' | 'wood' | 'beep'>(voice);
  const [localAccent, setLocalAccent] = useState<boolean>(accent);
  const [localChangeEvery, setLocalChangeEvery] = useState<number>(changeEvery);

  // コンポーネントマウント時にローカルストレージから設定を読み込む
  useEffect(() => {
    const savedSettings = loadSettings();
    if (savedSettings) {
      // 保存された設定をローカル状態に反映
      setBpmValue(savedSettings.bpm.toString());
      setLocalMeter(savedSettings.meter);
      setLocalVoice(savedSettings.voice);
      setLocalAccent(savedSettings.accent);
      setLocalChangeEvery(savedSettings.changeEvery);
      setSelectedNotes(savedSettings.selectedNotes);
      
      // 親コンポーネントにも通知
      if (onBpmChange) onBpmChange(savedSettings.bpm);
      if (onMeterChange) onMeterChange(savedSettings.meter);
      if (onVoiceChange) onVoiceChange(savedSettings.voice);
      if (onAccentChange) onAccentChange(savedSettings.accent);
      if (onChangeEveryChange) onChangeEveryChange(savedSettings.changeEvery);
      if (onSelectedNotesChange) onSelectedNotesChange(savedSettings.selectedNotes);
    } else {
      // 保存された設定がない場合は、propsの値をローカル状態に反映
      setSelectedNotes(externalSelectedNotes || ['C', 'D♯', 'G', 'A']);
    }
    setIsInitialized(true);
  }, []);

  // 設定が変更されたときにローカルストレージに保存する
  useEffect(() => {
    // 初期化が完了していない場合は保存しない
    if (!isInitialized) return;
    
    const currentSettings: Settings = {
      bpm: parseInt(bpmValue, 10),
      meter: localMeter,
      voice: localVoice,
      accent: localAccent,
      changeEvery: localChangeEvery,
      selectedNotes: selectedNotes
    };
    
    saveSettings(currentSettings);
  }, [bpmValue, localMeter, localVoice, localAccent, localChangeEvery, selectedNotes, isInitialized]);

  // ノートセレクターモーダルの開閉
  const openNoteSelector = () => {
    setIsModalOpen(true);
  };

  const closeNoteSelector = () => {
    setIsModalOpen(false);
  };

  // 選択音符の保存処理
  const handleSaveNotes = (notes: string[]) => {
    setSelectedNotes(notes);
    // 親コンポーネントにも通知
    if (onSelectedNotesChange) {
      onSelectedNotesChange(notes);
    }
  };

  // BPM変更ハンドラー
  const handleBpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBpm = parseInt(e.target.value, 10);
    setBpmValue(newBpm.toString());
    if (onBpmChange) {
      onBpmChange(newBpm);
    }
  };

  // 拍子変更ハンドラー
  const handleMeterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [numerator, denominator] = e.target.value.split('/').map(Number);
    const newMeter: [number, number] = [numerator, denominator];
    setLocalMeter(newMeter);
    if (onMeterChange) {
      onMeterChange(newMeter);
    }
  };

  // 音声タイプ変更ハンドラー
  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newVoice = e.target.value as 'click' | 'wood' | 'beep';
    setLocalVoice(newVoice);
    if (onVoiceChange) {
      onVoiceChange(newVoice);
    }
  };

  // アクセント変更ハンドラー
  const handleAccentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAccent = e.target.checked;
    setLocalAccent(newAccent);
    if (onAccentChange) {
      onAccentChange(newAccent);
    }
  };

  // 音符変更間隔の増減ハンドラー
  const decreaseChangeEvery = () => {
    if (localChangeEvery > 1) {
      const newChangeEvery = localChangeEvery - 1;
      setLocalChangeEvery(newChangeEvery);
      if (onChangeEveryChange) {
        onChangeEveryChange(newChangeEvery);
      }
    }
  };

  const increaseChangeEvery = () => {
    const newChangeEvery = localChangeEvery + 1;
    setLocalChangeEvery(newChangeEvery);
    if (onChangeEveryChange) {
      onChangeEveryChange(newChangeEvery);
    }
  };

  return (
    <div className={`bg-gradient-light rounded-lg p-4 shadow-card ${className}`}>
      {/* NotesとEditButtonを1行に配置 */}
      <div className="flex items-center gap-2 mb-3">
        <label className="text-xs font-medium text-text w-16">
          Notes
        </label>
        <div className="flex-1 flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {selectedNotes.map((note) => {
              const { root, chordType } = splitChordName(note);
              
              return (
                <span key={note} className="bg-primary bg-opacity-20 px-2 py-1 rounded text-sm flex items-baseline">
                  {root}
                  {chordType && (
                    <span className="text-sm text-text opacity-70 ml-0.5">
                      {chordType}
                    </span>
                  )}
                </span>
              );
            })}
          </div>
          <button 
            onClick={openNoteSelector}
            className="bg-surface hover:bg-gray-100 p-2 rounded-full transition-colors ml-2"
            aria-label="Edit notes"
          >
            ✏️
          </button>
        </div>
      </div>
      
      {/* その他のコントロール - ラベルとUIを左右に配置 */}
      <div className="space-y-3">
        {/* BPM スライダー */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-text w-16">
            Tempo
          </label>
          <div className="flex-1 flex items-center">
            <input 
              type="range" 
              min="20" 
              max="240" 
              value={bpmValue}
              onChange={handleBpmChange}
              className="flex-1 accent-primary"
            />
            <span className="text-xs ml-2 whitespace-nowrap min-w-[30px] text-right text-text">{bpmValue} BPM</span>
          </div>
        </div>
        
        {/* Meter と Voice を1行に配置 */}
        <div className="flex gap-4">
          {/* 拍子選択 */}
          <div className="flex items-center gap-2 flex-1">
            <label className="text-xs font-medium text-text w-16">
              Meter
            </label>
            <select 
              className="flex-1 bg-white border border-gray-200 rounded px-2 py-1 text-sm text-text"
              value={`${localMeter[0]}/${localMeter[1]}`}
              onChange={handleMeterChange}
            >
              <option value="4/4">4/4</option>
              <option value="3/4">3/4</option>
              <option value="2/4">2/4</option>
              <option value="6/8">6/8</option>
            </select>
          </div>
          
          {/* 音声選択 */}
          <div className="flex items-center gap-2 flex-1">
            <label className="text-xs font-medium text-text w-16">
              Voice
            </label>
            <select 
              className="flex-1 bg-white border border-gray-200 rounded px-2 py-1 text-sm text-text"
              value={localVoice}
              onChange={handleVoiceChange}
            >
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
            <label className="text-xs font-medium text-text w-16">
              Accent
            </label>
            <div className="flex-1">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={localAccent}
                  onChange={handleAccentChange}
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
          
          {/* ChangeEvery */}
          <div className="flex items-center gap-2 flex-1">
            <label className="text-xs font-medium text-text w-16">
              Change
            </label>
            <div className="flex flex-1">
              <button 
                className="bg-white border border-gray-200 px-2 py-0 rounded-l text-sm text-text"
                onClick={decreaseChangeEvery}
                disabled={localChangeEvery <= 1}
              >-</button>
              <span className="bg-white border-t border-b border-gray-200 px-3 py-0 flex items-center justify-center text-sm min-w-[30px] text-text">
                {localChangeEvery}
              </span>
              <button 
                className="bg-white border border-gray-200 px-2 py-0 rounded-r text-sm text-text"
                onClick={increaseChangeEvery}
              >+</button>
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