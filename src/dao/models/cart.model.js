import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = new mongoose.Schema({
    products: {
        type: Array,
        default: [ { product: { type: mongoose.Schema.Types.ObjectId, ref: "products" }, quantity: Number } ],
    },
    });

export const cartModel = mongoose.model(cartCollection, cartSchema);
