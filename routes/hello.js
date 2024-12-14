const express = require("express");
const helloRoute = express.Router();

helloRoute.get('/hello',(req, res)=>{
    res.send('hello world')
});
module.exports = helloRoute;