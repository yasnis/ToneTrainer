'use client';

import React, { useState, useEffect } from 'react';

// 音符の定義（Aから始まる順序、#とbの両方を含む）
const ALL_NOTES = ['A', 'A#', 'Bb', 'B', 'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab'];

// ルート音（#とbを別々の音名として扱う、Aから始まる順序）
const ROOT_NOTES = [
  'A', 
  'A#', 'Bb',
  'B', 
  'C', 
  'C#', 'Db',
  'D', 
  'D#', 'Eb',
  'E', 
  'F', 
  'F#', 'Gb',
  'G', 
  'G#', 'Ab'
];

// コードタイプ
const CHORD_TYPES = ['maj7', '7', 'm7', 'm7(b5)', 'dim7'];

// タブの種類
type TabType = 'notes' | 'chords';

// コード名を生成する関数（保存用）
const getChordName = (root: string, type: string): string => {
  return `${root}${type}`;
};

/**
 * コード名を分解してルート音とコードタイプに分ける関数
 */
const splitChordName = (chordName: string): { root: string; type: string | null } => {
  // コードタイプの一覧 - 長いものから順に検索
  const sortedChordTypes = ['m7(b5)', 'maj7', 'dim7', 'm7', '7'];
  
  for (const type of sortedChordTypes) {
    if (chordName.endsWith(type)) {
      return {
        root: chordName.substring(0, chordName.length - type.length),
        type: type
      };
    }
  }
  return { root: chordName, type: null };
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
 * コード名を表示するコンポーネント
 * ルート音とコードタイプを別々のスタイルで表示
 */
const ChordDisplay: React.FC<{ chord: string }> = ({ chord }) => {
  const { root, type } = splitChordName(chord);
  
  return (
    <span className="flex items-baseline">
      {root}
      {type && (
        <span className="text-sm text-gray-400 ml-0.5">
          {type}
        </span>
      )}
    </span>
  );
};

interface NoteSelectorModalProps {
  /**
   * 現在選択されている音符のリスト
   */
  selectedNotes: string[];

  /**
   * モーダルが開いているかどうか
   */
  isOpen: boolean;

  /**
   * モーダルを閉じる際のコールバック
   */
  onClose: () => void;

  /**
   * 音符の選択が変更された際のコールバック
   */
  onSave: (notes: string[]) => void;
}

/**
 * 音符選択用のモーダルコンポーネント
 * タブで単音名とコード名を切り替え可能
 * 各タブは3×4または縦型レイアウトのグリッドで表示し、「すべて選択」「クリア」「保存」ボタンを持つ
 */
export const NoteSelectorModal: React.FC<NoteSelectorModalProps> = ({
  selectedNotes,
  isOpen,
  onClose,
  onSave,
}) => {
  // 現在のタブ
  const [activeTab, setActiveTab] = useState<TabType>('notes');
  
  // 内部状態として選択中の音符とコードを管理
  const [selectedSingleNotes, setSelectedSingleNotes] = useState<string[]>([]);
  const [selectedChords, setSelectedChords] = useState<string[]>([]);

  // モーダルが開かれたときに初期値を設定
  useEffect(() => {
    if (isOpen) {
      // 選択済みのアイテムを単音とコードに分類
      const notes: string[] = [];
      const chords: string[] = [];
      
      selectedNotes.forEach(item => {
        // コード形式かどうかをチェック（例: Cmaj7, D7など）
        const isChord = CHORD_TYPES.some(type => {
          return item.endsWith(type) && 
                 ROOT_NOTES.some(root => {
                   const rootBase = root.split('/')[0];
                   return item.startsWith(rootBase);
                 });
        });
        
        if (isChord) {
          chords.push(item);
        } else if (ALL_NOTES.includes(item)) {
          notes.push(item);
        }
      });
      
      setSelectedSingleNotes(notes);
      setSelectedChords(chords);
    }
  }, [isOpen, selectedNotes]);
  
  // 単音の選択状態を切り替える
  const toggleNote = (note: string) => {
    if (selectedSingleNotes.includes(note)) {
      setSelectedSingleNotes(selectedSingleNotes.filter((n) => n !== note));
    } else {
      setSelectedSingleNotes([...selectedSingleNotes, note]);
    }
  };
  
  // コードの選択状態を切り替える
  const toggleChord = (root: string, type: string) => {
    const chordName = getChordName(root, type);
    
    if (selectedChords.includes(chordName)) {
      setSelectedChords(selectedChords.filter((c) => c !== chordName));
    } else {
      setSelectedChords([...selectedChords, chordName]);
    }
  };

  // すべての単音を選択
  const selectAllNotes = () => {
    setSelectedSingleNotes([...ALL_NOTES]);
  };

  // すべてのコードを選択
  const selectAllChords = () => {
    // すべてのルート音とコードタイプの組み合わせを選択
    const allChords: string[] = [];
    ROOT_NOTES.forEach(root => {
      CHORD_TYPES.forEach(type => {
        allChords.push(getChordName(root, type));
      });
    });
    setSelectedChords(allChords);
  };

  // 単音の選択をクリア
  const clearNotes = () => {
    setSelectedSingleNotes([]);
  };
  
  // コードの選択をクリア
  const clearChords = () => {
    setSelectedChords([]);
  };

  // 現在のタブに基づいて選択をすべて選択/クリアする
  const selectAll = () => {
    if (activeTab === 'notes') {
      selectAllNotes();
    } else {
      selectAllChords();
    }
  };
  
  const clearSelection = () => {
    if (activeTab === 'notes') {
      clearNotes();
    } else {
      clearChords();
    }
  };

  // 保存して閉じる
  const handleSave = () => {
    // 単音とコードを結合
    const combinedSelection = [...selectedSingleNotes, ...selectedChords];
    
    // 少なくとも1つのアイテムが選択されていることを確認
    if (combinedSelection.length === 0) {
      // 何も選択されていない場合は、デフォルトでCを選択
      onSave(['C']);
    } else {
      onSave(combinedSelection);
    }
    onClose();
  };

  // キャンセル時は元の選択に戻す
  const handleCancel = () => {
    onClose();
  };

  // コードが選択されているかチェック
  const isChordSelected = (root: string, type: string): boolean => {
    const chordName = getChordName(root, type);
    return selectedChords.includes(chordName);
  };

  // モーダルが閉じている場合は何も表示しない
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-surface p-4 rounded-lg w-[500px] max-w-[95vw]">
        <h2 className="text-lg font-medium mb-4">Select Notes/Chords</h2>
        
        {/* タブ切り替え */}
        <div className="flex border-b border-gray-600 mb-4">
          <button
            className={`px-4 py-2 ${
              activeTab === 'notes'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-400'
            }`}
            onClick={() => setActiveTab('notes')}
          >
            Notes
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === 'chords'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-400'
            }`}
            onClick={() => setActiveTab('chords')}
          >
            Chords
          </button>
        </div>
        
        {/* 単音選択画面 */}
        {activeTab === 'notes' && (
          <div className="grid grid-cols-4 gap-2 mb-4">
            {ALL_NOTES.map((note) => (
              <button 
                key={note}
                onClick={() => toggleNote(note)}
                className={`p-2 rounded ${
                  selectedSingleNotes.includes(note) ? 'bg-primary' : 'bg-gray-700'
                } transition-colors text-sm`}
              >
                {note}
              </button>
            ))}
          </div>
        )}
        
        {/* コード選択画面 - 縦型レイアウト（#とbを別々の行に表示） */}
        {activeTab === 'chords' && (
          <div className="mb-4 max-h-[350px] overflow-y-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-gray-700">
                  <th className="py-2 text-left pl-2 w-[25%]">Root</th>
                  {CHORD_TYPES.map(type => (
                    <th key={type} className="py-2 text-center w-[15%]">{type}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROOT_NOTES.map(root => (
                  <tr key={root} className="border-b border-gray-800">
                    <td className="py-2 pl-2 text-sm">{root}</td>
                    {CHORD_TYPES.map(type => {
                      const chordName = getChordName(root, type);
                      return (
                        <td key={`${root}-${type}`} className="text-center p-1">
                          <button
                            onClick={() => toggleChord(root, type)}
                            className={`w-full py-1 rounded ${
                              selectedChords.includes(chordName) ? 'bg-primary' : 'bg-gray-700'
                            } transition-colors text-xs`}
                            aria-label={`${root} ${type}`}
                          >
                            <span aria-hidden="true">✓</span>
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* 「すべて選択」と「クリア」ボタン */}
        <div className="flex gap-2 mb-4">
          <button 
            onClick={selectAll}
            className="bg-surface border border-gray-600 px-3 py-1 rounded flex-1 hover:bg-gray-700 transition-colors"
          >
            Select All
          </button>
          <button 
            onClick={clearSelection}
            className="bg-surface border border-gray-600 px-3 py-1 rounded flex-1 hover:bg-gray-700 transition-colors"
          >
            Clear
          </button>
        </div>
        
        {/* 選択状態の表示 */}
        <div className="mb-4 max-h-20 overflow-y-auto">
          <div className="text-xs text-gray-400 mb-1">
            {activeTab === 'notes' ? 'Selected Notes:' : 'Selected Chords:'}
          </div>
          <div className="flex flex-wrap gap-1">
            {(activeTab === 'notes' ? selectedSingleNotes : selectedChords).map((item) => (
              <span key={item} className="bg-primary bg-opacity-20 px-2 py-1 rounded text-xs flex items-baseline">
                <ChordDisplay chord={item} />
              </span>
            ))}
            {(activeTab === 'notes' ? selectedSingleNotes.length : selectedChords.length) === 0 && (
              <span className="text-gray-500 text-xs italic">None selected</span>
            )}
          </div>
        </div>
        
        {/* 「保存」と「キャンセル」ボタン */}
        <div className="flex justify-end gap-2">
          <button 
            onClick={handleCancel}
            className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="bg-primary px-3 py-1 rounded hover:bg-primary-dark transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteSelectorModal;