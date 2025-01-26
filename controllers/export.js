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



/*   static async PurchasesDataByUserExcel(req,res){
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
*/
static async PurchasesDataByUserExcel(req, res) {
    const { userId } = req.params;

    try {
        const purchases = await PurchaseModel.getPurchasesByUserId(userId);
        console.log(purchases);

        if (!purchases || purchases.length === 0) {
            throw new Error('No purchases found');
        }

        // Extract unique user data
        const { fullname, email, personal_ID } = purchases[0]; // Assume all rows have the same user data
        const groupedPurchases = {};

        // Group purchases by purchase_id
        purchases.forEach(row => {
            if (!groupedPurchases[row.purchase_id]) {
                groupedPurchases[row.purchase_id] = {
                    purchase_id: row.purchase_id,
                    date: row.date,
                    products: [] // Initialize product array
                };
            }

            // Add product details
            groupedPurchases[row.purchase_id].products.push({
                product_id: row.product_id,
                name: row.name,
                amount: row.amount,
                price: row.price
            });
        });

        // Convert grouped data to a flat array for Excel
        const finalPurchases = Object.values(groupedPurchases).map(purchase => ({
            purchase_id: purchase.purchase_id,
            date: purchase.date,
            products: purchase.products
                .map(product => `ID: ${product.product_id}, Name: ${product.name}, Quantity: ${product.amount}, Price: ${product.price}`)
                .join('; ')
        }));

        // Prepare the Excel data
        const excelData = [
            // Add user info as the first row
            { Field: 'Full Name', Value: fullname },
            { Field: 'Email', Value: email },
            { Field: 'Personal ID', Value: personal_ID },
            {}, // Add an empty row as a spacer
            ...finalPurchases // Add grouped purchase data
        ];

        // Create a new workbook
        const wb = XLSX.utils.book_new();

        // Create worksheet for purchases
        const ws = XLSX.utils.json_to_sheet(excelData, {
            header: ['Field', 'Value', 'purchase_id', 'date', 'products']
        });

        // Adjust column widths
        const columnWidths = [
            { wch: 15 }, // Field
            { wch: 30 }, // Value
            { wch: 15 }, // purchase_id
            { wch: 20 }, // date
            { wch: 50 }  // products
        ];

        ws['!cols'] = columnWidths;

        // Append worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Purchases');

        // Convert workbook to buffer
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

        // Set headers for download
        res.setHeader('Content-Disposition', 'attachment; filename="purchases_data.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(excelBuffer);

    } catch (error) {
        handleError(res, error);
    }
}


   static async PurchaseDataByDateRangeExcel(req,res){
    const {startDate,endDate}= req.query;
    console.log(startDate,endDate)

    if(!startDate ||  !endDate){
     return res.status(400).json({error:'Se requieren start'})  
      }

    //Formateamos la fecha
   const formattedStartDate = new Date(startDate)
   const formattedEndDate= new Date(endDate);

     if(isNaN(formattedStartDate) || isNaN(formattedEndDate)){
    return res.status(400).json({error:'Fechas invalidas'})
     }

    try {
        const purchases = await PurchaseModel.getPurchasesByDateRange(formattedStartDate,formattedEndDate);
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


   static async  PurchaseDataByDateRangeUserExcel(req,res){
    const {id} = req.params;
    const {dateFrom, dateTo} = req.query;
//console.log(id,dateFrom,dateTo)
    if(!dateFrom || !dateTo){
        return res.status(400).json({ error: 'Missing date range' });
    }

    const formattedDateFrom = new Date(dateFrom);
    const formattedDateTo = new Date(dateTo);
    
    if(isNaN(formattedDateFrom) || isNaN(formattedDateTo)){
        return res.status(400).json({ error: 'Invalid date range' });
    }

    try {
        const purchases = await PurchaseModel.getPurchasesByUserDate(id, formattedDateFrom, formattedDateTo);
console.log(purchases)
if (!purchases || purchases.length === 0) {
    throw new Error('No purchases found');
}

// Extract unique user data
const { fullname, email, personal_ID } = purchases[0]; // Assume all rows have the same user data
const groupedPurchases = {};

// Group purchases by purchase_id
purchases.forEach(row => {
    if (!groupedPurchases[row.purchase_id]) {
        groupedPurchases[row.purchase_id] = {
            purchase_id: row.purchase_id,
            date: row.date,
            products: [] // Initialize product array
        };
    }

    // Add product details
    groupedPurchases[row.purchase_id].products.push({
        product_id: row.product_id,
        name: row.name,
        amount: row.amount,
        price: row.price
    });
});

// Convert grouped data to a flat array for Excel
const finalPurchases = Object.values(groupedPurchases).map(purchase => ({
    purchase_id: purchase.purchase_id,
    date: purchase.date,
    products: purchase.products
        .map(product => `ID: ${product.product_id}, Name: ${product.name}, Quantity: ${product.amount}, Price: ${product.price}`)
        .join('; ')
}));

// Prepare the Excel data
const excelData = [
    // Add user info as the first row
    { Field: 'Full Name', Value: fullname },
    { Field: 'Email', Value: email },
    { Field: 'Personal ID', Value: personal_ID },
    {}, // Add an empty row as a spacer
    ...finalPurchases // Add grouped purchase data
];

// Create a new workbook
const wb = XLSX.utils.book_new();

// Create worksheet for purchases
const ws = XLSX.utils.json_to_sheet(excelData, {
    header: ['Field', 'Value', 'purchase_id', 'date', 'products']
});

// Adjust column widths
const columnWidths = [
    { wch: 15 }, // Field
    { wch: 30 }, // Value
    { wch: 15 }, // purchase_id
    { wch: 20 }, // date
    { wch: 50 }  // products
];

ws['!cols'] = columnWidths;

// Append worksheet to workbook
XLSX.utils.book_append_sheet(wb, ws, 'Purchases');

// Convert workbook to buffer
const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

// Set headers for download
res.setHeader('Content-Disposition', 'attachment; filename="purchases_data.xlsx"');
res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
res.send(excelBuffer);

        return excelBuffer;
        
    } catch (error) {
        handleError(res, error);
        
    }
}
static async PurchaseDataByUserPdf(req, res) {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ error: 'Missing user ID' });
    }
    try {
        const purchases = await PurchaseModel.getPurchasesByUserId(userId);

        if (!purchases || purchases.length === 0) {
            throw new Error('No purchases found');
        }

        // Group purchases
        const groupedPurchases = {};
        let userDetails = null; // Store user details separately
        purchases.forEach(row => {
            if (!userDetails) {
                // Extract user details from the first row
                userDetails = {
                    fullname: row.fullname,
                    username: row.username,
                    personal_ID: row.personal_ID,
                    email: row.email,
                };
            }

            if (!groupedPurchases[row.purchase_id]) {
                groupedPurchases[row.purchase_id] = {
                    purchase_id: row.purchase_id,
                    date: row.date,
                    total: row.amount,
                    products: [],
                };
            }
            groupedPurchases[row.purchase_id].products.push({
                Product_Id: row.product_id,
                name: row.name,
                quantity: row.quantity,
                price: row.price,
            });
        });

        const finalPurchases = Object.values(groupedPurchases);

        const doc = new PDFDocument();
        const stream = Readable.from(doc);

        res.setHeader('Content-Disposition', 'attachment; filename="compras_data.pdf"');
        res.setHeader('Content-Type', 'application/pdf');

        // Render user information once at the top of the document
        doc.fontSize(18).text('Purchase Data', { align: 'center' });
        doc.moveDown(2);

        doc.fontSize(12).fillColor('black')
            .text(`Fullname: ${userDetails.fullname}`, 50)
            .text(`Username: ${userDetails.username}`, 50, doc.y + 15)
            .text(`Personal ID: ${userDetails.personal_ID}`, 50, doc.y + 15)
            .text(`Email: ${userDetails.email}`, 50, doc.y + 15);

        doc.moveDown(2); // Add some space before listing purchases

        // Render purchases and products
        let y = doc.y;

        finalPurchases.forEach(purchase => {
            // Render purchase details
            doc.fontSize(12).fillColor('black')
                .text(`Purchase ID: ${purchase.purchase_id}`, 50, y)
                .text(`Date: ${new Date(purchase.date).toLocaleDateString()}`, 50, y + 15)
                .text(`Total: ${purchase.total}`, 50, y + 30);

            y += 50;

            // Render product details for this purchase
            doc.fontSize(10).text('Products:', 50, y);
            y += 20;

            purchase.products.forEach(product => {
                doc.fontSize(10).fillColor('black')
                    .text(`- Product ID: ${product.Product_Id}`, 70, y)
                    .text(`Name: ${product.name}`, 200, y)
                    .text(`Quantity: ${product.quantity}`, 350, y)
                    .text(`Price: ${product.price}`, 450, y);
                y += 20;

                // Add spacing if too close to the bottom of the page
                if (y > 700) {
                    doc.addPage();
                    y = 50;
                }
            });

            y += 30; // Space between purchases
        });

        doc.end();
        stream.pipe(res);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


static async PurchaseDataPdf(req, res) {
    try {

        const purchases = await PurchaseModel.getPurchases();
console.log(purchases)
        if (!purchases || purchases.length === 0) {
            throw new Error('No purchases found');
        }

        // Agrupar las compras
        const groupedPurchases = {};
        purchases.forEach(row => {
            if (!groupedPurchases[row.purchase_id]) {
                groupedPurchases[row.purchase_id] = {
                    Purchase_ID: row.purchase_id,
                    date: row.date,
                    total: row.amount,
                    fullname: row.fullname,
                    email: row.email,
                    personal_ID: row.personal_ID,
                   
                    products: []
                };
            }
            groupedPurchases[row.purchase_id].products.push({
                product_id: row.product_id,
                name: row.name,
                Quantity: row.amount,
                Price: row.price
            });
        });

        const finalPurchases = Object.values(groupedPurchases);

        console.log(finalPurchases);

        const doc = new PDFDocument();
        const stream = Readable.from(doc);

        res.setHeader('Content-Disposition', 'attachment; filename="compras_data.pdf"');
        res.setHeader('Content-Type', 'application/pdf');

        doc.fontSize(18).text('Datos de Compras', { align: 'center' });
        doc.moveDown(2);

        const tableTop = doc.y;
        const itemHeight = 20;
        const tableWidth = 500;

        // Cabeceras de la tabla
        doc.fontSize(12).fillColor('black').text('Purchase ID', 50, tableTop);
        doc.text('Fullname', 150, tableTop);
        doc.text('Personal ID', 300, tableTop);
      //  doc.text('Email', 300, tableTop);
        doc.text('Total', 400, tableTop);
        doc.text('Date', 500, tableTop);
        
        // Línea horizontal
        doc.moveTo(50, tableTop + itemHeight).lineTo(550, tableTop + itemHeight).stroke();

        let y = tableTop + itemHeight;

        finalPurchases.forEach(purchase => {
            doc.fontSize(10).fillColor('black')
                .text(purchase.Purchase_ID, 50, y)
                .text(purchase.fullname, 150, y)
                .text(purchase.personal_ID, 300, y)
//                .text(purchase.email, 300, y)
                .text(purchase.total, 400, y)// Formatear total
                .text(purchase.date, 500, y); 

            y += itemHeight;

            // Línea horizontal después de cada fila
            doc.moveTo(50, y).lineTo(550, y).stroke();
            y += itemHeight;

            // Productos de cada compra
            purchase.products.forEach(product => {
                doc.text(`ID: ${product.product_id}, Name: ${product.name}, Quantity: ${product.Quantity}, Price: ${product.Price}`, 50, y);
                y += itemHeight;
            });

            // Espaciado entre compras
            y += itemHeight;

             // Línea final
        doc.moveTo(50, y).lineTo(550, y).stroke();
        });

        // Línea final
        doc.moveTo(50, y).lineTo(550, y).stroke();

        doc.end();
        stream.pipe(res);

    }catch(error){
    handleError(res,error)
    }
}
}

export default exportData