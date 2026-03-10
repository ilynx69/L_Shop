import fs from 'fs/promises';
import path from 'path';

// Определяем путь к папке с JSON-файлами
const DB_PATH = path.join(__dirname, '../models/db');

/**
 * Читает JSON-файл и возвращает распарсенный объект.
 * @param filename - имя файла (например, "users.json")
 */
export async function readJSON<T>(filename: string): Promise<T> {
    const filePath = path.join(DB_PATH, filename);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as T;
}

/**
 * Записывает данные в JSON-файл.
 * @param filename - имя файла
 * @param data - данные для записи
 */
export async function writeJSON<T>(filename: string, data: T): Promise<void> {
    const filePath = path.join(DB_PATH, filename);
    // Преобразуем в JSON с отступами для читаемости
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}