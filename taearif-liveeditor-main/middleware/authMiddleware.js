import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {
  try {
    // Prefer cookies.authToken; fallback to parsing Cookie header
    const token =
      req?.cookies?.authToken ||
      (req?.headers?.cookie || "")
        .split(";")
        .map((c) => c.trim())
        .find((c) => c.startsWith("authToken="))
        ?.split("=")[1];

    if (!token) {
      return res.status(401).json({ message: "UnAuthorized" });
    }

    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
      return res
        .status(500)
        .json({ message: "Server configuration error: SECRET_KEY is not set" });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        console.error("Token Verification Error:", err);
        return res.status(403).json({ error: "Invalid Token", err });
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error("Error verifying JWT:", error);
    return res.status(403).json({ message: "Invalid token." });
  }
}
