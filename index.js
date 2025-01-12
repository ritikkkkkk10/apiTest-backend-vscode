const express = require('express');
const mongoose = require("mongoose");
const http = require('http'); // Required for WebSocket
const dotenv = require('dotenv'); // Import dotenv

const helloRoute = require('./routes/hello');
const authRouter = require('./routes/auth');
const appUsageRouter = require('./routes/AppUsage'); // Import the appUsage route
const locationRouter = require('./routes/location')
const callLogsRouter = require('./routes/callLogs'); // Import the callLogs route
const authNewRouter = require('./routes/authNew');  // Update this line
const { setupWebSocketServer } = require('./routes/websocket'); // Import the WebSocket logic

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 3000;
const DB = process.env.DB;

const app = express();

app.use(helloRoute);
app.use(express.json());
app.use(authRouter);
app.use('/api', callLogsRouter); 
app.use('/api', appUsageRouter); // Use the appUsageRouter
app.use('/api', locationRouter);
app.use(authNewRouter);  // Replace authRouter with authNewRouter


// HTTP server setup
const server = http.createServer(app);

// Setup WebSocket server
setupWebSocketServer(server);

mongoose.connect(DB).then(()=>{
    console.log('mongoDB connected');
})

server.listen(process.env.PORT || 3000, "0.0.0.0", function() {
    console.log(`server is running on port ${PORT}`)
});