import rolePermisosModel from "../models/rolesPermisosModel.js"

const checkPermission =  (permission)=>{
    return async (req,res,next)=>{
    const userRoleId= req.user.role
    try {
        console.log(userRoleId)
      const permisos = await rolePermisosModel.getPermissionsByRole(userRoleId)
     
      
      if (!permisos || permisos.length === 0) {
        return res.status(403).json({ message: 'Permission denied.' });
      }
            // Verifica si el rol tiene el permiso requerido
            const hasPermission = permisos.find((permiso) => permiso.permiso === permission);

             if (!hasPermission) {
        return res.status(403).json({ message: 'Permission denied' });
      }



      next(); 
    } catch (error) {
        console.error(error); // Log del error para depuración
        return res.status(500).json({ message: 'Error getting permissions' });
    }
 

    }
}

export default checkPermission