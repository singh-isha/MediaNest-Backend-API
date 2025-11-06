// # APPROACH 1 WHEN  WE ERITE AL THE CODE INSIDE  MAIN INDEX.JS
// # WHEN YOU FORGET TO ADD DOTENV FILE INSIDE YOUR INDEX.JS

//  import mongoose from "mongoose"
//  import {DB_NAME}from "./constants.js"
//  import express from "express"

//  const app = express()
//  ;(async () =>{
//     try{
// await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
// app.on("error",(error) =>{
//     console.log("Error :" , error)
//      throw error
// })
// app.listen(process.env.PORT,() =>{
//     console.log(`App is listening on ${process.env.PORT}`);
// })
//     }catch (error){
//          console.error("ERROR" , error)
//           throw error
//     }
//  })()

// AFTER CHNAGING CODE AND INJECTING DOTENV FILE WITH CORRECT IMPORTATION AND CALL OF DOTENV

// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import { DB_NAME } from "./constants.js";

// // Load environment variables
// dotenv.config();

// const app = express();

// (async () => {
//   try {
//     const mongoURI = `${process.env.MONGODB_URI}/${DB_NAME}`;
//     console.log("🔗 Connecting to MongoDB at:", mongoURI);

//     await mongoose.connect(mongoURI);

//     console.log("✅ MongoDB connected successfully!");

//     app.on("error", (error) => {
//       console.log("❌ App error:", error);
//       throw error;
//     });

//     app.listen(process.env.PORT || 8000, () => {
//       console.log(`🚀 Server running on port ${process.env.PORT || 8000}`);
//     });

//   } catch (error) {
//     console.error("❌ ERROR connecting to MongoDB:", error);
//     throw error;
//   }
// })();

// APPROACH 2 WHEN ALL THE DB CODE IN DB FOLDER INSIDE INDEX.JS FILE
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js"
dotenv.config();
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 4000, () => {
      console.log(` server is running at port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("mongodb connection got failed", error);
  });

// why did we write this ?? in this when we have already written it in  db/ index.js ?
