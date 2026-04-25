"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSms = sendSms;
const dotenv_1 = require("dotenv");
const twilio_1 = require("twilio");
(0, dotenv_1.configDotenv)();
const accountSid = process.env.TWILIO_SID || "";
const authToken = process.env.TWILIO_TOKEN || "";
const twilioNumber = process.env.TWILIO_PHONE_NUMBER || "";
// Initialize the client to send sms
const client = new twilio_1.Twilio(accountSid, authToken);
//Send sms helper function that execute in worker
async function sendSms(mobile) {
    try {
        const message = await client.messages.create({
            body: "Hello from this side",
            from: twilioNumber,
            to: `+91${mobile}`,
        });
        console.log(`Success sms job! SID: ${message.sid}`);
    }
    catch (error) {
        console.error(`Error: ${error}`);
        throw error;
    }
}
// sendSms(9909176342);
//# sourceMappingURL=Messager.js.map