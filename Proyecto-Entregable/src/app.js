const express = require('express');
const handlebars = require('express-handlebars');
const io = require('socket.io');

const productsRouter = require('./routes/products.js');
const cartsRouter = require('./routes/carts.js');
const viewRouter = require('./routes/view.js');

const ProductManager = require('./controllers/ProductManager.js')

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static("./src" + "/public"))

app.engine("handlebars", handlebars.engine())
app.set("views", "./src" + "/views")
app.set("view engine", "handlebars")

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewRouter);

const httpServer = app.listen(port, () => {
    console.log(`Servidor Express corriendo en el puerto ${port}`);
})

const productManager = new ProductManager()
const socketServer = new io.Server(httpServer)

socketServer.on("connection", async (socket) => {
    console.log("Cliente conectado");
    const products = await productManager.getProducts();
    socket.emit('productos', products);

    socket.on('addProduct', async data => {
        await productManager.addProduct(data);
        const updatedProducts = await productManager.getProducts(); // Obtener la lista actualizada de productos
        socket.emit('productosupdated', updatedProducts);
    });

    socket.on("deleteProduct", async (id) => {
        console.log("ID del producto a eliminar:", id);
        await productManager.deleteProduct(id);
        const updatedProducts = await productManager.getProducts();
        socketServer.emit("productosupdated", updatedProducts);
    });
})