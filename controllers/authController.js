const Admin = require("../models/Admin");

exports.getAdminEmail = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username || !username.trim()) {
      return res.status(400).json({
        success: false,
        message: "Username is required"
      });
    }

    const admin = await Admin.findOne({
      username: username.trim(),
      isActive: true,
      role: "admin"
    }).select("email");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Unable to process login request"
      });
    }

    return res.status(200).json({
      success: true,
      email: admin.email
    });
  } catch (error) {
    console.error("Admin lookup failed:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};