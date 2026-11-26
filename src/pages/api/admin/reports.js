import connectDB from "../../../lib/mongodb";
import verifyAdmin from "../../../lib/adminAuth";
import mongoose from "mongoose";

export default async function handler(req, res) {
  const admin = await verifyAdmin(req);
  if (!admin) return res.status(401).json({ message: "Unauthorized." });
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed." });

  try {
    await connectDB();
    const db = mongoose.connection.db;
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [payments, bookings, rooms, monthlyPayments] = await Promise.all([
      db.collection("payments").find({ status: { $in: ["Paid", "Completed", "Success"] } }).toArray(),
      db.collection("bookings").find().toArray(),
      db.collection("rooms").find().toArray(),
      db.collection("payments").find({
        status: { $in: ["Paid", "Completed", "Success"] },
        createdAt: { $gte: monthStart },
      }).toArray(),
    ]);

    const totalRevenue = payments.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const monthlyRevenue = monthlyPayments.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const occupiedBeds = rooms.reduce((sum, room) => sum + Math.max(0, Number(room.totalBeds || 0) - Number(room.availableBeds || 0)), 0);
    const totalBeds = rooms.reduce((sum, room) => sum + Number(room.totalBeds || 0), 0);

    return res.status(200).json({
      report: {
        totalRevenue,
        monthlyRevenue,
        totalBookings: bookings.length,
        confirmedBookings: bookings.filter((item) => item.status === "Confirmed").length,
        occupancyRate: totalBeds ? Math.round((occupiedBeds / totalBeds) * 100) : 0,
        totalRooms: rooms.length,
      },
    });
  } catch (error) {
    console.error("Admin reports API error:", error);
    return res.status(500).json({ message: "Unable to load reports." });
  }
}
