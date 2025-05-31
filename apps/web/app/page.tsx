'use client';

import { ControlsCard, NoteDisplay, BeatVisualizer, BeatPositionDisplay } from '@tone-trainer/ui';
import { BeatManager } from '@tone-trainer/core/src/utils/BeatManager';
import { metronome } from '@tone-trainer/core/src/audio';
import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';

export default function Home() {
  // 再生状態の管理
  const [isPlaying, setIsPlaying] = useState(false);
  
  // 現在の音符（仮の実装）
  const [currentNote, setCurrentNote] = useState('C');
  
  // 次の音符（仮の実装）
  const [nextNote, setNextNote] = useState('G');
  
  // BPMの設定
  const [bpm, setBpm] = useState(120);
  
  // 拍子の設定
  const [meter, setMeter] = useState<[number, number]>([4, 4]);
  
  // 現在の拍子位置の管理
  const [currentBeat, setCurrentBeat] = useState(1);
  
  // 現在の小節位置の管理
  const [currentMeasure, setCurrentMeasure] = useState(1);
  
  // Tone.jsの初期化フラグ
  const [isToneInitialized, setIsToneInitialized] = useState(false);
  
  // BeatManagerの参照を保持するためのref
  const beatManagerRef = useRef<BeatManager | null>(null);
  
  // Tone.jsの初期化
  useEffect(() => {
    // ユーザーのジェスチャーがある時に初期化される
    const initializeTone = async () => {
      await Tone.start();
      setIsToneInitialized(true);
      console.log('Tone.js initialized');
    };
    
    // この時点では初期化しておく（ユーザーのジェスチャーが必要なので実際には再生時に初期化される）
    initializeTone().catch(console.error);
  }, []);
  
  // 初回レンダリング時にBeatManagerをインスタンス化
  useEffect(() => {
    // BeatManagerのインスタンスを作成
    beatManagerRef.current = new BeatManager(bpm, true);
    
    // コンポーネントがアンマウントされる際にリスナーを削除するための関数を返す
    return () => {
      // 特に何もしなくてよい
      // BeatManagerのインスタンスはガベージコレクションにより自動的に破棄される
    };
  }, []);
  
  // BPMが変更された時にBeatManagerのBPMも更新
  useEffect(() => {
    if (beatManagerRef.current) {
      beatManagerRef.current.setBpm(bpm);
    }
    
    // メトロノームのテンポも更新
    metronome.setTempo(bpm);
  }, [bpm]);
  
  // 再生/停止をトグルする関数
  const togglePlayback = async () => {
    // まだTone.jsが初期化されていない場合は初期化
    if (!isToneInitialized) {
      try {
        await Tone.start();
        setIsToneInitialized(true);
        console.log('Tone.js initialized');
      } catch (error) {
        console.error('Failed to initialize Tone.js:', error);
        return;
      }
    }
    
    // 再生状態を反転
    const newPlayingState = !isPlaying;
    setIsPlaying(newPlayingState);
    
    // 再生状態に応じてメトロノームを制御
    if (newPlayingState) {
      // 再生開始
      metronome.start(bpm);
    } else {
      // 再生停止
      metronome.stop();
    }
  };
  
  // 再生中の場合、BeatManagerにリスナーを登録
  useEffect(() => {
    if (!beatManagerRef.current) return;
    
    let removeListener: (() => void) | null = null;
    
    if (isPlaying) {
      // BeatManagerにビートリスナーを登録
      removeListener = beatManagerRef.current.addBeatListener(() => {
        // ビートごとに呼び出される処理
        setCurrentBeat((prevBeat) => {
          // 次の拍に進む
          const nextBeat = prevBeat + 1;
          
          // 1小節が終わったら次の小節へ
          if (nextBeat > meter[0]) {
            setCurrentMeasure((prevMeasure) => prevMeasure + 1);
            return 1;
          }
          
          return nextBeat;
        });
      });
    }
    
    // クリーンアップ時にリスナーを削除
    return () => {
      if (removeListener) {
        removeListener();
      }
    };
  }, [isPlaying, meter]);
  
  // コンテナのサイズを参照するためのref
  const containerRef = useRef<HTMLDivElement>(null);
  // コンテナのサイズ状態
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  
  // コンテナのサイズを計測するeffect
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        // 親要素の幅と高さを取得
        setContainerSize({
          width: clientWidth,
          height: clientHeight
        });
      }
    };
    
    // 初期サイズ設定
    updateSize();
    
    // リサイズイベントでサイズを更新
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  
  // 利用可能な幅と高さの小さい方を使って正方形のサイズを計算
  const squareSize = Math.min(containerSize.width, containerSize.height);
  
  return (
    <div className="flex flex-col items-center h-full w-full overflow-hidden px-4">
      {/* メインディスプレイエリア */}
      <div className="w-full max-w-3xl flex-1 flex flex-col items-center justify-center">
        {/* サイズ計測用のコンテナ - ref追加 */}
        <div 
          ref={containerRef}
          className="relative w-full h-full flex items-center justify-center"
        >
          {/* 正方形のコンテナ - 計算したサイズに基づいて調整 */}
          <div 
            className="relative flex items-center justify-center"
            style={{ 
              width: squareSize ? `${squareSize}px` : '100%', 
              height: squareSize ? `${squareSize}px` : '100%',
              maxWidth: '90vmin',
              maxHeight: '90vmin'
            }}
          >
            {/* BeatVisualizer - 正方形コンテナに合わせる */}
            <div className="absolute inset-0 flex items-center justify-center">
              <BeatVisualizer 
                isPlaying={isPlaying}
                meter={meter}
                currentBeat={currentBeat}
                bpm={bpm}
                className="transition-all duration-300 w-full h-full"
              />
            </div>
            
            {/* 中央コンテンツ - BeatVisualizerの上に配置 */}
            <div 
              className="relative w-full h-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300"
              onClick={togglePlayback}
            >
              {/* 統合したNoteDisplayコンポーネント - CurrentNoteとNextNoteを置き換え */}
              <div className="flex flex-col items-center justify-center">
                <NoteDisplay 
                  currentNote={currentNote}
                  nextNote={nextNote}
                  isPlaying={isPlaying}
                  onTap={togglePlayback}
                  size="xlarge"
                  showNextNote={true}
                />
              </div>
              
              {/* BeatPositionDisplay - 小さめに表示 */}
              <div className="mt-4"> 
                <BeatPositionDisplay 
                  measure={currentMeasure}
                  beat={currentBeat}
                  className="text-lg opacity-80"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* コントロールエリア - 画面下部に固定 */}
      <ControlsCard className="w-full max-w-3xl mb-4" />
    </div>
  );
}