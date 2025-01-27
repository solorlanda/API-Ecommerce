import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
export const mongoUrl = process.env.MONGO_URL;


export const connectMongoDB = async () => {
    try {
        if (!mongoUrl) {
            throw new Error("La variable MONGO_URL no esta definida en .env");    
        }
        await mongoose.connect(mongoUrl);

        console.log("mongo connected");
    } catch (error) {
        console.log("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};
