import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Call external API
    const response = await axios.post("https://taearif.com/api/v1/owner-rental/login", {
      email,
      password,
    });

    const { success, data } = response.data;

    if (success && data && data.token && data.owner_rental) {
      const { owner_rental: user, token } = data;
      // Set cookie with JWT token
      const cookieOptions = {
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      };

      res.setHeader(
        "Set-Cookie",
        `owner_token=${token}; Path=${cookieOptions.path}; Max-Age=${cookieOptions.maxAge}; ${cookieOptions.secure ? "Secure" : ""}; SameSite=${cookieOptions.sameSite}, ownerRentalToken=${token}; Path=${cookieOptions.path}; Max-Age=${cookieOptions.maxAge}; ${cookieOptions.secure ? "Secure" : ""}; SameSite=${cookieOptions.sameSite}`
      );

      return res.status(200).json({
        success: true,
        user: {
          email: user.email,
          first_name: user.name ? user.name.split(' ')[0] : null,
          last_name: user.name ? user.name.split(' ').slice(1).join(' ') : null,
          tenant_id: user.tenant_id,
          owner_id: user.id,
          permissions: user.permissions || [],
        },
        token: token,
      });
    } else {
      return res.status(400).json({ message: "Invalid response from server" });
    }
  } catch (error) {
    console.error("❌ Error in owner login:", error);
    
    let errorMessage = "فشل تسجيل الدخول";
    let statusCode = 500;

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
      statusCode = error.response.status;
    } else if (error.response?.status === 401) {
      errorMessage = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
      statusCode = 401;
    } else if (error.response?.status === 404) {
      errorMessage = "المستخدم غير موجود";
      statusCode = 404;
    }

    return res.status(statusCode).json({ 
      success: false,
      message: errorMessage 
    });
  }
}
