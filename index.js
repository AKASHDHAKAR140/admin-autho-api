const express = require("express")
const bodyParser = require("body-parser")
//const router = require("./modules/subAdmin/subAdmin.controller")
const app  = express();
const dotenv = require("dotenv")
dotenv.config();
app.use(bodyParser.json())
app.use(require("./routes"))
//app.use(router)

app.get("/",(req,res)=>{
    res.send("server running")
})
app.listen(3000,(req,res)=>{
    console.log("server listening port on 3000")
})