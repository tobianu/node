// import {
//    Configuration,
//    OpenAIApi
// } from "openai";

// const configuration = new Configuration({
//    apiKey: process.env.OPENAI_API_KEY,
// });
// const openAI = new OpenAIApi(configuration);

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});

export default async function handler(req, res) {

    const MessagingResponse = require('twilio').twiml.MessagingResponse;
    var messageResponse = new MessagingResponse();
    const sentMessage = req.body.Body || '';

    let replyToBeSent = "";

    if (sentMessage.trim().length === 0) {
        replyToBeSent = "We could not get your message. Please try again";
    } else {

        try {
            const completion = await openai.completions.create({
                model: "gpt-4-1106-preview", // required
                prompt: req.body.Body, // completion based on this
                temperature: 0.6, //
                n: 1,
                max_tokens: 300,
                // stop: "."
            });
        
            replyToBeSent = completion.data.choices[0].text
    
        } catch (error) {
            console.error("Error with OpenAI request:", error);
            
            // More detailed error handling
            if (error.response) {
                // Log the response from OpenAI if available
                console.error("Response from OpenAI:", error.response);
                replyToBeSent = "There was an issue with processing your request.";

            } else if (error.request) {
                // The request was made but no response was received
                console.error("No response received from OpenAI:", error.request);
                replyToBeSent = "Failed to receive a response. Please try again.";

            } else {
                // Something else happened in setting up the request
                console.error("Error setting up the request to OpenAI:", error.message);
                replyToBeSent = "An unexpected error occurred. Please try again.";
            }

        }
    }

    messageResponse.message(replyToBeSent);

    // send response
    res.writeHead(200, {
        'Content-Type': 'text/xml'
    });

    res.end(messageResponse.toString());
}