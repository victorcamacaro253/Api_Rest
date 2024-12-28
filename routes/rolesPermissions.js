import { Router } from 'express';
import rolesPermissions from '../controllers/rolesPermissions.js';

const router = Router();

//Routes to retrieve data from the database

//Route to get all roles from the database
router.get('/roles',rolesPermissions.getAllRoles);

//Route to get a specific role from the database
router.get('/roles/:id',rolesPermissions.getRoleById);


//Route to get all permissions from the database
router.get('/permissions',rolesPermissions.getAllPermissions);

//Route to get a specific permission from the database
router.get('/permissions/:id',rolesPermissions.getPermissionById);

//Route to get all roles with their permissions from the database
router.get('/roles-permissions',rolesPermissions.getAllRolesPermissions);

//Route to get a specific role with its permissions from the database
router.get('/roles-permissions/:id',rolesPermissions.getRolePermissionsById);

//Route to get all permissions with their roles from the database
router.get('/permissions-roles',rolesPermissions.getAllPermissionsRoles);

//Route to get a specific permission with its roles from the database
router.get('/permissions-roles/:id',rolesPermissions.getPermissionRolesById);


//Route to add a new role to the database
router.post('/',rolesPermissions.addRole);

//Route to add a new permission to the database
router.post('/permissions',rolesPermissions.addPermission);

//Route to add a new role with its permissions to the database
router.post('/roles-permissions',rolesPermissions.addRolePermission);

//Route to update a specific role in the database
router.put('/:id',rolesPermissions.updateRole);

//Route to update a specific permission in the database
router.put('/permissions/:id',rolesPermissions.updatePermission);

//Route to update a specific role with its permissions in the database
router.put('/roles-permissions/:id',rolesPermissions.updateRolePermissions);

//Route to delete a specific role from the database
router.delete('/:id',rolesPermissions.deleteRole);

//Route to delete a specific permission from the database
router.delete('/permissions/:id',rolesPermissions.deletePermission);

//Route to delete a specific role with its permissions from the database
router.delete('/roles-permissions/:id',rolesPermissions.deleteRolePermissions);

//Route to delete a specific permission with its roles from the database
router.delete('/permissions-roles/:id',rolesPermissions.deletePermissionRoles);


export default router;