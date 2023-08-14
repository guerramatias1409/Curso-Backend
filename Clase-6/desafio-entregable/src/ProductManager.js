const fs = require('fs');

class ProductManager {
    #products;
    #path

    constructor(path) {
      this.#products = [];
      this.#path = path;
      this.lastProductId = 0;
    }

    loadProducts = async(limit) => {
      try {
        if(!fs.existsSync(this.#path)){
          //Create file if not exists
          await fs.promises.writeFile(this.#path, JSON.stringify([], null, 2), 'utf-8');
        }
        const data = await fs.promises.readFile(this.#path, 'utf-8');
        const products = JSON.parse(data);
        this.#products = limit > 0 ? products.slice(0, limit) : products;
    
      } catch (error) {
        this.#products = [];
        console.error('Error: No se pudieron leer los productos');
      }
    }

    saveProducts = async() => {
      await fs.promises.writeFile(this.#path, JSON.stringify(this.#products, null, 2), 'utf-8');
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
      const newProduct = { id: this.lastProductId, ...product };
      this.#products.push(newProduct);
      await this.saveProducts();
      console.log('Producto agregado con éxito');
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

    updateProduct = async(id, updatedProduct) => {
      await this.loadProducts();
      const productIndex = this.#products.findIndex((product) => product.id === id);
      if (productIndex !== -1) {
        this.#products[productIndex] = { id, ...updatedProduct };
        await this.saveProducts();
        console.log('Producto actualizado con éxito:');
      } else {
        console.error('Error: Producto no encontrado.');
      }
    }

    deleteProduct = async(id) =>  {
      await this.loadProducts();
      const productIndex = this.#products.findIndex((product) => product.id === id);
      if (productIndex !== -1) {
        this.#products.splice(productIndex, 1)[0];
        await this.saveProducts();
        console.log('Producto eliminado con éxito:');
      } else {
        console.error('Error: Producto no encontrado.');
      }
    }
  }

  module.exports = ProductManager;