import mongoose from "mongoose";

async function connectDB() {
  try{
    const conn = await mongoose.connect(`${process.env.MONGODB_URI}/todo`)
    console.log(`Database has been connected: ${conn.connection.host}`)
  }catch(err){
    console.log('Error in connecting with database', err.message)
    process.exit(1)
  }
}

export default connectDB