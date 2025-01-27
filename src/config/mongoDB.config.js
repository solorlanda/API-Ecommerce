import mongoose from "mongoose";

const mongoUrl = "mongodb+srv://solorlanda:Arielito1997.@cluster-backendi.2b5pc.mongodb.net/Ecommerce";

export const connectMongoDB = async () => {
    try {
        await mongoose.connect(mongoUrl);
        console.log("mongo connected");
    } catch (error) {
        console.log("Error connecting to MongoDB:", error);
    }
};

export { mongoUrl };