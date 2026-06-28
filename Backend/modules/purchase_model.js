import mongoose from "mongoose";
import { Schema } from "mongoose";
import { Course } from "./course_model.js";

const purchaseSchema = new mongoose.Schema({
   userId:{
    type: mongoose.Types.ObjectId,
    ref: "User",
   },
   courseId:{
    type: mongoose.Types.ObjectId,
    ref: "Course",
   },
   
});

export const Purchase = mongoose.model("Purchase", purchaseSchema);