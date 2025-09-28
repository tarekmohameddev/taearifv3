import { authenticateToken } from "../../../middleware/authMiddleware";

export default function handler(req, res) {
  authenticateToken(req, res, () => {
    try {
      if (req.user && req.user.email) {
        console.log("Debug - JWT user data:", req.user);
        return res.status(200).json({
          success: true,
          user: {
            id: req.user.id,
            email: req.user.email,
            username: req.user.username,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            tenantId: req.user.tenantId || req.user.id,
            name: req.user.first_name + " " + req.user.last_name,
          },
          responseNumber: Math.floor(Math.random() * 1e20) + 1,
        });
      } else {
        return res
          .status(401)
          .json({ message: "User not authenticated or email not found" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });
}
