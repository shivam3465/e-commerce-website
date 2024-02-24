import cookieParser from "cookie-parser";
import express, { urlencoded } from "express";
import { ProductRouter } from "./router/product.router.js";
import { UserRouter } from "./router/user.router.js";

const app = express();

app.use(express.json());
app.use(urlencoded({extended: true,limit:"50mb"}));
app.use(cookieParser());

app.use('/api/v1',ProductRouter);
app.use('/api/v1',UserRouter);

export { app };
