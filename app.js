const express=require("express");
const app=express();

require("dotenv").config();

app.use(express.json());

//router
require("./src/startup/routes")(app);

//database transaction
(async ()=>{
    await require("./src/db/dbConnection")();
})();

const port= process.env.PORT || 5000;

app.listen(port, ()=>{
    console.log(`Listening Port ${port}`);
});


