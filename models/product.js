import { query } from "../db/db.js";

class ProductModel{

    static async getAllProducts(){
        const SQL='SELECT p.product_id,p.code,p.name,p.description,p.price,p.image,p.status,c.name as category FROM products p JOIN categories c ON p.category_id=c.id';
        const result = await query(SQL);
        return result;
    }

    static async getProductById(id){
        const SQL='SELECT p.product_id,p.code,p.name,p.description,p.price,p.image,p.status,c.name as category FROM products p JOIN categories c ON p.category_id=c.id WHERE p.product_id = ?';
        const result = await query(SQL, [id]);
        return result[0];
    }

    static async getProductByName(name){
        const SQL='SELECT p.product_id,p.code,p.name,p.description,p.price,p.image,p.status,c.name as category FROM products p JOIN categories c ON p.category_id=c.id WHERE p.name = ?';
        const result = await query(SQL, [name]);
        return result;
    }

    static async updateProduct(id, updateFields,values){
     const setClause = updateFields.map(field => `${field} = ?`).join(', ');

     const SQL= `UPDATE products SET ${setClause} WHERE product_id = ?`;

     const finalValues = values.concat(id);

     const result = await query(SQL, finalValues);

     return result
    }

/*
    static async addProduct({name, price, category, stock}){
        const SQL='INSERT INTO products (name, price, category, stock) VALUES (?, ?, ?, ?)';
        const result = await query(SQL, [name, price, category, stock]);
        const SQL2='SELECT * FROM products WHERE product_id = ?';
        const insertedProduct = await query(SQL2, [result.insertId]);
        return insertedProduct[0];
    }
        */

    static async getProductsByFilter(fields,values){
        const setClause = fields.map(field => `${field} = ?`).join(' AND ');
        const SQL = `SELECT * FROM products WHERE ${setClause}`;
        const result = await query(SQL, values);
        return result;

    }

    static async getProductsByPriceRange(minPrice, maxPrice){
        const SQL = `SELECT * FROM products WHERE price BETWEEN ? AND ?`;
        const result = await query(SQL, [minPrice, maxPrice]);
        return result;
        }

    static async getPaginatedProducts(offset, limit){
        const SQL = `SELECT * FROM products LIMIT ? OFFSET ?`;
        const result = await query(SQL, [limit, offset]);
        return result;
        }
        
    static async getProductsByCategory(categoryId){
        const SQL = 'SELECT p.product_id,p.code,p.name,p.description,p.price,p.image,p.status,c.name as category FROM products p JOIN categories c ON p.category_id=c.id WHERE c.name=?';
        const result = await query(SQL, [categoryId]);
        return result;
    }


    static async getTopSellingProducts(){
        const SQL = 'SELECT * FROM most_sold_products ORDER BY total_sold DESC';
        const result = await query(SQL);
        return result;
    }

    static async getProductStock(connection,productId){
        const SQL = 'SELECT * FROM stock WHERE product_id = ?';
        const result = await connection.query(SQL,[productId]);
        return result;
    }

    static async checkStock(){
        const SQL = 'SELECT * FROM stock';
        const result = await query(SQL);
        return result;
    }

  static async updateProductStock(connection,productId,newStock){
       const SQL ='UPDATE stock s SET s.stock =  ?  WHERE s.product=?'
        const results = await connection.query(SQL,[newStock,productId]);
        return results;
    }


    static async addProductStock(productId,stock,supplier){
        const SQL = 'INSERT INTO stock (product,stock,status,suplier) VALUES (?,?,active,?)';
        const results = await query(SQL,[productId,stock,supplier]);
        return results;
    }
}

export default ProductModel;