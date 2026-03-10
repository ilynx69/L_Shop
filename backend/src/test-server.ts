import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'; // ВАЖНО!
import { readJSON, writeJSON } from './utils/fileUtils';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    available: boolean;
    image: string;
}

interface CartItem {
    productId: string;
    quantity: number;
}

interface Cart {
    userId: string;
    items: CartItem[];
}

const app = express();
const PORT = 3002;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser()); // обязательно!

const defaultProducts: Product[] = [
    { id: '1', name: 'iPhone 15', description: 'Смартфон Apple', price: 999, category: 'Смартфоны', available: true, image: '' },
    { id: '2', name: 'Samsung Galaxy S24', description: 'Смартфон Samsung', price: 899, category: 'Смартфоны', available: true, image: '' },
    { id: '3', name: 'MacBook Pro', description: 'Ноутбук Apple', price: 1999, category: 'Ноутбуки', available: false, image: '' },
    { id: '4', name: 'Наушники Sony', description: 'Беспроводные наушники', price: 399, category: 'Аксессуары', available: true, image: '' }
];

// ========== ТОВАРЫ ==========
app.get('/api/products', async (req, res) => {
    try {
        let products: Product[] = await readJSON<Product>('products.json');
        if (products.length === 0) {
            products = defaultProducts;
            await writeJSON('products.json', products);
        }
        let filtered = [...products];
        const search = req.query.q as string;
        if (search) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.description.toLowerCase().includes(search.toLowerCase())
            );
        }
        const sort = req.query.sort as string;
        if (sort === 'price_asc') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sort === 'price_desc') {
            filtered.sort((a, b) => b.price - a.price);
        }
        const category = req.query.category as string;
        if (category) {
            filtered = filtered.filter(p => p.category === category);
        }
        const available = req.query.available === 'true';
        if (available) {
            filtered = filtered.filter(p => p.available);
        }
        res.json(filtered);
    } catch (error) {
        console.error('Products error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/categories', async (req, res) => {
    try {
        let products: Product[] = await readJSON<Product>('products.json');
        if (products.length === 0) {
            products = defaultProducts;
            await writeJSON('products.json', products);
        }
        const categories = [...new Set(products.map(p => p.category))];
        res.json(categories);
    } catch (error) {
        console.error('Categories error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ========== КОРЗИНА ==========
app.get('/api/cart', async (req, res) => {
    try {
        console.log('Cookies:', req.cookies); // для отладки
        const userId = req.cookies?.session;
        if (!userId) {
            console.log('No session cookie!');
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const carts: Cart[] = await readJSON<Cart>('carts.json');
        let cart = carts.find(c => c.userId === userId);
        if (!cart) {
            cart = { userId, items: [] };
            carts.push(cart);
            await writeJSON('carts.json', carts);
        }
        res.json(cart);
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/cart/items', async (req, res) => {
    try {
        console.log('Cookies:', req.cookies);
        const userId = req.cookies?.session;
        if (!userId) {
            console.log('No session cookie!');
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const { productId, quantity } = req.body;
        const carts: Cart[] = await readJSON<Cart>('carts.json');
        let cart = carts.find(c => c.userId === userId);
        if (!cart) {
            cart = { userId, items: [] };
            carts.push(cart);
        }
        const existing = cart.items.find(i => i.productId === productId);
        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }
        await writeJSON('carts.json', carts);
        res.status(201).json({ message: 'Item added' });
    } catch (error) {
        console.error('Add item error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.put('/api/cart/items/:productId', async (req, res) => {
    try {
        const userId = req.cookies?.session;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });
        const productId = req.params.productId;
        const { quantity } = req.body;
        const carts: Cart[] = await readJSON<Cart>('carts.json');
        const cart = carts.find(c => c.userId === userId);
        if (!cart) return res.status(404).json({ error: 'Cart not found' });
        const item = cart.items.find(i => i.productId === productId);
        if (!item) return res.status(404).json({ error: 'Item not found' });
        item.quantity = quantity;
        await writeJSON('carts.json', carts);
        res.json({ message: 'Item updated' });
    } catch (error) {
        console.error('Update item error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/api/cart/items/:productId', async (req, res) => {
    try {
        const userId = req.cookies?.session;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });
        const productId = req.params.productId;
        const carts: Cart[] = await readJSON<Cart>('carts.json');
        const cart = carts.find(c => c.userId === userId);
        if (!cart) return res.status(404).json({ error: 'Cart not found' });
        cart.items = cart.items.filter(i => i.productId !== productId);
        await writeJSON('carts.json', carts);
        res.json({ message: 'Item removed' });
    } catch (error) {
        console.error('Remove item error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/api/cart', async (req, res) => {
    try {
        const userId = req.cookies?.session;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });
        const carts: Cart[] = await readJSON<Cart>('carts.json');
        const cart = carts.find(c => c.userId === userId);
        if (cart) {
            cart.items = [];
            await writeJSON('carts.json', carts);
        }
        res.json({ message: 'Cart cleared' });
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Бэкенд товаров и корзины (с файлами) запущен на порту ${PORT}`);
});