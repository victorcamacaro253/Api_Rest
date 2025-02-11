import csvParser from 'csv-parser';
import fs from 'fs';
import XLSX from 'xlsx';
import handleError from '../utils/handleError.js';
import UserModel from '../models/user.js';
import ProductModel from '../models/product.js';
import {hash,compare} from 'bcrypt';

class importData {

    static async importUsersCsv(re,res){
        const filePath = req.file.path;
        const users = [];
        const errors = [];
    
        try {
            const readStream = fs.createReadStream(filePath);
            const parseStream = readStream.pipe(csvParser());
    
            const promises = [];
    
            parseStream.on('data', (row) => {
                const promise = new Promise(async (resolve, reject) => {
                    try {
                        const hashedPassword = await hash(row.password, 10);
                        const existingUser = await UserModel.existingUser(row.personal_ID);
    
                        if (existingUser) {
                            // Acumulamos el error en lugar de devolver una respuesta inmediatamente
                            errors.push(`User with ID ${row.personal_ID} already exist`);
                            resolve();  // Resolvemos la promesa para no bloquear el flujo
                            return;
                        }
    
                        // Si no existe, agregamos el usuario
                        users.push({
                            fullname: row.fullname,
                            username: row.username,
                            personal_ID: row.personal_ID,
                            email: row.email,
                            hashedPassword: hashedPassword,
                            role: row.role,
                            image: row.imagee,
                        });
                        resolve();  // Resolvemos la promesa una vez que el usuario se haya agregado
                    } catch (error) {
                        reject(error);  // En caso de error, rechazamos la promesa
                    }
                });
                promises.push(promise);
            });
    
            // Esperamos a que todas las promesas se resuelvan
            await new Promise((resolve, reject) => {
                parseStream.on('end', resolve);
                parseStream.on('error', reject);
            });
    
            // Esperamos a que todas las promesas de usuarios se resuelvan
            await Promise.all(promises);
    
            // Si no hubo errores, insertamos los usuarios en la base de datos
            if (users.length > 0) {
                await UserModel.bulkUsers(users);
            }
    
            // Eliminamos el archivo una vez procesado correctamente
            fs.unlinkSync(filePath);
    
            // Si hubo errores (usuarios duplicados), los devolvemos junto con una respuesta exitosa
            if (errors.length > 0) {
                return res.status(400).json({
                    message: 'Some users already exist.',
                    errors: errors
                });
            }
    
            // Respuesta exitosa si todo salió bien
            return res.json({ message: 'Users imported successfully' });
        } catch (error) {
            console.log('Error importing users', error);
    
            // Eliminamos el archivo si ocurrió un error
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
    
            return res.status(500).json({ message: 'Error importing users', error });
        }
    };

    
static  importUsersExcel= async(req,res)=>{
    const filePath = req.file.path
    const users=[]
    const errors = [];
  
  
    try {
  
      const workbook = XLSX.readFile(filePath)
  
      //suponemos que los datos estan en la primera hoja del archivo
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName]
  
      //convertimos los datos de la hoja a formato JSON 
      const data = XLSX.utils.sheet_to_json(worksheet);
      const headers = data.shift()
      
      const promises = []
  
      data.forEach((row)=>{
          promises.push(
              new Promise(async(resolve,reject)=>{
                  try {
                      const hashedPassword= await hash(row.password,10)
  
                      const existingUser = await UserModel.existingUser(row.personal_ID);
  
                      if (existingUser) {
                          // Acumulamos el error en lugar de devolver una respuesta inmediatamente
                          errors.push(`User with Personal_ID ${row.personal_ID} already exist`);
                          resolve();  // Resolvemos la promesa para no bloquear el flujo
                          return;
                      }
  
                      users.push({
                          fullname:row.fullname,
                          username:row.username,
                          personal_ID:row.personal_ID,
                          email:row.email,
                          password:hashedPassword,
                          role:row.role,
                          image:row.image
                          })
                          resolve()
                          
                      } catch (error) {
                      reject(error)
                      }
                      })
                  
              
          )
      })
  
      await Promise.all(promises)
  
      //const count = await UserModel.addMultipleUser(users)
       // Si no hubo errores, insertamos los usuarios en la base de datos
       if (users.length > 0) {
          await UserModel.bulkUsers(users);
      }
  
      fs.unlinkSync(filePath)
  
       // Si hubo errores (usuarios duplicados), los devolvemos junto con una respuesta exitosa
       if (errors.length > 0) {
          return res.status(400).json({
              message: 'Some users already exits.',
              errors: errors
          });
      }
  
      res.json({message:'Users imported successfully'})
  
    } catch (error) {
      if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
      }
  
      handleError(res,error)
    }
  }
    
/*
  static importProductsCsv = async (req, res) => {
    const filePath = req.file.path;
    const products = [];
    const errors = [];

    try {
        const readStream = fs.createReadStream(filePath);
        const parseStream = readStream.pipe(csvParser());

        const promises = [];

        parseStream.on('data', (row) => {
            console.log(row)
            const promise = new Promise(async (resolve, reject) => {
                try {

                    const existingProduct = await ProductModel.getProductByName(row.product_name);

                    if (existingProduct) {
                        // Acumulamos el error en lugar de devolver una respuesta inmediatamente
                        errors.push(`Product ${row.product_name} already exist`);
                        resolve();  // Resolvemos la promesa para no bloquear el flujo
                        return;
                    }

                    // Si no existe, agregamos el producto
                    products.push({
                        code: row.code,
                        name: row.product_name,
                        description: row.description,
                        price: parseFloat(row.price),
                        stock:parseInt(row.stock),
                        category_id: parseInt(row.category_id ),
                        status:row.status,
                        supplier_id: parseInt(row.supplier_id),
                        image:row.image
                    })
            
                    resolve();  // Resolvemos la promesa una vez que el producto se haya agregado
                } catch (error) {
                    reject(error);  // En caso de error, rechazamos la promesa
                }
            });
            promises.push(promise);
        });

        // Esperamos a que todas las promesas se resuelvan
        await new Promise((resolve, reject) => {
            parseStream.on('end', resolve);
            parseStream.on('error', reject);
        });

        // Esperamos a que todas las promesas de productos se resuelvan
        await Promise.all(promises);

        // Si no hubo errores, insertamos los usuarios en la base de datos
        if (products.length > 0) {
            await ProductModel.importProducts(products);
            
        }

        // Eliminamos el archivo una vez procesado correctamente
        fs.unlinkSync(filePath);

        // Si hubo errores (usuarios duplicados), los devolvemos junto con una respuesta exitosa
        if (errors.length > 0) {
            return res.status(400).json({
                message: 'Algunos productos ya existen.',
                errors: errors
            });
        }

        // Respuesta exitosa si todo salió bien
        return res.json({ message: 'Productos importados correctamente' });
    } catch (error) {
        console.log('Error al procesar el archivo o importar productos', error);

        // Eliminamos el archivo si ocurrió un error
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return res.status(500).json({ message: 'Error al importar productos', error });
    }
};

*/


static importProductsCsv = async (req, res) => {
    const filePath = req.file.path;
    const products = [];
    const productsStock = [];
    const errors = [];

    try {
        const readStream = fs.createReadStream(filePath);
        const parseStream = readStream.pipe(csvParser());

        const promises = [];

        parseStream.on('data', (row) => {
            const promise = (async () => {
                try {
                    console.log(row.price)
                    const existingProduct = await ProductModel.existingProduct(row.name);

                    console.log(existingProduct)

                   if (existingProduct) {
                        errors.push(`Product ${row.name} exist`);
                        return;
                    } 

                    products.push({
                        code: row.code,
                        name: row.name,
                        description: row.description,
                        priceNum: parseFloat(row.price),
                        stock: parseInt(row.stock),
                        category: parseInt(row.category_id),
                        status: row.status,
                        supplier: parseInt(row.supplier),
                        imagePath: row.image
                    });
                } catch (error) {
                    console.error(`Error procesando producto ${row.name}:`, error);
                }
            })();

            promises.push(promise);
        });
        console.log(products)

        // Esperamos a que termine la lectura del CSV
        await new Promise((resolve, reject) => {
            parseStream.on('end', resolve);
            parseStream.on('error', reject);
        });

        // Esperamos a que todas las promesas de validación se completen
        await Promise.all(promises);

        if (products.length > 0) {
            const insertedIds = await ProductModel.bulkProducts(products);
            console.log(insertedIds);

            // Asumiendo que `insertedIds` devuelve un array con los IDs insertados
            products.forEach((product, index) => {
                productsStock.push({
                    productId: insertedIds[index], // Corrected from products.insertID
                    stock: product.stock,
                    supplier: product.supplier // Assuming supplier maps to id_proveedor
                });
            });

            console.log(productsStock)
            // Insertar datos relacionados en `productsStock`
            await ProductModel.bulkProductsStock(productsStock);
        }

        // Eliminamos el archivo después de procesarlo
        await fs.promises.unlink(filePath);

        if (errors.length > 0) {
            return res.status(400).json({
                message: 'Algunos productos ya existen.',
                errors
            });
        }

        return res.json({ message: 'Productos importados correctamente' });
    } catch (error) {
        console.error('Error al procesar el archivo o importar productos:', error);

        // Eliminamos el archivo en caso de error
        if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
        }

        return res.status(500).json({ message: 'Error al importar productos', error });
    }
};





static importProductsExcel = async (req, res) => {
    const filePath = req.file.path;
    const products = [];
    const productsStock = [];
    const errors = [];

    try {
        // Cargar el archivo Excel
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0]; // Obtener la primera hoja
        const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]); // Convertir a JSON

        console.log(sheetData); // Debugging: Ver los datos leídos

        // Procesar cada fila del Excel
        for (const row of sheetData) {
            try {
                console.log(`Procesando producto: ${row.name}`);

                const existingProduct = await ProductModel.existingProduct(row.name);

                if (existingProduct) {
                    errors.push(`Product ${row.name} already exists`);
                    continue; // Saltamos la inserción si el producto ya existe
                }

                products.push({
                    code: row.code,
                    name: row.name,
                    description: row.description,
                    priceNum: parseFloat(row.price),
                    stock: parseInt(row.stock),
                    category: parseInt(row.category_id),
                    status: row.status,
                    supplier: parseInt(row.supplier),
                    imagePath: row.image
                });
            } catch (error) {
                console.error(`Error procesando producto ${row.name}:`, error);
            }
        }

        if (products.length > 0) {
            const insertedIds = await ProductModel.bulkProducts(products);
            console.log(insertedIds);

            products.forEach((product, index) => {
                productsStock.push({
                    productId: insertedIds[index], // Asumimos que devuelve IDs insertados en orden
                    stock: product.stock,
                    supplier: product.supplier
                });
            });

            console.log(productsStock);
            await ProductModel.bulkProductsStock(productsStock);
        }

        // Eliminar el archivo después de procesarlo
        await fs.promises.unlink(filePath);

        if (errors.length > 0) {
            return res.status(400).json({
                message: 'Algunos productos ya existen.',
                errors
            });
        }

        return res.json({ message: 'Productos importados correctamente' });
    } catch (error) {
        console.error('Error al procesar el archivo o importar productos:', error);

        // Eliminamos el archivo en caso de error
        if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
        }

        return res.status(500).json({ message: 'Error al importar productos', error });
    }
};





    }



    export default importData