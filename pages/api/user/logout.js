import https from "https";
import axios from "axios";
import { serialize } from "cookie";
import axiosInstance from "@/lib/axiosInstance";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const httpsAgent = new https.Agent({
        rejectUnauthorized:
          process.env.NODE_ENV === "development" ? false : true,
      });
      await axios.post(`${process.env.NEXT_PUBLIC_Backend_URL}/logout`, null, {
        headers: { Authorization: `Bearer ${req.body.token}` },
        httpsAgent: httpsAgent,
      });
    } catch (error) {
      console.error(
        "An error occurred while sending the logout request to the external API:",
        error,
      );
    }

    const cookies = [
      serialize("authToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        expires: new Date(0),
        sameSite: "strict",
        path: "/",
      }),
      serialize("next-auth.session-token", "", {
        path: "/",
        expires: new Date(0),
        secure: process.env.NODE_ENV !== "development",
        sameSite: "lax",
      }),
      serialize("csrf-token", "", {
        path: "/",
        expires: new Date(0),
      }),
    ];

    res.setHeader("Set-Cookie", cookies);
    res.setHeader("Cache-Control", "no-store, max-age=0");
    res.status(200).json({ message: "تم تسجيل الخروج بنجاح" });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`الطريقة ${req.method} غير مسموحة`);
  }
}
