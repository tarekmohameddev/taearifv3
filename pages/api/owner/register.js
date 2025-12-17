import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email, password, first_name, last_name, phone } = req.body;

    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({
        message: "Email, password, first name, and last name are required",
      });
    }

    // Call external API
    const response = await axios.post(
      "https://api.taearif.com/api/v1/owner-rental/register",
      {
        email,
        password,
        first_name,
        last_name,
        phone,
      },
    );

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
        `owner_token=${token}; Path=${cookieOptions.path}; Max-Age=${cookieOptions.maxAge}; ${cookieOptions.secure ? "Secure" : ""}; SameSite=${cookieOptions.sameSite}, ownerRentalToken=${token}; Path=${cookieOptions.path}; Max-Age=${cookieOptions.maxAge}; ${cookieOptions.secure ? "Secure" : ""}; SameSite=${cookieOptions.sameSite}`,
      );

      return res.status(201).json({
        success: true,
        user: {
          email: user.email,
          first_name: user.name ? user.name.split(" ")[0] : first_name,
          last_name: user.name
            ? user.name.split(" ").slice(1).join(" ")
            : last_name,
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
    console.error("❌ Error in owner register:", error);

    let errorMessage = "فشل التسجيل";
    let statusCode = 500;

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
      statusCode = error.response.status;
    } else if (error.response?.status === 400) {
      errorMessage = "البيانات المدخلة غير صحيحة";
      statusCode = 400;
    } else if (error.response?.status === 409) {
      errorMessage = "البريد الإلكتروني موجود بالفعل";
      statusCode = 409;
    }

    return res.status(statusCode).json({
      success: false,
      message: errorMessage,
    });
  }
}
