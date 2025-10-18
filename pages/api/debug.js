// Debug API endpoint to track client-side execution
export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { type, tenantId, hostname, timestamp } = req.body;

  console.log("🐛 DEBUG API:", {
    type,
    tenantId,
    hostname,
    timestamp,
    userAgent: req.headers["user-agent"],
    ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
  });

  res.status(200).json({
    success: true,
    message: "Debug info received",
    timestamp: new Date().toISOString(),
  });
}
