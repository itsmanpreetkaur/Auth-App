const mongoose = require("mongoose");

require("dotenv").config();

const dbConnect = () =>
{
    mongoose.connect(process.env.MONGO_URL).then(
        ()=>{
            console.log("Database has connected Successfully!!");
        }
    ).catch(
        (error)=>{
            console.log(error);
            console.error(error);
            process.exit(1);
        }
    );

}

module.exports = dbConnect;