import dotenv from "dotenv";
dotenv.config();
import { app } from "./app";

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
