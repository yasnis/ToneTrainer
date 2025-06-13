'use client';

import { ControlsCard, NoteDisplay, BeatVisualizer, BeatPositionDisplay, AppHeader, OnboardingModal } from '@tone-trainer/ui';
import { BeatManager } from '@tone-trainer/core/src/utils/BeatManager';
import { metronome, notePlayer } from '@tone-trainer/core/src/audio';
import { Note, useAppStore } from '@tone-trainer/core/src/store';
import { useState, useEffect, useRef } from 'react';
import NoSleep from 'nosleep.js';

// ServiceWorkerの登録処理
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('ServiceWorker登録成功:', registration.scope);
    } catch (error) {
      console.error('ServiceWorker登録失敗:', error);
    }
  }
};

export default function HomePage() {
  // 再生状態の管理
  const [isPlaying, setIsPlaying] = useState(false);
  
  // 現在の音符
  const [currentNote, setCurrentNote] = useState('C');
  
  // 次の音符
  const [nextNote, setNextNote] = useState('G');
  
  // BPMの設定
  const [bpm, setBpm] = useState(120);
  
  // 拍子の設定
  const [meter, setMeter] = useState<[number, number]>([4, 4]);
  
  // 音声タイプの設定
  const [voiceType, setVoiceType] = useState<'click' | 'wood' | 'beep'>('click');
  
  // アクセントの設定
  const [accentEnabled, setAccentEnabled] = useState(true);
  
  // 音符変更間隔の設定
  const [changeEvery, setChangeEvery] = useState(1);
  
  // 選択された音符
  const [selectedNotes, setSelectedNotes] = useState(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
  
  // 現在の拍子位置の管理
  const [currentBeat, setCurrentBeat] = useState(1);
  
  // 現在の小節位置の管理
  const [currentMeasure, setCurrentMeasure] = useState(1);
  
  // 音符変更タイミングをカウントするための変数
  const measureCountRef = useRef(0);
  
  // オーディオの初期化フラグ
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  
  // NoSleepインスタンスを保持するref
  const noSleepRef = useRef<NoSleep | null>(null);
  
  // BeatManagerの参照を保持するためのref
  const beatManagerRef = useRef<BeatManager | null>(null);
  
  // 初回レンダリング時にインスタンスと初期音符を初期化
  useEffect(() => {
    // BeatManagerのインスタンスを作成
    beatManagerRef.current = new BeatManager(bpm, true);
    
    // NoSleepインスタンスを作成
    noSleepRef.current = new NoSleep();
    
    // 初期音符を設定
    if (selectedNotes.length > 0) {
      // 初期の現在の音符を設定
      const initialCurrentIndex = Math.floor(Math.random() * selectedNotes.length);
      const initialCurrentNote = selectedNotes[initialCurrentIndex];
      setCurrentNote(initialCurrentNote);
      
      // 初期の次の音符を設定（現在の音符と異なるもの）
      let initialNextIndex;
      do {
        initialNextIndex = Math.floor(Math.random() * selectedNotes.length);
      } while (initialNextIndex === initialCurrentIndex && selectedNotes.length > 1);
      
      setNextNote(selectedNotes[initialNextIndex]);
    }
    
    // コンポーネントがアンマウントされる際の処理
    return () => {
      // NoSleepを無効化
      if (noSleepRef.current) {
        noSleepRef.current.disable();
      }
      
      // メトロノームを停止
      metronome.stop();
    };
  }, [bpm, selectedNotes]);
  
  // BPMが変更された時にBeatManagerのBPMも更新し、メトロノームのテンポも更新
  useEffect(() => {
    if (beatManagerRef.current) {
      beatManagerRef.current.setBpm(bpm);
    }
    
    // 再生中の場合はメトロノームのテンポも更新
    if (isPlaying) {
      metronome.setTempo(bpm);
    }
  }, [bpm, isPlaying]);
  
  // アクセントの設定が変更されたときにメトロノームに通知
  useEffect(() => {
    metronome.setAccent(accentEnabled);
  }, [accentEnabled]);
  
  // 現在の音符が変更されたときにメトロノームに通知
  useEffect(() => {
    // 現在の音符からNoteオブジェクトを作成
    const noteObj: Note = {
      name: currentNote,
      octave: 4 // デフォルトのオクターブ
    };
    
    // メトロノームに現在の音符を設定
    metronome.setCurrentNote(noteObj);
    
    // Zustandストアも更新
    useAppStore.setState({ currentNote: noteObj });
    console.log('Updated store and metronome with current note:', noteObj);
  }, [currentNote]);
  
  // オーディオの初期化（ユーザージェスチャー時に呼び出す）
  const initializeAudio = async () => {
    if (isAudioInitialized) return true;
    
    try {
      await metronome.initialize();
      setIsAudioInitialized(true);
      console.log('Audio initialized successfully');
      return true;
    } catch (error) {
      console.error('Could not initialize audio:', error);
      return false;
    }
  };
  
  // 再生/停止をトグルする関数
  const togglePlayback = async () => {
    // まだオーディオが初期化されていない場合は初期化
    if (!isAudioInitialized) {
      const success = await initializeAudio();
      if (!success) {
        console.error('Could not initialize audio, playback not started');
        return;
      }
    }
    
    // 再生状態を反転
    const newPlayingState = !isPlaying;
    setIsPlaying(newPlayingState);
    
    // NoSleepの有効/無効を切り替え
    if (noSleepRef.current) {
      if (newPlayingState) {
        try {
          // 再生開始時にNoSleepを有効化（画面をスリープさせない）
          await noSleepRef.current.enable();
          console.log('Screen wake lock enabled');
        } catch (err) {
          console.error('Failed to enable wake lock:', err);
        }
      } else {
        // 再生停止時にNoSleepを無効化（画面スリープを許可）
        noSleepRef.current.disable();
        console.log('Screen wake lock disabled');
      }
    }
    
    // 再生/停止をメトロノームに伝える
    if (newPlayingState) {
      // Noteオブジェクトを作成して現在の音符を設定
      const noteObj: Note = {
        name: currentNote,
        octave: 4 // オクターブを4に戻す
      };
      
      // Zustandストアを更新して、メトロノームが現在の音符の音程で鳴るようにする
      useAppStore.setState({ currentNote: noteObj });
      console.log('Starting metronome with note:', noteObj);
      
      // メトロノームを開始（コールバック関数を渡して音符の変更に対応）
      await metronome.start(bpm, () => {
        // 現在のnoteObjを取得
        const currentNoteObj = useAppStore.getState().currentNote;
        console.log('Metronome callback with current note:', currentNoteObj);
      });
      
      // 小節カウンターと拍位置をリセット
      setCurrentBeat(1);
      setCurrentMeasure(1);
      measureCountRef.current = 0;
    } else {
      // メトロノームを停止
      metronome.stop();
    }
  };
  
  // 再生中の場合、BeatManagerにリスナーを登録
  useEffect(() => {
    if (!beatManagerRef.current) return;
    
    let removeListener: (() => void) | null = null;
    
    if (isPlaying) {
      // 前回のビート処理中かどうかを示すフラグ
      let isProcessingBeat = false;
      
      // BeatManagerにビートリスナーを登録
      removeListener = beatManagerRef.current.addBeatListener(() => {
        // 前回のビート処理中なら処理をスキップ（同時に複数の処理が走らないようにする）
        if (isProcessingBeat) return;
        isProcessingBeat = true;
        
        // 次の拍と小節の値を計算
        let nextBeat = currentBeat + 1;
        let nextMeasure = currentMeasure;
        let shouldUpdateNote = false;
        
        // 1小節が終わったら次の小節へ
        if (nextBeat > meter[0]) {
          nextBeat = 1;
          
          // 小節カウンターをインクリメント
          measureCountRef.current += 1;
          
          // 変更間隔に達したら音符を変更
          if (measureCountRef.current >= changeEvery) {
            measureCountRef.current = 0;
            shouldUpdateNote = true;
            // 音符変更時は小節カウンターをリセット
            nextMeasure = 1;
          } else {
            // 音符変更がない場合は小節をインクリメント
            nextMeasure = currentMeasure + 1;
          }
        }
        
        // ビートと小節の状態を一度に更新
        setCurrentBeat(nextBeat);
        setCurrentMeasure(nextMeasure);
        
        // 音符の更新は小節と拍の更新後に行う
        if (shouldUpdateNote) {
          // 現在の音符と次の音符を更新
          if (selectedNotes.length > 0) {
            // 現在のNextNoteをCurrentNoteに移動
            setCurrentNote(nextNote);
            
            // 次の音符用に、現在の音符と異なる新しいランダムな音符を選択
            let newNextNote;
            do {
              const randomIndex = Math.floor(Math.random() * selectedNotes.length);
              newNextNote = selectedNotes[randomIndex];
            } while ((newNextNote === nextNote || newNextNote === currentNote) && selectedNotes.length > 2);
            
            // 新しい次の音符を設定
            setNextNote(newNextNote);
          }
        }
        
        // ビート処理完了を示す
        isProcessingBeat = false;
      });
    }
    
    // クリーンアップ時にリスナーを削除
    return () => {
      if (removeListener) {
        removeListener();
      }
    };
  }, [isPlaying, meter, isAudioInitialized, changeEvery, selectedNotes, currentNote, nextNote, currentBeat, currentMeasure]);
  
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
  
  // オンボーディングモーダル関連の状態
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [onboardingLang, setOnboardingLang] = useState<'en' | 'ja'>('ja');
  
  // 初回表示のチェック（ローカルストレージから読み込み）
  useEffect(() => {
    // ブラウザ環境でのみ実行
    if (typeof window !== 'undefined') {
      // ローカルストレージから表示済みかどうかを確認
      const hasSeenOnboarding = localStorage.getItem('tt_onb_v1') === '1';
      
      // まだ表示されていない場合は表示
      if (!hasSeenOnboarding) {
        setOnboardingOpen(true);
      }
    }
  }, []);
  
  // オンボーディングモーダルを閉じる処理
  const handleCloseOnboarding = () => {
    // ローカルストレージに表示済みフラグを保存
    localStorage.setItem('tt_onb_v1', '1');
    setOnboardingOpen(false);
    
    // モーダルを閉じた後にメトロノームを開始
    if (!isPlaying) {
      togglePlayback();
    }
  };
  
  // ヘルプボタンがクリックされたときの処理
  const handleHelpClick = () => {
    setOnboardingOpen(true);
  };
  
  // PWAのServiceWorker登録
  useEffect(() => {
    registerServiceWorker();
  }, []);
  
  return (
    <>
      {/* メインコンテンツを全画面表示に */}
      <div className="flex flex-col items-center h-full w-full overflow-hidden bg-gradient-light">
        {/* メインディスプレイエリア - ヘッダーのパディングなし */}
        <div className="w-full max-w-3xl flex-1 flex flex-col items-center justify-center px-4">
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
                  currentBeat={currentBeat}
                  bpm={bpm}
                  className="transition-all duration-300 w-full h-full text-primary"
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
                    meter={meter}
                    changeEvery={changeEvery}
                    className="text-lg text-text opacity-80"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* コントロールエリア用のラッパー - 画面下部に固定し、左右マージンを確保 */}
        <div className="w-full px-4 mb-4">
          <div className="w-full max-w-3xl mx-auto">
            <ControlsCard 
              className="w-full shadow-card bg-gradient-light"
              bpm={bpm}
              onBpmChange={setBpm}
              meter={meter}
              onMeterChange={setMeter}
              voice={voiceType}
              onVoiceChange={setVoiceType}
              accent={accentEnabled}
              onAccentChange={setAccentEnabled}
              changeEvery={changeEvery}
              onChangeEveryChange={setChangeEvery}
              selectedNotes={selectedNotes}
              onSelectedNotesChange={setSelectedNotes}
            />
          </div>
        </div>
      </div>
      
      {/* ヘッダーをメインコンテンツの上に重ねる（絶対配置） */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <AppHeader onHelpClick={handleHelpClick} />
      </div>
      
      {/* オンボーディングモーダル */}
      <OnboardingModal
        open={onboardingOpen}
        lang={onboardingLang}
        onLangChange={setOnboardingLang}
        onClose={handleCloseOnboarding}
      />
    </>
  );
}