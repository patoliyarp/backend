import { configDotenv } from "dotenv";
import { Twilio } from "twilio";
import { MessageInstance } from "twilio/lib/rest/api/v2010/account/message";
configDotenv();

const accountSid: string = process.env.TWILIO_SID || "";
const authToken: string = process.env.TWILIO_TOKEN || "";
const twilioNumber: string = process.env.TWILIO_PHONE_NUMBER || "";

// Initialize the client to send sms
const client = new Twilio(accountSid, authToken);

//Send sms helper function that execute in worker
export async function sendSms(mobile: number): Promise<void> {
  try {
    const message: MessageInstance = await client.messages.create({
      body: "Hello from this side",
      from: twilioNumber,
      to: `+91${mobile}`,
    });

    console.log(`Success sms job! SID: ${message.sid}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
}

// sendSms(9909176342);
