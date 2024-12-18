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
    const { name, apellido, cedula, email, password } = req.body;

    if (!name || !apellido || !email || !password) {
        return res.status(400).json({ error: 'name,apellido,email & password are required' });
    }

    if (password.length < 7) {
        return res.status(400).json({ error: 'password must be at least 7 characters' });
    }

  
    try {


        const existingUser = await User.existingCedula(cedula)

        if (existingUser.length > 0) {
         
            return res.status(400).json({ error: 'Usuario already exist' });
        }

        const hashedPassword = await hash(password, 10);
        const result = await User.addUser(name, apellido, cedula, email,hashedPassword);

       
        await cacheService.deleteFromCache('users');

        
        res.status(201).json({ id: result.insertId, name, email });
    } catch (error) {

      handleError(res,error)  
    }
};


static update = async (req, res) => {
    const { id } = req.params;
    const { name, apellido, cedula, email, password } = req.body;

    if (!name && !apellido && !email && !password) {
        return res.status(400).json({ error: 'No data to update' });
    }

    try {
        let updateFields = [];
        let values = [];

        if (name) {
            updateFields.push('nombre = ?');
            values.push(name);
        }

        if (apellido) {
            updateFields.push('apellido = ?');
            values.push(apellido);
        }

        if (cedula) {
            updateFields.push('cedula = ?');
            values.push(cedula);
        }

        if (email) {
            updateFields.push('correo = ?');
            values.push(email);
        }
        
        if (password) {
            const hashedPassword = await hash(password, 10);
            updateFields.push('contraseña = ?');
            values.push(hashedPassword);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ error: 'No data to update' });
        }

        const results = await User.updateUser(id, updateFields,values);

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

       
       await cacheService.deleteFromCache(`user:${id}`);
       await cacheService.deleteFromCache('users');
        

        res.status(200).json({ message: 'User updated succesfully' });
        
    } catch (error) {
       
        handleError(res,error)

        }
};

// Eliminar un usuario por ID
static deleteUser = async (req, res) => {
    
    const { id } = req.params;
  
    try {
        const result = await User.deleteUser(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

       // await redis.del(`user:${id}`);
       // await redis.del('users');
       await cacheService.deleteFromCache(`user:${id}`);
   await cacheService.deleteFromCache('users');
        

        res.status(200).json({ message: 'Usuario deleted succesfully' });
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
        const userResults = await User.getUserById(id)
        if (userResults.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        let updateFields = [];
        let values = [];

        // Solo actualizar los campos proporcionados
        if (updates.name) {
            updateFields.push('nombre = ?');
            values.push(updates.name);
        }
        if (updates.email) {
            updateFields.push('correo = ?');
            values.push(updates.email);
        }

        if (updates.cedula) {
            updateFields.push('correo = ?');
            values.push(updates.cedula);
        }

        if (updates.apellido) {
            updateFields.push('apellido = ?');
            values.push(updates.apellido);
        }

        if (updates.password) {
            const hashedPassword = await hash(updates.password, 10);
            updateFields.push('contraseña = ?');
            values.push(hashedPassword);
        }

        // Añadir el ID al final de los valores
        values.push(id);

        if (updateFields.length === 0) {
            return res.status(400).json({ error: 'No hay datos válidos para actualizar' });
        }

        
        const result = await User.updatePartialUser(updateFields,values)

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

   // Solo actualizar los campos proporcionados
   if (updates.fullname) {
    Fields.push('fullname');
    values.push(updates.fullname);
}
if (updates.ID) {
    Fields.push('ID');
    values.push(updates.ID);
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
        console.error('Error ejecutando la consulta', error);
        handleError(res,error)    
    }
};


static getProfile = async (req, res) => {
    try {
        
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Usuario not found' });
        }


        const results = await User.getPerfil();

        if (results.length === 0) {
            return res.status(404).json({ error: 'Profile not found' });
        }

   
        res.status(200).json(results);

    } catch (error) {
      
        handleError(res,error)    
    }
};


static getUserProfile= async (req,res) => {
    console.log('req.params:', req.params);
const {id} = req.params;
    

    if (!id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
               
        // Consultar el perfil del usuario en la base de datos
        const results = await User.getUserPerfil(id);

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


       const result= await User.getLoginHistory(nombre);

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
        const result = await User.getUsersWithPagination(limit,offset);
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
            const { name, apellido, cedula, email, password,rol } = user;

            if (!name || !apellido || !cedula || !email || !password || !rol) {
                errors.push({ error: 'name,apellido,cedula,email & password are required', user });
                continue; // Cambiado para seguir insertando otros usuarios
            }

            if (password.length < 7) {
                errors.push({ error: 'Password must be at least 7 characters long', user });
                continue; // Cambiado para seguir insertando otros usuarios
            }

            const existingUser = await User.existingCedula(cedula);

            if (existingUser) {
                errors.push({ error: 'User already exist', name });
                continue; // Cambiado para seguir insertando otros usuarios
            }

            const imagePath = req.files[0] ? req.files[0].filename : null; 

            console.log(imagePath)

            const hashedPassword = await hash(password, 10);

            usersToInsert.push({
                name,
                apellido,
                cedula,
                email,
                hashedPassword,
                rol,
                imagen:imagePath
            });
        }

        if (usersToInsert.length > 0) {
            // Llama a la función de inserción de múltiples usuarios en el modelo
            const result = await UserModel.addMultipleUser(usersToInsert);
            createdUsers.push(...usersToInsert.map(user => ({ name: user.nombre }))); // Solo agregar nombres
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
        return User.deleteUser(id)
    })

    await Promise.all(deletePromises)
        
    res. status(200).json({ message:'Users delete succesfully'})

    
 } catch (error) {
    handleError(res,error)    
}

}


static changeStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.params; 
console.log(id,status)
    try {
        const user = await User.getUserStatus(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verifica el estado actual del usuario
        if (user.estatus === 'activo' && status === 'activo') {
            return res.status(400).json({ message: 'User is alerady active' });
        }

        // Cambia el estado solo si el usuario está inactivo
        if (user.estatus === 'inactivo' && status === 'activo') {
            const update = await User.changeStatus('activo', id);
            if (!update) {
                return res.status(404).json({ message: `It hasn't been updated` });
            }
            return res.json({ message: 'It has switched to active' });
        }

        // Si el estado es inválido, se cambia a inválido
        const update = await User.changeStatus('inactivo', id);
        if (!update) {
            return res.status(404).json({ message: `It hasn't been updated` });
        }

        res.json({ message: 'Status chnaged successfully' });

    } catch (error) {
        handleError(res,error)    
    }
}


static requestPasswordReset= async (req,res)=>{
  const { email }= req.body;

  const user = User.findByEmail(email)

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

        await User.updateUserPassword(userId,hashedPassword)

       return res.status(200).json({ message: 'Password has been reset successfully' });
        
    } catch (error) {
        res.status(500).json({ message: 'Error resetting password', error: error.message });    
    }
}


}


export default User