import * as Tone from 'tone';
import { Note, useAppStore } from '../store';

// メトロノームクラス
export class Metronome {
  private synth: any = null;
  private loop: any = null;
  private initialized: boolean = false;
  private currentNote: Note | null = null;  // 現在の音符を保持するプロパティ
  private accentEnabled: boolean = true;    // アクセントの有効/無効
  private accentOctaveUp: boolean = true;   // アクセント音を1オクターブ上げるかどうか
  
  constructor() {
    // 遅延初期化するため、コンストラクタでは何もしない
  }
  
  // 現在の音符を設定するメソッド
  setCurrentNote(note: Note | null): void {
    this.currentNote = note;
    console.log('Metronome.setCurrentNote called with:', note);
  }
  
  // アクセントの有効/無効を設定するメソッド
  setAccent(enabled: boolean): void {
    this.accentEnabled = enabled;
    console.log('Metronome.setAccent called with:', enabled);
  }
  
  // アクセント音をオクターブ上げるかどうかを設定するメソッド
  setAccentOctaveUp(enabled: boolean): void {
    this.accentOctaveUp = enabled;
    console.log('Metronome.setAccentOctaveUp called with:', enabled);
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
      // this.currentNoteからZustandのストアを参照するのではなく、クラスのプロパティを使用
      if (this.currentNote) {
        // 拍の位置を取得（Transportのpositionから計算）
        const position = Tone.Transport.position.toString().split(':');
        const beat = parseInt(position[1]) + 1; // 0-indexed to 1-indexed
        
        // オクターブを決定（アクセントが有効かつ1拍目かつオクターブアップが有効の場合はオクターブを上げる）
        const baseOctave = this.currentNote.octave || 4; // デフォルトは4
        const octave = (this.accentEnabled && beat === 1 && this.accentOctaveUp) 
          ? baseOctave + 1 // アクセント時は1オクターブ上げる
          : baseOctave;    // それ以外は元のオクターブ
        
        // 音符文字列を作成
        const noteToPlay = `${this.currentNote.name}${octave}`;
        
        // デバッグ情報をログに出力
        console.log('メトロノーム音:', { 
          currentNote: this.currentNote,
          beat: beat,
          accentEnabled: this.accentEnabled,
          accentOctaveUp: this.accentOctaveUp,
          baseOctave: baseOctave,
          octave: octave,
          noteToPlay: noteToPlay
        });
        
        // クリック音を再生
        if (this.synth) {
          this.synth.triggerAttackRelease(noteToPlay, '16n', time);
        }
      } else {
        // currentNoteが設定されていない場合はデフォルトの音を使用
        const position = Tone.Transport.position.toString().split(':');
        const beat = parseInt(position[1]) + 1; // 0-indexed to 1-indexed
        
        // アクセントが有効で1拍目の場合はオクターブを上げる
        const octave = (this.accentEnabled && beat === 1 && this.accentOctaveUp) ? 5 : 4;
        const noteToPlay = `C${octave}`; // デフォルトはC
        
        console.log('メトロノーム音 (デフォルト):', { 
          beat: beat,
          accentEnabled: this.accentEnabled,
          accentOctaveUp: this.accentOctaveUp,
          noteToPlay: noteToPlay
        });
        
        if (this.synth) {
          this.synth.triggerAttackRelease(noteToPlay, '16n', time);
        }
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