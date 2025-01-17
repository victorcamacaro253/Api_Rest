import { query } from "../db/db.js";


class apiKeyModel {

 static async saveApiKey(apiKey,userId) {
    const result = await query(`INSERT INTO api_keys (user_id,apiKey,revoked) VALUES (?,?,0)`,
         [userId,apiKey]);
    return result;
    
 }

 static async getApiKey(userId) {
   const result = await query(`SELECT apikey FROM api_keys WHERE  user_id = ?`, [ userId]);

   // Verificar si se encontró un resultado
   if (result.length > 0) {
       return result[0].apikey; // Devuelve el valor de apikey como una cadena
   }
   return null; // Devuelve null si no se encuentra la API key
}

}

export default apiKeyModel