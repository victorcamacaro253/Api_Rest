import { Router } from "express";
import authenticateToken from "../middleware/authenticationToken.js";
import apiKey from "../controllers/apiKey.js";
const router = Router();


router.get('/',authenticateToken,apiKey.getApiKey)

export default router