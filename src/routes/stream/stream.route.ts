import {
  readimage,
  readstream,
} from "../../controller/stream/stream.controller";

import express from "express";

const router = express.Router();

router.get("/readstream", readstream);
router.get("/readpicture", readimage);

export default router;
