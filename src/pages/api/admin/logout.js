
export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);

    return res.status(405).json({
      message: "Method not allowed.",
    });
  }

  res.setHeader("Set-Cookie", [
    `aa_admin_token=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0${process.env.NODE_ENV === "production" ? "; Secure" : ""}`,
  ]);

  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
}
