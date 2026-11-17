import fs from 'node:fs';
import path from 'node:path';

/** Публичные PDF — в public/books/, публикуются вместе с сайтом */
const PUBLIC_BOOKS_DIR = path.join(process.cwd(), 'public', 'books');

/** Личные PDF — вне public/ и вне git, доступны только в npm run dev */
export const PRIVATE_BOOKS_DIR = path.join(process.cwd(), 'books-private');

/** Личные книги показываются только при локальной разработке */
export const isBookVisible = (book: { data: { draft: boolean; private: boolean } }) =>
  !book.data.draft && (import.meta.env.DEV || !book.data.private);

const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} МБ` : `${Math.max(1, Math.round(bytes / 1024))} КБ`;

/**
 * Проверяет, что PDF на месте, и возвращает адрес и размер.
 * Если файла нет — сборка падает с понятной ошибкой, а не публикует битую ссылку.
 */
export function getBookFile(file: string, isPrivate = false) {
  const dir = isPrivate ? PRIVATE_BOOKS_DIR : PUBLIC_BOOKS_DIR;
  const folder = isPrivate ? 'books-private' : 'public/books';
  const filePath = path.join(dir, file);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Книги: файл ${folder}/${file} не найден. Положите PDF в ${folder}/ или исправьте поле file.`);
  }

  return {
    url: isPrivate ? `/books/private/${file}` : `/books/${file}`,
    size: formatSize(fs.statSync(filePath).size),
  };
}
