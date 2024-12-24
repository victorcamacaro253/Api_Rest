import { Router } from "express";
import Product from "../controllers/product.js";
import upload from "../middleware/multerConfig.js";

const router = Router();

//Routes to retrieve data from the database
router.get("/", Product.getAllProducts);

// Route to get filtered products from the database
router.get("/filter", Product.filterProducts);

//Route to get product by Price Range
router.get("/price-range",Product.getProductsByPriceRange);

// Route for paginated results
router.get("/page", Product.getPaginatedProducts);

// Route to get products by category
router.get("/category/:categoryId", Product.getProductsByCategory);

router.get("/product/:name",Product.getProductByName);

//Route to get the top selling products
router.get('/top-selling', Product.getTopSellingProducts);


//Route to get the products stock
router.get("/stock",Product.checkStock);

// Route to get product by id
router.get("/:id", Product.getProductById);



// Route to check product stock availability
router.get("/:id/stock", Product.getProductStock);


//Route to update product
router.put("/:productId", Product.updateProduct);

// Route to update stock for a product
router.put("/:id/stock", Product.updateProductStock);


//Routet to add a new product to the database
router.post("/", Product.addProduct);

//Route to insert multiple products
router.post("/bulk",upload.array('image'),Product.bulkProducts);

//Route to delete multiple products
router.post("/delete", Product.deleteMultiple);

//Route to delete a product by id
router.delete("/:id", Product.delete);

export default router;