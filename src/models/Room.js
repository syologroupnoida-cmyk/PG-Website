import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
      unique: true,
    },
    sharingType: {
      type: String,
      enum: ["Single", "Double", "Triple"],
      required: true,
    },
    totalBeds: {
      type: Number,
      required: true,
      min: 1,
    },
    availableBeds: {
      type: Number,
      required: true,
      min: 0,
    },
    monthlyRent: {
      type: Number,
      required: true,
    },
    securityDeposit: {
      type: Number,
      required: true,
    },
    amenities: [String],
    images: [String],
    description: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Room ||
  mongoose.model("Room", RoomSchema);