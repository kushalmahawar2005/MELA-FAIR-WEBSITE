"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "motion/react";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ADMIN_EMAIL } from "@/lib/admin";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Sparkles, KeyRound, Mail } from "lucide-react";

const loginSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    const password = values.password ?? "";

    if (password.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password is required",
        path: ["password"],
      });
      return;
    }

    if (password.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password must be at least 6 characters",
        path: ["password"],
      });
    }
  });

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mounted && user) {
      router.push("/profile");
    }
  }, [mounted, user, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const email = data.email.trim().toLowerCase();
      const password = data.password?.trim();
      const result = await login(email, password);
      if (result.success) {
        toast.success("Welcome back to Naaz Amusement!");
        router.push("/profile");
      } else {
        toast.error(result.message || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An error occurred during sign in."
      );
    }
  };

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-deep-purple">
        <Loader2 className="h-8 w-8 animate-spin text-accent-yellow" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-deep-purple px-4 py-12">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-accent-magenta/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-accent-yellow/10 blur-[120px] pointer-events-none" />

      {/* Back to Home Link */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-6 left-6 z-10"
      >
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-[14px] tracking-wide text-fk-offwhite/80 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> BACK TO HOME
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
            <Sparkles className="h-3 w.5-3 animate-pulse" />
            <span>Rajasthan&apos;s Premier Amusement Destination</span>
          </motion.div>
          <h1 className="mt-4 font-display text-[36px] sm:text-[44px] leading-none text-white">
            SIGN IN TO <span className="text-accent-yellow">NAAZ</span>
          </h1>
          <p className="mt-2 text-sm text-fk-offwhite/60">
            Access your bookings, profile settings, and event tickets.
          </p>
        </div>

        {/* Card Form */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 shadow-xl backdrop-blur-md sm:p-8">
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

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-medium text-fk-offwhite/90">
                  Password
                </Label>
                {errors.password && (
                  <span className="text-[11px] text-red-400 font-medium">
                    {errors.password.message}
                  </span>
                )}
              </div>
              <div className="relative">
                <KeyRound className="absolute top-2.5 left-3 h-4 w-4 text-fk-offwhite/40" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9 h-10 bg-white/[0.04] border-white/10 text-white placeholder:text-white/20 focus-visible:border-accent-yellow focus-visible:ring-accent-yellow/20"
                  disabled={isLoading}
                  {...register("password")}
                />
              </div>
              <div className="flex justify-end mt-1">
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-accent-yellow/80 hover:text-accent-yellow transition hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <p className="mt-2 text-[11px] text-white/40">
                Admin login: use {ADMIN_EMAIL} with your existing password.
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-10 rounded-lg bg-accent-yellow text-deep-purple hover:bg-accent-yellow/90 font-display text-[15px] tracking-wide mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> SIGNING IN...
                </>
              ) : (
                "SIGN IN TO ACCOUNT"
              )}
            </Button>
          </form>

          {/* Social / Registration Link */}
          <div className="mt-6 text-center text-xs text-fk-offwhite/60">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-white hover:text-accent-yellow transition hover:underline"
            >
              Sign Up Now
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
