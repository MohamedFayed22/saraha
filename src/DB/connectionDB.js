import mongoose from "mongoose";
import {db_uri_config} from "../../config/config.service.js";

const checkConnection = async () => {
    await mongoose.connect(db_uri_config, { serverSelectionTimeoutMS: 5000})
        .then(() => {
            console.log("DB connected successfully")
        })
        .catch((error) => {
            console.log(error, "DB connection failed.")
        });
}

export default checkConnection;