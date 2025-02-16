import { query } from "../db/db.js";

class CartModel {
    // Get all carts
    static async getCart() {
        const [rows] = await query('SELECT * FROM shopping_cart')
        return rows
    }

    // Get cart by ID
    static async getById(cartId) {
        const [rows] = await query('SELECT * FROM shopping_cart WHERE cart_id = ?', [cartId])
        return rows[0]
    }

    // Get cart by user ID
    static async getCartByUserId(userId) {
        const [rows] = await query('SELECT * FROM shopping_cart WHERE user_id = ?', [userId])
        return rows[0]
    }

    // Create new cart
    static async createCart(userId) {
        const [result] = await query('INSERT INTO shopping_cart (user_id) VALUES (?)', [userId])
        return { cart_id: result.insertId, user_id: userId }
    }

    // Get cart item
    static async getItem(cartId, productId) {
        const [rows] = await query(
            'SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?', 
            [cartId, productId]
        )
        return rows[0]
    }

    // Update item quantity
    static async updateQuantity(cartId, productId, quantity) {
        const [result] = await query(
            'UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?',
            [quantity, cartId, productId]
        )
        return result
    }

    // Add new item to cart
    static async addItem(cartId, productId, quantity) {
        const [result] = await query(
            'INSERT INTO cart_items (cart_id, product_id, quantity, createdAt) VALUES (?, ?, ?, NOW())',
            [cartId, productId, quantity]
        )
        return result
    }


    // Delete all items from a cart
static async deleteAllItems(cartId) {
    const [result] = await query(
        'DELETE FROM cart_items WHERE cart_id = ?',
        [cartId]
    )
    return result
}

// Delete specific item from cart
static async deleteItem(cartId, productId) {
    const [result] = await query(
        'DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?',
        [cartId, productId]
    )
    return result
}

// Calculate cart total
static async calculateTotal(cartId) {
    const [rows] = await query(`
        SELECT SUM(ci.quantity * p.price) as total 
        FROM cart_items ci 
        JOIN products p ON ci.product_id = p.product_id 
        WHERE ci.cart_id = ?`,
        [cartId]
    )
    return rows[0].total || 0
}

static async deleteCart(cartId) {
    // First delete all items from cart_items due to FK constraint
    await query('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);
    
    // Then delete the cart itself from shopping_cart
    const [result] = await query('DELETE FROM shopping_cart WHERE cart_id = ?', [cartId]);
    
    return result;
}


}

export default CartModel
