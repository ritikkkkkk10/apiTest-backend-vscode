// websocket.js
const WebSocket = require('ws');

// Store child location data keyed by userid
const childLocations = new Map(); // { userid: { latitude, longitude } }

const setupWebSocketServer = (server) => {
    const wss = new WebSocket.Server({ server }); // Attach WebSocket to HTTP server

    wss.on('connection', (ws) => {
        console.log('Client connected to WebSocket');

        ws.on('message', (data) => {
            // Convert the buffer to a string and parse it as JSON
            const message = data.toString(); // Converts the buffer to a string
            console.log('Received data:', message);
            try {
                const locationData = JSON.parse(message);  // Parse the string as JSON
                const { type, userid, latitude, longitude } = locationData;

                if (type === 'child') {
                    // If it's a child, store the location data
                    if (latitude && longitude) {
                        childLocations.set(userid, { latitude, longitude });
                        console.log(`Child location received: ${userid} - ${latitude}, ${longitude}`);
                    }
                } else if (type === 'parent') {
                    // If it's a parent, send the child's location to the parent
                    const location = childLocations.get(userid);
                    if (location) {
                        ws.send(JSON.stringify({
                            type: 'location',
                            userid: userid,
                            latitude: location.latitude,
                            longitude: location.longitude
                        }));
                        console.log(`Sent location to parent ${userid}: ${location.latitude}, ${location.longitude}`);
                    } else {
                        console.log(`No location data for child ${userid}`);
                    }
                }
            } catch (e) {
                console.error('Error parsing received data:', e);
            }
        });

        ws.on('close', () => console.log('Client disconnected'));
    });
};

module.exports = { setupWebSocketServer };
