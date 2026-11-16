import { createQuoteHandler } from './handler.ts';

Deno.serve(createQuoteHandler({
  env: (name) => Deno.env.get(name),
  fetch: (input, init) => fetch(input, init),
}));
