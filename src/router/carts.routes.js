import { Router } from "express";
import { CartsManager } from "../managers/cartManager.js";

const router = Router();

const cartManager = new CartsManager();

router.post("/", async (req, res) => {
    try {
        const cart = await cartManager.createCart();
        res.status(200).send(cart);
    } catch (error) {
        console.log(error);
        res.status(404).send(error.message);
    }
});

router.get("/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartManager.getCartById(cid);
        res.status(200).send(cart);
    } catch (error) {
        console.log(error);
        res.status(404).send(error.message);
    }
});

router.post("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const updatedCart = await cartManager.addToCart(cid, pid);
        res.status(200).send(updatedCart);
    } catch (error) {
        console.log(error);
        res.status(404).send(error.message);
    }
});
export default router;