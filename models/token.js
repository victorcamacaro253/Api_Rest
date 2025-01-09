import { query } from "../db/db.js";

class tokenModel {

    static async saveRefreshToken(user_id,token,expiresIn){
        const queryStr= `INSERT INTO refresh_tokens (user_id,token,expiresIn) VALUES (?,?,?)`
        const result = await query(queryStr,[user_id,token,expiresIn])
        return result
        
    }

    static async revocateToken(saveRefreshToken){
        const queryStr=`UPDATE refresh_tokens SET revoked=TRUE WHERE token=?`
        const result = await query(queryStr,[saveRefreshToken])
        return result
    }


    static async verifyExistingToken(refresh,id){
        const queryStr = `SELECT * FROM refresh_tokens WHERE token=? AND user_id=? AND revoked=FALSE`
        const result = await query(queryStr,[refresh,id])
        return result

    }
}

export default tokenModel