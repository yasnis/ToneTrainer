import { create } from 'zustand';

// 音符の型定義
export type Note = {
  name: string;     // 音名（C, C#, D, ...）
  octave: number;   // オクターブ
  fret?: number;    // フレット番号（オプション）
  string?: number;  // 弦番号（オプション）
};

// アプリケーションの状態
export interface AppState {
  // メトロノーム設定
  tempo: number;
  isPlaying: boolean;
  // 練習設定
  selectedNotes: string[];  // 練習対象の音名
  currentNote: Note | null; // 現在表示されている音符
  displayMode: 'note' | 'fret'; // 表示モード（音名 or フレット位置）
  answerMode: 'manual' | 'auto'; // 回答モード（手動 or 自動）
  // 統計
  correctCount: number;
  totalCount: number;
  // アクション
  setTempo: (tempo: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setSelectedNotes: (notes: string[]) => void;
  setCurrentNote: (note: Note | null) => void;
  setDisplayMode: (mode: 'note' | 'fret') => void;
  setAnswerMode: (mode: 'manual' | 'auto') => void;
  incrementCorrectCount: () => void;
  incrementTotalCount: () => void;
  resetStats: () => void;
}

// Zustandストアの作成
export const useAppStore = create<AppState>((set) => ({
  // 初期状態
  tempo: 60,
  isPlaying: false,
  selectedNotes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
  currentNote: null,
  displayMode: 'note',
  answerMode: 'manual',
  correctCount: 0,
  totalCount: 0,
  
  // アクション
  setTempo: (tempo) => set({ tempo }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setSelectedNotes: (selectedNotes) => set({ selectedNotes }),
  setCurrentNote: (currentNote) => set({ currentNote }),
  setDisplayMode: (displayMode) => set({ displayMode }),
  setAnswerMode: (answerMode) => set({ answerMode }),
  incrementCorrectCount: () => set((state) => ({ correctCount: state.correctCount + 1 })),
  incrementTotalCount: () => set((state) => ({ totalCount: state.totalCount + 1 })),
  resetStats: () => set({ correctCount: 0, totalCount: 0 }),
}));