const mongoose=require("mongoose");

async function connectDb(){
    try {
        console.log("Trying to connect to the database...");
        await mongoose.connect(process.env.DB_URI);
        console.log("Database connection completed successfully :)");
    } catch (err) {
        console.log(`An error occurred while trying to connect to the database : ${err}`);
    }
};

module.exports=connectDb;