
import connectDB from "../../../lib/mongodb";
import Admin from "../../../models/Admin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({
      message: "Method not allowed",
    });
  }

  try {
    await connectDB();

    const { email, password } = req.body || {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured.");
    }

    const admin = await Admin.findOne({
      email: email.trim().toLowerCase(),
      role: "admin",
    }).select("+password");

    if (!admin) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id.toString(),
        role: admin.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.setHeader("Set-Cookie", [
      `aa_admin_token=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=86400${process.env.NODE_ENV === "production" ? "; Secure" : ""}`,
    ]);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });

  } catch (error) {
    console.error("Admin login error:", error);

    return res.status(500).json({
      message: "Unable to login. Please try again.",
    });
  }
}
