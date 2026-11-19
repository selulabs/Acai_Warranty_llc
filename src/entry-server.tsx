import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server.js';
import App from './App';
import { INDEXABLE_PAGES, getPageMeta } from './data/pageMeta';
import { renderHead } from './lib/seoMetadata';
import { SITE } from './data/site';
export { PAGE_CONTENT_DATES as contentDates } from './data/pageMeta';

export const pages = INDEXABLE_PAGES;
export const siteUrl = SITE.url;
export function render(path: string) {
  return { html: renderToString(<StaticRouter location={path}><App /></StaticRouter>),
    head: renderHead(getPageMeta(path)) };
}
