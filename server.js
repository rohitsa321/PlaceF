const express=require('express');
const cors=require("cors");
const env=require('dotenv').config({path:'./.env'});
const connectDB=require('./connectDB');

const app=express();
const port=process.env.PORT|3001;

app.use(cors());
app.use(express.json());

connectDB();

//publicizing /uploads
app.use('/uploads',express.static('uploads'));

//user
//route /login,/singin
const userRouter=require("./routes/userRoutes");
app.use('/',userRouter);

//places
//route /add,/,/:userId/add
const placeRouter=require("./routes/placeRoutes");
app.use('/',placeRouter);

app.get("/",(req,res)=>res.send("hello"));

app.listen(port,()=>console.log("running"));