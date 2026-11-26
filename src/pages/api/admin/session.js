import verifyAdmin from "../../../lib/adminAuth";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({
      message: "Method not allowed.",
    });
  }

  const admin = await verifyAdmin(req);

  if (!admin) {
    return res.status(401).json({
      authenticated: false,
    });
  }

  return res.status(200).json({
    authenticated: true,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
    },
  });
}
