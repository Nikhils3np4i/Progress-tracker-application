const express = require('express')
const app = express();
const { userRouter } = require('./routes/user')
require('dotenv').config();
const mongoose = require('mongoose')

const cookieParser = require('cookie-parser')
app.use(cookieParser());

app.use(express.json())
async function connectToDB(){

    const port = 3000;
    try{
        await mongoose.connect(process.env.MONGO_URL);
        app.listen(port);
        console.log("Connected to db, Server is now listening to port " + port);
    } catch(e){
        console.log("Error while launching server " + e);
    }
}
connectToDB()




//Routes of this application
app.use("/api/v1/user", userRouter);
