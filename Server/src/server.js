import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/web";
import connectdb from "./config/connectdb"
import cors from "cors"
require("dotenv").config();
let app = express();

//config app
app.use(
    cors({
        origin: process.env.URL_REACT, // Chỉ cho phép frontend gọi API
        credentials: true // Cho phép gửi cookies và headers xác thực
    })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}))
viewEngine(app);
initWebRoutes(app);
connectdb();
let PORT = process.env.PORT;
app.listen(PORT, ()=> {
    console.log("Backend is running on the port :"+PORT)
})