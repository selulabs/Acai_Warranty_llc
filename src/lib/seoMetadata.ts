import { SITE } from '../data/site';
import { PAGE_META, type PageMeta } from '../data/pageMeta';
import { FAQS_BY_PATH } from '../data/faqs';

export const SOCIAL_IMAGE = `${SITE.url}/og-image.png`;
export const SOCIAL_IMAGE_ALT = `${SITE.name} — ${SITE.tagline}`;

export function structuredData(meta: PageMeta) {
  if (meta.noindex) return { '@context': 'https://schema.org', '@graph': [] };
  const organization = `${SITE.url}/#organization`;
  const graph: Record<string, unknown>[] = [
    { '@type': 'Organization', '@id': organization, name: SITE.name, url: SITE.url,
      email: SITE.email, telephone: SITE.phoneHref.replace('tel:', ''),
      logo: { '@type': 'ImageObject', url: `${SITE.url}/icon-512.png`, width: 512, height: 512 },
      description: SITE.description },
    { '@type': 'WebSite', '@id': `${SITE.url}/#website`, url: `${SITE.url}/`, name: SITE.name,
      publisher: { '@id': organization } },
  ];
  if (meta.path !== '/') graph.push({ '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE.url}/` },
    { '@type': 'ListItem', position: 2, name: meta.title.split(' | ')[0], item: `${SITE.url}${meta.path}` },
  ] });
  const service = meta.path === PAGE_META.auto.path ? 'Auto warranty protection options' :
    meta.path === PAGE_META.home.path ? 'Home warranty protection options' : null;
  if (service) graph.push({ '@type': 'Service', '@id': `${SITE.url}${meta.path}#service`,
    name: service, serviceType: service, url: `${SITE.url}${meta.path}`, description: meta.description,
    provider: { '@id': organization } });
  const faqs = FAQS_BY_PATH[meta.path];
  if (faqs) graph.push({ '@type': 'FAQPage', '@id': `${SITE.url}${meta.path}#faq`,
    mainEntity: faqs.map(({ question, answer }) => ({ '@type': 'Question', name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer } })) });
  // Mailing address is omitted. FAQ data matches visible, owner-approved answers;
  // Google has retired FAQ rich results. No ratings or state availability inferred.
  return { '@context': 'https://schema.org', '@graph': graph };
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function escape(value: string) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function renderHead(meta: PageMeta) {
  const url = `${SITE.url}${meta.path}`;
  const image = meta.image ?? SOCIAL_IMAGE;
  const name = (key: string, value: string) => `<meta name="${key}" content="${escape(value)}" />`;
  const property = (key: string, value: string) => `<meta property="${key}" content="${escape(value)}" />`;
  return [
    `<title>${escape(meta.title)}</title>`, name('description', meta.description),
    name('robots', meta.noindex ? 'noindex, follow' : 'index, follow'),
    ...(meta.noindex ? [] : [`<link rel="canonical" href="${escape(url)}" />`]),
    property('og:title', meta.title), property('og:description', meta.description), property('og:url', url),
    property('og:site_name', SITE.name), property('og:type', 'website'), property('og:locale', 'en_US'),
    property('og:image', image), property('og:image:type', 'image/png'),
    property('og:image:width', '1200'), property('og:image:height', '630'), property('og:image:alt', SOCIAL_IMAGE_ALT),
    name('twitter:card', 'summary_large_image'), name('twitter:title', meta.title),
    name('twitter:description', meta.description), name('twitter:image', image), name('twitter:image:alt', SOCIAL_IMAGE_ALT),
    `<script id="structured-data" type="application/ld+json">${serializeJsonLd(structuredData(meta))}</script>`,
  ].join('\n    ').replace(/<(title|meta|link|script)\b/g, '<$1 data-seo');
}
