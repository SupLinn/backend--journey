import dotenv from 'dotenv'
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import { app } from './app.js';
import connectDB from './db/index.js';

dotenv.config({
    path: './env'
})


connectDB()
// since the async method returns a promise after its completion so we can apply then and catch 
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port : ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})


/*
const app = express()
(async () => {
    try {
       await mongoose.connect(`${process.env.MONGODB_URI}/ ${DB_NAME}`)
       app.on("error", (error) => {
        throw error
       })

       app.listen (process.env.PORT, () => {
        console.log(`App is listening on port ${process.env.PORT}`); 
       })
    } catch (error) {
        console.error("ERROR: ", error)
        throw err
    }
})()
    */