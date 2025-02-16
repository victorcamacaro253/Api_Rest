import { Router } from "express";
import Cart from "../controllers/cart.js";
import authenticateToken from "../middleware/authenticationToken.js";
const router= Router();

router.get('/',Cart.getCart)

router.get('/:id',Cart.getCartById)

router.get('/user/:userId',Cart.getCartByUserId)

router.post('/',Cart.createCart)

// Clear entire cart
router.delete('/clear/:cartId', Cart.clearCart)

router.delete('/:id', Cart.deleteCart)


// Remove specific item from cart
router.delete('/items/:cartId/:productId', Cart.removeItem)

// Update item quantity
router.put('/items/:cartId/:productId', Cart.updateItemQuantity)

// Get cart total
router.get('/total/:cartId', Cart.getCartTotal)


export default router;