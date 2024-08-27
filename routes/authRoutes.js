const express = require("express");
const router = express.Router();

const { signup, login,getAllUsers,updateUserRole,} = require("../controllers/authController");
const {authenticate,verifyClientToken,} = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");
const { clientSignup,clientLogin,getClientDetail, getClientCount,} = require("../controllers/clientController");
const { getSaleCount, getOrderCount, placeOrder, getSalesRecord, getSaleDetailOfSpecificOrder, updateSaleDetails, getMonthlySalesRecord, getMonthlyWeeklySalesRecord, getWeeklySalesRecord, getTopServices } = require("../controllers/saleController");
const { CheckIn, CheckOut, getAttendanceRecord } = require("../controllers/attendanceController");


router.post("/signup", signup);
router.post("/login", login);
router.get("/getAllUsers",authenticate,authorizeRoles(["Admin", "SuperAdmin"]),getAllUsers);
router.put("/updateUserRole", authenticate,authorizeRoles(["Admin", "SuperAdmin"]),updateUserRole);

router.post("/clientSignup", clientSignup);
router.post("/clientLogin", clientLogin);
router.get("/getClientDetail", verifyClientToken, getClientDetail);
router.get('/getClientsCount',authenticate,authorizeRoles(["Admin", "SuperAdmin"]),getClientCount);

router.get('/getSalesCount',authenticate,authorizeRoles(["Admin", "SuperAdmin"]),getSaleCount)
router.get('/getOrdersCount',authenticate,authorizeRoles(["Admin", "SuperAdmin"]),getOrderCount)

router.post("/attendance/check-in",authenticate,authorizeRoles(["SalesAgent"]),CheckIn);
router.post("/attendance/check-out",authenticate,authorizeRoles(["SalesAgent"]),CheckOut);
router.get("/attendance",authenticate,authorizeRoles(["SuperAdmin", "Admin"]),getAttendanceRecord);

router.post("/sale", verifyClientToken,placeOrder);
router.get( "/sales-details",authenticate,authorizeRoles(["Admin", "SuperAdmin"]),getSalesRecord);
router.get("/sales-details/:saleID",authenticate,authorizeRoles(["Admin", "SuperAdmin"]),getSaleDetailOfSpecificOrder);
router.put("/updateSaleDetails",authenticate,authorizeRoles(["Admin", "SuperAdmin"]),updateSaleDetails)
router.get('/getMonthlySalesRecord',authenticate,authorizeRoles(["Admin", "SuperAdmin"]),getMonthlySalesRecord)
router.get('/getMonthlyWeeklySales', authenticate, authorizeRoles(["Admin", "SuperAdmin"]), getMonthlyWeeklySalesRecord);
router.get('/getWeeklySalesRecord',  authenticate, authorizeRoles(["Admin", "SuperAdmin"]), getWeeklySalesRecord);
router.get('/getTopServices',  authenticate, authorizeRoles(["Admin", "SuperAdmin"]), getTopServices);

module.exports = router;
