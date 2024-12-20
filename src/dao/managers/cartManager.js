import fs from "fs";
import { v4 as uuid } from "uuid";
import { ProductManager } from "./productManager.js";

const productManager = new ProductManager();

export class CartsManager {
    constructor() {
        this.carts = [];
        this.path = "./src/managers/data/carts.json";
    }

    async createCart() {

        const newCart = {
            id: uuid(),
            products: []
        };

        this.carts.push(newCart);

        await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));

        return newCart;
    }

    async getCarts() {
        const file = await fs.promises.readFile(this.path, "utf-8");
        const fileParse = JSON.parse(file);

        this.carts = fileParse;
        return this.carts;
    }

    async getCartById(id) {
        await this.getCarts();
        const cart = this.carts.find((product) => product.id === id);
        if (!cart) throw new Error(`No se encuentra el carrito con el ID: ${id}`);

        return cart;
    }

    async addToCart(cid, pid) {
        // Obtengo el ID del carrito
        const cart = await this.getCartById(cid);
    
        if (!cart) throw new Error(`No se encuentra el carrito con el ID: ${cid}`);
    
        // Obtengo el ID del producto que quiero agregar usando ProductManager
        const product = await productManager.getProductById(pid);
    
        if (!product) throw new Error(`No se encuentra el producto con el ID: ${pid}`);
    
        // Valido si ese ID de producto ya se encuentra en ese ID de carrito
        const productIndex = cart.products.findIndex(prod => prod.id === pid);
    
        if (productIndex !== -1) {
            // Incremendo la cantidad del producto porque si es distinto de -1 quiere decir que ya existe ese ID de producto en ese ID de carrito (por logica find index cuando no encuentra arroja -1)
            cart.products[productIndex].quantity += 1;
        } else {
            // Este es el caso en el que find index arroja -1 es decir no existe ese ID de producto en ese ID de carrito aun, por lo tanto lo agrega por primera vez
            cart.products.push({ id: pid, quantity: 1 });
        }
    
        // Guardo en el archivo JSON
        await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    
        return cart;
    }
}