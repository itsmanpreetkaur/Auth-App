const express = require("express");
const app = express();

app.use(express.json());

require("dotenv").config();

const PORT = process.env.PORT || 4000;

const authRoutes = require("./routes/authroute");
app.use("/api/v1", authRoutes);

const dbConnect = require("./config/database");
dbConnect();

app.listen(PORT, ()=>{
    console.log(`App started successfullt at port ${PORT}`);
});


app.get("/", (req,res)=>{
    res.send(`<h1>
        This is Home Page !!
        </h1>`)
})