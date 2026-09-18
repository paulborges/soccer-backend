import { Router } from "express";
import { authentication } from "../middleware/requireAuth";
import { createMatchLog, getMatchLog } from "../controllers/matchLogController";

const router = Router();

router.post("/",authentication,createMatchLog);
router.get("/",authentication,getMatchLog);

export default router;