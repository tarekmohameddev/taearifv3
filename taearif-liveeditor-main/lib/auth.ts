import bcrypt from "bcryptjs";
import { z } from "zod";
import { rateLimit } from "./rate-limit";

// Password validation schema
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character",
  );

// Signup validation schema
export const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: passwordSchema,
    confirmPassword: z.string(),
    tenantId: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Login validation schema
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  tenantId: z.string(),
});

// Magic link validation schema
export const magicLinkSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  tenantId: z.string(),
});

// Password reset validation schema
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
    token: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Verify password
export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Rate limiter for auth endpoints
export const authRateLimiter = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  limit: 10, // 10 requests per interval
});

// Generate verification token
export function generateVerificationToken(): string {
  return crypto.randomUUID();
}

// Validate CSRF token
export async function validateCSRFToken(
  token: string,
  expectedToken: string,
): Promise<boolean> {
  return token === expectedToken;
}

// Detect bot activity
export function isBotRequest(userAgent: string | null): boolean {
  if (!userAgent) return true;

  const botPatterns = [
    /bot/i,
    /crawl/i,
    /spider/i,
    /headless/i,
    /scrape/i,
    /phantom/i,
    /selenium/i,
    /puppeteer/i,
  ];

  return botPatterns.some((pattern) => pattern.test(userAgent));
}
