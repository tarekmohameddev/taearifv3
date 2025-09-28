import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  await dbConnect();

  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "البريد الإلكتروني وكلمة المرور مطلوبان" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "بيانات الاعتماد غير صحيحة" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "بيانات الاعتماد غير صحيحة" });
    }

    // Issue JWT
    const secretKey = process.env.SECRET_KEY;
    const payload = {
      id: String(user._id),
      email: user.email,
      username: user.username,
      first_name: user.firstName,
      last_name: user.lastName,
    };
    const token = jwt.sign(payload, secretKey, { expiresIn: "7d" });

    // Set cookie (httpOnly=false because you read it client too; switch to true if only server needs it)
    res.setHeader(
      "Set-Cookie",
      `authToken=${token}; Path=/; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`,
    );

    res.status(200).json({
      _id: user._id,
      email: user.email,
      username: user.username,
      imageToggle: user.imageToggle,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "خطأ في الخادم الداخلي" });
  }
}
