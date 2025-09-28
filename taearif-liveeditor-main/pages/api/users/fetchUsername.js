import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export default async function handler(req, res) {
  await dbConnect();
  const { username } = req.body;

  try {
    const user = await User.findOne({ username });
    if (user) {
      const userData = user.toObject();
      userData.componentSettings = Object.fromEntries(user.componentSettings);
      return res.status(200).json(userData);
    } else {
      return res.status(204).end(); // لا محتوى لإرجاعه
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error fetching user information" });
  }
}
