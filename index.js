const express = require('express');
const mongoose = require("mongoose");
const helloRoute = require('./routes/hello');
const authRouter = require('./routes/auth');
const appUsageRouter = require('./routes/AppUsage'); // Import the appUsage route
const locationRouter = require('./routes/location')
const PORT = 3000;
const callLogsRouter = require('./routes/callLogs'); // Import the callLogs route

const app = express();

const DB = "mongodb+srv://ritzreigns002:Prajapati%40002@cluster0.i52by.mongodb.net/"
app.use(helloRoute);
app.use(express.json());
app.use(authRouter);
app.use('/api', callLogsRouter); 
app.use('/api', appUsageRouter); // Use the appUsageRouter
app.use('/api', locationRouter);

mongoose.connect(DB).then(()=>{
    console.log('mongoDB connected');
})

app.listen(PORT, "0.0.0.0", function() {
    console.log(`server is running on port ${PORT}`)
});