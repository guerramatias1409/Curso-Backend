const express = require('express');
const ProductManager = require('../controllers/ProductManager.js');

const router = express.Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const productsToShow = await productManager.getProducts(limit);
    res.json({ products: productsToShow });
});

router.get('/:pid', async (req, res) => {
    const pid = parseInt(req.params.pid);
    const product = await productManager.getProductById(pid)
    res.json({ product });
    /*
    loadProducts();
    const pid = parseInt(req.params.pid);
    const product = products.find((product) => product.id === pid);
    if (!product) {
        res.status(404).json({ error: 'Producto no encontrado' });
    } else {
        res.json({ product });
    }
    */
});

router.post('/', async (req, res) => {
    const addedProduct = await productManager.addProduct(req.body);
    res.json({ message: 'Producto agregado con éxito', product: addedProduct });

    /* 
    loadProducts();
    const productExists = products.some(product => product.code === req.body.code);
    if(productExists){
        res.status(404).json({ error: 'Ya existe un producto con el código ingresado' });
        return;
    }
    const newProduct = { id: generateId(), ...req.body, ...{status: true}};
    products.push(newProduct);
    saveDataToFile(filePath, products);
    res.json({ message: 'Producto agregado con éxito', product: newProduct });
    */
});

router.put('/:pid', async (req, res) => {
    const updatedProduct = await productManager.updatedProduct(req.params.pid, req.body);
    res.json({ message: 'Producto actualizado con éxito', product: updatedProduct });

    /*
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
    */
});

router.delete('/:pid', async (req, res) => {
    const pid = parseInt(req.params.pid);
    const deletedProduct = productManager.deletedProduct(pid);
    res.json({ message: 'Producto eliminado con éxito', product: deletedProduct });

    /*
    loadProducts();
    const productIndex = products.findIndex((product) => product.id === pid);
    if (productIndex !== -1) {
        const deletedProduct = products.splice(productIndex, 1)[0];
        saveDataToFile(filePath, products);
        res.json({ message: 'Producto eliminado con éxito', product: deletedProduct });
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
    */
});

module.exports = router;