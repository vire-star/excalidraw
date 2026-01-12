import mongoose from "mongoose"
import { ENV } from "./env.js"

export const connectDb =async()=>{
    try {
        await mongoose.connect(ENV.MONGO_DB)
        console.log(`db connected`)
    } catch (error) {
        console.log(`error from connect Db , ${error}`)
    }
}