import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
    const MessagingResponse = require('twilio').twiml.MessagingResponse;
    const messageResponse = new MessagingResponse();
    const sentMessage = req.body.Body || '';

    if (sentMessage.trim().length === 0) {
        messageResponse.message("We could not get your message. Do you want to try again");
        res.writeHead(200, {'Content-Type': 'text/xml'});
        return res.end(messageResponse.toString());
    }

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: sentMessage }
            ],
        });

        const replyToBeSent = completion.choices[0].message.content;
        messageResponse.message(replyToBeSent);

    } catch (error) {
        console.error("Error with OpenAI request:", error);
        messageResponse.message("Sorry, there was an error processing your request.");
    }

    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(messageResponse.toString());
}
