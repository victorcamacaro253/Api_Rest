import { Router } from "express";
import Cart from "../controllers/cart.js";
import authenticateToken from "../middleware/authenticationToken.js";
const router= Router();

router.get('/',Cart.getCart)

router.get('/:id',Cart.getCartById)

router.get('/user/:userId',Cart.getCartByUserId)

router.post('/',Cart.createCart)

router.post

export default router;