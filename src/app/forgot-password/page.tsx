"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "motion/react";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Sparkles, Mail, CheckCircle2, Lock } from "lucide-react";

const forgotPasswordSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { resetPassword, isLoading } = useAuthStore();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const result = await resetPassword(data.email, data.password);
      if (result.success) {
        setIsSubmitted(true);
        toast.success("Password updated! You can sign in now.");
      } else {
        toast.error(result.message || "Failed to reset password.");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-deep-purple px-4 py-12">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-accent-magenta/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-accent-yellow/10 blur-[120px] pointer-events-none" />

      {/* Back to Login Link */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-6 left-6 z-10"
      >
        <Link
          href="/login"
          className="flex items-center gap-2 font-display text-[14px] tracking-wide text-fk-offwhite/80 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> BACK TO SIGN IN
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[450px]"
      >
        {/* Brand / Logo Header */}
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-accent-yellow/20 bg-accent-yellow/5 px-4 py-1.5 text-xs text-accent-yellow"
          >
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span>Naaz Account Recovery</span>
          </motion.div>
          <h1 className="mt-4 font-display text-[36px] sm:text-[44px] leading-none text-white">
            {isSubmitted ? "PASSWORD UPDATED" : "RESET PASSWORD"}
          </h1>
          <p className="mt-2 text-sm text-fk-offwhite/60">
            {isSubmitted
              ? "Your password has been updated. You can now sign in with your new password."
              : "Enter your registered email and choose a new password."}
          </p>
        </div>

        {/* Card Form */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 shadow-xl backdrop-blur-md sm:p-8">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email" className="text-xs font-medium text-fk-offwhite/90">
                    Email Address
                  </Label>
                  {errors.email && (
                    <span className="text-[11px] text-red-400 font-medium">
                      {errors.email.message}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Mail className="absolute top-2.5 left-3 h-4 w-4 text-fk-offwhite/40" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="yourname@example.com"
                    className="pl-9 h-10 bg-white/[0.04] border-white/10 text-white placeholder:text-white/20 focus-visible:border-accent-yellow focus-visible:ring-accent-yellow/20"
                    disabled={isLoading}
                    {...register("email")}
                  />
                </div>
              </div>

              {/* New Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-medium text-fk-offwhite/90">
                    New Password
                  </Label>
                  {errors.password && (
                    <span className="text-[11px] text-red-400 font-medium">
                      {errors.password.message}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute top-2.5 left-3 h-4 w-4 text-fk-offwhite/40" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••"
                    className="pl-9 h-10 bg-white/[0.04] border-white/10 text-white placeholder:text-white/20 focus-visible:border-accent-yellow focus-visible:ring-accent-yellow/20"
                    disabled={isLoading}
                    {...register("password")}
                  />
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="confirmPassword" className="text-xs font-medium text-fk-offwhite/90">
                    Confirm Password
                  </Label>
                  {errors.confirmPassword && (
                    <span className="text-[11px] text-red-400 font-medium">
                      {errors.confirmPassword.message}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute top-2.5 left-3 h-4 w-4 text-fk-offwhite/40" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••"
                    className="pl-9 h-10 bg-white/[0.04] border-white/10 text-white placeholder:text-white/20 focus-visible:border-accent-yellow focus-visible:ring-accent-yellow/20"
                    disabled={isLoading}
                    {...register("confirmPassword")}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-10 rounded-lg bg-accent-yellow text-deep-purple hover:bg-accent-yellow/90 font-display text-[15px] tracking-wide mt-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> UPDATING PASSWORD...
                  </>
                ) : (
                  "UPDATE PASSWORD"
                )}
              </Button>
            </form>
          ) : (
            <div className="text-center py-4 space-y-5">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="inline-flex items-center justify-center rounded-full bg-green-500/10 p-3 text-green-400"
              >
                <CheckCircle2 className="h-10 w-10" />
              </motion.div>
              <p className="text-xs text-fk-offwhite/60">
                Your password has been updated successfully. Use your new password to sign in to your account.
              </p>
              <Link href="/login" className="block">
                <Button className="w-full h-10 rounded-lg bg-accent-yellow text-deep-purple hover:bg-accent-yellow/90 font-display text-[15px] tracking-wide">
                  GO TO SIGN IN
                </Button>
              </Link>
            </div>
          )}

          {/* Social / Registration Link */}
          <div className="mt-6 text-center text-xs text-fk-offwhite/60">
            Back to{" "}
            <Link
              href="/login"
              className="font-semibold text-white hover:text-accent-yellow transition hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
