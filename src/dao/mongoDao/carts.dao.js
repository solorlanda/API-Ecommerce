import { cartModel } from "../models/cart.model.js";

class CartDao {
    async getAll() {
        try {
            return await cartModel.find();
        } catch (error) {
            console.error("Error al obtener todos los carritos:", error.message);
            throw error;
        }
    }

    async getById(id) {
        try {
            // Incluye .populate en la consulta de Mongoose
            return await cartModel.findById(id).populate("products.product");
        } catch (error) {
            console.error(`Error al obtener el carrito con ID ${id}:`, error.message);
            throw error;
        }
    }

    async create(data) {
        try {
            return await cartModel.create(data);
        } catch (error) {
            console.error("Error al crear el carrito:", error.message);
            throw error;
        }
    }

    async update(id, data) {
        try {
            return await cartModel.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            console.error(`Error al actualizar el carrito con ID ${id}:`, error.message);
            throw error;
        }
    }

    async delete(id) {
        try {
            return await cartModel.findByIdAndDelete(id);
        } catch (error) {
            console.error(`Error al eliminar el carrito con ID ${id}:`, error.message);
            throw error;
        }
    }
}

export const cartDao = new CartDao();
