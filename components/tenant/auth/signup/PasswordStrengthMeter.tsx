"use client";

import { useEffect, useState } from "react";

interface PasswordStrengthMeterProps {
  password: string;
}

const PasswordStrengthMeter = ({ password }: PasswordStrengthMeterProps) => {
  const [strength, setStrength] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Calculate password strength
    let score = 0;

    if (!password) {
      setStrength(0);
      setMessage("");
      return;
    }

    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    // Set strength level (0-5)
    setStrength(Math.min(5, score));

    // Set message based on strength
    switch (score) {
      case 0:
      case 1:
        setMessage("Very weak");
        break;
      case 2:
        setMessage("Weak");
        break;
      case 3:
        setMessage("Fair");
        break;
      case 4:
        setMessage("Good");
        break;
      case 5:
        setMessage("Strong");
        break;
      default:
        setMessage("");
    }
  }, [password]);

  // Get color based on strength
  const getColor = () => {
    switch (strength) {
      case 0:
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-orange-500";
      case 3:
        return "bg-yellow-500";
      case 4:
        return "bg-blue-500";
      case 5:
        return "bg-green-500";
      default:
        return "bg-gray-200";
    }
  };

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex h-2 overflow-hidden rounded bg-gray-200">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`h-full w-1/5 ${i < strength ? getColor() : "bg-gray-200"}`}
          />
        ))}
      </div>
      <p
        className={`mt-1 text-xs ${strength <= 2 ? "text-red-600" : strength <= 3 ? "text-yellow-600" : "text-green-600"}`}
      >
        {message}
      </p>
    </div>
  );
};

export default PasswordStrengthMeter;
