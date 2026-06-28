// // import {Order}from "../modules/order_model.js"
// import { Purchase } from "../modules/purchase_model.js";


// export const orderData=async(req,res)=>{
//     const order=req.body;
//     try{
//         const orderInfo=await Order.create(order)
//         console.log(orderInfo)
//         const userId=orderInfo?.userId
//         const courseId=orderInfo?.courseId
//         res.status(201).json({message:"Order Details: ",orderInfo})
//         if(orderInfo){
//             await Purchase.create({
//             userId,
//             courseId
//         });
//         }

//     }catch(error){
//         console.log("Error in order: ",error)
//         res.status(401).json({errors:"Error in order creation"})
//     }
// };

// controllers/fileController.js
// import path from "path";

// export const viewPdf = (req, res) => {
//   const filename = req.params.filename;
//   const filePath = path.join(__dirname, "../uploads", filename);

//   res.setHeader("Content-Type", "application/pdf");
//   res.setHeader("Content-Disposition", "inline"); // 👈 ensures open in tab
//   res.sendFile(filePath);
// };