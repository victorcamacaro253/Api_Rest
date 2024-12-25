import { query } from "../db/db.js";

class PurchaseModel {

static async getPurchase(){
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


static async getPurchaseById(id){
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
    const result = await query(SQL,[id]);
    return result;
}


}
export default PurchaseModel;