import mongoose from "mongoose";
export async function dataBaseConnection(){
    const params={
        useNewUrlParser:true,
        useUnifiedTopology:true
    };
    try {
        mongoose.connect("mongodb://127.0.0.1:27017",params)
        console.log("Mongodb is connected")
    } catch (error) {
        console.log("Mongodb connection error")
    }
}