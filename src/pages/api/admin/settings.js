import connectDB from "../../../lib/mongodb";
import verifyAdmin from "../../../lib/adminAuth";
import mongoose from "mongoose";

export default async function handler(req, res) {
  const admin = await verifyAdmin(req);
  if (!admin) return res.status(401).json({ message: "Unauthorized." });

  try {
    await connectDB();
    const admins = mongoose.connection.db.collection("admins");

    if (req.method === "GET") {
      const account = await admins.findOne(
        { _id: admin._id },
        { projection: { name: 1, email: 1, settings: 1 } }
      );
      return res.status(200).json({
        settings: {
          propertyName: account?.settings?.propertyName || "Crossing PG",
          supportEmail: account?.settings?.supportEmail || account?.email || "",
          supportPhone: account?.settings?.supportPhone || "",
          currency: account?.settings?.currency || "INR",
          bookingApproval: account?.settings?.bookingApproval !== false,
          emailNotifications: account?.settings?.emailNotifications !== false,
        },
      });
    }

    if (req.method === "PUT") {
      await admins.updateOne(
        { _id: admin._id },
        { $set: { settings: req.body } }
      );
      return res.status(200).json({ success: true, settings: req.body });
    }

    res.setHeader("Allow", ["GET", "PUT"]);
    return res.status(405).json({ message: "Method not allowed." });
  } catch (error) {
    console.error("Admin settings API error:", error);
    return res.status(500).json({ message: "Unable to save settings." });
  }
}
