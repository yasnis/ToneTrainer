// ルートページをServer Componentとして実装し、クライアントコンポーネントはSuspenseでラップする
import { Suspense } from 'react';

// 動的レンダリングを強制
export const dynamic = 'force-dynamic';

// クライアントコンポーネントは別ファイルとして切り出す
import HomePage from './components/HomePage';

export default function Page() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">読み込み中...</div>}>
      <HomePage />
    </Suspense>
  );
}