import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';

const DATA_DIR = join(__dirname, '../../data');

export async function readJson<T>(filename: string): Promise<T> {
  const filePath = join(DATA_DIR, filename);

  try {
    const data = await readFile(filePath, 'utf-8');
    return JSON.parse(data) as T;
  } catch (err: any) {
    if (err?.code === 'ENOENT') {
      return [] as T; // или {} as T — в зависимости от файла
    }
    throw err;
  }
}

export async function writeJson<T>(filename: string, data: T): Promise<void> {
  const filePath = join(DATA_DIR, filename);

  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}