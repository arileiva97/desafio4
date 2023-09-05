import { Router } from "express";
import ProductManager from '../manager/ProductManager.js';
const productManager = new ProductManager();

const router = Router();

router.get('/', async (req, res) => {
    const limit = req.query.limit;
    const products = await productManager.getProducts();

    if(limit){
        return res.send(products.slice(0, limit));
    }

    res.send(products);
});

router.get('/search/:productCode', async (req, res) => {
    const productCode = req.params.productCode;
    const productSearched = await productManager.getProductByCode(productCode);
    if(productSearched === undefined){
        return res.status(404).send();
    }

    res.send(productSearched);
});

router.get('/:productId', async (req, res) => {
    const productId = req.params.productId;
    const productSearched = await productManager.getProductById(parseInt(productId, 10));
    if(productSearched === undefined){
        return res.status(404).send();
    }

    res.send(productSearched);
});

router.post('/', async (req, res) => {
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

router.put('/:productId', async (req, res) => {
    const productId = req.params.productId;
    const productProp = req.body.productProp;
    const change = req.body.change;
    if(productId === undefined || productProp === undefined || change === undefined){
        return res.status(400);
    }
    await productManager.updateProduct(parseInt(productId, 10), productProp, change);
    res.send();
});

router.delete('/:productId', async (req, res) => {
    const productId = req.params.productId;
    await productManager.deleteProduct(parseInt(productId, 10));
    if(productId === undefined){
        return res.status(404).send();
    }
    res.send();
});

export default router;