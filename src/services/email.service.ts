import eventBus from "./eventEmitter";
import { sendWelcomeEmail } from "../utils/WelcomeMail";
import logger from "../config/logger.config";

//Listen signup events
eventBus.on("userSignup", async (options) => {
  try {
    await sendWelcomeEmail(options);
  } catch (error) {
    logger.error(error);
  }
});
