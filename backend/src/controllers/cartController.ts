import { Request, Response } from 'express';
import { readJson, writeJson } from '../utils/fileUtils';
import { Cart, CartItem, CartWithProducts } from '../models/cart';
import { Product } from '../models/product';

const CARTS_FILE = 'carts.json';
const PRODUCTS_FILE = 'products.json';

// Предполагаем, что в req.user есть id пользователя после авторизации
// (middleware должен добавлять req.user)

export const getCart = async (req: Request, res: Response) => {
  const userId = req.user?.id; // ← от middleware авторизации
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const carts = await readJson<Record<string, Cart>>(CARTS_FILE);
  const cart = carts[userId] || { userId, items: [], updatedAt: new Date().toISOString() };

  // Можно обогатить товарами
  const products = await readJson<Product[]>(PRODUCTS_FILE);
  const itemsWithProducts = cart.items.map(item => ({
    product: products.find(p => p.id === item.productId)!,
    quantity: item.quantity,
  })).filter(i => i.product); // убираем удалённые товары

  const total = itemsWithProducts.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  res.json({ userId, items: itemsWithProducts, total });
};

export const addToCart = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const { productId, quantity = 1 } = req.body;
  if (!productId || quantity < 1) return res.status(400).json({ error: 'Invalid data' });

  const products = await readJson<Product[]>(PRODUCTS_FILE);
  if (!products.some(p => p.id === productId)) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const carts = await readJson<Record<string, Cart>>(CARTS_FILE);
  let cart = carts[userId] || { userId, items: [], updatedAt: new Date().toISOString() };

  const existing = cart.items.find(i => i.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({ productId, quantity });
  }

  cart.updatedAt = new Date().toISOString();
  carts[userId] = cart;

  await writeJson(CARTS_FILE, carts);
  res.status(201).json({ message: 'Added to cart' });
};

export const updateCartItem = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const { quantity } = req.body;
  if (typeof quantity !== 'number' || quantity < 0) {
    return res.status(400).json({ error: 'Invalid quantity' });
  }

  const carts = await readJson<Record<string, Cart>>(CARTS_FILE);
  const cart = carts[userId];
  if (!cart) return res.status(404).json({ error: 'Cart not found' });

  const item = cart.items.find(i => i.productId === req.params.productId);
  if (!item) return res.status(404).json({ error: 'Item not found in cart' });

  if (quantity === 0) {
    cart.items = cart.items.filter(i => i.productId !== req.params.productId);
  } else {
    item.quantity = quantity;
  }

  cart.updatedAt = new Date().toISOString();
  await writeJson(CARTS_FILE, carts);
  res.json({ message: 'Cart updated' });
};

export const removeFromCart = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const carts = await readJson<Record<string, Cart>>(CARTS_FILE);
  const cart = carts[userId];
  if (!cart) return res.status(404).json({ error: 'Cart not found' });

  cart.items = cart.items.filter(i => i.productId !== req.params.productId);
  cart.updatedAt = new Date().toISOString();

  await writeJson(CARTS_FILE, carts);
  res.json({ message: 'Item removed' });
};

export const clearCart = async (userId: string) => {  // вызывается из delivery после успеха
  const carts = await readJson<Record<string, Cart>>(CARTS_FILE);
  if (carts[userId]) {
    carts[userId].items = [];
    carts[userId].updatedAt = new Date().toISOString();
    await writeJson(CARTS_FILE, carts);
  }
};