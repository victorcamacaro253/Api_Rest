import rolesPermissionsModel from '../models/rolesPermissions.js';
import handleError from '../utils/handleError.js';

class rolesPermissions {

    static async getAllRoles(req,res){
        try {
            const roles = await rolesPermissionsModel.getAllRoles();
            res.json(roles)
            } catch (error) {
                console.error(error);
             handleError(res,error)
            }
        
    }

    static async getRoleById(req,res){
        const {id} = req.params
        if(!id){
            return res.status(400).json({message: 'id is required'})
        }
        try {
            
            const role = await rolesPermissionsModel.getRoleById(id);
            if (role.length===0) {
                return res.status(404).json({message: 'Role not found'})
            }

            res.json(role)

    }catch(error){
        handleError(res,error)
    }


}


static async getAllPermissions(req,res){
    try {
        const permissions = await rolesPermissionsModel.getAllPermissions();
     res.json(permissions)
    } catch (error) {
            handleError(res,error)
            }
} 

static async getPermissionById(req,res){
    const {id} = req.params
    if(!id){
        return res.status(400).json({message: 'id is required'})
        }
        try {
            const permission = await rolesPermissionsModel.getPermissionById(id);
            if (permission.length===0) {
                return res.status(404).json({message: 'Permission not found'})
                }
            res.json(permission)
            } catch (error) {
                    handleError(res,error)
                    }
                    }


             static async getAllRolesPermissions(req,res){
                try {
                    const rolesPermissions = await rolesPermissionsModel.getAllRolesPermissions();
                res.json(rolesPermissions)
                } catch (error) {
                        handleError(res,error)
                        }

             }       

             static async getRolePermissionsById(req,res){
                const {id} = req.params
                if(!id){
                    return res.status(400).json({message: 'id is required'})
                    }
                    try {
                        const rolePermissions = await rolesPermissionsModel.getRolePermissionsById(id);
                        if (rolePermissions.length===0) {
                            return res.status(404).json({message: 'Role not found'})
                            }
                       res.json(rolePermissions)
                        } catch (error) {
                                handleError(res,error)
                                }

             }

             static async getAllPermissionsRoles(req,res){
                try {
                    const permissionRoles = await rolesPermissionsModel.getAllPermissionsRoles();
                 
                    res.json(permissionRoles)

                    } catch (error) {
                        handleError(res,error)
                        }
             }

             static async getPermissionRolesById(req,res){
                const {id} = req.params
                if(!id){
                    return res.status(400).json({message: 'id is required'})
                    }
                    try {
                        const permissionRoles = await rolesPermissionsModel.getPermissionRolesById(id);
                        if (permissionRoles.length===0) {
                            return res.status(404).json({message: 'Permission not found'})
                            }

                            res.json(permissionRoles)

                            } catch (error) {
                                handleError(res,error)
                                }
                                
             }

             static async addRole (req,res){
                const {name,description} = req.body
                if(!name || !description){
                    return res.status(400).json({message: 'name and description are required'})
                    }
                    try {
                        const role = await rolesPermissionsModel.addRole(name,description);
                        return res.status(201).json(role);
                        
                        } catch (error) {
                            handleError(res,error)

                        }
             }


             static async addPermission (req,res){
                const {name,description} = req.body
                if(!name || !description){
                    return res.status(400).json({message: 'name and description are required'})
                    }
                    try {
                        const permission = await permissionsModel.addPermission(name,description);
                        return res.status(201).json(permission);

                    }catch(error){
                        handleError(res,error)
                    }
                }

                static async addRolePermission(req,res){
                    const {roleId,permissionId} = req.body
                    if(!roleId || !permissionId){
                        return res.status(400).json({message: 'roleId and permissionId are required'})
                        }
                        try {
                            const rolePermission = await rolesPermissionsModel.addRolePermission(roleId,permissionId);
                            return res.status(201).json(rolePermission);
                            } catch (error) {
                                handleError(res,error)
                                }
                            }



                       static async updateRole(req,res){
                        const { roleId } = req.params
                        const {name,description} = req.body
                        if(!roleId){
                            return res.status(400).json({message: 'roleId '})
                            }


                            try {

                                let updateFields = [];
                                let values = [];

                                if (name) {
                                    updateFields.push('name = ?');
                                    values.push(name);
                                }

                                if (description) {
                                updateFields.push('description = ?');
                                values.push(description);
                                 }
                                 
                              if (updateFields.length === 0) {
                              return res.status(400).json({ error: 'No hay datos para actualizar' });
                              }

                                const updatedRole = await rolesPermissionsModel.updateRole(roleId,updateFields,values);

                                return res.status(200).json(updatedRole);
                                } catch (error) {
                                    handleError(res,error)
                                    }
                                    
                       }


                       static async updatePermission(req,res){
                        const { permissionId } = req.params
                        const {name,description} = req.body
                        if(!permissionId){
                            return res.status(400).json({message: 'permissionId '})
                            }


                            try {

                                let updateFields = [];
                                let values = [];

                                if (name) {
                                    updateFields.push('name = ?');
                                    values.push(name);
                                }

                                if (description) {
                                updateFields.push('description = ?');
                                values.push(description);
                                 }
                                 
                              if (updateFields.length === 0) {
                              return res.status(400).json({ error: 'No data' });
                              }

                                const updatedPermission = await rolesPermissionsModel.updatePermission(permissionId,updateFields,values);
                                
                                return res.status(200).json(updatedPermission);
                                } catch (error) {

                                    handleError(res,error)

                                    }
                                    
                                    
                                }

                                static async updateRolePermissions(req,res){
                                    const {roleId,permissionId} = req.body
                                    if(!roleId || !permissionId){
                                        return res.status(400).json({message: 'roleId and permissionId are required'})
                                        }
                                        
                                        try {
                                            const updatedRolePermissions = await rolesPermissionsModel.updateRolePermission(roleId,permissionId);
                                            return res.status(200).json(updatedRolePermissions);
                                            } catch (error) {
                                                handleError(res,error)
                                                }                                      
                                    
                                            }


                                        static async deleteRole(req,res){
                                            const {roleId} = req.body
                                            if(!roleId){
                                                return res.status(400).json({message: 'roleId is required'})
                                                }
                                                try {
                                                    const deletedRole = await rolesModel.deleteRole(roleId);
                                                    return res.status(200).json(deletedRole);
                                                    
                                                } catch (error) {
                                                    handleError(res,error)
                                                    
                                                }
                                            
                                                }



                                       static async deletePermission(req,res){
                                        const {permissionId} = req.body 
                                        if(!permissionId){
                                            return res.status(400).json({message: 'permissionId is required'})
                                            }
                                            try {
                                                const deletedPermission = await permissionsModel.deletePermission(permissionId);
                                                if (!deletedPermission){
                                                    return res.status(404).json({message: 'Permission not found'})
                                                }
                                                return res.status(200).json(deletedPermission);
                                                    
                                            }catch(error){
                                                handleError(res,error)
                                            }


                                            
                                        }

                                        static async deleteRolePermissions(req,res){
                                            const {roleId} = req.body
                                            if(!roleId){
                                                return res.status(400).json({message: 'roleId is required'})
                                                }
                                                try {
                                                    const deletedRolePermissions = await rolesPermissionsModel.deleteRolePermissions(roleId);
                                                    return res.status(200).json(deletedRolePermissions);
                                                        
                                                }catch(error){
                                                    handleError(res,error)

                                                }
                                        }


                                       static async deletePermissionRoles(req,res){
                                        const {permissionId} = req.body
                                        if(!permissionId){
                                            return res.status(400).json({message: 'permissionId is required'})
                                            }
                                            try {
                                                const deletedPermissionRoles = await permissionsRolesModel.deletePermissionRoles(permissionId);
                                                return res.status(200).json(deletedPermissionRoles);

                                            }catch(error){
                                                handleError(res,error)
                                            }
                                       }
                                }

                                    

                                

export default rolesPermissions;