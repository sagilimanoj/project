const express = require("express");
const dotenv = require("dotenv");
const DbConnection = require("./dataBaseConnection")
dotenv.config();
const app = express();
DbConnection(); 
const PORT = 8081;
app.use(express.json());

const userRoutes=require("./Routes/users.js");
const bookRoutes=require("./Routes/books.js");


app.get("/",(req,res)=>{
    res.status(200).json({
        message:"Server is running:-)",
        messa:"My name"
    });
});

app.use("/users",userRoutes);
app.use("/books",bookRoutes);



app.listen(PORT,()=>{
    console.log(`Server is running on port  ${PORT}`);
});

