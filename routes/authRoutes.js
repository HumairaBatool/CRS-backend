const express = require("express");
const moment = require("moment"); // Import moment

const {
  signup,
  login,
  getAllUsers,
  updateUserRole,
} = require("../controllers/authController");
const {
  authenticate,
  verifyClientToken,
} = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");
const db = require("../models");
const {
  clientSignup,
  clientLogin,
  getClientDetail,
} = require("../controllers/clientController");
const router = express.Router();

// Add console logging to debug the route hit
router.post("/signup", signup);
router.post("/login", login);
router.get(
  "/getAllUsers",
  authenticate,
  authorizeRoles(["Admin", "SuperAdmin"]),
  getAllUsers
);
router.put(
  "/updateUserRole",
  authenticate,
  authorizeRoles(["Admin", "SuperAdmin"]),
  updateUserRole
);
router.post("/clientSignup", clientSignup);
router.post("/clientLogin", clientLogin);
router.get("/getClientDetail", verifyClientToken, getClientDetail);

router.get("/permissions", authenticate, (req, res) => {
  const permissions = req.user.permissions;
  res.send({ permissions });
});

router.post("/sale", verifyClientToken, async (req, res) => {
  const formData = req.body;
  const currentClient = req.clientId; // The user making the request
  //console.log('currentClient:requser =',currentClient)
  console.log("sale-formData", formData);
  try {
    console.log("Creating an Order associated with the client");
    // Create an Order associated with the client
    const order = await db.Order.create({
      clientId: currentClient,

      Upgrade: formData.wantToUpgradeBoxes,
      serviceProvider: formData.serviceProvider,
      duration: formData.duration,

      securityPin: formData.securityPin,
      accountNum: formData.accNum,
      SSN: formData.ssn,
      dob: formData.dateOfBirth,

      cardProvider: formData.cardProvider,
      nameOnCard: formData.nameOnCard,
      type: formData.cardType,
      cardNum: formData.cardNum,
      expiry: formData.cardExp,
      CVV: formData.cvv,
      comment: formData.comments,
    });

    console.log("Creating an Order associated with the services");
    // Fetch services from the database
    const currentServices = await db.Service.findAll({
      attributes: ["serviceName"],
    });

    const serviceNames = currentServices.map(
      (service) => service.dataValues.serviceName
    );
    const mapservices = formData.activeServices.map((selected, index) =>
      selected ? serviceNames[index] : null
    );
    const selectedServices = mapservices.filter((service) => service !== null);

    for (const service of selectedServices) {
      const serviceRecord = await db.Service.findOne({
        where: { serviceName: service },
      });

      if (!serviceRecord) {
        return res.status(400).send({ error: `Invalid service: ${service}` });
      }

      await db.CompleteOrderDetail.create({
        orderId: order.id,
        serviceId: serviceRecord.dataValues.id,
      });
    }
    const ord = {
      clientId: order.clientId,
      id: order.id,
      Upgrade: order.Upgrade,
      serviceProvider: order.serviceProvider,
      duration: order.duration,
      services: selectedServices,

      securityPin: order.securityPin,
      accountNum: order.accountNum,
      SSN: order.SSN,
      dob: order.dob,

      cardProvider: order.cardProvider,
      nameOnCard: order.nameOnCard,
      type: order.type,
      cardNum: order.cardNum,
      expiry: order.expiry,
      CVV: order.CVV,
      comment: order.comment,
    };
    res.status(200).json({
      message: "Order placed successfully!",
      order: ord,
    });
  } catch (error) {
    console.error("Error in placing order", error.message);
    res.status(500).json({ message: "An error occurred while placing order" });
  }
});

//admin and super admin can see only
router.get(
  "/sales-details",
  authenticate,
  authorizeRoles(["Admin", "SuperAdmin"]),
  async (req, res) => {
    try {
      const query = `SELECT 
          cod.id ,
          o.id AS orderId,
          c.name AS clientName,
          a.name AS agentName,
          s.serviceName AS Service,

          o.serviceProvider, 
          o.duration, 
          o.Upgrade AS Upgradation, 
          o.securityPin,  
          o.accountNum,   o.SSN,
          o.cardProvider, 
          o.nameOnCard , 
          o.type AS CardType, 
          o.cardNum, 
          o.dob as DOB,
          o.expiry, o.
          CVV

      FROM  completeOrderDetails  cod

      LEFT JOIN  Orders o ON o.id = cod.orderId
      LEFT JOIN  Services s ON cod.serviceId = s.id
      LEFT JOIN  Clients c ON o.clientId = c.id
      LEFT JOIN  Agents a ON a.id = s.agentId

      `;

      const [orderDetails] = await db.sequelize.query(query);
      res.json(orderDetails);
    } catch (error) {
      console.error("Error fetching order details:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);
// Backend route to fetch details of a specific order
router.get(
  "/sales-details/:saleID",
  authenticate,
  authorizeRoles(["Admin", "SuperAdmin"]),
  async (req, res) => {
    try {
      const { saleID } = req.params;
      console.log(`Fetching details for order ID: ${saleID}`);
      const query = `
      SELECT 
        cod.id,
        o.id AS orderId,
        c.name AS clientName,
        c.email AS clientEmail,
        c.address AS clientAddress,
        c.num1 AS clientPrimaryPhone,
        c.num2 AS clientAlternatePhone,
        c.relation AS clientRelation,
        c.closerName AS clientCloserName,
        a.name AS agentName,

        s.serviceName AS Service,
        o.Upgrade,
        o.serviceProvider,
        o.duration,
        o.comment,
        o.securityPin, 
        o.accountNum,   
        o.SSN,

        o.cardProvider,
        o.nameOnCard ,
        o. type AS CardType, 
        o.cardNum, 
        o.dob as DOB, 
        o.expiry, 
        o. CVV

      FROM  completeOrderDetails  cod

      LEFT JOIN  Orders o ON o.id = cod.orderId
      LEFT JOIN  Services s ON cod.serviceId = s.id
      LEFT JOIN  Clients c ON o.clientId = c.id
      LEFT JOIN  Agents a ON o.id = s.agentId

      WHERE cod.id = :saleID
    `;

      const [orderDetails] = await db.sequelize.query(query, {
        replacements: { saleID },
      });
      res.json(orderDetails);
    } catch (error) {
      console.error("Error fetching order details:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);
router.put(
  "/updateSaleDetails",
  authenticate,
  authorizeRoles(["Admin", "SuperAdmin"]),
  async (req, res) => {
    const {
      id,
      Service,
      orderId,
      Upgrade,
      serviceProvider,
      duration,
      cardProvider,
      nameOnCard,
      CardType,
      cardNum,
      expiry,
      DOB,
      CVV,
      securityPin,
      accountNum,
      SSN,
      clientName,
      clientAddress,
      clientPrimaryPhone,
      clientAlternatePhone,
      clientRelation,
      clientCloserName,
      clientEmail,
    } = req.body;

    try {
      // Convert DOB to 'YYYY-MM-DD' format
      const formattedDOB = new Date(DOB).toISOString().split("T")[0];

      console.log("updating order");
      await db.Order.update(
        {
          id,
          Upgrade,
          serviceProvider,
          duration,
          cardProvider,
          nameOnCard,
          type: CardType,
          cardNum,
          expiry,
          dob: formattedDOB, // Update with formatted DOB
          CVV,
          securityPin,
          accountNum,
          SSN,
        },
        { where: { id: orderId } }
      );

      console.log("updating client");
      await db.Client.update(
        {
          name: clientName,
          address: clientAddress,
          num1: clientPrimaryPhone,
          num2: clientAlternatePhone,
          relation: clientRelation,
          closerName: clientCloserName,
        },
        { where: { email: clientEmail } }
      );

      console.log("finding service");
      const service = await db.Service.findOne({
        where: { serviceName: Service },
      });

      console.log("updating CompleteOrderDetail");
      await db.CompleteOrderDetail.update(
        {
          serviceId: service.id,
        },
        { where: { id: id } }
      );

      res.json({ message: "Details updated successfully!" });
    } catch (error) {
      console.error("Error updating order details:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Route for check-in
router.post(
  "/attendance/check-in",
  authenticate,
  authorizeRoles(["SalesAgent"]),
  async (req, res) => {
    const { agentId } = req.body;
    console.log("agentId:", agentId);

    try {
      // Fetch the user with the given agentId
      const user = await db.User.findOne({
        where: {
          id: agentId,
        },
        include: {
          model: db.Role,
          where: {
            name: "SalesAgent",
          },
        },
      });
      console.log("user: ", user);
      // Check if the user exists and has the 'Agent' role
      if (!user) {
        return res
          .status(404)
          .json({ error: "User not found or not an agent" });
      }

      // Create an attendance record for the agent
      const checkIn = await db.Attendance.create({
        agentId,
        checkInTime: new Date(),
      });

      res.status(201).json(checkIn);
    } catch (error) {
      console.error("Error during check-in:", error);
      res.status(500).json({ error: "Failed to check in" });
    }
  }
);

// Route for check-out
router.post(
  "/attendance/check-out",
  authenticate,
  authorizeRoles(["SalesAgent"]),
  async (req, res) => {
    const { agentId } = req.body;
    try {
      const attendanceRecord = await db.Attendance.findOne({
        where: { agentId, checkOutTime: null },
      });
      if (!attendanceRecord) {
        return res.status(404).json({ error: "No check-in record found" });
      }
      attendanceRecord.checkOutTime = new Date();
      await attendanceRecord.save();
      res.status(200).json(attendanceRecord);
    } catch (error) {
      res.status(500).json({ error: "Failed to check out" });
    }
  }
);
// Route to get all attendance records - Only accessible to Super Admin
router.get(
  "/attendance",
  authenticate,
  authorizeRoles(["SuperAdmin", "Admin"]),
  async (req, res) => {
    try {
      // Fetch all attendance records
      const attendanceRecords = await db.Attendance.findAll({
        include: [{ model: db.User, attributes: ["username", "email"] }], // Include user details if needed
      });
      console.log("attendanceRecords", attendanceRecords);
      res.status(200).json(attendanceRecords);
    } catch (error) {
      console.error("Error fetching attendance records:", error);
      res.status(500).json({ error: "Failed to retrieve attendance records" });
    }
  }
);

module.exports = router;
