// Optional developer utility. Requires Chrome running with
// --headless --remote-debugging-port=9222. Normal builds use committed assets.
import { readFile, writeFile } from 'node:fs/promises';

const logo = await readFile('public/favicon.svg', 'utf8');
const cardLogo = logo.replace('width="40" height="40"', 'x="90" y="170" width="230" height="230"');
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#002C40"/>
<rect x="65" y="145" width="280" height="280" rx="24" fill="white"/>
${cardLogo}
<g fill="white" font-family="Arial, sans-serif">
<text x="395" y="230" font-size="82" font-weight="700" letter-spacing="6">ACAI</text>
<text x="395" y="300" font-size="54" font-weight="700">Warranty LLC</text>
<text x="395" y="367" font-size="30" fill="#D6E6EE">Auto &amp; Home Protection Solutions</text>
<text x="70" y="558" font-size="28" fill="#D6E6EE">acaiwarranty.com</text>
</g><rect x="70" y="475" width="1060" height="5" rx="2" fill="#FF8000"/>
</svg>`;
await writeFile('public/og-image.svg', og);

const tabs = await (await fetch('http://127.0.0.1:9222/json/list')).json();
const socket = new WebSocket(tabs.find((tab) => tab.type === 'page').webSocketDebuggerUrl);
await new Promise((resolve) => socket.addEventListener('open', resolve, { once: true }));
let nextId = 0;
const waiting = new Map();
socket.addEventListener('message', ({ data }) => {
  const message = JSON.parse(data);
  const callbacks = waiting.get(message.id);
  if (callbacks) { waiting.delete(message.id); message.error ? callbacks.reject(message.error) : callbacks.resolve(message.result); }
});
function command(method, params) {
  return new Promise((resolve, reject) => {
    const id = ++nextId;
    waiting.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
}
async function png(svg, width, height) {
  const expression = `(async () => {
    const image = new Image();
    image.src = 'data:image/svg+xml;base64,' + ${JSON.stringify(Buffer.from(svg).toString('base64'))};
    await image.decode();
    const canvas = document.createElement('canvas'); canvas.width = ${width}; canvas.height = ${height};
    canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png').split(',')[1];
  })()`;
  const result = await command('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return Buffer.from(result.result.value, 'base64');
}
try {
  await writeFile('public/og-image.png', await png(og, 1200, 630));
  const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><rect width="512" height="512" rx="48" fill="white"/>${logo.replace('width="40" height="40"', 'x="32" y="32" width="448" height="448"')}</svg>`;
  const buffers = new Map();
  for (const [size, file] of [[16, 'favicon-16'], [32, 'favicon-32'], [180, 'apple-touch-icon'], [192, 'icon-192'], [512, 'icon-512']]) {
    const buffer = await png(icon, size, size);
    buffers.set(size, buffer);
    await writeFile(`public/${file}.png`, buffer);
  }
  // ICO supports PNG-compressed image frames; include both favicon sizes.
  const header = Buffer.alloc(6 + 2 * 16);
  header.writeUInt16LE(1, 2); header.writeUInt16LE(2, 4);
  let offset = header.length;
  [16, 32].forEach((size, index) => {
    const at = 6 + index * 16;
    header[at] = size; header[at + 1] = size;
    header.writeUInt16LE(1, at + 4); header.writeUInt16LE(32, at + 6);
    header.writeUInt32LE(buffers.get(size).length, at + 8); header.writeUInt32LE(offset, at + 12);
    offset += buffers.get(size).length;
  });
  await writeFile('public/favicon.ico', Buffer.concat([header, buffers.get(16), buffers.get(32)]));
  console.log('Generated branded OG image and PNG/ICO icons from the existing SVG logo.');
} finally { socket.close(); }
