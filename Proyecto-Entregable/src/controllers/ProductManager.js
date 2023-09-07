const fs = require('fs');
const filePath = './src/products.json';

class ProductManager {
    #products;
    #path

    constructor() {
      this.#path = filePath;
      this.#init()
      this.#products = [];
      this.lastProductId = 10;
    }

    #init = async () => {
      if (!fs.existsSync(this.#path)) {
        //Create file if not exists
        await fs.promises.writeFile(this.#path, JSON.stringify([], null, 2), 'utf-8');
      }
    }

    loadProducts = async(limit) => {
      try {
        if (!fs.existsSync(this.#path)) return 'Error: El archivo no existe';
        const data = await fs.promises.readFile(this.#path, 'utf-8');
        const products = JSON.parse(data);
        this.#products = limit > 0 ? products.slice(0, limit) : products;
      } catch (error) {
        this.#products = [];
        console.error('Error: No se pudieron leer los productos');
      }
    }

    saveProducts = async() => {
      if (!fs.existsSync(this.#path)) return 'Error: El archivo no existe';
      await fs.promises.writeFile(this.#path, JSON.stringify(this.#products, null, 2), 'utf-8');
    }

    getProducts = async(limit) => {
      await this.loadProducts(limit);
      return this.#products;
    }
  
    getProductById = async(id) => {
      await this.loadProducts();
      const product = this.#products.find((product) => product.id === id);
      if (!product) {
        return '\n Error: Producto no encontrado';
      }
      return product;
    }

    addProduct = async(product) => {
      if (!product || typeof product !== 'object') {
        console.error('Error: El producto no es válido');
        return;
      }
  
      const { title, description, price, thumbnail, code, stock } = product;
  
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        console.error('Error: Todos los campos son obligatorios');
        return;
      }

      await this.loadProducts();
  
      if (this.#products.some((existingProduct) => existingProduct.code === code)) {
        console.error('Error: El código de producto ya existe');
        return;
      }
  
      this.lastProductId++;
      const newProduct = { id: this.lastProductId, ...product, ...{status: true} };
      this.#products.push(newProduct);
      await this.saveProducts();
      console.log('Producto agregado con éxito');
      return newProduct;
    }

    updateProduct = async(id, updatedProduct) => {
      await this.loadProducts();
      const productIndex = this.#products.findIndex((product) => product.id === id);
      if (productIndex !== -1) {
        this.#products[productIndex] = { ...this.#products[productIndex], ...updatedProduct };
        await this.saveProducts();
        console.log('Producto actualizado con éxito:');
        return this.#products[productIndex];
      } else {
        console.error('Error: Producto no encontrado.');
      }
    }

    deleteProduct = async(id) =>  {
      await this.loadProducts();
      const productIndex = this.#products.findIndex((product) => product.id === id);
      if (productIndex !== -1) {
        const deletedProduct = this.#products[productIndex];
        this.#products.splice(productIndex, 1)[0];
        await this.saveProducts();
        console.log('Producto eliminado con éxito:');
        return deletedProduct;
      } else {
        console.error('Error: Producto no encontrado.');
      }
    }
  }

  module.exports = ProductManager;