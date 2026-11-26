import connectDB from "../../../lib/mongodb";
import verifyAdmin from "../../../lib/adminAuth";
import mongoose from "mongoose";

export default async function handler(req, res) {
  const admin = await verifyAdmin(req);
  if (!admin) return res.status(401).json({ message: "Unauthorized." });

  try {
    await connectDB();
    const users = mongoose.connection.db.collection("users");

    if (req.method === "GET") {
      const { search = "" } = req.query;
      const query = search
        ? {
            $or: [
              { firstName: { $regex: search, $options: "i" } },
              { lastName: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
              { phone: { $regex: search, $options: "i" } },
            ],
          }
        : {};
      const customers = await users.find(query).sort({ createdAt: -1 }).toArray();
      return res.status(200).json({ customers });
    }

    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: "Method not allowed." });
  } catch (error) {
    console.error("Admin customers API error:", error);
    return res.status(500).json({ message: "Unable to load customers." });
  }
}