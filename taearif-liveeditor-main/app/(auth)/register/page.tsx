"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { User, Mail, Lock, Phone, Globe, Building2 } from "lucide-react";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { GradientButton } from "@/components/ui/gradient-button";
import { useAuth } from "@/context/AuthContext";

const formSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(50, "Full name too long"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
    confirmPassword: z.string(),
    phoneNumber: z
      .string()
      .min(10, "Please enter a valid phone number")
      .max(15, "Phone number too long"),
    websiteName: z
      .string()
      .min(3, "Website name must be at least 3 characters")
      .max(30, "Website name too long")
      .regex(/^[a-zA-Z0-9-]+$/, "Only letters, numbers, and hyphens allowed"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      websiteName: "",
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    try {
      // Split full name into first and last name
      const [firstName, ...lastNameParts] = data.fullName.trim().split(" ");
      const lastName = lastNameParts.join(" ") || firstName;
      
      await register(
        data.websiteName.toLowerCase(),
        data.websiteName,
        data.email,
        data.password,
        firstName,
        lastName,
        data.phoneNumber,
      );
      toast.success("Account created successfully! 🎉");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-3 text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Start building your website today
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          Create your professional website in minutes with our drag-and-drop builder
        </p>
      </motion.div>

      {/* Registration Form */}
      <motion.form
        variants={itemVariants}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* Full Name */}
        <motion.div variants={itemVariants}>
          <FloatingLabelInput
            label="Full Name"
            icon={<User className="h-4 w-4" />}
            error={form.formState.errors.fullName?.message}
            {...form.register("fullName")}
          />
        </motion.div>

        {/* Email */}
        <motion.div variants={itemVariants}>
          <FloatingLabelInput
            label="Email Address"
            type="email"
            icon={<Mail className="h-4 w-4" />}
            error={form.formState.errors.email?.message}
            {...form.register("email")}
          />
        </motion.div>

        {/* Website Name */}
        <motion.div variants={itemVariants}>
          <FloatingLabelInput
            label="Website Name"
            icon={<Building2 className="h-4 w-4" />}
            error={form.formState.errors.websiteName?.message}
            {...form.register("websiteName")}
          />
          <p className="mt-2 text-xs text-gray-500">
            This will be your website's URL: yourname.Taearif-platform.com
          </p>
        </motion.div>

        {/* Phone Number */}
        <motion.div variants={itemVariants}>
          <FloatingLabelInput
            label="Phone Number"
            type="tel"
            icon={<Phone className="h-4 w-4" />}
            error={form.formState.errors.phoneNumber?.message}
            {...form.register("phoneNumber")}
          />
        </motion.div>

        {/* Password */}
        <motion.div variants={itemVariants}>
          <FloatingLabelInput
            label="Password"
            type="password"
            icon={<Lock className="h-4 w-4" />}
            error={form.formState.errors.password?.message}
            {...form.register("password")}
          />
        </motion.div>

        {/* Confirm Password */}
        <motion.div variants={itemVariants}>
          <FloatingLabelInput
            label="Confirm Password"
            type="password"
            icon={<Lock className="h-4 w-4" />}
            error={form.formState.errors.confirmPassword?.message}
            {...form.register("confirmPassword")}
          />
        </motion.div>

        {/* Submit Button */}
        <motion.div variants={itemVariants} className="pt-4">
          <GradientButton
            type="submit"
            className="w-full"
            size="lg"
            loading={isLoading}
            icon={<Globe className="h-4 w-4" />}
          >
            Create Account
          </GradientButton>
        </motion.div>
      </motion.form>

      {/* Login Link */}
      <motion.div variants={itemVariants} className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link 
            href="/login" 
            className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            Sign in
          </Link>
        </p>
      </motion.div>

      {/* Trust Indicators */}
      <motion.div variants={itemVariants} className="text-center space-y-3">
        <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>SSL Secured</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span>Free Trial</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full" />
            <span>24/7 Support</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
