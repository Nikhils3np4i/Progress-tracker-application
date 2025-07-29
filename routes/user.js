const express = require('express')
const Router = express.Router;
const { userModel, todoModel } = require("../db");
const jwt = require('jsonwebtoken');
const { user_JWT_Secret } = require('../config');
const { userAuthMiddleware } = require('../userAuth');

const userRouter = Router();

userRouter.post("/signup", async(req, res)=> {
    const { email, password, firstName, lastName } = req.body;
    
    try{

        const existingUser = await userModel.findOne({
            email: email
        })
        if(existingUser){
            res.status(403).json({
                message: "Email already in use"
            })
        } else {
            await userModel.create({
                email,
                password,
                firstName,
                lastName
            })
            res.json({
                message:" Account created "
            })
        }
    } catch(e){
        console.log("Error while creating user account ", e);
        res.status(500).json({
            message: "Internal server error"
        })
    }
});


userRouter.post("/login", async(req, res)=> {
    const { email, password } = req.body;

    try{

        const response = await userModel.findOne({
            email,        
            password
        })
        if(!response){
            res.status(403).send({
                message:"User not found"
            })
        } else {
            const token = jwt.sign({
                id: response._id.toString()
            }, user_JWT_Secret);
            res.cookie("token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "strict"
            })
            res.send({
                message:"User logged in",
                user: {
                    id: response._id,
                    email: response.email,
                    firstName: response.firstName,
                    lastName: response.lastName
                }
            })
        }
    }catch(err){
        console.log("Error while loggin in the user " + e);
        res.status(500).send({
            message: "Internal server error"
        })
    }
})

userRouter.post("/createTodo", userAuthMiddleware, async(req, res)=> {
    const userId = req.userId;
    const { title, done } = req.body;
    try {

        await todoModel.create({
            title,
            done,
            userId
        });
        res.json({
            message:"Task added"
        })
    }catch(err){
        console.log("Error while adding a new task "+ e)
        res.status(500).send({
            message:"Internal server error, Couldn't add a new task"
        })
    }
});

userRouter.get("/todos", userAuthMiddleware, async (req, res)=> {
    const userId = req.userId;
    try{

        const response = await todoModel.find({
            userId
        })
        res.json({
            response
        });
    } catch(err){
        console.log("Error while getting all of your Todos" + e);
        res.status(500).send({
            message:"Internal server error, Couldn't show all of your Tasks"
        })
    }
})




module.exports = {
    userRouter: userRouter
}