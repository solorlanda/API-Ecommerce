import { Router } from "express";
import { productDao } from "../dao/mongoDao/products.dao.js";

const router = Router();

router.get("/", async (req, res) => {
    const { limit, page, sort, category, status} = req.query;
    try {
        const options = {
            limit: limit || 10,
            page: page || 1,
            sort: {
                price: sort === "asc" ? 1 : -1 
            },
            lean: true
        };

        if(status){
            const products = await productDao.getAll({ status: status }, options);
            return res.json({ status: "success", payload: products});
        }

        if(category){
            const products = await productDao.getAll({ status: status }, options);
            return res.json({ status: "success", payload: products});
        }

        const products = await productDao.getAll({}, options)
        res.json({ status: "success", payload: products});
    } catch (error) {
        console.log(error);
        res.status(404).send(error.message);
    }
});

router.get("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await productDao.getById(pid);
        if(!product) return res.json({ status: "error", message: `Product id ${pid} not found`});

        res.json({ status: "success", payload: product});
    } catch (error) {
        console.log(error);
        res.status(404).send(error.message);
    }
});

router.post("/", async (req, res) => {
    const body = req.body;
    try {
        const product = await productDao.create(body);
        res.json({ status: "success", payload: product});
    } catch (error) {
        console.log(error);
        res.status(404).send(error.message);
    }
});

router.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const body = req.body;
    try {
        const findProduct = await productDao.getById(pid);
        if(!findProduct) return res.json({ status: "error", message: `Product ID ${pid} not found`})

        const product = await productDao.update(pid, body)
        res.json({ status: "ok", payload: product });

    } catch (error) {
        console.log(error);
        res.status(404).send(error.message);
    }
});

router.delete("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
        const findProduct = await productDao.getById(pid);
        if(!findProduct) return res.json({ status: "error", message: `Product ID ${pid} not found`})

        await productDao.delete(pid);
        res.json({ status: "success", payload: `Product ID ${pid} eliminado`});
    } catch (error) {
        console.log(error);
        res.status(404).send(error.message);
    }
})

export default router;