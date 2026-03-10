import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3002;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// Тестовые товары
const products = [
    { id: '1', name: 'iPhone 15', description: 'Смартфон Apple', price: 999, category: 'Смартфоны', available: true, image: '' },
    { id: '2', name: 'Samsung Galaxy S24', description: 'Смартфон Samsung', price: 899, category: 'Смартфоны', available: true, image: '' },
    { id: '3', name: 'MacBook Pro', description: 'Ноутбук Apple', price: 1999, category: 'Ноутбуки', available: false, image: '' },
    { id: '4', name: 'Наушники Sony', description: 'Беспроводные наушники', price: 399, category: 'Аксессуары', available: true, image: '' }
];

// Эндпоинты
app.get('/api/products', (req, res) => {
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
});

app.get('/api/categories', (req, res) => {
    const categories = [...new Set(products.map(p => p.category))];
    res.json(categories);
});

// Корзина (простая заглушка)
let cart: any = { userId: 'test-user', items: [] };

app.get('/api/cart', (req, res) => {
    res.json(cart);
});

app.post('/api/cart/items', (req, res) => {
    const { productId, quantity } = req.body;
    const existing = cart.items.find((i: any) => i.productId === productId);
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.items.push({ productId, quantity });
    }
    res.status(201).json({ message: 'added' });
});

app.put('/api/cart/items/:productId', (req, res) => {
    const productId = req.params.productId;
    const { quantity } = req.body;
    const item = cart.items.find((i: any) => i.productId === productId);
    if (item) {
        item.quantity = quantity;
    }
    res.json({ message: 'updated' });
});

app.delete('/api/cart/items/:productId', (req, res) => {
    const productId = req.params.productId;
    cart.items = cart.items.filter((i: any) => i.productId !== productId);
    res.json({ message: 'removed' });
});

app.delete('/api/cart', (req, res) => {
    cart.items = [];
    res.json({ message: 'cleared' });
});

app.listen(PORT, () => {
    console.log(`✅ Тестовый бэкенд-2 запущен на порту ${PORT}`);
});