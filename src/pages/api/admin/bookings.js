import mongoose from "mongoose";
import connectDB from "../../../lib/mongodb";
import verifyAdmin from "../../../lib/adminAuth";
import Booking from "../../../models/Booking";

export default async function handler(req, res) {
  const admin = await verifyAdmin(req);
  if (!admin) return res.status(401).json({ message: "Unauthorized." });

  try {
    await connectDB();

    if (req.method === "GET") {
      const bookings = await Booking.find()
        .populate("customer", "firstName lastName email phone")
        .populate("room", "roomNumber sharingType")
        .sort({ createdAt: -1 });
      return res.status(200).json({ bookings });
    }

    if (req.method === "PATCH") {
      const { id, status, paymentStatus } = req.body;
      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid booking id." });
      }
      const updates = {};
      if (status) updates.status = status;
      if (paymentStatus) updates.paymentStatus = paymentStatus;
      const booking = await Booking.findByIdAndUpdate(id, updates, { new: true, runValidators: true })
        .populate("customer", "firstName lastName email phone")
        .populate("room", "roomNumber sharingType");
      if (!booking) return res.status(404).json({ message: "Booking not found." });
      return res.status(200).json({ booking });
    }

    res.setHeader("Allow", ["GET", "PATCH"]);
    return res.status(405).json({ message: "Method not allowed." });
  } catch (error) {
    console.error("Admin bookings API error:", error);
    return res.status(400).json({ message: error.message || "Unable to process booking." });
  }
}