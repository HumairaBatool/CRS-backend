const db = require("../models");
const jwt = require("jsonwebtoken");
const { secretKey } = require("../config/config");
const services = require("../models/services");

const getOrderCount = async (req, res) => {
  try {
    const ordersCount = await db.Order.count();
    res.json(ordersCount);
  } catch {
    console.log("Error in fetching order count");
    res.status(500).json({ message: "Error in fetching order count" });
  }
};
const getSaleCount = async (req, res) => {
  try {
    const ordersCount = await db.Order.count();
    res.json(ordersCount);
  } catch {
    console.log("Error in fetching order count");
    res.status(500).json({ message: "Error in fetching order count" });
  }
};

const placeOrder = async (req, res) => {
  const formData = req.body;
  const currentClient = req.clientId; // The user who is placing order
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
};
const getSalesRecord = async (req, res) => {
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
};

const getTopServices = async (req, res) => {
  try {
    const query = `
      SELECT 
        s.id, 
        s.serviceName, 
        COUNT(cod.serviceId) AS order_count
      FROM 
        completeOrderDetails cod
      JOIN  
        Services s 
      ON 
        cod.serviceId = s.id
      GROUP BY 
        s.id, s.serviceName
      ORDER BY 
        order_count DESC
      LIMIT 2;  -- Correct for MySQL
    `;

    const [Services] = await db.sequelize.query(query);
    // console.log('Top services: ', Services);
    res.json(Services);
  } catch (error) {
    console.error("Error fetching Top services:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const getSaleDetailOfSpecificOrder = async (req, res) => {
  try {
    const { saleID } = req.params;
    const sale = await db.CompleteOrderDetail.findOne({
      where: {
        id: saleID,
      },
    });
    if (!sale) {
      res.status(501).json({ error: "Invalid Order ID" });
    }
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
};

const updateSaleDetails = async (req, res) => {
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
};

const getMonthlySalesRecord = async (req, res) => {
  try {
    const query = `
          SELECT 
            DATE_FORMAT(cod.createdAt, '%Y-%m') AS month,
            COUNT(*) AS salesCount
          FROM completeOrderDetails cod
          WHERE cod.createdAt >= DATE_FORMAT(CURDATE(), '%Y-01-01') -- From January of the current year
          GROUP BY month
          ORDER BY month ASC;
        `;

    const [salesData] = await db.sequelize.query(query);
    console.log("Monthly sales : ", salesData);
    res.json(salesData);
  } catch (error) {
    console.error("Error fetching monthly sales data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getMonthlyWeeklySalesRecord = async (req, res) => {
  try {
    // Get current date and calculate the start and end of the current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1); // First day of the current month
    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(startOfMonth.getMonth() + 1);
    endOfMonth.setDate(0); // Last day of the current month

    // Calculate the start and end of each week within the month
    const weeks = [];
    let currentWeekStart = new Date(startOfMonth);
    while (currentWeekStart < endOfMonth) {
      const weekEnd = new Date(currentWeekStart);
      weekEnd.setDate(currentWeekStart.getDate() + 6);
      weeks.push({
        start: currentWeekStart.toISOString().split("T")[0],
        end:
          weekEnd > endOfMonth
            ? endOfMonth.toISOString().split("T")[0]
            : weekEnd.toISOString().split("T")[0],
      });
      currentWeekStart = new Date(weekEnd);
      currentWeekStart.setDate(currentWeekStart.getDate() + 1);
    }

    const salesCounts = await Promise.all(
      weeks.map(async (week) => {
        const query = `
          SELECT 
            COUNT(*) AS salesCount
          FROM completeOrderDetails cod
          LEFT JOIN Orders o ON o.id = cod.orderId
          WHERE o.createdAt BETWEEN :startDate AND :endDate
        `;
        const [result] = await db.sequelize.query(query, {
          replacements: { startDate: week.start, endDate: week.end },
        });
        return {
          week: `Week of ${new Date(week.start).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })} - ${new Date(week.end).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}`,
          salesCount: result[0].salesCount,
        };
      })
    );

    res.json(salesCounts);
  } catch (error) {
    console.error("Error fetching monthly weekly sales data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getWeeklySalesRecord = async (req, res) => {
  try {
    const query = `
        SELECT
          WEEKDAY(o.createdAt) AS dayOfWeek, 
          COUNT(*) AS salesCount
        FROM Orders o
        WHERE YEAR(o.createdAt) = YEAR(CURDATE()) 
          AND MONTH(o.createdAt) = MONTH(CURDATE())
        GROUP BY WEEKDAY(o.createdAt)
        ORDER BY WEEKDAY(o.createdAt);
      `;

    const [weeklySales] = await db.sequelize.query(query);

    // Convert weekday index to day name
    const weeklySalesWithDayNames = weeklySales.map((sale) => ({
      ...sale,
      dayOfWeek: (sale.dayOfWeek + 1) % 7,
    }));
    res.json(weeklySalesWithDayNames);
  } catch (error) {
    console.error("Error fetching weekly sales data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// router.post("/sale", verifyClientToken,
//     async (req, res) => {
//     const formData = req.body;
//     const currentClient = req.clientId; // The user who is placing order
//     //console.log('currentClient:requser =',currentClient)
//     console.log("sale-formData", formData);
//     try {
//       console.log("Creating an Order associated with the client");
//       // Create an Order associated with the client
//       const order = await db.Order.create({
//         clientId: currentClient,

//         Upgrade: formData.wantToUpgradeBoxes,
//         serviceProvider: formData.serviceProvider,
//         duration: formData.duration,

//         securityPin: formData.securityPin,
//         accountNum: formData.accNum,
//         SSN: formData.ssn,
//         dob: formData.dateOfBirth,

//         cardProvider: formData.cardProvider,
//         nameOnCard: formData.nameOnCard,
//         type: formData.cardType,
//         cardNum: formData.cardNum,
//         expiry: formData.cardExp,
//         CVV: formData.cvv,
//         comment: formData.comments,
//       });

//       console.log("Creating an Order associated with the services");
//       // Fetch services from the database
//       const currentServices = await db.Service.findAll({
//         attributes: ["serviceName"],
//       });

//       const serviceNames = currentServices.map(
//         (service) => service.dataValues.serviceName
//       );
//       const mapservices = formData.activeServices.map((selected, index) =>
//         selected ? serviceNames[index] : null
//       );
//       const selectedServices = mapservices.filter((service) => service !== null);

//       for (const service of selectedServices) {
//         const serviceRecord = await db.Service.findOne({
//           where: { serviceName: service },
//         });

//         if (!serviceRecord) {
//           return res.status(400).send({ error: `Invalid service: ${service}` });
//         }

//         await db.CompleteOrderDetail.create({
//           orderId: order.id,
//           serviceId: serviceRecord.dataValues.id,
//         });
//       }
//       const ord = {
//         clientId: order.clientId,
//         id: order.id,
//         Upgrade: order.Upgrade,
//         serviceProvider: order.serviceProvider,
//         duration: order.duration,
//         services: selectedServices,

//         securityPin: order.securityPin,
//         accountNum: order.accountNum,
//         SSN: order.SSN,
//         dob: order.dob,

//         cardProvider: order.cardProvider,
//         nameOnCard: order.nameOnCard,
//         type: order.type,
//         cardNum: order.cardNum,
//         expiry: order.expiry,
//         CVV: order.CVV,
//         comment: order.comment,
//       };
//       res.status(200).json({
//         message: "Order placed successfully!",
//         order: ord,
//       });
//     } catch (error) {
//       console.error("Error in placing order", error.message);
//       res.status(500).json({ message: "An error occurred while placing order" });
//     }
//   }
// );

//   //admin and super admin can see only
//   router.get( "/sales-details",authenticate,authorizeRoles(["Admin", "SuperAdmin"]),
//     async (req, res) => {
//       try {
//         const query = `SELECT
//             cod.id ,
//             o.id AS orderId,
//             c.name AS clientName,
//             a.name AS agentName,
//             s.serviceName AS Service,

//             o.serviceProvider,
//             o.duration,
//             o.Upgrade AS Upgradation,
//             o.securityPin,
//             o.accountNum,   o.SSN,
//             o.cardProvider,
//             o.nameOnCard ,
//             o.type AS CardType,
//             o.cardNum,
//             o.dob as DOB,
//             o.expiry, o.
//             CVV

//         FROM  completeOrderDetails  cod

//         LEFT JOIN  Orders o ON o.id = cod.orderId
//         LEFT JOIN  Services s ON cod.serviceId = s.id
//         LEFT JOIN  Clients c ON o.clientId = c.id
//         LEFT JOIN  Agents a ON a.id = s.agentId

//         `;

//         const [orderDetails] = await db.sequelize.query(query);
//         res.json(orderDetails);
//       } catch (error) {
//         console.error("Error fetching order details:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//       }
//     }
//   );
//   // Backend route to fetch details of a specific order
//   router.get("/sales-details/:saleID",authenticate,authorizeRoles(["Admin", "SuperAdmin"]),
//     async (req, res) => {
//       try {
//         const { saleID } = req.params;
//         const sale=await db.CompleteOrderDetail.findOne({
//           where:{
//             id:saleID
//           }
//         })
//         if(!sale){
//           res.status(501).json({error:"Invalid Order ID"})
//         }
//         console.log(`Fetching details for order ID: ${saleID}`);
//         const query = `
//         SELECT
//           cod.id,
//           o.id AS orderId,
//           c.name AS clientName,
//           c.email AS clientEmail,
//           c.address AS clientAddress,
//           c.num1 AS clientPrimaryPhone,
//           c.num2 AS clientAlternatePhone,
//           c.relation AS clientRelation,
//           c.closerName AS clientCloserName,
//           a.name AS agentName,

//           s.serviceName AS Service,
//           o.Upgrade,
//           o.serviceProvider,
//           o.duration,
//           o.comment,
//           o.securityPin,
//           o.accountNum,
//           o.SSN,

//           o.cardProvider,
//           o.nameOnCard ,
//           o. type AS CardType,
//           o.cardNum,
//           o.dob as DOB,
//           o.expiry,
//           o. CVV

//         FROM  completeOrderDetails  cod

//         LEFT JOIN  Orders o ON o.id = cod.orderId
//         LEFT JOIN  Services s ON cod.serviceId = s.id
//         LEFT JOIN  Clients c ON o.clientId = c.id
//         LEFT JOIN  Agents a ON o.id = s.agentId

//         WHERE cod.id = :saleID
//       `;

//         const [orderDetails] = await db.sequelize.query(query, {
//           replacements: { saleID },
//         });
//         res.json(orderDetails);
//       } catch (error) {
//         console.error("Error fetching order details:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//       }
//     }
//   );
//   router.put("/updateSaleDetails",authenticate,authorizeRoles(["Admin", "SuperAdmin"]),
//     async (req, res) => {
//       const {
//         id,
//         Service,
//         orderId,
//         Upgrade,
//         serviceProvider,
//         duration,
//         cardProvider,
//         nameOnCard,
//         CardType,
//         cardNum,
//         expiry,
//         DOB,
//         CVV,
//         securityPin,
//         accountNum,
//         SSN,
//         clientName,
//         clientAddress,
//         clientPrimaryPhone,
//         clientAlternatePhone,
//         clientRelation,
//         clientCloserName,
//         clientEmail,
//       } = req.body;

//       try {
//         // Convert DOB to 'YYYY-MM-DD' format
//         const formattedDOB = new Date(DOB).toISOString().split("T")[0];

//         console.log("updating order");
//         await db.Order.update(
//           {
//             id,
//             Upgrade,
//             serviceProvider,
//             duration,
//             cardProvider,
//             nameOnCard,
//             type: CardType,
//             cardNum,
//             expiry,
//             dob: formattedDOB, // Update with formatted DOB
//             CVV,
//             securityPin,
//             accountNum,
//             SSN,
//           },
//           { where: { id: orderId } }
//         );

//         console.log("updating client");
//         await db.Client.update(
//           {
//             name: clientName,
//             address: clientAddress,
//             num1: clientPrimaryPhone,
//             num2: clientAlternatePhone,
//             relation: clientRelation,
//             closerName: clientCloserName,
//           },
//           { where: { email: clientEmail } }
//         );

//         console.log("finding service");
//         const service = await db.Service.findOne({
//           where: { serviceName: Service },
//         });

//         console.log("updating CompleteOrderDetail");
//         await db.CompleteOrderDetail.update(
//           {
//             serviceId: service.id,
//           },
//           { where: { id: id } }
//         );

//         res.json({ message: "Details updated successfully!" });
//       } catch (error) {
//         console.error("Error updating order details:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//       }
//     }
//   );

module.exports = {
  getOrderCount,
  getSaleCount,
  placeOrder,
  getSalesRecord,
  getSaleDetailOfSpecificOrder,
  updateSaleDetails,
  getMonthlySalesRecord,
  getMonthlyWeeklySalesRecord,
  getWeeklySalesRecord,
  getTopServices,
};
