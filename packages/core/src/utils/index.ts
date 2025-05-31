import { Note } from '../store';

// 全ての音名
export const ALL_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// ギターの標準チューニング (低音から高音へ: E A D G B E)
export const STANDARD_TUNING = ['E', 'A', 'D', 'G', 'B', 'E'];

// フレットボード上の位置から音名を取得する関数
export function getNoteFromFretPosition(stringNumber: number, fretNumber: number): Note {
  // 弦の開放弦の音名（0フレット）
  const openString = STANDARD_TUNING[stringNumber - 1]; // stringNumberは1から開始
  
  // 開放弦の音名のインデックスを取得
  const openStringIndex = ALL_NOTES.indexOf(openString);
  
  // フレット位置から音名のインデックスを計算
  const noteIndex = (openStringIndex + fretNumber) % ALL_NOTES.length;
  
  // 音名
  const noteName = ALL_NOTES[noteIndex];
  
  // オクターブを計算 (簡易的な実装)
  // 標準チューニングでの各弦の開放弦のオクターブ
  const openStringOctaves = [2, 2, 3, 3, 3, 4]; // 低E:2, A:2, D:3, G:3, B:3, 高E:4
  
  // 基本オクターブ + フレット数による上昇分
  let octave = openStringOctaves[stringNumber - 1] + Math.floor((openStringIndex + fretNumber) / ALL_NOTES.length);
  
  // 音符オブジェクトを返す
  return {
    name: noteName,
    octave,
    string: stringNumber,
    fret: fretNumber
  };
}

// フレットボード上のランダムな位置を生成する関数
export function getRandomFretPosition(maxFret: number = 12): { string: number; fret: number } {
  // ランダムな弦 (1-6)
  const string = Math.floor(Math.random() * 6) + 1;
  
  // ランダムなフレット (0-maxFret)
  const fret = Math.floor(Math.random() * (maxFret + 1));
  
  return { string, fret };
}

// 指定された音名のリストからランダムな音符を生成する関数
export function generateRandomNote(selectedNotes: string[], minOctave: number = 3, maxOctave: number = 5): Note {
  // ランダムな音名を選択
  const randomNoteIndex = Math.floor(Math.random() * selectedNotes.length);
  const noteName = selectedNotes[randomNoteIndex];
  
  // ランダムなオクターブを選択
  const octave = Math.floor(Math.random() * (maxOctave - minOctave + 1)) + minOctave;
  
  return {
    name: noteName,
    octave
  };
}

// フレットボード上の指定された音名を持つ全ての位置を取得する関数
export function getAllPositionsForNote(noteName: string, maxFret: number = 12): Array<{ string: number; fret: number }> {
  const positions = [];
  
  // 全ての弦と指定されたフレット範囲で検索
  for (let string = 1; string <= 6; string++) {
    for (let fret = 0; fret <= maxFret; fret++) {
      const note = getNoteFromFretPosition(string, fret);
      if (note.name === noteName) {
        positions.push({ string, fret });
      }
    }
  }
  
  return positions;
}

export default {
  ALL_NOTES,
  STANDARD_TUNING,
  getNoteFromFretPosition,
  getRandomFretPosition,
  generateRandomNote,
  getAllPositionsForNote
};