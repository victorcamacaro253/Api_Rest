import { query,pool } from '../db/db.js';

class UserModel{

   static async getAllUsers() {
        const SQL='SELECT u.user_id,u.fullname,u.username,u.personal_ID,u.phone,u.email,u.role,r.name,u.image,u.status FROM users u JOIN roles r ON u.role = r.id'
        const results = await query(SQL);
        return results;
    }

 static  async getUserById(id) {

        const SQL = 'SELECT u.user_id,u.google_id,u.facebook_id,u.github_id,u.twitter_id,u.fullname,u.username,u.personal_ID,u.phone,u.email,u.role,r.name as role_name,u.image,u.status FROM users u JOIN roles r ON u.role = r.id WHERE u.user_id = ?';
        const [results] = await query(SQL, [id]);
        return results;
    }

   static async getUserByUsername(username){
        const SQL = 'SELECT u.user_id,u.fullname,u.username,u.personal_ID,u.phone,u.email,u.role,r.name,u.image,u.status FROM users u JOIN roles r ON u.role = r.id  WHERE u.username = ?';
        const result= await query(SQL,[username]);
        return result;
      
          }

   static async existingUser(personal_ID) {
    
    const SQL = `SELECT * FROM users WHERE personal_ID = ?`;
        const [results] = await query(SQL,[personal_ID]);
        console.log('resultados',results)
        return results;
    }

   static async getUserByPersonalID(ID) {
    const SQL = `SELECT  u.user_id,u.fullname,u.username,u.personal_.ID,u.phone,u.email,u.role,r.name,u.image,u.status FROM users u JOIN roles r ON u.role = r.id  WHERE u.national_ID = ?`;
        const results = await query(SQL,[ID]);
          // Si el arreglo `results` contiene al menos un resultado, retorna `true`, si no, retorna `false`
        return results.length > 0;

    }

    static async getUserByEmail(email) {
        const SQL = `SELECT  u.user_id,u.fullname,u.username,u.personal_ID,u.phone,u.email,u.password,u.role,r.name,u.image,u.status FROM users u JOIN roles r ON u.role = r.id  WHERE u.email = ?`;
        const [results] = await query(SQL, [email]);
        return results;

    }



   static async addUser (fullname, username, email, hashedPassword,personal_ID,role){
    const SQL= `INSERT INTO users (fullname,username,email,password,personal_ID,role) VALUES (?,?,?,?,?,?)`;
        const result= await query( SQL,
            [fullname, username, email,hashedPassword,personal_ID,role] );

            return result;
    }


  static  async addUserGoogle({ googleId, username, email, image }) {
    console.log(googleId,username)
    const SQL = `INSERT INTO users (google_id, username, email,role, image) VALUES (?,?,?,3,?)`;
        const result = await query(SQL,
            [googleId, username, email, image]
        );
    console.log(result.insertId)
     // Ahora, busca el usuario insertado usando su ID
     const SQL2='SELECT * FROM users WHERE user_id = ?';
  const insertedUser = await query(SQL2, [result.insertId]);
    console.log(insertedUser[0])
  return insertedUser[0]; // Asegúrate de retornar solo el primer resultado
    }



   static async addUserFacebook({ facebook_id, username, email, image }) {
    const SQL='INSERT INTO users (facebook_id, username, email, role,image) VALUES (?, ?, ?,3,?)'
        const result = await query(SQL,
            [facebook_id, username, email, image]
        );
    
     // Ahora, busca el usuario insertado usando su ID
     const SQL2='SELECT * FROM users WHERE user_id = ?';
  const insertedUser = await query(SQL2, [result.insertId]);
    
  return insertedUser[0]; // Asegúrate de retornar solo el primer resultado
    }

   static async addUserGithub({ github_id, username, email, image }) {
    const SQL='INSERT INTO users (github_id, username, email,role , image) VALUES (?, ?, ?,3 , ?)'
        const result = await query(SQL,
            [github_id, username, email, image]
        );
    
     // Ahora, busca el usuario insertado usando su ID
     const SQL2='SELECT * FROM users WHERE user_id = ?';
     const insertedUser = await query(SQL2, [result.insertId]);
    
     return insertedUser[0]; // Asegúrate de retornar solo el primer resultado
    }

    
   static async addUserTwitter({ twitter_id, username, email, image }) {
        const SQL=`INSERT INTO users (twitter_id, username, email,role, image) VALUES (?, ?, ?, 3,?)`
        const result = await query(SQL,
            [twitter_id, username, email, image]
        );
    
     // Ahora, busca el usuario insertado usando su ID
      const SQL2=`SELECT * FROM users WHERE user_id = ?`
      const insertedUser = await query(SQL2, [result.insertId]);
    
      return insertedUser[0]; // Asegúrate de retornar solo el primer resultado

     }
    

    // Modelo: updateUser
    static async updateUser(id, updateFields, values) {
         //construir la parte de SET para la consulta , añadiendo un signo de interrogacion para cada campo
     const setClause= updateFields.map(field => `${field} = ? `).join(', '); 


    const SQL = `UPDATE users SET ${setClause} WHERE user_id = ?`;
  
    const finalValues = values.concat(id);

   
    const results = await query(SQL, finalValues);

    return results; // Retornar el resultado de la consulta
}

static async updatePartialUser(updateFields,values){
  
  const SQL = `UPDATE users SET ${updateFields.join(', ')} WHERE user_id = ?`;
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
        console.error('Error executing query ');
        throw error;
    }
}




   static async deleteUser(id) {
    const SQL= `DELETE FROM users WHERE user_id = ?`
        const result = await query(SQL, [id]);
        return result.affectedRows;
    }


   static async insertLoginRecord(userId, code) {
    const SQL=`INSERT INTO login_history (user_id,date, code) VALUES (?, NOW(), ?)`
        await query( SQL, [userId, code]);
    }


    static async getUserByEmail(email) {
        const SQL = `SELECT * FROM users WHERE email = ?`
        const [results] = await query(SQL, [email]);
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
        const SQL= `SELECT u.user_id,u.fullname,u.username,u.personal_ID,u.phone,u.email,u.role,r.name as role_name,u.image FROM users u JOIN roles r ON u.role = r.id LIMIT ? OFFSET ?`
        const result= await query(SQL,[limit,offset])
        return result;

    } catch (error) {
        console.error('Server Error',error)
        throw error;
    }
}


   static async bulkUsers(users){
      
        const queries = users.map(user=>{
            const {fullname, username,email, hashedPassword,personal_ID,role,image} = user;
            console.log(personal_ID)
            const SQL = `INSERT INTO users (fullname,username,email,password,personal_ID,role,image) VALUES (?,?,?,?,?,?,?)`
            return query(SQL,
                [fullname, username,email, hashedPassword,personal_ID,role,image]
            )
        })  

        const result = await Promise.all(queries);
        return result

    }


   static async getUserByGoogleId(googleId) {
        const SQL = 'SELECT * FROM users WHERE google_id = ?';
        const [rows] = await query(SQL, [googleId]);
        console.log(rows)
        return rows;
    }

   static async getUserByFacebookId(facebookId) {
        const SQL = 'SELECT * FROM users WHERE facebook_id = ?';
        const [rows] = await query(SQL, [facebookId]);
        return rows;
    }

   static async getUserByGithubId(githubId) {
        const SQL = 'SELECT * FROM users WHERE github_id = ?';
        const [rows] = await query(SQL, [githubId]);
        return rows;
    }


   static async getUserByTwitterId(twitterId) {
        const SQL = 'SELECT * FROM users WHERE twitter_id = ?';
        const [rows] = await query(SQL, [twitterId]);
        return rows;
    }


   static async changeStatus(status,id){
    const SQL = 'UPDATE users SET status = ? WHERE user_id = ?'
        const result = await query(SQL,[status,id])
        return result
     }



   static  async getUserStatus(id){
        const sql = "SELECT status FROM users WHERE user_id= ?"
        const [result]= await query(sql,[id])
        return result 
     }
    

}







export default UserModel;
