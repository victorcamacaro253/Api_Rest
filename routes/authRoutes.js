import { Router } from "express";
import Authentication from "../controllers/authentication.js";

const router = Router();

router.post("/login", Authentication.login);


export default router;