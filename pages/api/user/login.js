import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import axios from "axios";
import https from "https";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    try {
      const agent = new https.Agent({
        rejectUnauthorized: false, // Disable SSL certificate validation (not recommended for production)
      });

      const response = await axios.post(
        "https://taearif.com/api/login",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          httpsAgent: agent,
        },
      );

      if (response.status === 200) {
        const { user, token: UserToken } = response.data;

        const token1 = jwt.sign(
          {
            email: user.email,
            token: UserToken,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
          },
          process.env.SECRET_KEY,
          { expiresIn: "30d" },
        );

        const cookieOptions = {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: "/",
        };

        const authCookie = serialize("authToken", token1, cookieOptions);
        res.setHeader("Set-Cookie", authCookie);

        return res.status(200).json({ success: true, user , UserToken});
      } else {
        console.error("External API returned non-200 status:", response.status);
        return res
          .status(401)
          .json({ success: false, error: "فشل تسجيل الدخول" });
      }
    } catch (error) {
      console.error(
        "Error during login:",
        error.response?.data || error.message,
      );
      return res.status(500).json({
        success: false,
        error: "حدث خطأ أثناء الاتصال بالخادم",
      });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
