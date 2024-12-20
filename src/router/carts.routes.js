import { Router } from "express";

import { productDao } from "../dao/mongoDao/products.dao.js";
import { cartDao } from "../dao/mongoDao/carts.dao.js";

const router = Router();

router.post("/", async (req, res) => {
    try {
        const cart = await cartDao.create({});
        res.json({ status: "success", payload: cart});
    } catch (error) {
        console.log(error);
        res.status(404).send(error.message);
    }
});


router.post("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;

    try {
        // Verificar si el producto existe en la base de datos
        const findProduct = await productDao.getById(pid);
        if (!findProduct) 
            return res.json({ status: "error", message: `Product ID ${pid} not found` });

        // Obtener el carrito por su ID
        const cart = await cartDao.getById(cid);
        if (!cart) 
            return res.json({ status: "error", message: `Cart ID ${cid} not found` });

        // Buscar si el producto ya está en el carrito
        const productInCart = cart.products.find((productCart) => productCart.product.toString() === pid);

        if (productInCart) {
            // Si el producto ya existe, incrementar la cantidad
            productInCart.quantity++;
        } else {
            // Si el producto no existe en el carrito, agregarlo con cantidad 1
            cart.products.push({ product: pid, quantity: 1 });
        }

        // Actualizar el carrito
        const updatedCart = await cartDao.update(cid, { products: cart.products }, { new: true });

        // Enviar respuesta con el carrito actualizado
        res.json({ status: "success", payload: updatedCart });

    } catch (error) {
        console.log(error);
        res.status(404).send(error.message);
    }
});


router.put("/:cid", async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;

    try {
        const cart = await cartDao.getById(cid);
        if (!cart) {
            return res.json({ status: "error", message: `Cart id ${cid} not found` });
        }

        cart.products = products;

        const updatedCart = await cartDao.update(cid, cart);
        res.json({ status: "success", payload: updatedCart });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

router.put("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await cartDao.getById(cid);
        if (!cart) {
            return res.json({ status: "error", message: `Cart id ${cid} not found` });
        }

        const product = cart.products.find((prod) => prod.product.toString() === pid);
        if (!product) {
            return res.json({ status: "error", message: `Product ID ${pid} not found in cart` });
        }

        product.quantity = quantity;

        const updatedCart = await cartDao.update(cid, cart);
        res.json({ status: "success", payload: updatedCart });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:cid", async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await cartDao.getById(cid);
        if (!cart) {
            return res.json({ status: "error", message: `Cart ID ${cid} not found` });
        }

        cart.products = [];

        const updatedCart = await cartDao.update(cid, cart);
        res.json({ status: "success", payload: updatedCart });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

router.get("/:cid", async (req, res) => {
    const { cid } = req.params;

    try {
        // Obtener el carrito por ID
        const cart = await cartDao.getById(cid);
        
        // Verificar si el carrito no existe
        if (!cart) {
            return res.json({ status: "error", message: `Cart ID ${cid} not found` });
        }

        // Asegurarnos de que el método populate se pueda usar en el carrito
        await cart.populate("products.product");

        // Devolver el carrito con los productos poblados
        res.json({ status: "success", payload: cart });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});


export default router;