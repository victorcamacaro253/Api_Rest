import { parse } from 'dotenv';
import ProductModel from '../models/product.js';
import handleError from '../utils/handleError.js';


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

  
  static async filteProducts(req,res) {
    const { name, category, price } = req.query;

    if(!name && !category && !price) {
        return res.status(400).json({ error: 'At least one filter is required' });
    }

    const priceNum = parseFloat(price);

    try {

        const fieldsToCheck= [
            {field: 'name', value: name},
            {field: 'category', value: category},
            {field: 'price', value: priceNum}
        ]


        const fields= []
        const values = []


        for(const {field,value} of fieldsToCheck) {
            if(value !== undefined && value !== null) {
                fields.push(field);
                values.push(value);
            }
        }

        // If no fields are valid, return an error
        if (fields.length === 0) {
            return res.status(400).json({ error: 'No hay datos para actualizar' });
        }

        const products = await ProductModel.getProductsByFilter(fields, values);

        if (results.length > 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        return res.json(products);
        
    } catch (error) {
     handleError(res,error)   
    }
  }

}


export default Product;