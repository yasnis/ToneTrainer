// 静的アセットのパスを解決するユーティリティ関数
import { Platform } from 'react-native';

/**
 * 静的アセット（画像など）へのパスをプラットフォームに応じて正しく解決します
 * @param path アセットへの相対パス（先頭のスラッシュは含める）
 * @returns プラットフォームに応じた正しいパス
 */
export function getAssetPath(path: string): string {
  // パスが空または無効な場合は空文字を返す
  if (!path) return '';

  // プラットフォームによって異なるパスを返す
  if (Platform.OS === 'web') {
    // Web環境: 常に/tonetrainerを返す（開発環境・本番環境とも）
    const basePath = '/tonetrainer';
    // パスが既にベースパスで始まっていないことを確認
    return path.startsWith(basePath) ? path : `${basePath}${path}`;
  } else {
    // Mobileネイティブ環境: 絶対URLを返す
    // パスが既にhttpsで始まっている場合はそのまま返す
    if (path.startsWith('http')) {
      return path;
    }
    // そうでなければ、ベースURLとパスを結合
    return `https://tonetrainer.app${path}`;
  }
}