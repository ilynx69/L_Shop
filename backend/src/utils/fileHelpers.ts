import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(__dirname, '../models/db');

export async function readJSON<T>(filename: string): Promise<T> {
    const filePath = path.join(DB_PATH, filename);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
}

export async function writeJSON<T>(filename: string, data: T): Promise<void> {
    const filePath = path.join(DB_PATH, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}