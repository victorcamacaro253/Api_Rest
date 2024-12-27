import { Router } from "express";
import Purchase from "../controllers/purchase.js";
const router = Router();

// Routes to retrieve data from the database

// Route to get all purchases
router.get('/', Purchase.getPurchase)



// Route to get purchase by user id
router.get('/user/:userId', Purchase.getPurchaseByUserId)

//Route to get purchase by price range
router.get('/price-range', Purchase.getPurchaseByPriceRange)

// Route to get purchase by product id
router.get('/product/:productId', Purchase.getPurchaseByProduct)

// Route to get purchase by date
router.get('/date', Purchase.getPurchaseByDateRange)

//Route to get purchases stadistics 
router.get('/stadistics', Purchase.getPurchaseStadistics)

//Route to get purchase by user date
router.get('/user-date/:userId', Purchase.getPurchaseByUserDate)

// Route to get purchase by status
router.get('/status', Purchase.getPurchaseByStatus)

// Route to get purchase by payment method
router.get('/payment-method', Purchase.getPurchaseByPaymentMethod)



//Route to get purchases stadistics by date
router.get('/stadistics-date', Purchase.getPurchaseStadisticsByDate)

//Routet to get purchases stadistics by user
router.get('/stadistics-user/:userId', Purchase.getPurchaseStadisticsByUser)

// Route to get purchase by username
router.get('/username/:username', Purchase.getPurchaseByUsername)

// Route to get purchase by id
router.get('/:id', Purchase.getPurchaseById)

// Route to create a new purchase
router.post('/', Purchase.createPurchase)

// Route to update a purchase
//router.put('/:id', Purchase.updatePurchase)

// Route to delete a purchase
router.delete('/:purchaseId', Purchase.deletePurchase)



export default router;