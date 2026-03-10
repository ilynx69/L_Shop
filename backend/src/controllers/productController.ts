import { Request, Response } from 'express';
import { readJson, writeJson } from '../utils/fileUtils';
import { Product } from '../models/product';

const PRODUCTS_FILE = 'products.json';

export const getProducts = async (req: Request, res: Response) => {
  let products: Product[] = await readJson<Product[]>(PRODUCTS_FILE);

  // Поиск ?q=
  const q = (req.query.q as string)?.toLowerCase();
  if (q) {
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) || (p.description?.toLowerCase().includes(q) ?? false)
    );
  }

  // Фильтрация
  if (req.query.category) {
    products = products.filter(p => p.category === req.query.category);
  }
  if (req.query.available) {
    const available = req.query.available === 'true';
    products = products.filter(p => p.available === available);
  }

  // Сортировка
  const sort = req.query.sort as string;
  if (sort === 'price_asc') {
    products.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    products.sort((a, b) => b.price - a.price);
  }

  res.json(products);
};

export const getProductById = async (req: Request, res: Response) => {
  const products = await readJson<Product[]>(PRODUCTS_FILE);
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
};

export const getCategories = async (_req: Request, res: Response) => {
  const products = await readJson<Product[]>(PRODUCTS_FILE);
  const categories = [...new Set(products.map(p => p.category))];
  res.json(categories);
};