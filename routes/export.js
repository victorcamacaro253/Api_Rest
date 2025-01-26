import { Router } from "express";
import exportData from "../controllers/export.js";

const router = Router();


//Ruta para exportar todos los usuarios en excel

router.get('/Excel/users',exportData.UsersDataExcel)

//Ruta para exportar los usuario por nombre en excel

router.get('/Excel/users/name',exportData.UsersDataExcelUsername)

//Ruta para exportar los usuario por id en excel

router.get('/Excel/users/:id', exportData.UserDataExcel);

//Ruta para exportar todos los usuario en pdf


router.get('/PDF/users', exportData.UsersDataPdf)

//Ruta para exportar los usarios por id en pdf

router.get('/PDF/users/:id', exportData.UserDataPdf)

//Ruta para exportar todos los usarios en csv

router.get('/CSV/users',exportData.UsersDataCsv)

//Ruta para exportar los usarios por id en csv

router.get('/CSV/users/:id',exportData.UserDataCsv)

//Ruta para exportar todos los usarios en formato json

//router.get('/JSON/users',exportData.exportUserDataToJson)
router.get('/Excel/purchases/date',exportData.PurchaseDataByDateRangeExcel)

//Ruta para exportar las compras por nombre de usuario en excel

router.get('/Excel/purchases/:userId',exportData.PurchasesDataByUserExcel)

router.get('/Excel/purchases',exportData.PurchaseDataExcel)


//Ruta para exportar las compras por fecha en excel



//Ruta para exportar las compras por id de usuario en excel

router.get('/Excel/purchases/:userId',exportData.PurchasesDataByUserExcel);

//Ruta para exportar todsas las compras en excel


//Ruta para exportar las compras por fecha para el usuario en excel

router.get('/Excel/purchases/:id/dates',exportData.PurchaseDataByDateRangeUserExcel)


//Ruta para exportar las compras por nombre de usuario en Pdf

router.get('/PDF/purchases/user/:userId',exportData.PurchaseDataByUserPdf)

//Ruta para exportar todsas las compras en pdf

router.get('/PDF/purchases',exportData.PurchaseDataPdf)    
/*
//Ruta para exportar las compras por fecha en pdf

router.get('/PDF/purchases/date',exportData.exportComprasByDatePdf)

//Ruta para exportar las compras por fecha para el usuario en pdf

router.get('/PDF/compras/:id/userFecha',exportData.exportComprasUserDatePdf)

router.get('/PDF/products',exportData.exportProductsPdf)

router.get('/Excel/products',exportData.exportProducts)

*/
export default router