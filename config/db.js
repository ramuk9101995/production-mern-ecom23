import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.LOCAL_DB);
    // console.log(
    //   `connected to Mongodb Database${conn.connection.host} and db ${process.env.LOCAL_DB}`
    //     .bgGreen.white
    // );
  } catch (error) {
    // console.log(`error in MongodbConnection ${error}`.bgRed.white);
  }
};

export default connectDB;
