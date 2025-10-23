import jwt from "jsonwebtoken";

export function authenticateOwnerToken(req, res, next) {
  try {
    // Get token from cookie
    const token = req.headers.cookie
      ? req.headers.cookie
          .split('; ')
          .find(row => row.startsWith('owner_token='))
          ?.split('=')[1]
      : null;

    if (!token) {
      return res.status(401).json({ message: "Access token required" });
    }

    try {
      // Verify JWT token
      const decoded = jwt.verify(token, process.env.SECRET_KEY || "your-secret-key");
      
      // Set owner data in request
      req.owner = {
        id: decoded.id,
        owner_id: decoded.owner_id,
        email: decoded.email,
        first_name: decoded.first_name,
        last_name: decoded.last_name,
        tenant_id: decoded.tenant_id,
        permissions: decoded.permissions || [],
        token: token,
      };

      next();
    } catch (jwtError) {
      console.error("❌ JWT verification error:", jwtError);
      return res.status(403).json({ message: "Invalid or expired token" });
    }
  } catch (error) {
    console.error("❌ Error in authenticateOwnerToken:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
