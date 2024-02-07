import express from 'express';
import redis from 'redis';
import { promisify } from 'util';

const app = express();
const port = 1245;

// Array containing the list of products
const listProducts = [
    { itemId: 1, itemName: 'Suitcase 250', price: 50, initialAvailableQuantity: 4 },
    { itemId: 2, itemName: 'Suitcase 450', price: 100, initialAvailableQuantity: 10 },
    { itemId: 3, itemName: 'Suitcase 650', price: 350, initialAvailableQuantity: 2 },
    { itemId: 4, itemName: 'Suitcase 1050', price: 550, initialAvailableQuantity: 5 }
];

// Function to get an item by its id
function getItemById(id) {
    return listProducts.find(product => product.itemId === id);
}

// Express route to list all available products
app.get('/list_products', (req, res) => {
    res.json(listProducts.map(product => ({
        itemId: product.itemId,
        itemName: product.itemName,
        price: product.price,
        initialAvailableQuantity: product.initialAvailableQuantity
    })));
});

// Create a Redis client
const client = redis.createClient();

// Promisify Redis commands
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

// Function to reserve stock by item id
async function reserveStockById(itemId, stock) {
    await setAsync(`item.${itemId}`, stock);
}

// Function to get current reserved stock by item id
async function getCurrentReservedStockById(itemId) {
    const reservedStock = await getAsync(`item.${itemId}`);
    return reservedStock ? parseInt(reservedStock) : 0;
}

// Express route to get product details by item id
app.get('/list_products/:itemId', async (req, res) => {
    const itemId = parseInt(req.params.itemId);
    const product = getItemById(itemId);
    if (!product) {
        return res.json({ status: 'Product not found' });
    }
    const currentQuantity = await getCurrentReservedStockById(itemId);
    res.json({ ...product, currentQuantity });
});

// Express route to reserve product by item id
app.get('/reserve_product/:itemId', async (req, res) => {
    const itemId = parseInt(req.params.itemId);
    const product = getItemById(itemId);
    if (!product) {
        return res.json({ status: 'Product not found' });
    }
    const currentQuantity = await getCurrentReservedStockById(itemId);
    if (currentQuantity <= 0) {
        return res.json({ status: 'Not enough stock available', itemId });
    }
    await reserveStockById(itemId, currentQuantity - 1);
    res.json({ status: 'Reservation confirmed', itemId });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});