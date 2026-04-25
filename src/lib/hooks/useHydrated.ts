import { useSyncExternalStore } from 'react';

function getSnapshot(): boolean {
  return true;
}

function getServerSnapshot(): boolean {
  return false;
}

function subscribe(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const id = window.setTimeout(callback, 0);
  return () => {
    window.clearTimeout(id);
  };
}

/**
 * SSR/初回ハイドレートで false、マウント完了後の最初の再レンダーで true。
 * useSyncExternalStore の getServerSnapshot 経由で React の hydration と整合する。
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
