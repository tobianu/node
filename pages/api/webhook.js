const express = require('express');
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// Import Twilio's library
const { TwimlResponse } = require('twilio').twiml;

// Define the webhook endpoint
app.post('/webhook', (req, res) => {
    // Your existing handler logic
    const messageResponse = new TwimlResponse();
    messageResponse.message('Reply goes here');

    // Send response
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(messageResponse.toString());
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

