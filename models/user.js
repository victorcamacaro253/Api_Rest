import { query,pool } from '../db/db.js';
import bcrypt from 'bcrypt';
import XLSX from 'xlsx';

class UserModel{

   static async getAllUsers() {
        const SQL=`SELECT u.user_id,u.google_id,u.facebook_id,u.github_id,u.twitter_id,u.fullname,u.username,u.personal_ID,u.email,u.role,r.name as role_name,u.image,u.status FROM users u JOIN roles r ON u.role = r.id`;

        const results = await query(SQL);
        return results;
    }

 static  async getUserById(id) {
        const SQL = 'SELECT u.user_id,u.google_id,u.facebook_id,u.github_id,u.twitter_idu.fullname,u.username,u.personal_ID,u.email,u.role,r.name as role_name,u.image,u.status FROM users u JOIN roles r ON u.role = r.id WHERE u.user_id = ?';
        const results = await query(SQL, [id]);
        return results;
    }

   static async getUserByNombre(nombre){
        const SQL = `SELECT * FROM usuario WHERE nombre = ?`;
        const result= await query(SQL,[nombre]);
        return result;
      
          }

   static async existingUser(personal_ID) {
    
    const SQL = `SELECT * FROM users WHERE personal_ID = ?`;
        const [results] = await query(SQL,[personal_ID]);
        console.log('resultados',results)
        return results;
    }



   static async addUser (fullname, username, email, hashedPassword,personal_ID,role){
    const SQL= `INSERT INTO users (fullname,username,email,password,personal_ID,role) VALUES (?,?,?,?,?,?)`;
        const result= await query( SQL,
            [fullname, username, email,hashedPassword,personal_ID,role] );

            return result;
    }


  static  async addUserGoogle({ google_id, nombre, correo, imagen }) {
    const SQL = `INSERT INTO usuario (google_id, nombre, correo, imagen) VALUES (?,?,?,?)`;
        const result = await query(SQL,
            [google_id, nombre, correo, imagen]
        );
    
     // Ahora, busca el usuario insertado usando su ID
     const SQL2='SELECT * FROM usuario WHERE id = ?';
  const insertedUser = await query(SQL2, [result.insertId]);
    
  return insertedUser[0]; // Asegúrate de retornar solo el primer resultado
    }



   static async addUserFacebook({ facebook_id, nombre, correo, imagen }) {
    const SQL='INSERT INTO usuario (facebook_id, nombre, correo, imagen) VALUES (?, ?, ?, ?)'
        const result = await query(SQL,
            [facebook_id, nombre, correo, imagen]
        );
    
     // Ahora, busca el usuario insertado usando su ID
     const SQL2='SELECT * FROM usuario WHERE id = ?';
  const insertedUser = await query(SQL2, [result.insertId]);
    
  return insertedUser[0]; // Asegúrate de retornar solo el primer resultado
    }

   static async addUserGithub({ github_id, nombre, correo, imagen }) {
    const SQL='INSERT INTO usuario (github_id, nombre, correo, imagen) VALUES (?, ?, ?, ?)'
        const result = await query(SQL,
            [github_id, nombre, correo, imagen]
        );
    
     // Ahora, busca el usuario insertado usando su ID
     const SQL2='SELECT * FROM usuario WHERE id = ?';
     const insertedUser = await query(SQL2, [result.insertId]);
    
     return insertedUser[0]; // Asegúrate de retornar solo el primer resultado
    }

    
   static async addUserTwitter({ twitter_id, nombre, correo, imagen }) {
        const SQL=`INSERT INTO usuario (twitter_id, nombre, correo, imagen) VALUES (?, ?, ?, ?)`
        const result = await query(SQL,
            [twitter_id, nombre, correo, imagen]
        );
    
     // Ahora, busca el usuario insertado usando su ID
      const SQL2=`SELECT * FROM usuario WHERE id = ?`
      const insertedUser = await _query(SQL2, [result.insertId]);
    
      return insertedUser[0]; // Asegúrate de retornar solo el primer resultado

     }
    

    // Modelo: updateUser
    static async updateUser(id, updateFields, values) {

     //construir la parte de SET para la consulta , añadiendo un signo de interrogacion para cada campo
     const setClause= updateFields.map(field => `${field} = ? `).join(', '); 

    // Construir la consulta SQL
    const SQL = `UPDATE usuario SET ${setClause} WHERE id = ?`;

    // Añadir el ID al final de los valores
    const finalValues = values.concat(id);

    // Ejecutar la consulta
    const results = await query(SQL, finalValues);

    return results; // Retornar el resultado de la consulta
}

static async updatePartialUser(updateFields,values){
  // Construir la consulta SQL
  const SQL = `UPDATE usuario SET ${updateFields.join(', ')} WHERE id = ?`;
  const result = await query(SQL, values);
  return result
}

static async filterUsers(fields, values) {
    if (fields.length === 0 || values.length === 0) {
        throw new Error('No fields or values provided for filtering.');
    }

    try {
        // Construir la consulta dinámica
        const conditions = fields.map((field, index) => `${field} = ?`).join(' AND ');

        const SQL = `SELECT user_id, fullname, username,email,password,ID,role,image,status,createdAt FROM users WHERE ${conditions}`;
        
      
       
        const [rows] = await query(SQL, values);

        return rows;
    } catch (error) {
        console.error('Error ejecutando la consulta dinámica:', error);
        throw error;
    }
}




   static async deleteUser(id) {
    const SQL= `DELETE FROM usuario WHERE id = ?`
        const result = await query(SQL, [id]);
        return result.affectedRows;
    }


   static async insertLoginRecord(userId, code) {
    const SQL=`INSERT INTO historial_ingresos (id_usuario, fecha, codigo) VALUES (?, NOW(), ?)`
        await query( SQL, [userId, code]);
    }


    static async findByEmail(email) {
        const SQL = `SELECT * FROM usuario WHERE email = ?`
        const results = await query(SQL, [email]);
        return results;
    }


static async getProfile(){
    const SQL=`SELECT u.user_id,u.fullname,u.username,u.personal_ID,u.email,u.role,r.name as role_name,u.image FROM users u JOIN roles r ON u.role = r.id`
    const results= await query(SQL);
    return results;
}

static async getUserProfile(id){
    const SQL= `SELECT u.user_id,u.fullname,u.username,u.personal_ID,u.email,u.role,r.name as role_name,u.image FROM users u JOIN roles r ON u.role = r.id WHERE u.user_id = ?`
    const result= await query(SQL,[id])
    return result;
}

/*
async getLoginHistory(id){
    
    try{

        const result= await _query('SELECT * FROM  hsitorial_ingresos WHERE id=?',[id]);
        return result;
    
    }catch(error){
    console.error('Error',error);
    throw error;
    }
}
*/

static async getLoginHistory(nombre){
    try {
        const SQL=`SELECT * FROM historial_ingresos INNER JOIN usuario ON historial_ingresos.id_usuario=usuario.id WHERE usuario.nombre=?`
        const result = await query(SQL, [nombre]);
        return result;
      } catch (error) {
        console.error('Error getting login history', error);
        throw error;
      }
    
}

static async getUsersWithPagination(limit,offset){
    try {
        const SQL= `SELECT SELECT u.user_id,u.fullname,u.username,u.personal_ID,u.email,u.role,r.name as role_name,u.image FROM users u JOIN roles r ON u.role = r.id LIMIT ? OFFSET ?`
        const result= await query(SQL,[limit,offset])
        return result;

    } catch (error) {
        console.error('Server Error',error)
        throw error;
    }
}


   static async bulkUsers(users){
       // console.log(users)
        const queries = users.map(user=>{
            const {fullname, username,email, hashedPassword,personal_ID,role} = user;
            console.log(personal_ID)
            const SQL = `INSERT INTO users (fullname,username,email,password,personal_ID,role) VALUES (?,?,?,?,?,?)`
            return query(SQL,
                [fullname, username,email, hashedPassword,personal_ID,role]
            )
        })  

        const result = await Promise.all(queries);
        return result

    }


   static async findUserByGoogleId(googleId) {
        const SQL = 'SELECT * FROM usuario WHERE google_id = ?';
        const [rows] = await query(SQL, [googleId]);
        return rows;
    }

   static async findUserByFacebookId(facebookId) {
        const SQL = 'SELECT * FROM usuario WHERE google_id = ?';
        const [rows] = await query(SQL, [facebookId]);
        return rows;
    }

   static async findUserByGithubId(githubId) {
        const SQL = 'SELECT * FROM usuario WHERE github_id = ?';
        const [rows] = await query(SQL, [githubId]);
        return rows;
    }


   static async findUserByTwitterId(twitterId) {
        const SQL = 'SELECT * FROM usuario WHERE twitter_id = ?';
        const [rows] = await query(SQL, [twitterId]);
        return rows;
    }


   static async changeStatus(status,id){
    const SQL = 'UPDATE usuario SET status = ? WHERE id = ?'
        const result = await query(SQL,[status,id])
        return result
     }



   static  async getUserStatus(id){
        const sql = "SELECT estatus FROM usuario WHERE id= ?"
        const [result]= await _query(sql,[id])
        return result 
     }
    

}







export default UserModel;