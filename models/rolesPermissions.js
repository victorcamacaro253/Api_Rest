import { query } from "../db/db.js";

class rolesPermissionsModel{

    static async getAllRoles(){
        const SQL = `SELECT * FROM roles`;
        const result = await query(SQL);
        return result

    }

    static async getRoleById(id){
        const SQL = `SELECT * FROM roles WHERE id = ?`;
        const result = await query(SQL, [id]);
        return result[0];

    }

    static async getAllPermissions(){
        const SQL = `SELECT * FROM permissions`;
        const result = await query(SQL);
        return result;
    }

    static async getPermissionById(id){
        const SQL = `SELECT * FROM permissions WHERE id = ?`;
        const result = await query(SQL, [id]);
        return result[0];
    }

    static async getAllRolesPermissions(){
        const SQL = `SELECT r.id as Role_id,.r.name as Role ,GROUP_CONCAT(p.name SEPARATOR ', ') as Permissions
                    FROM roles_permissions rp JOIN roles r ON rp.role_id=r.id JOIN permissions p ON rp.permission_id=p.id
                     GROUP BY r.id, r.name ORDER BY r.id;`;
        const result = await query(SQL);
        return result;
    }

    static async getRolePermissionsById(id){
        const SQL = `SELECT r.id as Role_id,.r.name as Role ,GROUP_CONCAT(p.name SEPARATOR ', ') as Permissions
        FROM roles_permissions rp JOIN roles r ON rp.role_id=r.id JOIN permissions p ON rp.permission_id=p.id
        WHERE r.id= ?  GROUP BY r.id, r.name ORDER BY r.id;`;
     const result = await query(SQL,[id]);
      return result;
    }

    static async getAllPermissionsRoles(){
        const SQL=`SELECT p.id as Permission_id,p.name as Permission ,GROUP_CONCAT(r.name SEPARATOR ', ') as Role
                  FROM roles_permissions rp JOIN roles r ON rp.role_id=r.id JOIN permissions p ON rp.permission_id=p.id
                   GROUP BY p.id,p.name ORDER BY p.id;`
                   const result = await query(SQL);
                   return result;
    }

  
    static async getPermissionRolesById(id){
        const SQL = `SELECT p.id as Permission_id,p.name as Permission ,GROUP_CONCAT(r
        .name SEPARATOR ', ') as Role
        FROM roles_permissions rp JOIN roles r ON rp.role_id=r.id JOIN permissions p ON rp.permission_id WHERE p.id= ? GROUP BY p.id,p.name ORDER BY p.id;
        `;
        const result = await query(SQL, [id]);
        return result;
        }

        static async addRole(name,description){
            const SQL = `INSERT INTO roles (name,description) VALUES (?,?)`;
            const result = await query(SQL, [name,description]);
            return result;

        }

        static async addPermission(name,description){
            const SQL = `INSERT INTO permissions (name,description) VALUES (?,?)`;
            const result = await query(SQL, [name,description]);
            return result;
        }

        static async addRolePermission(roleId,permissionId){
            const SQL = `INSERT INTO roles_permissions (role_id,permission_id) VALUES (?,?) `;
            const result = await query(SQL, [roleId,permissionId]);
            return result;

        }


        static async updateRole(roleId,updateFields,values){
            const setClause= updateFields.map(field => `${field} = ? `).join(', '); 


            const SQL = `UPDATE roles SET ${setClause} WHERE id = ?`;

            const finalValues = values.concat(roleId)

            const results = await query(SQL,[finalValues])
            return results;
        }


        static async updatePermission(permissionId,updateFields,values){
            const setClause= updateFields.map(field => `${field} = ? `).join(', ');
            const SQL = `UPDATE permissions SET ${setClause} WHERE id = ?`;
            const finalValues = values.concat(permissionId)
            const results = await query(SQL,[finalValues])
            return results;
            }


         static async updateRolePermission(roleId,permissionId){
            const SQL = `UPDATE roles_permissions SET role_id = ?, permission_id = ? WHERE role_id
            = ? AND permission_id = ?`;
            const results = await query(SQL, [roleId,permissionId]);
            return results;
            }
    

            static async deleteRole(id){
                const SQL = `DELETE FROM roles WHERE id = ?`;
                const results = await query(SQL, [id]);
                return results;
            }


            static async deletePermission(id){
                const SQL = `DELETE FROM permissions WHERE id = ?`;
                const results = await query(SQL, [id]);
                return results;
                }


                static async deleteRolePermission(roleId,permissionId){
                    const SQL = `DELETE FROM roles_permissions WHERE role_id = ? AND permission_id = ?`;
                    const results = await query(SQL, [roleId,permissionId]);
                    return results;
                    }
         

}


export default rolesPermissionsModel