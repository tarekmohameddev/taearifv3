import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { user, UserToken } = req.body;

    try {
      if (!user || !UserToken) {
        return res.status(400).json({
          success: false,
          error: "بيانات المستخدم أو التوكن غير موجودة",
        });
      }
      console.log(`UserToken`, UserToken);
      console.log(`user`, user);

      const token1 = jwt.sign(
        {
          email: user.email,
          token: UserToken,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          onboarding_completed: user.onboarding_completed === true,
        },
        process.env.SECRET_KEY,
        { expiresIn: "30d" },
      );

      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      };

      const authCookie = serialize("authToken", token1, cookieOptions);
      res.setHeader("Set-Cookie", authCookie);

      return res.status(200).json({
        success: true,
        user: {
          email: user.email,
          token: UserToken,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          onboarding_completed: user.onboarding_completed || false,
        },
      });
    } catch (error) {
      console.error("Error in setAuth:", error.message);
      return res.status(500).json({
        success: false,
        error: "حدث خطأ أثناء تعيين التوكن",
      });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
