const express = require('express');
const router = express.Router();
const fs = require('fs');
const filePath = './src/carts.json';

let lastCartId = 5; 
let carts = [];

function generateId(){
    lastCartId++;
    return lastCartId;
}

function loadCarts() {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        carts = JSON.parse(data);
    } catch (error) {
        console.log('ERROR AL LEER CARTS')
        carts = [];
    }
}

function saveDataToFile(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

router.post('/', (req, res) => {
    loadCarts()
    const newCart = { id: generateId(), products: [] };
    carts.push(newCart);
    saveDataToFile(filePath, carts);
    res.json({ message: 'Carrito creado con éxito', cart: newCart });
});

router.get('/:cid', (req, res) => {
    loadCarts();
    const cid = parseInt(req.params.cid);
    const cart = carts.find((cart) => cart.id === cid);
    if (!cart) {
        res.status(404).json({ error: 'Carrito no encontrado' });
    } else {
        res.json( cart.products );
    }
});

router.post('/:cid/product/:pid', (req, res) => {
    loadCarts();
    const cid = parseInt(req.params.cid);
    const existingCart = carts.find((cart) => cart.id === cid);
    if (!existingCart) {
        res.status(404).json({ error: 'Carrito no encontrado' });
        return;
    }

    const pid = parseInt(req.params.pid);
    
    const productToAdd = { id: pid, quantity: 1 };

    const existingProductIndex = existingCart.products.findIndex((product) => product.id === pid);

    if (existingProductIndex !== -1) {
        existingCart.products[existingProductIndex].quantity += 1;
    } else {
        existingCart.products.push(productToAdd);
    }

    saveDataToFile(filePath, carts);
    res.json({ message: 'Producto agregado al carrito con éxito', cart: existingCart });
});

module.exports = router;