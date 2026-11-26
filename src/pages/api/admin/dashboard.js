
import connectDB from "../../../lib/mongodb";
import verifyAdmin from "../../../lib/adminAuth";
import mongoose from "mongoose";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);

    return res.status(405).json({
      message: "Method not allowed.",
    });
  }

  try {
    const admin = await verifyAdmin(req);

    if (!admin) {
      return res.status(401).json({
        message: "Unauthorized. Please login.",
      });
    }

    await connectDB();

    const db = mongoose.connection.db;

    const rooms = db.collection("rooms");
    const customers = db.collection("users");
    const bookings = db.collection("bookings");
    const payments = db.collection("payments");

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const [
      totalRooms,
      totalCustomers,
      totalBookings,
      availableRooms,
      confirmedBookings,
      totalRevenueResult,
      monthlyRevenueResult,
      recentBookings,
      recentPayments,
    ] = await Promise.all([
      rooms.countDocuments(),

      customers.countDocuments(),

      bookings.countDocuments(),

      rooms.countDocuments({
        isActive: true,
        availableBeds: { $gt: 0 },
      }),

      bookings.countDocuments({
        status: "Confirmed",
      }),

      payments.aggregate([
        {
          $match: {
            status: {
              $in: ["Success", "Paid", "Completed"],
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]).toArray(),

      payments.aggregate([
        {
          $match: {
            status: {
              $in: ["Success", "Paid", "Completed"],
            },
            createdAt: { $gte: monthStart },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]).toArray(),

      bookings.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray(),

      payments.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray(),
    ]);

    const totalRevenue =
      totalRevenueResult[0]?.total || 0;

    const monthlyRevenue =
      monthlyRevenueResult[0]?.total || 0;

    return res.status(200).json({
      success: true,

      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },

      statistics: {
        totalRooms,
        availableRooms,
        totalCustomers,
        totalBookings,
        confirmedBookings,
        totalRevenue,
        monthlyRevenue,
      },

      recentBookings,
      recentPayments,
    });

  } catch (error) {
    console.error("Dashboard API error:", error);

    return res.status(500).json({
      message: "Unable to load dashboard.",
    });
  }
}
