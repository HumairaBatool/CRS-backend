const bcrypt = require("bcryptjs");
const db = require("../models");
const { getPermissionsByRoleId, generateToken } = require("../utils/jwtUtils");

db.sequelize
  .sync()
  .then(() => {
    console.log("Database synced");
  })
  .catch((err) => {
    console.log("Error syncing database: ", err);
  });

const signup = async (req, res) => {
  const { username, email, password, roleName } = req.body;
  if (!username || !email || !password || !roleName) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(402).json({ message: "Email already registered" });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const role = await db.Role.findOne({ where: { name: roleName } });
    if (!role) return res.status(403).json({ message: "Invalid role name" });
    const roleId = role.id;
    if (roleName === "SalesAgent") {
      await db.Agent.create({ name: username, email });
    }
    await db.User.create({ username, email, password: hashedPassword, roleId });
    const user = await db.User.findOne({
      where: { email },
      include: [db.Role],
    });

    const token = await generateToken(user);
    res.json({
      message: "Signed Up successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        roleId: user.roleId,
        roleName: user.Role.name,
        permissions: await getPermissionsByRoleId(user.roleId),
      },
      token: token,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(404).json({ message: "Error in registering user" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await db.User.findOne({ where: { email }, include: [db.Role] });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(400).json("Invalid Credentials");
  }
  const token = await generateToken(user);
  res.json({
    message: "Logged-in successfully",

    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      roleId: user.roleId,
      roleName: user.Role.name,
      permissions: await getPermissionsByRoleId(user.roleId),
    },
    token: token,
  });
};

const getAllUsers = async (req, res) => {
  try {
    const users = await db.User.findAll({
      attributes: ["id", "username", "email"],
      include: [
        {
          model: db.Role,
          attributes: ["name"],
        },
      ],
    });

    const userDetails = users.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      roleName: user.Role.name,
    }));

    res.json(userDetails);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(402).json({ message: "Error in fetching users" });
  }
};

const updateUserRole = async (req, res) => {
  const { userId, newRoleName } = req.body;
  const currentUser = req.user; // The user making the request
  console.log("req.user", req.user);
  try {
    // Check if the user is trying to update their own role
    if (userId === currentUser.id) {
      return res.status(400).json({ message: "Cannot change your own role" });
    }

    // Fetch the target user and role
    const user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(402).json({ message: "User not found" });
    }
    const targetUserCurrentRole = await db.Role.findOne({
      where: { id: user.roleId },
    });
    // Admins cannot update roles of other Admins or Super Admins
    if (
      currentUser.role == "Admin" &&
      (targetUserCurrentRole.name == "Admin" ||
        targetUserCurrentRole.name == "SuperAdmin")
    ) {
      return res
        .status(403)
        .json({
          message: "Admins cannot change roles of other Admins or Super Admins",
        });
    }

    const newRole = await db.Role.findOne({ where: { name: newRoleName } });
    if (!newRole) {
      return res.status(404).json({ message: "Invalid role" });
    }

    // Update the user's role
    user.roleId = newRole.id;
    await user.save();
    if (newRoleName == "SalesAgent" && targetUserCurrentRole != 'SalesAgent' ) {
      await db.Agent.create({ name: user.username, email: user.email });
    }
    else {
      await db.Agent.destroy({where:{email:user.email}})
    }
    res.json({ message: "User role updated successfully" });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(405).json({ message: "Error in updating user role" });
  }
};

module.exports = { updateUserRole };

module.exports = {
  signup,
  login,
  getAllUsers,
  updateUserRole,
};
