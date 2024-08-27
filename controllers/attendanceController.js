const db = require("../models");

const CheckIn = async (req, res) => {
  const { agentId } = req.body;

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
    // Check if the user exists and has the 'Agent' role
    if (!user) {
      return res.status(404).json({ error: "User not found or not an agent" });
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
};

const CheckOut = async (req, res) => {
  const { agentId } = req.body;
  console.log("agentid: ", agentId);
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
};

const getAttendanceRecord = async (req, res) => {
  try {
    const attendanceRecords = await db.Attendance.findAll({
      include: [{ model: db.User, attributes: ["username", "email"] }], // Include user details if needed
    });
    res.status(200).json(attendanceRecords);
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    res.status(500).json({ error: "Failed to retrieve attendance records" });
  }
};

module.exports = {
  CheckIn,
  CheckOut,
  getAttendanceRecord,
};
