const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
  
    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required.",
      });
    }

    const admin = await Admin.findOne({
      username: username.trim(),
      role: "admin",
      isActive: true,
    }).select("+passwordHash");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      admin.passwordHash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    // Regenerate the session after successful authentication.
    req.session.regenerate((error) => {
      if (error) {
        console.error("Session regeneration failed:", error);

        return res.status(500).json({
          success: false,
          message: "Unable to create login session.",
        });
      }

      req.session.adminId = admin._id.toString();

      req.session.save((saveError) => {
        if (saveError) {
          console.error("Session save failed:", saveError);

          return res.status(500).json({
            success: false,
            message: "Unable to save login session.",
          });
        }

        return res.status(200).json({
          success: true,
          message: "Login successful.",
          admin: {
            _id: admin._id,
            username: admin.username,
            email: admin.email,
            role: admin.role,
            isActive: admin.isActive,
          },
        });
      });
    });
  } catch (error) {
    console.error("Login failed:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

// GET /api/auth/me
exports.getCurrentAdmin = async (req, res) => {
  try {
    const admin = await Admin.findOne({
      _id: req.session.adminId,
      role: "admin",
      isActive: true,
    }).select("_id username email role isActive");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    return res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    console.error("Get current admin failed:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve admin details.",
    });
  }
};

// POST /api/auth/logout
exports.logout = (req, res) => {
  console.log("Logout called");
  if (!req.session) {
    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  }

  req.session.destroy((error) => {
    if (error) {
      console.error("Logout failed:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to log out.",
      });
    }

    res.clearCookie("admin.sid", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  });
};