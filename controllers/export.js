import UserModel from '../models/user.js';
import PurchaseModel from '../models/purchase.js';
import handleError from '../utils/handleError.js';
import XLSX from 'xlsx';
import PDFDocument from 'pdfkit';
import { Readable } from 'stream';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Parser  } from 'json2csv';


// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);





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
            const data =[
                ['Fullname', user.fullname],
                ['username', user.username],
                ['email', user.email],
                ['personal_ID', user.personal_ID],
                ['role', user.role_name],
                ['imagen', user.image],
                ['status', user.status],
            ];

            const ws = XLSX.utils.aoa_to_sheet(data);

              // Calcular el ancho dinámico de las columnas
        const colWidths = data[0].map((_, colIndex) => {
            // Obtener la longitud máxima de texto en cada columna
            const maxLength = Math.max(
                ...data.map(row => (row[colIndex] ? row[colIndex].toString().length : 0))
            );
            return { wch: maxLength + 2 }; // Añadir un pequeño margen (2)
        });

        // Asignar el ancho calculado a las columnas
        ws['!cols'] = colWidths;
    
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

    static async UsersDataExcelUsername (req,res){
        const {n} = req.query
    
        try {
            const users= await UserModel.getUserByUsername(n)
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



    static async UsersDataPdf(req,res){
        
    try {
        // Simular la obtención de datos del usuario
        const userData = await UserModel.getAllUsers();

        // Crea un documento PDF
        const doc = new PDFDocument();
        const stream = Readable.from(doc);

        // Configura las cabeceras para la descarga del PDF
        res.setHeader('Content-Disposition', 'attachment; filename="user_data.pdf"');
        res.setHeader('Content-Type', 'application/pdf');

        // Añadir título
        doc.fontSize(18).text('User Data', { align: 'center' });
        doc.moveDown();

        // Configurar la tabla
        const tableTop = 100;
        const itemHeight = 20;
        const tableWidth = 500;
        const columnWidths = [100, 200, 200]; // Ejemplo de anchos para columnas

        // Dibuja las cabeceras de la tabla
        doc.fontSize(10).text('ID', 50, tableTop);
        doc.text('fullname', 70, tableTop);
        doc.text('username', 150, tableTop);
        doc.text('email', 250, tableTop);
        doc.text('Personal_ID',350,tableTop)
        doc.text('Phone',450,tableTop)


      //  doc.moveDown(itemHeight);


        // Dibuja una línea horizontal debajo de las cabeceras
        doc.moveTo(50, tableTop + itemHeight).lineTo(550, tableTop + itemHeight).stroke();

        // Añadir datos a la tabla
        let y = tableTop + itemHeight;
        userData.forEach((user, index) => {
            doc.text(user.user_id, 30, y);
            doc.text(user.fullname, 50, y);
            doc.text(user.username, 150, y);
            doc.text(user.email,250,y)
            doc.text(user.personal_ID,350,y)
            doc.text(user.phone,450,y)

            // Dibuja una línea horizontal después de cada fila
            doc.moveTo(50, y + itemHeight).lineTo(550, y + itemHeight).stroke();
            y += itemHeight;
        });

        // Finaliza el PDF y envíalo como respuesta
        doc.end();
        stream.pipe(res);
    
    } catch (error) {

       handleError(res,error)
    }
    }
    

    static async UserDataPdf(req, res) {
        const { id } = req.params;
    
        try {
            const userData = await UserModel.getUserById(id);
            const userImagePath = userData.image; // e.g., 'uploads/1735008218260-882676649.png'
    console.log(userImagePath)
            const doc = new PDFDocument();
    
            res.setHeader('Content-Disposition', 'attachment; filename="user_data.pdf"');
            res.setHeader('Content-Type', 'application/pdf');
    
            doc.pipe(res);
    
            doc.text('User Data', { align: 'center', fontSize: 20 });
            doc.moveDown();
    
            doc.text(`ID: ${userData.user_id}`);
            doc.text(`Name: ${userData.fullname}`);
            doc.text(`Username: ${userData.username}`);
            doc.text(`Email: ${userData.email}`);
            doc.text(`Personal ID: ${userData.personal_ID}`);
            doc.text(`Phone: ${userData.phone}`);
            doc.moveDown();
    
            if (userImagePath) {
                try {

                    doc.text('Image : ', {  fontSize: 14, font: 'Helvetica-Bold' });
                doc.moveDown(); // Add some space between the title and the image

                    const absoluteImagePath = path.join(__dirname, '..', userImagePath); // Adjust path
                    console.log(absoluteImagePath)
                    fs.accessSync(absoluteImagePath, fs.constants.R_OK); // Check if file is readable
    
                    doc.image(absoluteImagePath, {
                        fit: [150, 150],
                        align: 'center',
                        valign: 'center',
                    });
                    doc.moveDown();
                } catch (err) {
                    console.error('Error loading image:', err.message);
                    doc.text('Error loading image', { align: 'center', color: 'red' });
                }
            } else {
                doc.text('No image available', { align: 'center' });
            }
    
            doc.end();
        } catch (error) {
            console.error('Error generating PDF:', error.message);
            handleError(res, error);
        }
    }


   static async UsersDataCsv(req,res){

    try {

        const users = await UserModel.getAllUsers()
    
    
        if (!users || users.length === 0) {
            throw new Error('No users found');
        }
    
        const fields= ['user_id','fullname','username','email','personal ID','phone','role',"name"]
        const json2csvParser = new Parser({fields})
        const csv = json2csvParser.parse(users)
        res.setHeader('Content-Disposition', 'attachment; filename="user_data.csv"');
        res.setHeader('Content-Type', 'text/csv');
        res.send(csv);
     
       } catch (error) {
        handleError(res,error)
       }
   }


   static async UserDataCsv(req,res){
    const {id}= req.params

    try {
        const users = await UserModel.getUserById(id)
    
    
        if (!users || users.length === 0) {
            throw new Error('No users found');
        }
    
        const fields= ['user_id','fullname','username','email','personal_ID','phone','role_name']
        const json2csvParser = new Parser({fields})
        const csv = json2csvParser.parse(users)
        res.setHeader('Content-Disposition', 'attachment; filename="user_data.csv"');
        res.setHeader('Content-Type', 'text/csv');
        res.send(csv);
     
       } catch (error) {
        handleError(res,error)
       }
   }

   static async PurchasesDataByUserExcel(req,res){
      const {userId} = req.params
    
      try {
        const purchases = await PurchaseModel.getPurchasesByUserId(userId);
        console.log(purchases);

        if (!purchases || purchases.length === 0) {
            throw new Error('No purchases found');
        }

        // Agrupar las compras
        const groupedPurchases = {};

        purchases.forEach(row => {
            if (!groupedPurchases[row.purchase_id]) {
                // Si aún no existe la compra, la crea
                groupedPurchases[row.purchase_id] = {
                    purchase_id: row.purchase_id,
                    date: row.date,
                    fullname: row.fullname,
                    email: row.email,
                    personal_ID: row.personal_ID,
                    products: [] // Inicializa el array de productos
                };
            }

            // Agregar el producto a la lista de productos
            groupedPurchases[row.purchase_id].products.push({
                product_id: row.product_id,
                name: row.name,
                amount: row.amount,
                price: row.price
            });
        });

        // Convertir el objeto agrupado en un array
        const finalPurchases = Object.values(groupedPurchases).map(purchase => ({
            ...purchase,
            products: purchase.products
                .map(product => `ID: ${product.product_id}, Name: ${product.name}, Quantity: ${product.amount}, Price: ${product.price}`)
                .join('; ')
        }));

        // Crear un nuevo libro de trabajo
        const wb = XLSX.utils.book_new();

        // Crear una hoja de trabajo desde los datos agrupados
        const ws = XLSX.utils.json_to_sheet(finalPurchases, {
            header: ['purchase_id', 'date', 'fullname', 'email', 'personal_ID', 'products']
        });

        // Ajustar el ancho de las columnas automáticamente
        const columnWidths = Object.keys(finalPurchases[0]).map((key, index) => {
            const maxLength = Math.max(
                key.length, // Longitud del nombre de la columna
                ...finalPurchases.map(row => (row[key] ? row[key].toString().length : 0)) // Longitud máxima del contenido
            );
            return { wch: maxLength + 2 }; // Agregar un poco de espacio adicional
        });

        ws['!cols'] = columnWidths;

        // Agregar la hoja de trabajo al libro
        XLSX.utils.book_append_sheet(wb, ws, 'Purchases');

        // Convertir el libro a un buffer
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

        // Configurar las cabeceras para la descarga
        res.setHeader('Content-Disposition', 'attachment; filename="purchases_data.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(excelBuffer);

        return excelBuffer;

    } catch (error) {
        handleError(res, error);
    }
   }


   static async PurchaseDataExcel(req, res) {
    try {
        const purchases = await PurchaseModel.getPurchases();
        console.log(purchases);

        if (!purchases || purchases.length === 0) {
            throw new Error('No purchases found');
        }

        // Agrupar las compras
        const groupedPurchases = {};

        purchases.forEach(row => {
            if (!groupedPurchases[row.purchase_id]) {
                // Si aún no existe la compra, la crea
                groupedPurchases[row.purchase_id] = {
                    purchase_id: row.purchase_id,
                    date: row.date,
                    fullname: row.fullname,
                    email: row.email,
                    personal_ID: row.personal_ID,
                    products: [] // Inicializa el array de productos
                };
            }

            // Agregar el producto a la lista de productos
            groupedPurchases[row.purchase_id].products.push({
                product_id: row.product_id,
                name: row.name,
                amount: row.amount,
                price: row.price
            });
        });

        // Convertir el objeto agrupado en un array
        const finalPurchases = Object.values(groupedPurchases).map(purchase => ({
            ...purchase,
            products: purchase.products
                .map(product => `ID: ${product.product_id}, Name: ${product.name}, Quantity: ${product.amount}, Price: ${product.price}`)
                .join('; ')
        }));

        // Crear un nuevo libro de trabajo
        const wb = XLSX.utils.book_new();

        // Crear una hoja de trabajo desde los datos agrupados
        const ws = XLSX.utils.json_to_sheet(finalPurchases, {
            header: ['purchase_id', 'date', 'fullname', 'email', 'personal_ID', 'products']
        });

        // Ajustar el ancho de las columnas automáticamente
        const columnWidths = Object.keys(finalPurchases[0]).map((key, index) => {
            const maxLength = Math.max(
                key.length, // Longitud del nombre de la columna
                ...finalPurchases.map(row => (row[key] ? row[key].toString().length : 0)) // Longitud máxima del contenido
            );
            return { wch: maxLength + 2 }; // Agregar un poco de espacio adicional
        });

        ws['!cols'] = columnWidths;

        // Agregar la hoja de trabajo al libro
        XLSX.utils.book_append_sheet(wb, ws, 'Purchases');

        // Convertir el libro a un buffer
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

        // Configurar las cabeceras para la descarga
        res.setHeader('Content-Disposition', 'attachment; filename="purchases_data.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(excelBuffer);

        return excelBuffer;

    } catch (error) {
        handleError(res, error);
    }
}


}

export default exportData