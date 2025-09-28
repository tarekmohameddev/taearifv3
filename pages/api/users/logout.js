import { serialize as serializeCookie } from "cookie";

export default async function handler(req, res) {
  if (req.method === "POST") {
    res.setHeader(
      "Set-Cookie",
      serializeCookie("authToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        expires: new Date(0),
        sameSite: "strict",
        path: "/",
      }),
    );

    return res.status(200).json({ message: "Logged out successfully" });
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
