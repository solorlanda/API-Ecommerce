import mongoose from "mongoose";

export const connectMongoDB = async () => {
    try {
        mongoose.connect("mongodb+srv://solorlanda:Arielito1997.@cluster-backendi.2b5pc.mongodb.net/Ecommerce")
        console.log("mongo connected")
    } catch (error) {
        console.log(error);
    }
}