import express from "express";
import colors from "colors"; // "type": "module",in package json for EcmaScript6 module
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import cors from 'cors'
import categoryRoutes from "./routes/categoryRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import path from 'path'

//configure env
dotenv.config(); //if .env file is in another path then use as dotenv.config({path:html&css})

//DBconnection
connectDB();

//rest object
const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname,'./client/build')))

//rest api
app.use('*',function(req,res){
  res.sendFile(path.join(__dirname,'./client/build/index.html'))
})

//routes
app.use("/api/v1/auth", authRoute); //comming from authRoute

//admin category create route
app.use("/api/v1/auth",categoryRoutes)

//admin product create route
app.use("/api/v1/auth/product",productRoutes)



//user .env as port process predefined then add .env and use PORT variable
let PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  // console.log(
  //   `port run at ${PORT} and developement by ${process.env.DEV_MODE}`.bgCyan
  //     .white
  // );
});
