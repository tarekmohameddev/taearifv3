/**
 * Mock Authentication API Service
 *
 * All functions simulate real API behavior with realistic delays.
 * Replace each function body with actual API calls when backend is ready.
 *
 * Mock credentials for testing:
 *   - OTP code: 123456
 *   - Login: any email/phone + any non-empty password
 */

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ─── Types ───────────────────────────────────────────────────────────────────

export interface MockUser {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone: string;
  onboarding_completed: boolean;
}

export interface AuthResult {
  success: boolean;
  user?: MockUser;
  token?: string;
  error?: string;
}

export interface OTPResult {
  success: boolean;
  message?: string;
  error?: string;
  attempts_remaining?: number;
}

export interface SocialAuthResult {
  success: boolean;
  url?: string;
  error?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateMockToken(): string {
  return `mock_token_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}

function buildMockUser(overrides: Partial<MockUser> = {}): MockUser {
  return {
    email: "user@example.com",
    username: "my-website",
    first_name: "محمد",
    last_name: "العمري",
    phone: "512345678",
    onboarding_completed: false,
    ...overrides,
  };
}

// ─── Login ───────────────────────────────────────────────────────────────────

/**
 * Mock login with email or phone + password.
 * Accepts any non-empty identifier and password.
 *
 * Real API: POST /login { email|phone, password, recaptcha_token }
 */
export async function mockLogin(
  identifier: string,
  password: string,
  _recaptchaToken?: string,
): Promise<AuthResult> {
  await delay(800 + Math.random() * 400);

  if (!identifier.trim() || !password.trim()) {
    return { success: false, error: "البريد الإلكتروني وكلمة المرور مطلوبان" };
  }

  // Simulate wrong credentials for specific test value
  if (password === "wrong") {
    return {
      success: false,
      error: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    };
  }

  const isPhone = /^5\d{8}$/.test(identifier.replace(/\s/g, ""));
  const user = buildMockUser({
    email: isPhone ? `${identifier}@mock.com` : identifier,
    phone: isPhone ? identifier : "512345678",
    onboarding_completed: true,
  });

  return { success: true, user, token: generateMockToken() };
}

// ─── OTP ─────────────────────────────────────────────────────────────────────

/**
 * Send OTP to phone number.
 * Real API: POST /auth/send-otp { phone, country_code, recaptcha_token }
 */
export async function mockSendOTP(
  phone: string,
  _countryCode = "+966",
  _recaptchaToken?: string,
): Promise<OTPResult> {
  await delay(600 + Math.random() * 400);

  if (!phone.trim()) {
    return { success: false, error: "رقم الهاتف مطلوب" };
  }

  // Simulate rate-limit for specific test number
  if (phone === "500000000") {
    return {
      success: false,
      error: "تم تجاوز الحد الأقصى للمحاولات. يرجى المحاولة لاحقاً.",
      attempts_remaining: 0,
    };
  }

  return {
    success: true,
    message: `تم إرسال رمز التحقق إلى +966${phone}`,
    attempts_remaining: 3,
  };
}

/**
 * Verify OTP code.
 * Mock code: 123456
 * Real API: POST /auth/verify-otp { phone, code }
 */
export async function mockVerifyOTP(
  _phone: string,
  code: string,
): Promise<OTPResult & { verified_token?: string }> {
  await delay(600 + Math.random() * 300);

  if (code === "123456") {
    return {
      success: true,
      message: "تم التحقق بنجاح",
      verified_token: `otp_verified_${Date.now()}`,
    };
  }

  return { success: false, error: "رمز التحقق غير صحيح. حاول مرة أخرى." };
}

// ─── Register ────────────────────────────────────────────────────────────────

/**
 * Complete registration after OTP verification.
 * Real API: POST /register { email, password, phone, username, verified_token, recaptcha_token, referral_code? }
 */
export async function mockRegister(data: {
  email: string;
  password: string;
  phone: string;
  username: string;
  verifiedToken: string;
  referralCode?: string;
  recaptchaToken?: string;
}): Promise<AuthResult> {
  await delay(1000 + Math.random() * 500);

  if (!data.email || !data.password || !data.username) {
    return { success: false, error: "جميع الحقول المطلوبة يجب تعبئتها" };
  }

  // Simulate taken username
  if (data.username === "taken-name") {
    return { success: false, error: "اسم الموقع مسجل بالفعل." };
  }

  // Simulate taken email
  if (data.email === "taken@example.com") {
    return { success: false, error: "هذا البريد الإلكتروني مسجل بالفعل." };
  }

  const user = buildMockUser({
    email: data.email,
    username: data.username,
    phone: data.phone,
    onboarding_completed: false,
  });

  return { success: true, user, token: generateMockToken() };
}

// ─── Social Auth ─────────────────────────────────────────────────────────────

/**
 * Get Google OAuth redirect URL.
 * Real API: GET /auth/google/redirect -> { url: string }
 */
export async function mockGoogleAuth(): Promise<SocialAuthResult> {
  await delay(400 + Math.random() * 200);

  // In mock mode, simulate the redirect URL
  // Replace with: fetch(`${process.env.NEXT_PUBLIC_Backend_URL}/auth/google/redirect`)
  return {
    success: true,
    url: `/oauth/token/success?token=${generateMockToken()}&provider=google`,
  };
}

/**
 * Get X (Twitter) OAuth redirect URL.
 * Real API: GET /auth/twitter/redirect -> { url: string }
 */
export async function mockTwitterAuth(): Promise<SocialAuthResult> {
  await delay(400 + Math.random() * 200);

  // Replace with: fetch(`${process.env.NEXT_PUBLIC_Backend_URL}/auth/twitter/redirect`)
  return {
    success: true,
    url: `/oauth/token/success?token=${generateMockToken()}&provider=twitter`,
  };
}
