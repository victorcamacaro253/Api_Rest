import PurchaseModel from '../models/purchase.js';
import handleError from '../utils/handleError.js';
import authenticateToken from '../middleware/authenticationToken.js';
import {pool} from '../db/db.js';

class Purchase {

    static async getPurchase(req, res) {
        try {
            const purchase = await PurchaseModel.getPurchases();

            const groupPurchase = new Map();

            for (const row of purchase) {
                const { purchase_id, date, amount, user_id, fullname, personal_ID, email,product_id,quantity,price,name } = row;
        
                if (!groupPurchase.has(purchase_id)) {
                    groupPurchase.set(purchase_id, {
                        purchase_id,
                        date,
                       total: amount,
                        user: {
                            user_id,
                            fullname,
                            personal_ID,
                            email
                        },
                        products: []
                    });
                }
                
                groupPurchase.get(purchase_id).products.push({
                    product_id,
                    quantity,
                    price,
                    name,    
                    });
        
            }
            
           return res.json([...groupPurchase.values()]);


            } catch (error) {
          handleError(res, error);    

             }


         }

    static async getPurchaseById(req, res) {
        const {id} = req.params;

        if (!id) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        try {
            const purchase = await PurchaseModel.getPurchaseById(id);

            if (!purchase) {
                return res.status(404).json({message: 'Purchase not found'});
            }
          
            const groupPurchase = new Map();

            for (const row of purchase) {
                const { purchase_id, date, amount, user_id, fullname, personal_ID, email,product_id,quantity,price,name } = row;
        
                if (!groupPurchase.has(purchase_id)) {
                    groupPurchase.set(purchase_id, {
                        purchase_id,
                        date,
                       total: amount,
                        user: {
                            user_id,
                            fullname,
                            personal_ID,
                            email
                        },
                        products: []
                    });
                }
                
                groupPurchase.get(purchase_id).products.push({
                    product_id,
                    quantity,
                    price,
                    name,    
                    });
        
            }
            
           return res.json([...groupPurchase.values()]);


            }
            catch (error) {

                handleError(res, error);
            }
            }


    static async getPurchaseByUserId(req, res) {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        try {
            const purchase = await PurchaseModel.getPurchasesByUserId(userId);
           
            if (!purchase) {
                return res.status(404).json({message: 'Purchase not found'});
            }

            const groupPurchase = new Map();

            for (const row of purchase) {
                const { purchase_id, date, amount, user_id, fullname, personal_ID, email,product_id,quantity,price,name } = row;
        
                if (!groupPurchase.has(purchase_id)) {
                    groupPurchase.set(purchase_id, {
                        purchase_id,
                        date,
                       total: amount,
                        user: {
                            user_id,
                            fullname,
                            personal_ID,
                            email
                        },
                        products: []
                    });
                }
                
                groupPurchase.get(purchase_id).products.push({
                    product_id,
                    quantity,
                    price,
                    name,    
                    });
        
            }
            
           return res.json([...groupPurchase.values()]);

        } catch (error) {
            handleError(res, error);
        }

    }

    static async getPurchaseByProduct(req, res) {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'Product ID is required' });
            }
            try {
                const purchase = await  PurchaseModel.getPurchasesByProduct(id);
                if (!purchase) {
                    return res.status(404).json({message: 'Purchase not found'});
                }

                const groupPurchase = new Map();

                for (const row of purchase) {
                    const { purchase_id, date, amount, user_id, fullname, personal_ID, email,product_id,quantity,price,name } = row;
            
                    if (!groupPurchase.has(purchase_id)) {
                        groupPurchase.set(purchase_id, {
                            purchase_id,
                            date,
                           total: amount,
                            user: {
                                user_id,
                                fullname,
                                personal_ID,
                                email
                            },
                            products: []
                        });
                    }
                    
                    groupPurchase.get(purchase_id).products.push({
                        product_id,
                        quantity,
                        price,
                        name,    
                        });
            
                }
                
               return res.json([...groupPurchase.values()]);
                
                } catch (error) {
                    handleError(res, error);
                }
                }

                static async getPurchaseByPriceRange(req, res) {
                    const { min, max } = req.params;
                    if (!min || !max) {
                        return res.status(400).json({ error: 'Price range is required' });
                    }

                    try {
                        const purchase = await PurchaseModel.getPurchasesByPriceRange(min, max);
                        if (!purchase) {
                            return res.status(404).json({message: 'Purchase not found'});
                        }

                        const groupPurchase = new Map();

                        for (const row of purchase) {
                            const { purchase_id, date, amount, user_id, fullname, personal_ID, email,product_id,quantity,price,name } = row;
                    
                            if (!groupPurchase.has(purchase_id)) {
                                groupPurchase.set(purchase_id, {
                                    purchase_id,
                                    date,
                                   total: amount,
                                    user: {
                                        user_id,
                                        fullname,
                                        personal_ID,
                                        email
                                    },
                                    products: []
                                });
                            }
                            
                            groupPurchase.get(purchase_id).products.push({
                                product_id,
                                quantity,
                                price,
                                name,    
                                });
                    
                        }
                        
                       return res.json([...groupPurchase.values()]);
                    
                        } catch (error) {
                            handleError(res, error);
                        }
                        }

                        static async getPurchaseByDateRange(req, res) {
                            const { startDate, endDate } = req.query;
                            if (!startDate || !endDate) {
                                return res.status(400).json({ error: 'Date range is required' });
                            }
                            try {
                                const purchase = await PurchaseModel.getPurchasesByDateRange(startDate, endDate);
                                if (!purchase) {
                                    return res.status(404).json({message: 'Purchase not found'});
                                    }

                                    const groupPurchase = new Map();

                                    for (const row of purchase) {
                                        const { purchase_id, date, amount, user_id, fullname, personal_ID, email,product_id,quantity,price,name } = row;
                                
                                        if (!groupPurchase.has(purchase_id)) {
                                            groupPurchase.set(purchase_id, {
                                                purchase_id,
                                                date,
                                               total: amount,
                                                user: {
                                                    user_id,
                                                    fullname,
                                                    personal_ID,
                                                    email
                                                },
                                                products: []
                                            });
                                        }
                                        
                                        groupPurchase.get(purchase_id).products.push({
                                            product_id,
                                            quantity,
                                            price,
                                            name,    
                                            });
                                
                                    }
                                    
                                   return res.json([...groupPurchase.values()]);
                                    
                                    }
                                    catch (error) {
                                        handleError(res, error);
                                    }
                                    }


                        static async getPurchaseByUserDate(req, res) {
                            const { userId } = req.params;
                            const { startDate, endDate } = req.query;
                            if (!userId || !startDate || !endDate) {
                                return res.status(400).json({ error: 'User ID and Date range are required' });
                            }
                           
                            try {
                                const purchase = await PurchaseModel.getPurchasesByUserDate(userId,startDate, endDate);
                                if (!purchase) {
                                    return res.status(404).json({message: 'Purchase not found'});
                                    }

                                    const groupPurchase = new Map();

                                    for (const row of purchase) {
                                        const { purchase_id, date, amount, user_id, fullname, personal_ID, email,product_id,quantity,price,name } = row;
                                
                                        if (!groupPurchase.has(purchase_id)) {
                                            groupPurchase.set(purchase_id, {
                                                purchase_id,
                                                date,
                                               total: amount,
                                                user: {
                                                    user_id,
                                                    fullname,
                                                    personal_ID,
                                                    email
                                                },
                                                products: []
                                            });
                                        }
                                        
                                        groupPurchase.get(purchase_id).products.push({
                                            product_id,
                                            quantity,
                                            price,
                                            name,    
                                            });
                                
                                    }
                                    
                                   return res.json([...groupPurchase.values()]);

                                    }
                                    catch (error) {
                                        handleError(res, error);
                                    }

                                }


                        static async getPurchaseByStatus(req, res) {
                            const { status } = req.query;
                            if (!status) {
                                return res.status(400).json({ error: 'Status is required' });
                                }
                                try {
                                    const purchase = await PurchaseModel.getPurchasesByStatus(status);
                                    if (!purchase) {
                                        return res.status(404).json({message: 'Purchase not found'});
                                        }
                                        res.json(purchase);
                                        }
                                        catch (error) {
                                            handleError(res, error);

                                        }
                                    }

                           static async getPurchaseByPaymentMethod(req, res) {
                            const { paymentMethod } = req.query;
                            if (!paymentMethod) {
                                return res.status(400).json({ error: 'Payment method is required' });
                                }
                                try {
                                    const purchase = await PurchaseModel.getPurchasesByPaymentMethod(paymentMethod);
                                    if (!purchase) {
                                        return res.status(404).json({message: 'Purchase not found'});
                                        }

                                        res.json(purchase);
                                        }
                                        catch (error) {
                                            handleError(res, error);
                                        }
                                            
                                    }

                                    static async getPurchaseStadistics(req, res) {
                                        try {
                                            const purchase = await PurchaseModel.getPurchases();
                                           const purchaseStats = await PurchaseModel.getPurchaseStats()
                                      
                                            const total_purchases = purchaseStats.length;
                                            const total_purchases_amount = purchaseStats.reduce((acc, purchase) => acc + parseFloat(purchase.amount), 0);
                                            //const total_purchases_quantity = purchase.reduce((acc, purchase) => acc + parseFloat(purchase.quantity), 0);
                                            const average_purchase_amount = total_purchases_amount / total_purchases;
                                           // const average_purchase_quantity = total_purchases_quantity / total_purchases;
                                            const min_purchase_amount = Math.min(...purchase.map(purchase => purchase.amount));
                                            const max_purchase_amount = Math.max(...purchase.map(purchase => purchase.amount));
                                            const first_purchase = purchaseStats[0];
                                            const last_purchase = purchaseStats[purchaseStats.length - 1];

                                            res.json({
                                                total_purchases,
                                                total_purchases_amount,
                                              //  total_purchases_quantity,
                                                average_purchase_amount,
                                              //  average_purchase_quantity,
                                                min_purchase_amount,
                                                max_purchase_amount,
                                                first_purchase,
                                                last_purchase
                                                });

                                           
                                            }
                                            catch (error) {
                                                handleError(res, error);
                                            }

                                        }

                                        /*    static async getPurchaseStadistics(req, res) {
                                                try {
                                                    const purchase = await PurchaseModel.getPurchaseStadistics();
                                                    console.log(purchase);
                                                    res.json(purchase);
                                                }catch(error) {
                                                    handleError(res, error);

                                                }
                                            }
                                                */

                                        static async getPurchaseStadisticsByDate(req, res) {
                                            const { startDate,endDate } = req.query;
                                            if (!date) {
                                                return res.status(400).json({ error: 'Date is required' });
                                            }
                                            try {
                                                const purchase = await purchaseModel.getPurchaseStadisticsByDate(startDate,endDate);
                                                const total_purchases = purchase.length;
                                                const total_purchases_amount = purchase.reduce((acc, purchase) => acc + purchase.amount, 0);
                                                const total_purchases_quantity = purchase.reduce((acc, purchase) => acc + purchase.quantity, 0);
                                                const average_purchase_amount = total_purchases_amount / total_purchases;
                                                const average_purchase_quantity = total_purchases_quantity / total_purchases;
                                                const min_purchase_amount = Math.min(...purchase.map(purchase => purchase.amount));
                                                const max_purchase_amount = Math.max(...purchase.map(purchase => purchase.amount));
                                                const first_purchase = purchase[0];
                                                const last_purchase = purchase[purchase.length - 1];

                                                res.json({
                                                    total_purchases,
                                                    total_purchases_amount,
                                                    total_purchases_quantity,
                                                    average_purchase_amount,
                                                    average_purchase_quantity,
                                                    min_purchase_amount,
                                                    max_purchase_amount,
                                                    first_purchase,
                                                    last_purchase
                                                });

                                                
                                                }
                                                catch (error) {
                                                    
                                                    handleError(res, error);
                                                }
                                                    
                                            }

                                            static async getPurchaseStadisticsByUser(req, res) {
                                                const { userId } = req.params;
                                                if (!userId) {

                                                    return res.status(400).json({ error: 'User ID is required' });
                                                }
                                                try {
                                                    const purchase = await purchaseModel.getPurchaseStadisticsByUser(userId);
                                                    const total_purchases = purchase.length;
                                                    const total_purchases_amount = purchase.reduce((acc, purchase) => acc + purchase.amount, 0);
                                                    const total_purchases_quantity = purchase.reduce((acc, purchase) => acc + purchase.quantity, 0);
                                                    const average_purchase_amount = total_purchases_amount / total_purchases;
                                                    const average_purchase_quantity = total_purchases_quantity / total_purchases;
                                                    const min_purchase_amount = Math.min(...purchase.map(purchase => purchase.amount));
                                                    const max_purchase_amount = Math.max(...purchase.map(purchase => purchase.amount));
                                                    const first_purchase = purchase[0];
                                                    const last_purchase = purchase[purchase.length - 1];

                                                    res.json({
                                                        total_purchases,
                                                        total_purchases_amount,
                                                        total_purchases_quantity,
                                                        average_purchase_amount,
                                                        average_purchase_quantity,
                                                        min_purchase_amount,
                                                        max_purchase_amount,
                                                        first_purchase,
                                                        last_purchase
                                                    });

                                                    }
                                                    catch (error) {
                                                        handleError(res, error);
                                                    }
                                                    
                                                }


                                                static async getPurchaseByUsername(req, res) {
                                                    const { username } = req.params;
                                                    if (!username) {
                                                        return res.status(400).json({ error: 'Username is required' });
                                                    }
                                                    try {
                                                        const purchase = await purchaseModel.getPurchaseByUsername(username);
                                                        if (!purchase) {
                                                            return res.status(404).json({message: 'Purchase not found'});
                                                        }
                                                        res.json(purchase);
                                                        }
                                                        catch (error) {
                                                            handleError(res, error);
                                                        }
                                                        
                                                    }

                                                    static async createPurchase(req, res) {
                                                        const {userId,products}= re.body;
                                                        if (!userId || !products) {
                                                            return res.status(400).json({ error: 'User ID and products are required' });
                                                            }


                                                            let total_purchase = 0;

                                                            for(const product of products) {
                                                                const {product_id,price,quantity} = product;
                                                                if (!product_id || !price ||isNaN(quantity) || !quantity || quantity <= 0 || isNaN(price) || price <= 0) {
                                                                    return res.status(400).json({ error: 'Product ID, price and quantity are required' });
                                                                }
                                                                total_purchase += price * quantity;
                                                            }


                                                            //start transacction
                                                            const connection = await pool.getConnection();
                                                            await connection.beginTransaction();


                                                            try {
                                                                const insertProducts=[]

                                                                for(const product of products) {
                                                                    const {product_id,price,quantity} = product;
                                                                    const stock = await ProductModel.getProductStock(connection,product_id);

                                                                    if (stock < quantity) {
                                                                        await connection.rollback();
                                                                        return res.status(400).json({ error: 'Insufficient stock for the product id' + product_id });
                                                                    }

                                                                    insertProducts.push(product);
                                                                }

                                                                const purchaseId = await purchaseModel.createPurchase(connection,userId,total_purchase);

                                                                await purchaseModel.createPurchaseProducts(connection,purchaseId,insertProducts);

                                                                for (const product of insertProducts) {
                                                                    const {product_id,quantity} = product;
                                                                    const stock = await ProductModel.getProductStock(connection,product_id);
                                                                    const newStock = stock - quantity;
                                                                    await ProductModel.updateProductStock(connection,product_id,newStock);
                                                                }

                                                                await connection.commit();

                                                                for (const product of insertProducts){
                                                                    const {product_id,quantity} = product;
                                                                    await ProductModel.updateTopSelling(product_id,quantity);
                                                                }

                                                                notificationService.notifyClients(`Purchase Notification recieved: ${purchaseId}, Usuario: ${userId}, Total: ${total_purchase}`)

                                                                return res.json({ message: 'Purchase created successfully', purchaseId: purchaseId });
                                                                
                                                            } catch (error) {
                                                                    await connection.rollback(); // Deshacer la transacción en caso de error

                                                                handleError(res, error);
                                                            }finally{
                                                                connection.release();
                                                            }
                                                        }



                                                        static async  deletePurchase(req, res) {
                                                            const { purchaseId } = req.params;
                                                           
                                                            const connection = await pool.getConnection();
                                                            await connection.beginTransaction();

                                                            try {
                                                                const purchaseProducts = await purchaseModel.getPurchaseProductsById(connection,purchaseId);

                                                               for (const product of purchaseProducts){
                                                                const {product_id,purchase_id} = product;
                                                                await purchaseModel.deletePurchaseProduct(connection,purchase_id);
 
                                                               }

                                                                await purchaseModel.deletePurchase(connection,purchaseId);

                                                                await connection.commit();

                                                                return res.json({ message: 'Purchase deleted successfully' });
                                                            } catch (error) {
                                                                await connection.rollback();
                                                                handleError(res, error);
                                                            } finally {
                                                                connection.release();
                                                            }
                                                        }

}

export default  Purchase;