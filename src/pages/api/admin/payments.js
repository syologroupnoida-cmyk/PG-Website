import mongoose from "mongoose";
import connectDB from "../../../lib/mongodb";
import verifyAdmin from "../../../lib/adminAuth";
import Payment from "../../../models/Payment";

export default async function handler(req, res) {
  const admin = await verifyAdmin(req);
  if (!admin) return res.status(401).json({ message: "Unauthorized." });

  try {
    await connectDB();

    if (req.method === "GET") {
      const payments = await Payment.find()
        .populate("customer", "firstName lastName email")
        .populate("booking", "bookingId")
        .sort({ createdAt: -1 });
      return res.status(200).json({ payments });
    }

    if (req.method === "PATCH") {
      const { id, status } = req.body;
      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid payment id." });
      }
      const payment = await Payment.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
      if (!payment) return res.status(404).json({ message: "Payment not found." });
      return res.status(200).json({ payment });
    }

    res.setHeader("Allow", ["GET", "PATCH"]);
    return res.status(405).json({ message: "Method not allowed." });
  } catch (error) {
    console.error("Admin payments API error:", error);
    return res.status(400).json({ message: error.message || "Unable to process payment." });
  }
}