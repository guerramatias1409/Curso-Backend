const express = require('express');
const ProductManager = require('./ProductManager');

const app = express();
const port = 8080;

const productManager = new ProductManager('./src/products.json');

app.use(express.urlencoded({extended:true}));

app.get('/products', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 0;
    const products = await productManager.getProducts(limit);
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

app.get('/products/:pid', async (req, res) => {
  const pid = parseInt(req.params.pid);
  try {
    const product = await productManager.getProductById(pid);
    res.json({ product });
  } catch (error) {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

app.listen(port, () => {
    console.log(`Servidor Express corriendo en el puerto ${port}`);
  });