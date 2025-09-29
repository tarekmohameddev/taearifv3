import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {
  const token = req.cookies.authToken;
  console.log("🔐 AuthMiddleware - Token from cookie:", token ? "Present" : "Missing");
  
  if (!token) {
    console.log("❌ AuthMiddleware - No token found in cookies");
    return res.status(401).json({ message: "UnAuthorized" });
  }
  
  try {
    const secretKey = process.env.SECRET_KEY;
    console.log("🔐 AuthMiddleware - Verifying token with secret key");
    
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        console.error("❌ Token Verification Error:", err);
        return res.status(403).json({ error: "Invalid Token", err });
      }
      console.log("✅ AuthMiddleware - Token verified successfully");
      req.user = user;
      next();
    });
  } catch (error) {
    console.error("❌ Error verifying JWT:", error);
    return res.status(403).json({ message: "Invalid token." });
  }
}
