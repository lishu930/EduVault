import mongoose from "mongoose";
import { Schema } from "mongoose";



const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    // timestamp: {
    //     type: Date,
    //     default: Date.now,
    // },
    image: {
       public_id:{
        type: String,
        required: true,
       },
       url:{
        type: String,
        required: true,
       },
    },
    creatorId: {
        type: mongoose.Types.ObjectId,
        ref: "Admin", 
    },
    pyqs: {
        public_id : {
            type : String,
            required : true,
        },
        url :{
            type: String,   
            required: true,
        },
    },
    notes: {
        public_id : {
            type : String,
            required : true,
        },
        url :{
            type: String,
            required: true,
        },
    },
    practice: {
        public_id : {
            type : String,
            required : true,
        },
        url :{
            type: String,
            required: true,
        },
    },
});

export const Course = mongoose.model("Course", courseSchema);