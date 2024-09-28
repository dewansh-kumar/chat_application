import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { deleteMessage, getMessages, sendMessage } from "../controller/message.controller.js";

const router = Router();

router.route("/getMessages").get(verifyJWT, getMessages);
router.route("/deleteMessage").delete(verifyJWT, deleteMessage)
router.route("/sendMessage").post(verifyJWT, sendMessage)
export default router;
