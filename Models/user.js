import mongoose, { Mongoose } from "mongoose";

const userSchema=mongoose.Schema({
    name:String,
    email:String,
    password:String,
    profileImg:String,
    created:{
        type:Date,
        default:Date.now
    }
})
export const User=mongoose.model("Authenticate",userSchema);