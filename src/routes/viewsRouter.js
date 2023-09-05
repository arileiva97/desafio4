import { Router } from "express";
import ProductManager from "../manager/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    req.context.socketServer.emit();
    const products = await productManager.getProducts();
    res.render('home', {products});
});

router.get('/realtimeproducts', async (req, res) => {
    req.context.socketServer.emit();
    const products = await productManager.getProducts();
    res.render('realTimeProducts', {products});
});

router.post('/realtimeproducts', async (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const stock = req.body.stock;
    const category = req.body.category;
    await productManager.addProduct(title, description, price, stock, category);
    if(title === undefined || description === undefined || price === undefined || stock === undefined || category === undefined){
        return res.status(400);
    }
    req.context.socketServer.emit();
    res.status(200).send();
});

router.delete('/realtimeproducts/:productId', async (req, res) => {
    const productId = req.params.productId;
    await productManager.deleteProduct(parseInt(productId, 10));
    if(productId === undefined){
        return res.status(404).send();
    }
    res.send();
});

export default router; 

