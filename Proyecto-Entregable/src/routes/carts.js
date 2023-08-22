const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

let carts = [];

function loadCarts() {
    try {
        const data = fs.readFileSync('../carrito.json', 'utf-8');
        carts = JSON.parse(data);
    } catch (error) {
        carts = [];
    }
}

function saveDataToFile(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

router.post('/', (req, res) => {
    const newCart = { id: uuidv4(), products: [] };
    carts.push(newCart);
    saveDataToFile('../carrito.json', carts);
    res.json({ message: 'Carrito creado con éxito', cart: newCart });
});

router.get('/:cid', (req, res) => {
    loadCarts();
    const cid = req.params.cid;
    const cart = carts.find((cart) => cart.id === cid);
    if (!cart) {
        res.status(404).json({ error: 'Carrito no encontrado' });
    } else {
        res.json({ cart });
    }
});

router.post('/:cid/product/:pid', (req, res) => {
    loadCarts();
    const cid = req.params.cid;
    const pid = req.params.pid;
    const existingCart = carts.find((cart) => cart.id === cid);
    const productToAdd = { product: pid, quantity: 1 };

    if (!existingCart) {
        res.status(404).json({ error: 'Carrito no encontrado' });
        return;
    }

    const existingProductIndex = existingCart.products.findIndex((product) => product.product === pid);

    if (existingProductIndex !== -1) {
        existingCart.products[existingProductIndex].quantity += 1;
    } else {
        existingCart.products.push(productToAdd);
    }

    saveDataToFile('carrito.json', carts);
    res.json({ message: 'Producto agregado al carrito con éxito', cart: existingCart });
});

module.exports = router;