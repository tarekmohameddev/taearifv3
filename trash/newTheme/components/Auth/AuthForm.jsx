// src/components/AuthForm.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Facebook, Twitter, Google } from "lucide-react";
import Image from "next/image";
import { signIn } from "next-auth/react";

const AuthForm = ({ isLogin }) => {
  const router = useRouter();
  const { UserIslogged, errorLogin, login } = useAuth();
  const [formData, setFormData] = useState({
    email: "test@1.test",
    password: "Test@1234",
    firstName: "",
    lastName: "",
    username: "",
    phoneNumber: "",
  });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        router.push("/");
      } else {
        setError(result.error);
      }
    } else {
      const response = await fetch("/api/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        setError(errorResponse.error);
      } else {
        const result = await response.json();
        setMessage(result.message);
        setTimeout(() => router.push("/login"), 2000);
      }
    }
  };

  const handleSocialLogin = (provider) => {
    signIn(provider, { callbackUrl: "/" });
  };

  return (
    <div className="flex min-h-screen font-opensans">
      {/* Left side - Decorative background */}
      <div className="hidden md:flex md:w-1/2 bg-gray-300 relative">
        {/* Logo Container */}
        <div className="absolute top-3 left-8 z-10 w-[8rem] h-20">
          <Link href="/" className={`cursor-pointer`}>
            <Image
              src="/images/LOGO.png"
              alt="Hotel Logo"
              fill
              className="object-contain brightness-0"
            />
          </Link>
        </div>

        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/placeholder.jpg"
            alt="Decorative background"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-gray-800">
              {isLogin ? "Login to continue" : "Create new account"}
            </h1>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="flex gap-4">
                  <div>
                    <label htmlFor="firstName" className="sr-only">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      placeholder="First Name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="sr-only">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      placeholder="Last Name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="username" className="sr-only">
                    Username
                  </label>
                  <input
                    id="username"
                    placeholder="Username"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="sr-only">
                    Phone Number
                  </label>
                  <input
                    id="phoneNumber"
                    placeholder="Phone Number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 border border-gray-300 rounded-md"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value.replace(/\s+/g, ""),
                  })
                }
              />
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-md"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value.replace(/\s+/g, ""),
                  })
                }
              />
            </div>

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600"
                  />
                  <label htmlFor="remember-me" className="ml-2 text-sm">
                    Remember me
                  </label>
                </div>
                <Link href="#" className="text-sm text-indigo-600">
                  Forgot password?
                </Link>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              {isLogin ? "LOGIN" : "SIGN UP"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <Link
                href={isLogin ? "/signup" : "/login"}
                className="text-indigo-600"
              >
                {isLogin ? "Sign up" : "Login"}
              </Link>
            </p>

            <div className="mt-3 flex justify-center space-x-3">
              <button
                onClick={() => handleSocialLogin("google")}
                className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700"
              >
                <Twitter size={20} />
              </button>
              <button
                onClick={() => handleSocialLogin("facebook")}
                className="p-2 rounded-full bg-blue-800 text-white hover:bg-blue-900"
              >
                <Facebook size={20} />
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}
          {message && <p className="text-green-500 text-center">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
