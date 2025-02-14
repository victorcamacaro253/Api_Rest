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
}

export default Cart