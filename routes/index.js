import { Router } from "express";
import user from "./user.js";
import product from "./product.js";
import Purchase from "./purchase.js";

const router= Router()

router.use('/users',user)

router.use('/products',product)

router.use('/purchases',Purchase)

export default router