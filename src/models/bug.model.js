import mongoose from "mongoose";


const bugSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    severity:{
        type:String,
        required:true,
        enum:["high", "low","medium"],
        default:"low"
    },
    status:{
        type:String,
        required:true,
        enum:["open", "in_progress","resolved","closed"],
        default:"open"
    },
    reporter:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:"User"
    }
})

export const Bug = mongoose.model("Bug", bugSchema);