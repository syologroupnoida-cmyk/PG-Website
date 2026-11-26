import mongoose from "mongoose";
import connectDB from "../../../lib/mongodb";
import verifyAdmin from "../../../lib/adminAuth";
import Room from "../../../models/Room";

export default async function handler(req, res) {
  const admin = await verifyAdmin(req);
  if (!admin) return res.status(401).json({ message: "Unauthorized." });

  try {
    await connectDB();

    if (req.method === "GET") {
      const rooms = await Room.find().sort({ createdAt: -1 });
      return res.status(200).json({ rooms });
    }

    if (req.method === "POST") {
      const room = await Room.create(req.body);
      return res.status(201).json({ room });
    }

    if (req.method === "PUT") {
      const { id, ...updates } = req.body;
      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid room id." });
      }
      const room = await Room.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
      if (!room) return res.status(404).json({ message: "Room not found." });
      return res.status(200).json({ room });
    }

    if (req.method === "DELETE") {
      const { id } = req.query;
      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid room id." });
      }
      const room = await Room.findByIdAndDelete(id);
      if (!room) return res.status(404).json({ message: "Room not found." });
      return res.status(200).json({ success: true });
    }

    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    return res.status(405).json({ message: "Method not allowed." });
  } catch (error) {
    console.error("Admin rooms API error:", error);
    return res.status(400).json({ message: error.message || "Unable to process rooms." });
  }
}