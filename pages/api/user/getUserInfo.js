import { authenticateToken } from "../../../middleware/authMiddleware";

export default function handler(req, res) {
  
  authenticateToken(req, res, () => {
    try {
      
      if (req.user && req.user.email) {
        const responseData = {
          email: req.user.email,
          token: req.user.token,
          username: req.user.username,
          first_name: req.user.first_name,
          last_name: req.user.last_name,
          responseNumber: Math.floor(Math.random() * 1e20) + 1,
        };
        
        return res.status(200).json(responseData);
      } else {
        return res
          .status(401)
          .json({ message: "User not authenticated or email not found" });
      }
    } catch (error) {
      console.error("❌ Error in getUserInfo:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
}
