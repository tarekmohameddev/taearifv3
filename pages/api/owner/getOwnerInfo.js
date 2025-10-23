import { authenticateOwnerToken } from "../../../middleware/ownerAuthMiddleware";

export default function handler(req, res) {
  authenticateOwnerToken(req, res, () => {
    try {
      if (req.owner && req.owner.email) {
        const responseData = {
          email: req.owner.email,
          token: req.owner.token,
          first_name: req.owner.first_name,
          last_name: req.owner.last_name,
          tenant_id: req.owner.tenant_id,
          owner_id: req.owner.owner_id || req.owner.id,
          permissions: req.owner.permissions || [],
          responseNumber: Math.floor(Math.random() * 1e20) + 1,
        };

        return res.status(200).json(responseData);
      } else {
        return res
          .status(401)
          .json({ message: "Owner not authenticated or email not found" });
      }
    } catch (error) {
      console.error("❌ Error in getOwnerInfo:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
}
