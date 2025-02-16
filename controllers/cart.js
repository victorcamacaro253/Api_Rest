import cartModel from '../models/cart.js';
import handleError from '../utils/handleError.js';


class Cart {

    static async getCart(req,res){
        try{
            const cart = await cartModel.getCart()
            res.json(cart)
            }catch(error){
                handleError(res,error)     
                }
    }

    static async getCartById(req,res){
        try{
            const {id} = req.params
            const cart = await cartModel.getById(id)
            if(!cart){
                res.status(404).json({message:'Cart not found'})

            }

            res.json(cart)
            }catch(error){
                handleError(res,error)     
                }
    }

    static async getCartByUserId(req,res){
        try{
            const userId = req.user.id;

            const cart = await cartModel.getCartByUserId(userId)
            if(!cart){
                res.status(404).json({message:'Cart not found'})
                }
                res.json(cart)
                }catch(error){
                    handleError(res,error)
                    }

    }


    static async createCart(userId){
        try{
            const cart = await cartModel.createCart(userId)
            return cart
            }catch(error){
                handleError(res,error)
                }
    }


    static async addItemToCart(req,res){
        try{
            const userId = req.user.id
            const {productId,quantity} = req.body

             // 🔎 Verify if the user already have a shopping cart
             let cart = await cartModel.getCartByUserId(userId)

              // 🛒 If it doesn't have one, creates one automatically
              if(!cart){
                cart = await cartModel.createCart(userId)
                
              }

              // 📦 Verify if the product is already in the cart
              const existingItem = await cartModel.getItem(cart.id, productId);


            if (existingItem) {
                // 🔄 Si ya está en el carrito, aumentar cantidad (sin cambiar el precio unitario)
                await cartModel.updateQuantity(cart.id, productId, quantity);
            } else {
                // ➕ Si no está en el carrito, agregarlo con su precio
                const cartItem = await cart.addItem(cart.cart_id, productId, quantity,);
              
            }
            res.status(201).json({ message: "Producto agregado al carrito", cartId: cart.id });

    }catch(error){
        handleError(res,error)
    }
}

static async clearCart(req, res) {
    try {
        const { cartId } = req.params;
        await cartModel.deleteAllItems(cartId);
        res.json({ message: 'Cart cleared successfully' });
    } catch (error) {
        handleError(res, error);
    }
}

static async removeItem(req, res) {
    try {
        const { cartId, productId } = req.params;
        await cartModel.deleteItem(cartId, productId);
        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        handleError(res, error);
    }
}

static async updateItemQuantity(req, res) {
    try {
        const { cartId, productId } = req.params;
        const { quantity } = req.body;
        await cartModel.updateQuantity(cartId, productId, quantity);
        res.json({ message: 'Item quantity updated' });
    } catch (error) {
        handleError(res, error);
    }
}

static async getCartTotal(req, res) {
    try {
        const { cartId } = req.params;
        const total = await cartModel.calculateTotal(cartId);
        res.json({ total });
    } catch (error) {
        handleError(res, error);
    }
}

static async deleteCart(req, res) {
    try {
        const { id } = req.params;
        
        // Delete cart and all its items
        await cartModel.deleteCart(id);
        
        res.json({ 
            success: true,
            message: 'Cart and all items deleted successfully' 
        });
    } catch (error) {
        handleError(res, error);
    }
}



}

export default Cart