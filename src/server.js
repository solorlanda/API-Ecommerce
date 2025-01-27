import express from "express";
import productsRoutes from "./router/products.routes.js";
import cartsRoutes from "./router/carts.routes.js";
import authRouter from "./router/auth.routes.js";
import { connectMongoDB, mongoUrl } from "./config/mongoDB.config.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import passport from "passport";
import { initializePassport } from "./config/passport.config.js";
import { JWT_SECRET } from "./utils/jwt.js";

const app = express();

connectMongoDB();
const port = 8080;

// Express config
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: JWT_SECRET,
        store: MongoStore.create({
            mongoUrl,
            ttl: 15,
        }),
        resave: false,
        saveUninitialized: false,
    })
);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);

// Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Port
app.listen(port, () => {
    console.log(`Server on port ${port}`);
});
