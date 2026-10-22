const Admin = require("../models/Admin");

async function requireAuth(req, res, next) {
  try {
    if (!req.session || !req.session.adminId) {
      return res.status(401).json({
        success: false,
        message: "Please log in.",
      });
    }

    // Recheck account status so a disabled admin loses access.
    const admin = await Admin.findOne({
      _id: req.session.adminId,
      role: "admin",
      isActive: true,
    }).select("_id");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin access denied.",
      });
    }

    req.adminId = admin._id.toString();

    next();
  } catch (error) {
    console.error("Authentication check failed:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify authentication.",
    });
  }
}

module.exports = requireAuth;