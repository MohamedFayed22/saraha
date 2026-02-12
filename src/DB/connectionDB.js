import mongoose from "mongoose";

const checkConnection = async () => {
    await mongoose.connect("mongodb://localhost:27017/saraha", { serverSelectionTimeoutMS: 5000})
        .then(() => {
            console.log("DB connected successfully")
        })
        .catch((error) => {
            console.log(error, "DB connection failed.")
        });
}

export default checkConnection;