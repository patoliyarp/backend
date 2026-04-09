import logger from "../config/logger.config";
import { subscriber } from "./redisClient";
import { sendWelcomeEmail } from "../utils/WelcomeMail";

//Initialize redis subscription
export async function initRedisSubscriptions() {
  //Listen published event from channel userSignup
  await subscriber.subscribe("userSignup", async (message) => {
    const options = JSON.parse(message);

    try {
      //Send welcome email
      await sendWelcomeEmail(options);
    } catch (error) {
      logger.error(error);
    }
  });
}
