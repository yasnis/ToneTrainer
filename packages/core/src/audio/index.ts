import * as Tone from 'tone';
import { Note } from '../store';

// メトロノームクラス
export class Metronome {
  private synth: Tone.Synth;
  private loop: Tone.Loop | null = null;
  
  constructor() {
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
  }

  // メトロノームの開始
  start(bpm: number, callback?: () => void): void {
    // 既存のループを停止
    if (this.loop) {
      this.loop.dispose();
    }

    // テンポを設定
    Tone.Transport.bpm.value = bpm;
    
    // クリックのループを作成
    this.loop = new Tone.Loop((time) => {
      // クリック音を再生
      this.synth.triggerAttackRelease('C5', '16n', time);
      
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
    Tone.Transport.bpm.value = bpm;
  }
}

// 音符の再生クラス
export class NotePlayer {
  private synth: Tone.PolySynth;
  
  constructor() {
    // シンセサイザーの初期化
    this.synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.02,
        decay: 0.1,
        sustain: 0.3,
        release: 0.8,
      },
    }).toDestination();
  }

  // 音符を再生
  playNote(note: Note, duration: string = '4n'): void {
    // オーディオコンテキストの起動
    if (Tone.context.state !== 'running') {
      Tone.context.resume();
    }
    
    // 音符を再生
    const noteString = `${note.name}${note.octave}`;
    this.synth.triggerAttackRelease(noteString, duration);
  }
}

// エクスポート
export const metronome = new Metronome();
export const notePlayer = new NotePlayer();