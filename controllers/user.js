import { hash, compare } from 'bcrypt';
import UserModel from '../models/user.js'
import emailService from '../services/emailService.js';
import tokenService from '../services/tokenService.js';
//import notificationService from '../services/notificationService.js';
import cacheService from '../services/cacheService.js';
import handleError from '../utils/handleError.js';




class User{


static getAllUsers = async (req, res) => {
   
    try {

      
   const cachedUsers = await cacheService.getFromCache('users')

     if (cachedUsers) {
      //console.log('data from cache')
       // notificationService.getNotifications()
        return res.status(200).json(cachedUsers)
    }

    const results = await UserModel.getAllUsers();

     await cacheService.setToCache('users',results)

    res.json(results);
        
    } catch (error) {
        handleError(res,error)    
    }
};

//----------------------------------------------------------------------------------------------------------

static getUserById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {

     const cachedUser = await cacheService.getFromCache(`user:${id}`);

    if (cachedUser) {
       console.log('data from cache')
       return res.status(200).json(cachedUser)
        
       }
        const user = await UserModel.getUserById(id);
        if (!user) {
           
            return res.status(404).json({ 
                error: `User not found with ${id}`, 
                
            });
        }
      
       await cacheService.setToCache(`user:${id}`, user);

        res.json(user);
    } catch (error) {
       
    handleError(res,error)
    }
};



// Agregar un nuevo usuario
static addUser = async (req, res) => {
    console.log(req.body)
    const { fullname, username, email,password,personal_ID,role } = req.body;

    if ( !username || !email || !password) {
        return res.status(400).json({ error: 'name,apellido,email & password are required' });
    }

    if (password.length < 7) {
        return res.status(400).json({ error: 'password must be at least 7 characters' });
    }

  
       try {


        const existingUser = await UserModel.existingUser(personal_ID)

        if (existingUser) {
         
            return res.status(400).json({ error: 'User already exist' });
        }

        const hashedPassword = await hash(password, 10);
        const result = await UserModel.addUser(fullname, username, email,hashedPassword,personal_ID,role);

       
        await cacheService.deleteFromCache('users');

        
        res.status(201).json({ id: result.insertId, fullname, email });
    } catch (error) {

      handleError(res,error)  
    }
};


static update = async (req, res) => {
    const { id } = req.params;
    const { fullname, username,email, password,personal_ID} = req.body;

    if (!fullname && !username && !email && !password  && !personal_ID) {
        return res.status(400).json({ error: 'No data to update' });
    }
console.log(req.body)
    try {
        let updateFields = [];
        let values = [];

        if (fullname) {
            updateFields.push('fullname');
            values.push(fullname);
        }

        if (username) {
            updateFields.push('username ');
            values.push(username);
        }

        if (email) {
            updateFields.push('email');
            values.push(email);
        }

        if (personal_ID) {
            updateFields.push('personal_ID ');
            values.push(personal_ID);
        }

      
        
        if (password) {
            const hashedPassword = await hash(password, 10);
            updateFields.push('password');
            values.push(hashedPassword);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ error: 'No data to update' });
        }

//        console.log(updateFields,values)
        const results = await UserModel.updateUser(id, updateFields,values);

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

       
     //  await cacheService.deleteFromCache(`user:${id}`);
      // await cacheService.deleteFromCache('users');
        

        res.status(200).json({ message: 'User updated succesfully' });
        
    } catch (error) {
       
        handleError(res,error)

        }
};


static deleteUser = async (req, res) => {
    
    const { id } = req.params;
  
    try {
        const result = await UserModel.deleteUser(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

       // await redis.del(`user:${id}`);
       // await redis.del('users');
       await cacheService.deleteFromCache(`user:${id}`);
   await cacheService.deleteFromCache('users');
        

        res.status(200).json({ message: 'User deleted succesfully' });
    } catch (error) {
        handleError(res,error)    
    }
};



static partialUpdate = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    // Validar que haya al menos un campo para actualizar
    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'No data to update' });
    }

    try {
        // Verificar si el usuario existe
        const userResults = await UserModel.getUserById(id)
        if (userResults.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        let updateFields = [];
        let values = [];

        // Solo actualizar los campos proporcionados
        if (updates.fullname) {
            updateFields.push('fullname');
            values.push(updates.fullname);
        }
        if (updates.email) {
            updateFields.push('username');
            values.push(updates.username);
        }

        if (updates.email) {
            updateFields.push('email');
            values.push(updates.email);
        }

        if (updates.personal_ID) {
            updateFields.push('personal_ID');
            values.push(updates.personal_ID);
        }


        // Añadir el ID al final de los valores
        values.push(id);

        if (updateFields.length === 0) {
            return res.status(400).json({ error: 'No hay datos válidos para actualizar' });
        }

        
        const result = await UserModel.updatePartialUser(updateFields,values)

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario actualizado parcialmente exitosamente' });
    } catch (error) {
        console.error('Error ejecutando la consulta:', err);
        handleError(res,error)    
    }
};

static filterUsers = async (req, res) => {
    console.log(req.query)
    const updates = req.query;
    try {

        
        let Fields = [];
        let values = [];

   // Only update field provided
   if (updates.fullname) {
    Fields.push('fullname');
    values.push(updates.fullname);
}
if (updates.personal_ID) {
    Fields.push('personal_ID');
    values.push(updates.personal_ID);
}

if (updates.username) {
    updateFields.push('username');
    values.push(updates.username);
}

if (updates.email) {
    Fields.push('email');
    values.push(updates.email);
}


        // Llamar a la función del modelo
        const results = await UserModel.filterUsers(Fields,values);

        res.status(200).json({results});
        
    } catch (error) {
       
        handleError(res,error)    
    }
};


static getProfile = async (req, res) => {
    try {
        
       /* if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'User not found' });
        }*/


        const results = await UserModel.getProfile();

        if (results.length === 0) {
            return res.status(404).json({ error: 'Profile not found' });
        }

   
        res.status(200).json(results);

    } catch (error) {
      
        handleError(res,error)    
    }
};


static getUserProfile= async (req,res) => {
 
    const {id} = req.params;
    
    if (!id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
               
        // Consultar el perfil del usuario en la base de datos
        const results = await UserModel.getUserProfile(id);

        if (results.length === 0) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        res.status(200).json(results);

     } catch (error) {
      
        handleError(res,error)    
     }

}


static getLoginHistory = async (req,res)=>{
   // const {id} = req.params;
   const{ nombre } =req.query
    try {
       // const result= await UserModel.getLoginHistory(id)


       const result= await UserModel.getLoginHistory(nombre);

           // Verifica si se encontró el usuario
           if (!result) {
            // Usuario no encontrado, responde con un error 404
            return res.status(404).json({ 
                error: 'User not found', 
              
            });
        }
        
        res.json(result);
    } catch (error) {
       
        handleError(res,error)    
    }
}


static getUsersWithPagination = async (req,res)=>{
    let {page= 1,limit=10}= req.query


     page = parseInt(page, 10);   
     limit = parseInt(limit, 10); 

    const offset= (page - 1 ) * limit;
    
    try {
        const result = await UserModel.getUsersWithPagination(limit,offset);
        res.status(200).json(result)

    } catch (error) {
      
        handleError(res,error)    
    }
}





static bulkUsers = async (req, res) => {
 
    console.log('full body',req.body)

    let users;
    if (typeof req.body.users === 'string') {
       
       try {
           users = JSON.parse(req.body.users || '[]');
       } catch (error) {
           return res.status(400).json({ error: 'Invalid JSON format for users' });
       }
   } else {
      
       users = req.body.users || [];
   }

   // const imagePath = req.files && req.files.length > 0 ? `/uploads/${req.files[0].filename}` : null;

    console.log(users);

    if (!Array.isArray(users)) {
        return res.status(400).json({ error: 'Users must be an array' });
    }

    const errors = [];
    const createdUsers = [];
    const usersToInsert = [];


    try {

        for (const user of users) {
            const { fullname, username,email, password,personal_ID,role } = user;

            if (!username || !email || !password ) {
                errors.push({ error: 'fullname,email & password are required', user });
                continue; // Cambiado para seguir insertando otros usuarios
            }

            if (password.length < 7) {
                errors.push({ error: 'Password must be at least 7 characters long', user });
                continue; // Cambiado para seguir insertando otros usuarios
            }

            const existingUser = await UserModel.existingUser(personal_ID);

            if (existingUser) {
                errors.push({ error: 'User already exist', fullname });
                continue; // Cambiado para seguir insertando otros usuarios
            }

           // const imagePath = req.files[0] ? req.files[0].filename : null; 

           // console.log(imagePath)

            const hashedPassword = await hash(password, 10);
            console.log(hashedPassword)

            usersToInsert.push({
                fullname,
                username,
                email,
                hashedPassword,
                personal_ID,
                role
               // imagen:imagePath
            });
        }

        if (usersToInsert.length > 0) {
            // Llama a la función de inserción de múltiples usuarios en el modelo
            const result = await UserModel.bulkUsers(usersToInsert);
            createdUsers.push(...usersToInsert.map(user => ({ name: user.fullname }))); // Solo agregar nombres
        }

        if (errors.length > 0) {
            res.status(400).json({ errors });
        } else {
            res.status(201).json({ createdUsers });
        }

    } catch (error) {
        
        handleError(res,error)    

    }
}


static deleteMultiple= async (req,res)=>{
   const { users } = req.body


   if (!Array.isArray(users)) {
    return res.status(400).json({ error: 'Users must be an array' });
 }

 try {
    const deletePromises = users.map(user=>{
        const { id } = user
        return UserModel.deleteUser(id)
    })

    await Promise.all(deletePromises)
        
    res. status(200).json({ message:'Users delete succesfully'})

    
 } catch (error) {
    handleError(res,error)    
}

}


static changeStatus = async (req, res) => {
    const { id, status } = req.params; // `status` se pasa en los parámetros de la URL
    console.log(id, status);

    // Validar que el `status` sea válido
    if (!['on', 'off'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status. Use "on" or "off"' });
    }

    try {
        const user = await UserModel.getUserStatus(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verifica si el estado actual ya es igual al deseado
        if (user.status === status) {
            return res.status(400).json({ message: `User is already ${status}` });
        }

        // Actualiza el estado
        const update = await UserModel.changeStatus(status, id);
        if (!update) {
            return res.status(500).json({ message: 'Failed to update user status' });
        }

        // Respuesta exitosa
        res.json({ message: `User status changed to ${status}` });

    } catch (error) {
        handleError(res, error); // Manejo de errores centralizado
    }
};


static requestPasswordReset= async (req,res)=>{
  const { email }= req.body;

  const user = UserModel.findByEmail(email)

  if(!user){
    return res.status(404).send('email not found')
  }
 
  const token = tokenService.generateToken(user.id,user.correo,user.rol,'1h')

  const emailSent = await emailService.sendEmail(email,'Password Reset',`You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
              `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
              `http://localhost:3001/resetPassword/${token}\n\n` +
              `If you did not request this, please ignore this email.\n`)
   

              if (!emailSent) {
                return res.status(500).send('Error sending email');
            }
    
            res.status(200).send('Recovery email sent');

}


static resetPassword= async (req,res)=>{
    const { token }  = req.params;
    const {newPassword} = req.body;

    try {

        const userId= await tokenService.verifyToken(token);
        
        if(!userId){
            return res.status(400).json({ message: 'Invalid or expired token' });
        }
        const hashedPassword = await hash(newPassword, 10);

        await UserModel.updateUserPassword(userId,hashedPassword)

       return res.status(200).json({ message: 'Password has been reset successfully' });
        
    } catch (error) {
        res.status(500).json({ message: 'Error resetting password', error: error.message });    
    }
}


}


export default User