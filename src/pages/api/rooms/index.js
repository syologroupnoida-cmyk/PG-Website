import connectDB from "../../../lib/mongodb";
import Room from "../../../models/Room";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    await connectDB();
    const rooms = await Room.find({ isActive: true }).sort({ createdAt: -1 });
    return res.status(200).json({ rooms });
  } catch (error) {
    console.error("Public rooms API error:", error);
    return res.status(500).json({ message: "Unable to load rooms." });
  }
}