import UserModel from '../models/user.js';
import handleError from '../utils/handleError.js';
import XLSX from 'xlsx';


class exportData{

    static async UsersDataExcel(req,res){

        try {

            const users= await UserModel.getAllUsers();
        
            if(!users  || users.length === 0){
            throw new Error('No users found');
            }
        
            //Create a new workbook
            const wb= XLSX.utils.book_new();
        
            //Create a worksheet from users data
            const ws= XLSX.utils.json_to_sheet(users,{
                header:['user_id','fullname','username','email','personal_ID','image','status']
            })
        
                  // Ajustar automáticamente el ancho de las columnas
                  const colWidths = [
                    { wch: 10 }, // Ancho para "id"
                    { wch: Math.max(10, ...users.map(user => user.fullname?.length || 0)) }, // Ancho para "nombre"
                    { wch: Math.max(10, ...users.map(user => user.username?.length || 0)) }, // Ancho para "apellido"
                    { wch: Math.max(10, ...users.map(user => user.email?.length || 0)) }, // Ancho para "cedula"
                    { wch: Math.max(10, ...users.map(user => user.personal_ID?.length || 0))},
                    { wch: Math.max(10, ...users.map(user => user.name?.length || 0))},
                    { wch: Math.max(10, ...users.map(user => user.imagen?.length || 0))},
                    { wch: Math.max(10, ...users.map(user => user.status?.length || 0))}
                  ];
                  ws['!cols'] = colWidths;
        
        
            //Append the worksheet to the workbook
            XLSX.utils.book_append_sheet(wb,ws,'Users');
        
            //Convert workbook to buffer 
            const excelBuffer = XLSX.write(wb,{bookType:'xlsx',type:'buffer'})
        
        
        
            res.setHeader('Content-Disposition', 'attachment; filename="user_data.xlsx"')
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            res.send(excelBuffer)
        
            
            return excelBuffer
        
           } catch (error) {
           handleError(res,error)
           }
    }


    static async UserDataExcel(req,res){
        const { id } = req.params;
        console.log(id)

        try {
            const user = await UserModel.getUserById(id);
            console.log(user)
    
            if (!user) {
                res.status(404).json('No se encontraron resultados');
                return;
            }
    
            // Crear un nuevo libro
            const wb = XLSX.utils.book_new();
    
            // Crear una hoja de cálculo con datos en formato vertical
            const ws = XLSX.utils.aoa_to_sheet([
                ['Fullname', user.fullname],
                ['username', user.username],
                ['email', user.email],
                ['personal_ID', user.personal_ID],
                ['role', user.role_name],
                ['imagen', user.image],
                ['status', user.status],
            ]);
    
            // Añadir la hoja al libro
            XLSX.utils.book_append_sheet(wb, ws, 'User');
    
            // Convertir el libro en un buffer
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
    
            // Configurar encabezados de respuesta para descargar el archivo
            res.setHeader('Content-Disposition', 'attachment; filename="user_data.xlsx"');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.send(excelBuffer);
    
        } catch (error) {
            handleError(res, error);
        }
    
    }

}

export default exportData