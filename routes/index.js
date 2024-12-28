import { Router } from "express";
import user from "./user.js";
import product from "./product.js";
import Purchase from "./purchase.js";
import rolesPermissions from "./rolesPermissions.js";

const router= Router()

router.use('/users',user)

router.use('/products',product)

router.use('/purchases',Purchase)

router.use(rolesPermissions)


export default router