import ProductModel from '../models/product.js';
import handleError from '../utils/handleError.js';
import crypto from 'crypto';
import { pool } from '../db/db.js';


class Product {

static async getAllProducts(req,res) {
    try {
        const products = await ProductModel.getAllProducts();
      
        res.json(products);

    } catch (error) {
     handleError(res,error)         

    }
          
    
}

 static async getProductById(req,res) {
   const {id} = req.params;
    if (!id) {
        return res.status(400).json({ error: 'Product ID is required' });
    }

    try {

        const product = await ProductModel.getProductById(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);

        
    } catch (error) {
        handleError(res,error)
        
    }
  }

  static async getProductByName(req,res) {
    
    const {name} = req.params;
    if (!name) {
        return res.status(400).json({ error: 'Product name is required' });
    }
    try {
        const product = await ProductModel.getProductByName(name);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    }
    catch (error) {
        handleError(res,error)
    }
    }

  
  static async filterProducts(req,res) {
    const { name, category, price } = req.query;

    if(!name && !category && !price) {
        return res.status(400).json({ error: 'At least one filter is required' });
    }

    const priceNum = parseFloat(price);

    try {

        const fields= []
        const values = []


        if (name) {
            fields.push('name');
            values.push(name);
        }

        if (category) {
            fields.push('category ');
            values.push(category);
        }

        if (price) {
            fields.push('price');
            values.push(priceNum);
        }

      
        // If no fields are valid, return an error
        if (fields.length === 0) {
            return res.status(400).json({ error: 'No hay datos para actualizar' });
        }

        const products = await ProductModel.getProductsByFilter(fields, values);

        if (products.length < 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        return res.json(products);
        
    } catch (error) {
     handleError(res,error)   
    }
  }

  static async getProductsByPriceRange(req,res) {
    const { min, max } = req.query;

    const minNum = parseFloat(min);
    const maxNum = parseFloat(max);

    if (!minNum || !maxNum) {
        return res.status(400).json({ error: 'Price range is required' });
    }

    try {
        const products = await ProductModel.getProductsByPriceRange(minNum, maxNum);

        if (products.length === 0) {
            return res.status(404).json({ error: 'No products found' });
        }
        res.json(products);
    } catch (error) {
        handleError(res,error)
    }

}


 static async getPaginatedProducts(req,res) {
    const { page=1, limit=10 } = req.query;

    const offset = (page - 1) * limit;

    try {

        const products = await ProductModel.getPaginatedProducts(offset, limit);
        res.json(products);
    }
    catch (error) {
        handleError(res,error)
    }
    }


  static async getProductsByCategory(req,res) {
    const { categoryId } = req.params;
    try {
        const products = await ProductModel.getProductsByCategory(categoryId);
        res.json(products);
        }
        catch (error) {
            handleError(res,error)
        }
    }

    static async getTopSellingProducts(req,res) {
        try {
            const products = await ProductModel.getTopSellingProducts();
            res.json(products);

            } catch (error) {
                handleError(res,error)
            }

    }

    static async getProductStock(req,res) {
        const { productId} = req.body;

        
          // Iniciar transacción
    const connection = await pool.getConnection();
    await connection.beginTransaction();
        try {
            const stock = await ProductModel.getProductStock(connection,productId);
            if (!stock) {
                await connection.rollback();
                return res.status(404).json({ error: 'Product not found' });
            }
            await connection.commit();

            res.json(stock);
        }catch(error) {
            await connection.rollback();
           handleError(res,error)
        }
}

static async checkStock(req,res) {
    try {
        const stock = await ProductModel.checkStock();
        if (!stock) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(stock);
    } catch (error) {
        handleError(res,error)
        }
    
    }

    static async updateProduct(req,res) {
        const { productId } = req.params;
        const { name, description, price, category, stock,suplier } = req.body;

        if (!productId) {
            return res.status(400).json({ error: 'Product ID is required' });
        }
        if (!name && !description && !price && !category && !stock && !suplier) {
            return res.status(400).json({ error: 'At least on field is required' });
            }

        try {
        
            let updateFields = [];
            let values = [];
            if (name) {
                updateFields.push('name = ?');
                values.push(name);
            }
            if (description) {
                updateFields.push('description = ?');
                values.push(description);
            }
            if (price) {
                updateFields.push('price = ?');
                values.push(price);
            }
            if (category) {
                updateFields.push('category = ?');
                values.push(category);
            }
            if (stock) {
                updateFields.push('stock = ?');
                values.push(stock);
            }


            const result = await ProductModel.updateProduct(productId, updateFields, values);
            if (!result) {
                return res.status(404).json({ error: 'Product not found' });
            }
            res.json(result);
        }catch(error) {
            handleError(res,error)
        }
    }

    static async updateProductStock(req,res) {
        const { productId } = req.params;
        const { stock } = req.body;

        if (!productId) {
            return res.status(400).json({ error: 'Product ID is required' });
        }
        if (!stock) {
            return res.status(400).json({ error: 'Stock is required' });
        }

          // Iniciar transacción
    const connection = await pool.getConnection();
    await connection.beginTransaction();

        try {


            const result = await ProductModel.updateProductStock(connection,productId, stock);
            if (!result) {
                await connection.rollback();
                return res.status(404).json({ error: 'Product not found' });
            }

            await connection.commit();
            res.json(result);
        } catch (error) {
            await connection.rollback(); 
            handleError(res,error)
        }
    }

    static async addProduct(req,res) {
        const { name, description, price, category,stock,supplier } = req.body;
       // const image = req.file

        
        if (!name || !description || !price  || !category) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const priceNum = parseFloat(price);
     
        if (isNaN(priceNum) || !Number.isFinite(priceNum) || priceNum < 0) {
            return res.status(400).json({ error: 'Price must be a positive number' });
        }

    
        const status = 'active';
     
    
        try {
            console.log(name)
            const existingProduct = await ProductModel.getProductByName(name);
            console.log(existingProduct)
            if (existingProduct.length > 0) {
                return res.status(400).json({ error: 'Product already exists' });
            }

         //const imagePath = image ? image.path : null;
         
        const code = crypto.randomBytes(8).toString('hex').toUpperCase();

         const result = await ProductModel.addProduct(code,name, description, priceNum, category,status);

         const addStock = await ProductModel.addProductStock(result.insertId,stock,supplier);


         res.status(201).json({id: result.insertId,name});

        } catch (error) {
            handleError(res,error)
        }
    
    }

    static async bulkProducts(req,res) {
    let products;
    if (typeof req.body.products === 'string') {
      
       try {
           products = JSON.parse(req.body.products || '[]');
       } catch (error) {
           return res.status(400).json({ error: 'Invalid JSON format for products' });
       }
   } else {
      
       products = req.body.products || [];
   }
      //  const imagePath = req.files && req.files.length > 0 ? `/uploads/${req.files[0].filename}` : null;

        if(!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: 'products must be an array' });
        }

        const errors = [];
        const createdProducts = [];

        try {
            const productsToInsert =[]
            for (const product of products) {
                const {
                    name,
                    description,
                    price,
                    category,
                    status= "active",
                    stock, 
                    supplier
                }= product

                if (!name || !description || !price || !category) {
                    errors.push({ product, error: 'All fields are required' });
                    continue;
                }

                const priceNum = parseFloat(price);

                if (isNaN(priceNum) || !Number.isFinite(priceNum) || priceNum < 0) {
                    errors.push({ product, error: 'Price must be a positive number' });
                    continue;
                }

                const code = crypto.randomBytes(8).toString('hex').toUpperCase();

                const existingProduct = await ProductModel.getProductByName(name);
                if(existingProduct.length > 0) {
                    errors.push({ error: 'Product already exists',name });
                    continue;
                }

                productsToInsert.push({name, description, priceNum, category, code, status, stock,supplier});
            }

          // Call the bulk insert method and get the insertIds
        const insertIds = await ProductModel.bulkProducts(productsToInsert);
        
        // Prepare the response with the created product IDs
        insertIds.forEach((id, index) => {
            createdProducts.push({ message: "Product added successfully", id });
        });

         
         // Insert stock for each product
         for (let i = 0; i < insertIds.length; i++) {
            const productId = insertIds[i];
            const stockQuantity = productsToInsert[i].stock; // Get the stock quantity from the original product data
            const supplier = productsToInsert[i].supplier; // Get the supplier from the original product data

            await ProductModel.addProductStock(productId, stockQuantity, supplier);
        }
      //  await StockModel.bulkInsertStock(stockEntries); // Assuming you have a method to bulk insert stock


           if(errors.length > 0) {
            res.status(400).json({ errors });
        } else {
            res.status(201).json({ createdProducts });
        }

        } catch (error) {
            handleError(res,error)
        }

    }

    static async deleteMultiple(req,res){
        const { products } = req.body;
        try {
            const deletePromises = products.map(product => {
               const {id}= product
                return ProductModel.deleteProduct(id);
            })

            await Promise.all(deletePromises);

            res.json({ message: 'Products deleted' });
        } catch (error) {
            handleError(res,error)
            
        }
    }


    static async delete(req,res) {
        const { id } = req.params;
        try {
           
            const result = await ProductModel.deleteProduct(id);
            if (!result) {
                return res.status(404).json({ error: 'Product not found' });
            }
            res.json({ message: 'Product deleted' });
        } catch (error) {
            handleError(res,error)
        }

    }


      
}
export default Product;