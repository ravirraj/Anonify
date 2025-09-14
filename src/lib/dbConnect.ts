import mongoose from "mongoose";
type connectionObject = {
    isConnected? : number
}

const connection : connectionObject = {}

async function dbConnect() : Promise<void> {
    if(connection.isConnected){
        console.log("DB IS ALREADY CONNECTED ") 
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "")
        connection.isConnected = db.connections[0].readyState 
        console.log("DB CONNECTED SUCCESSFULLY")
    } catch (error) {
        console.log("DB CONNECTION FAILED", error)
        process.exit(1)
    }
}

export default dbConnect