// 404ページをServer Componentとして実装し、クライアントコンポーネントはSuspenseでラップする
import { Suspense } from 'react';
import Link from 'next/link';

// クライアントコンポーネントを別ファイルに切り出す代わりにインラインで定義
// 'use client'ディレクティブ付きのコンポーネント
const NotFoundClient = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-2xl font-bold mb-4">404 - ページが見つかりません</h1>
      <p className="mb-4">お探しのページは存在しないか、移動した可能性があります。</p>
      <Link href="/" className="text-primary hover:underline">
        ホームに戻る
      </Link>
    </div>
  );
};

// Server Componentとして実装し、動的レンダリングを強制
export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFoundClient />
    </Suspense>
  );
}