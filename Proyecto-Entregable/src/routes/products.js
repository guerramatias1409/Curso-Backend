const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const filePath = './src/products.json';

let products = [];

function loadProducts() {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        products = JSON.parse(data);
    } catch (error) {
        console.log('ERROR AL LEER PRODUCTS')
        products = [];
    }
}

function saveDataToFile(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

router.get('/', (req, res) => {
    loadProducts()
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const productsToShow = limit ? products.slice(0, limit) : products;
    res.json({ products: productsToShow });
});

router.get('/:pid', (req, res) => {
    loadProducts();
    const pid = parseInt(req.params.pid);
    const product = products.find((product) => product.id === pid);
    if (!product) {
        res.status(404).json({ error: 'Producto no encontrado' });
    } else {
        res.json({ product });
    }
});

router.post('/', (req, res) => {
    loadProducts();
    const productExists = products.some(product => product.code === req.body.code);
    if(productExists){
        res.status(404).json({ error: 'Ya existe un producto con el código ingresado' });
        return;
    }
    const newProduct = { id: uuidv4(), ...req.body };
    products.push(newProduct);
    saveDataToFile(filePath, products);
    res.json({ message: 'Producto agregado con éxito', product: newProduct });
});

router.put('/:pid', (req, res) => {
    loadProducts();
    const pid = parseInt(req.params.pid);
    const updatedProduct = req.body;
    const productIndex = products.findIndex((product) => product.id === pid);
    if (productIndex !== -1) {
        products[productIndex] = { ...products[productIndex], ...updatedProduct };
        saveDataToFile(filePath, products);
        res.json({ message: 'Producto actualizado con éxito', product: products[productIndex] });
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

router.delete('/:pid', (req, res) => {
    loadProducts();
    const pid = parseInt(req.params.pid);
    const productIndex = products.findIndex((product) => product.id === pid);
    if (productIndex !== -1) {
        const deletedProduct = products.splice(productIndex, 1)[0];
        saveDataToFile(filePath, products);
        res.json({ message: 'Producto eliminado con éxito', product: deletedProduct });
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

module.exports = router;