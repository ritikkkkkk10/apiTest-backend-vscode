const express = require("express");
const helloRoute = express.Router();

helloRoute.get('/hell0',(req, res)=>{
    res.send('hello world')
});
module.exports = helloRoute;