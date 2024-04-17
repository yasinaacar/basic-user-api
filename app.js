require("express-async-errors");
const express=require("express");
const mongoSanitize = require('express-mongo-sanitize');
const limiter = require("./src/middlewares/rateLimit");
const app=express();

require("dotenv").config();

app.use(express.json());

//cors
require("./src/helpers/cors")(app);

// Or, to replace these prohibited characters with _, use:
app.use(
    mongoSanitize({
      replaceWith: '_',
    }),
  );

//rate limit
app.use("/api/v1", limiter); 

//router
require("./src/startup/routes")(app);

//database transaction
(async ()=>{
    await require("./src/db/dbConnection")();
    // await require("./src/db/dummy-data")();
})();

//catch errors
app.use(require("./src/middlewares/errorHandler"));

const port= process.env.PORT || 5000;

app.listen(port, ()=>{
    console.log(`Listening Port ${port}`);
});


