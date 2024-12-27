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


        static async updateProduct(productId, updateFields, values) {
            try {
              
                if (updateFields.length === 0) {
                    throw new Error('No fields to update');
                }

                const SQL = ` UPDATE products SET ${updateFields.join(', ')}  WHERE product_id = ?  `;
    
                // Agrega el `productId` al final de los valores
                values.push(productId);
    
                // Ejecuta la consulta
                const result = await query(SQL, values);
    
                // Verifica si el producto fue actualizado
                if (result.affectedRows === 0) {
                    return null; // Producto no encontrado
                }
    
                // Devuelve el producto actualizado
                return { message: 'Product updated successfully' };
            } catch (error) {
                throw error; // Lanza el error para que el controlador lo maneje
            }
        }


    static async getProductsByFilter(fields,values){
        const setClause = fields.map(field => `${field} = ?`).join(' AND ');
        const SQL = `SELECT * FROM products WHERE ${setClause}`;
        console.log(SQL);
        console.log(values);
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
        console.log(SQL);
        const result = await query(SQL, [limit, offset]);
        return result;
        }
        
    static async getProductsByCategory(categoryId){
        const SQL = 'SELECT p.product_id,p.code,p.name,p.description,p.price,p.image,p.status,c.name as category FROM products p JOIN categories c ON p.category_id=c.id WHERE c.name=?';
        const result = await query(SQL, [categoryId]);
        return result;
    }


    static async getTopSellingProducts(){
        const SQL = 'SELECT p.name AS Product_name, p.price as Unit_price,ms.total_sold FROM most_sold_products ms JOIN products p ON ms.product_id=p.product_id ORDER BY ms.total_sold DESC';
        const result = await query(SQL);
        return result;
    }

    static async getProductStock(connection,productId){
        const SQL = 'SELECT * FROM stock WHERE product = ?';
        const [result] = await connection.query(SQL,[productId]);
        return result[0].stock;
    }

    static async checkStock(){
        const SQL = 'SELECT p.name,s.stock FROM stock s JOIN products p ON s.product=p.product_id; ';
        const result = await query(SQL);
        return result;
    }

  static async updateProductStock(connection,productId,newStock){
     console.log(newStock)
       const SQL ='UPDATE stock s SET s.stock =  ?  WHERE s.product=?'
        const results = await connection.query(SQL,[newStock,productId]);
        return results;
    }

  static async addProduct(code, name, description,price,category, status ) {
    console.log(code)
        const results = await query(
            'INSERT INTO products (code, name, description,price,category_id,status) VALUES (?, ?, ?, ?, ?, ?)',
            [code, name, description,price,category, status]
        );
        return results;
    }

    static async addProductStock(productId,stock,supplier){
        const status='active';
        const SQL = 'INSERT INTO stock (product,stock,status,supplier) VALUES (?,?,?,?)';
        const results = await query(SQL,[productId,stock,status,supplier]);
        return results;
    }

    static async bulkProducts(products){
        const queries = products.map((product)=>{
            const {code,name,description,priceNum,category,imagePath,status} = product;

            const SQL = 'INSERT INTO products (code,name,description,price,category_id,image,status) VALUES (?,?,?,?,?,?,?)';
            return query(SQL,[code,name,description,priceNum,category,imagePath,status]);
    })

    const results = await Promise.all(queries);
      
    // Map the results to get the insertId for each product
    const insertIds = results.map(result => result.insertId);
    return insertIds; // Return the array of insertIds
    }

    static async bulkProductsStock(products){
        const queries = products.map((product)=>{
            const {productId,stock,supplier} = product;
            const status='active';
            const SQL = 'INSERT INTO stock (product,stock,status,supplier) VALUES (?,?,?,?)';
            return query(SQL,[productId,stock,status,supplier]);
            })
            const results = await Promise.all(queries);
            return results;
            }

            static async updateTopSellings(productId,quantity){
                const SQL = 'UPDATE most_sold_products set total_sold = total_sold + ? WHERE product_id = ?';
                const results = await query(SQL,[productId,quantity]);
                return results;
                }

}


export default ProductModel;