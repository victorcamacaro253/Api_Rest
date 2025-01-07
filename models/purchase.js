import { query } from "../db/db.js";

class PurchaseModel {

static async getPurchases(){
    const SQL=`SELECT 
                c.purchase_id,
                c.date,
                c.amount,
                u.user_id,
                u.fullname,
                u.personal_ID,
                u.email,
                cp.product_id,
                cp.quantity,
                cp.price,
                p.name
                FROM purchased_products cp
                 JOIN products p ON cp.product_id=p.product_id 
                 JOIN purchases c ON cp.purchase_id=c.purchase_id
                  JOIN users u ON c.user_id=u.user_id`;
    const result = await query(SQL);
    return result;


}


static async getPurchaseById(connection,id){
    const SQL = `SELECT 
                c.purchase_id,
                c.date,
                c.amount,
                u.user_id,
                u.fullname,
                u.personal_ID,
                u.email,
                cp.product_id,
                cp.quantity,
                cp.price,
                p.name
                FROM purchased_products cp
                 JOIN products p ON cp.product_id=p.product_id 
                 JOIN purchases c ON cp.purchase_id=c.purchase_id
                  JOIN users u ON c.user_id=u.user_id WHERE c.purchase_id = ?`;
    const result = await connection.query(SQL,[id]);
    return result;
}




static async getPurchasesByUserId(userId){
    const SQL = `SELECT
    c.purchase_id,
    c.date,
    c.amount,
    u.user_id,
    u.fullname,
    u.personal_ID,
    u.email,

    cp.product_id,
    cp.quantity,
    cp.price,
    p.name
    FROM purchased_products cp
    JOIN products p ON cp.product_id=p.product_id
    JOIN purchases c ON cp.purchase_id=c.purchase_id
    JOIN users u ON c.user_id=u.user_id WHERE u.user_id = ?`;
    const result = await query(SQL,[userId]);
    return result;

}

static async getPurchasesByPriceRange(min,max){
    const SQL = `SELECT
    c.purchase_id,
    c.date,
    c.amount,
    u.user_id,
    u.fullname,
    u.personal_ID,
    u.email,
    cp.product_id,
    cp.quantity,
    cp.price,
    p.name
    FROM purchased_products cp
    JOIN products p ON cp.product_id=p.product_id
    JOIN purchases c ON cp.purchase_id=c.purchase_id
    JOIN users u ON c.user_id=u.user_id WHERE c.amount BETWEEN ? AND ?`;
    const result = await query(SQL,[min,max]);
    return result;

}


  static async getPurchasesByProduct(productId){
    const SQL = `SELECT
    c.purchase_id,
    c.date,
    c.amount,
    u.user_id,
    u.fullname,
    u.personal_ID,
    u.email,
    cp.product_id,
    cp.quantity,
    cp.price,
    p.name,
    p.product_id
    FROM purchased_products cp
    JOIN products p ON cp.product_id=p.product_id
    JOIN purchases c ON cp.purchase_id=c.purchase_id
    JOIN users u ON c.user_id=u.user_id WHERE p.product_id = ?`;
    const result = await query(SQL,[productId]);
    return result;

  }

  
  static async getPurchasesByProductId(connection,productId){
    const SQL = `SELECT
    c.purchase_id,
    c.date,
    c.amount,
    u.user_id,
    u.fullname,
    u.personal_ID,
    u.email,
    cp.product_id,
    cp.quantity,
    cp.price,
    p.name,
    p.product_id
    FROM purchased_products cp
    JOIN products p ON cp.product_id=p.product_id
    JOIN purchases c ON cp.purchase_id=c.purchase_id
    JOIN users u ON c.user_id=u.user_id WHERE p.product_id = ?`;
    const result = await connection.query(SQL,[productId]);
    return result;

  }


  static async getPurchasesByDateRange(startDate,endDate){
    const SQL = `SELECT
    c.purchase_id,
    c.date,
    c.amount,
    u.user_id,
    u.fullname,
    u.personal_ID,
    u.email,
    cp.product_id,
    cp.quantity,
    cp.price,
    p.name
    FROM purchased_products cp
    JOIN products p ON cp.product_id=p.product_id
    JOIN purchases c ON cp.purchase_id=c.purchase_id
    JOIN users u ON c.user_id=u.user_id WHERE c.date BETWEEN ? AND ?`;
    const result = await query(SQL,[startDate,endDate]);
    return result;

  }

  static async getPurchasesByUserDate(userId,startDate,endDate){
    const SQL = `SELECT
    c.purchase_id,
    c.date,
    c.amount,
    u.user_id,
    u.fullname,
    u.personal_ID,
    u.email,
    cp.product_id,
    cp.quantity,
    cp.price,
    p.name
    FROM purchased_products cp
    JOIN products p ON cp.product_id=p.product_id
    JOIN purchases c ON cp.purchase_id=c.purchase_id
    JOIN users u ON c.user_id=u.user_id WHERE u.user_id = ? AND c.date BETWEEN ? AND ?`;
    const result = await query(SQL,[userId,startDate,endDate]);
    return result;

  }

    static async getPurchasesByStatus(status){
        const SQL = `SELECT
        c.purchase_id,
        c.date,
        c.amount,
        u.user_id,
        u.fullname,
        u.personal_ID,
        u.email,
        cp.product_id,
        cp.quantity,
        cp.price,
        p.name
        FROM purchased_products cp
        JOIN products p ON cp.product_id=p.product_id
        JOIN purchases c ON cp.purchase_id=c.purchase_id
        JOIN users u ON c.user_id=u.user_id WHERE c.status = ?`;
        const result = await query(SQL,[status]);
        return result;
    
    }

    static async getPurchasesByPaymentMethod(paymentMethod){
        const SQL = `SELECT
        c.purchase_id,
        c.date,
        c.amount,
        u.user_id,
        u.fullname,
        u.personal_ID,
        u.email,
        cp.product_id,
        cp.quantity,
        cp.price,
        p.name
        FROM purchased_products cp
        JOIN products p ON cp.product_id=p.product_id
        JOIN purchases c ON cp.purchase_id=c.purchase_id
        JOIN users u ON c.user_id=u.user_id WHERE c.payment_method = ?`;
        const result = await query(SQL,[paymentMethod]);
        return result;
    
    }

    static async getPurchaseStadistics(){
        const SQL = `SELECT
        COUNT(c.purchase_id) AS total_purchases,
        SUM(c.amount) AS total_amount,
        AVG(c.amount) AS average_amount
        FROM purchases c`;
        const result = await query(SQL);
        return result;
    
    }

    static async getPurchaseStats(){
        const SQL = `SELECT  * FROM purchases`;
        const result = await query(SQL);
        return result;
    }

    static async getPurchaseStatsByUser(userId){
        const SQL = `SELECT  * FROM purchases WHERE user_id = ?`;
        const result = await query(SQL,[userId]);
        return result;
    }
    
    static async getPurchaseStatsDateRange(startDate,endDate){
        const SQL = `SELECT  * FROM purchases WHERE date BETWEEN ? AND ?`;
        const result = await query(SQL,[startDate,endDate]);
        return result;
    }

    static async createPurchase(connection, userId,total_purchase){
        const [result] = await connection.query('INSERT INTO purchases (user_id,total_purchase,date) VALUES (?,?,NOW())',[userId,total_purchase]); 
        return result.insertId;
    }

    static async createPurchasedProduct(connection,purchaseId,insertProducts){
      const query='INSERT INTO purchased_products (purchase_id,product_id,amount,quantity) VALUES ?';
        const values = insertProducts.map(product => [purchaseId,product.product_id,product.price,product.quantity]);
        const result = await connection.query(query,[values]);
      return result;
    }

    static async deletePurchase(connection,id){
        const result = await connection.query('DELETE FROM purchases WHERE purchase_id = ?',[id]);
        return result;
    }

    static async deletePurchasedProduct(connection,id){
       
        const result = await connection.query('DELETE FROM purchased_products WHERE purchase_id = ?',[id]);
        return result;
    }


}
export default PurchaseModel;
