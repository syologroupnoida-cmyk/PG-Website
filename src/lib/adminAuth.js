
import jwt from "jsonwebtoken";
import connectDB from "./mongodb";
import Admin from "../models/Admin";

export default async function verifyAdmin(req) {
  try {
    const token = req.cookies?.aa_admin_token;

    if (!token || !process.env.JWT_SECRET) {
      return null;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (decoded.role !== "admin" || !decoded.id) {
      return null;
    }

    await connectDB();

    const admin = await Admin.findById(decoded.id)
      .select("_id name email role");

    return admin?.role === "admin" ? admin : null;

  } catch (error) {
    return null;
  }
}
