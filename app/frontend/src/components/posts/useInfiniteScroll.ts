import { useEffect, useRef, useCallback } from 'react';

export function useInfiniteScroll(callback: () => void, hasMore: boolean, loading: boolean) {
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new window.IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          callback();
        }
      });
      if (node) observer.current.observe(node);
    },
    [callback, hasMore, loading]
  );
  return lastElementRef;
} 