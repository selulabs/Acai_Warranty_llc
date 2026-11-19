/** Preserve each photo's original crop and aspect ratio at smaller sizes. */
export function imageAtWidth(src: string, width: number): string {
  if (!src.startsWith('https://images.pexels.com/')) return src;
  const url = new URL(src);
  const oldWidth = Number(url.searchParams.get('w'));
  const oldHeight = Number(url.searchParams.get('h'));
  url.searchParams.set('w', String(width));
  if (oldWidth && oldHeight) url.searchParams.set('h', String(Math.round(width * oldHeight / oldWidth)));
  url.searchParams.set('auto', 'compress');
  return url.toString();
}

export function imageSrcSet(src: string, widths = [400, 640, 960, 1280, 1600, 2000]) {
  if (!src.startsWith('https://images.pexels.com/')) return undefined;
  return widths.map((width) => `${imageAtWidth(src, width)} ${width}w`).join(', ');
}
