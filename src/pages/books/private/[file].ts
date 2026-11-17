import fs from 'node:fs';
import path from 'node:path';
import type { APIRoute, GetStaticPaths } from 'astro';
import { PRIVATE_BOOKS_DIR } from '@/lib/books';

/*
  Отдаёт личные PDF из books-private/ — только в npm run dev.
  В продакшен-сборке список путей пустой, поэтому ни один личный файл не попадает в dist/.
*/
export const getStaticPaths = (() => {
  if (import.meta.env.PROD || !fs.existsSync(PRIVATE_BOOKS_DIR)) return [];

  return fs
    .readdirSync(PRIVATE_BOOKS_DIR)
    .filter((file) => file.toLowerCase().endsWith('.pdf'))
    .map((file) => ({ params: { file } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ params }) => {
  const data = fs.readFileSync(path.join(PRIVATE_BOOKS_DIR, params.file!));
  return new Response(data, { headers: { 'Content-Type': 'application/pdf' } });
};
