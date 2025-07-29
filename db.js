const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const userSchema = new Schema({
    email: {type: String, unique: true},
    password: String,
    firstName: String,
    lastName: String
})

const todoSchema = new Schema({
    title: String,
    done: Boolean,
    userId: ObjectId
})

const userModel = mongoose.model("user", userSchema);
const todoModel = mongoose.model("tood", todoSchema);

module.exports = {
    userModel,
    todoModel
}