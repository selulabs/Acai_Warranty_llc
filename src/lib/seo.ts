import { useEffect } from 'react';
import type { PageMeta } from '@/data/pageMeta';
import { renderHead } from '@/lib/seoMetadata';
export { PAGE_META } from '@/data/pageMeta';
export type { PageMeta } from '@/data/pageMeta';

export function useDocumentHead(meta: PageMeta) {
  useEffect(() => {
    document.head.querySelectorAll('[data-seo]').forEach((node) => node.remove());
    document.head.insertAdjacentHTML('beforeend', renderHead(meta));
  }, [meta]);
}
