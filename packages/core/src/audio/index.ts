import * as Tone from 'tone';
import { Note } from '../store';

// メトロノームクラス
export class Metronome {
  private synth: any = null;
  private loop: any = null;
  private initialized: boolean = false;
  
  constructor() {
    // 遅延初期化するため、コンストラクタでは何もしない
  }
  
  // メトロノームの初期化（ユーザーのジェスチャー後に呼び出す）
  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      // Tone.jsの初期化
      await Tone.start();
      
      // シンセサイザーの初期化
      this.synth = new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: {
          attack: 0.01,
          decay: 0.1,
          sustain: 0.1,
          release: 0.1,
        },
      }).toDestination();
      
      this.initialized = true;
      console.log('Metronome initialized');
    } catch (error) {
      console.error('Failed to initialize metronome:', error);
      throw error;
    }
  }

  // メトロノームの開始
  async start(bpm: number, callback?: () => void): Promise<void> {
    // まだ初期化されていなければ初期化
    if (!this.initialized) {
      await this.initialize();
    }
    
    // Synthが初期化されていなければエラー
    if (!this.synth) {
      console.error('Synth not initialized');
      return;
    }
    
    // 既存のループを停止
    if (this.loop) {
      this.loop.dispose();
      this.loop = null;
    }

    // テンポを設定
    Tone.Transport.bpm.value = bpm;
    
    // クリックのループを作成
    this.loop = new Tone.Loop((time: number) => {
      // クリック音を再生
      if (this.synth) {
        this.synth.triggerAttackRelease('C5', '16n', time);
      }
      
      // コールバックがあれば実行（次の音符を表示するなど）
      if (callback) {
        callback();
      }
    }, '4n').start(0);
    
    // Transportを開始
    Tone.Transport.start();
  }

  // メトロノームの停止
  stop(): void {
    if (this.loop) {
      this.loop.dispose();
      this.loop = null;
    }
    Tone.Transport.stop();
  }

  // テンポの変更
  setTempo(bpm: number): void {
    if (Tone.Transport) {
      Tone.Transport.bpm.value = bpm;
    }
  }
  
  // 初期化済みかどうかを確認
  isInitialized(): boolean {
    return this.initialized;
  }
}

// 音符の再生クラス
export class NotePlayer {
  private synth: any = null;
  private initialized: boolean = false;
  
  constructor() {
    // 遅延初期化するため、コンストラクタでは何もしない
  }
  
  // NotePlayerの初期化（ユーザーのジェスチャー後に呼び出す）
  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      // Tone.jsの初期化
      await Tone.start();
      
      // シンセサイザーの初期化
      this.synth = new Tone.PolySynth(Tone.Synth).toDestination();
      this.synth.set({
        oscillator: { type: 'sine' },
        envelope: {
          attack: 0.02,
          decay: 0.1,
          sustain: 0.3,
          release: 0.8,
        }
      });
      
      this.initialized = true;
      console.log('NotePlayer initialized');
    } catch (error) {
      console.error('Failed to initialize note player:', error);
      throw error;
    }
  }

  // 音符を再生
  async playNote(note: Note, duration: string = '4n'): Promise<void> {
    // まだ初期化されていなければ初期化
    if (!this.initialized) {
      await this.initialize();
    }
    
    // Synthが初期化されていなければエラー
    if (!this.synth) {
      console.error('Synth not initialized');
      return;
    }
    
    // オーディオコンテキストの起動
    if (Tone.context.state !== 'running') {
      await Tone.context.resume();
    }
    
    // 音符を再生
    const noteString = `${note.name}${note.octave}`;
    this.synth.triggerAttackRelease(noteString, duration);
  }
  
  // 初期化済みかどうかを確認
  isInitialized(): boolean {
    return this.initialized;
  }
}

// エクスポート - インスタンスをエクスポートするが、実際の初期化は後で行う
export const metronome = new Metronome();
export const notePlayer = new NotePlayer();