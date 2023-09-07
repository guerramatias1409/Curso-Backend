const express = require("express")
const ProductManager = require('../controllers/ProductManager.js');

const productManager = new ProductManager()

const router = express.Router()

router.get("/", async (req, res) => {
    const listaproductos = await productManager.getProducts()
    res.render("home", { listaproductos })
})

router.get("/realtimeproducts", async (req, res) => {
    res.render("realTimeProducts")
})

module.exports = router