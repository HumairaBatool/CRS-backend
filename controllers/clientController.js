const db = require("../models");
const jwt = require("jsonwebtoken");
const { secretKey } = require("../config/config");


const clientLogin = async (req, res) => {
  const { email } = req.body;

  try {
    const client = await db.Client.findOne({ where: { email } });
    if (!client) {
      return res.status(400).json({ message: "Email not registered" });
    }
    const token = jwt.sign({ id: client.id, email: client.email }, secretKey, {
      expiresIn: '1h',
    })
    res.json({ token });
  } catch (error) {
    console.error("Error during login", error);
    res.status(402).json({ message: "Server error" });
  }
};

const clientSignup = async (req, res) => {
  const formData = req.body;
  const email = formData.accEmailAdd;
  try {
    const existingClient = await db.Client.findOne({ where: { email } });
    if (existingClient) {
      return res.status(400).json({ message: "Email already registered" });
    }

    console.log("Creating a new Client");
    // Create a new Client
    const client = await db.Client.create({
      name: formData.name,
      email: formData.accEmailAdd,
      address: formData.accAddress,
      num1: formData.accPhoneNum,
      num2: formData.altPhoneNum,
      relation: formData.onCallPerson,
      closerName: formData.nameOfCloser,
    });

    const token = jwt.sign({ id: client.id, email: client.email }, secretKey, {
      expiresIn: '1h',
    })
    res.json({
      message: "Signed Up successfully",
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        address: client.address,
        dob: client.dob,
        num1: client.num1,
        num2: client.num2,
        relation: client.relation,
        closerName: client.closerName,
      },
      token: token,
    });
  } catch (error) {
    console.error("Error creating Client:", error);
    res.status(402).json({ message: "Error in registering Client" });
  }
};

const getClientDetail = async (req, res) => {
  try {
    const client = await db.Client.findOne({
      where: { id: req.clientId }
    });

    if (!client) {
      return res.status(400).json({ message: 'Client not found' });
    }
    res.json({ client });
  } catch (error) {
    console.error('Error fetching client details:', error);
    res.status(402).json({ message: 'Error fetching client details' });
  }
};

module.exports = {
  clientSignup,
  clientLogin,
  getClientDetail,
};
