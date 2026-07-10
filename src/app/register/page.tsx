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
import { toast } from "sonner";
import { ArrowLeft, Loader2, Sparkles, User, Mail, Phone, KeyRound } from "lucide-react";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: signup, isLoading, user } = useAuthStore();
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
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const success = await signup(data.name, data.email, data.phone, data.password);
      if (success) {
        toast.success("Account created successfully!");
        router.push("/profile");
      } else {
        toast.error("Failed to create account. Email may be already in use.");
      }
    } catch {
      toast.error("An error occurred during sign up.");
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
        className="w-full max-w-[480px]"
      >
        {/* Brand / Logo Header */}
        <div className="mb-6 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-accent-yellow/20 bg-accent-yellow/5 px-4 py-1.5 text-xs text-accent-yellow"
          >
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span>Naaz Amusement Club Pass</span>
          </motion.div>
          <h1 className="mt-3 font-display text-[36px] sm:text-[44px] leading-none text-white">
            CREATE AN <span className="text-accent-yellow">ACCOUNT</span>
          </h1>
          <p className="mt-2 text-sm text-fk-offwhite/60">
            Sign up to book experiences, manage rides rentals, and view tickets.
          </p>
        </div>

        {/* Card Form */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 shadow-xl backdrop-blur-md sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="name" className="text-xs font-medium text-fk-offwhite/90">
                  Full Name
                </Label>
                {errors.name && (
                  <span className="text-[11px] text-red-400 font-medium">
                    {errors.name.message}
                  </span>
                )}
              </div>
              <div className="relative">
                <User className="absolute top-2.5 left-3 h-4 w-4 text-fk-offwhite/40" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="pl-9 h-10 bg-white/[0.04] border-white/10 text-white placeholder:text-white/20 focus-visible:border-accent-yellow focus-visible:ring-accent-yellow/20"
                  disabled={isLoading}
                  {...register("name")}
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1">
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

            {/* Phone Number */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="phone" className="text-xs font-medium text-fk-offwhite/90">
                  Phone Number
                </Label>
                {errors.phone && (
                  <span className="text-[11px] text-red-400 font-medium">
                    {errors.phone.message}
                  </span>
                )}
              </div>
              <div className="relative">
                <Phone className="absolute top-2.5 left-3 h-4 w-4 text-fk-offwhite/40" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="10-digit mobile number"
                  className="pl-9 h-10 bg-white/[0.04] border-white/10 text-white placeholder:text-white/20 focus-visible:border-accent-yellow focus-visible:ring-accent-yellow/20"
                  disabled={isLoading}
                  {...register("phone")}
                />
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-medium text-fk-offwhite/90">
                    Password
                  </Label>
                  {errors.password && (
                    <span className="text-[11px] text-red-400 font-medium leading-none block max-w-[140px] truncate">
                      {errors.password.message}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <KeyRound className="absolute top-2.5 left-3 h-4 w-4 text-fk-offwhite/40" />
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

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="confirmPassword" className="text-xs font-medium text-fk-offwhite/90">
                    Confirm Password
                  </Label>
                  {errors.confirmPassword && (
                    <span className="text-[11px] text-red-400 font-medium leading-none block max-w-[140px] truncate">
                      {errors.confirmPassword.message}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <KeyRound className="absolute top-2.5 left-3 h-4 w-4 text-fk-offwhite/40" />
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
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-10 rounded-lg bg-accent-yellow text-deep-purple hover:bg-accent-yellow/90 font-display text-[15px] tracking-wide mt-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> CREATING ACCOUNT...
                </>
              ) : (
                "CREATE ACCOUNT"
              )}
            </Button>
          </form>

          {/* Social / Login Link */}
          <div className="mt-6 text-center text-xs text-fk-offwhite/60">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-white hover:text-accent-yellow transition hover:underline"
            >
              Sign In Now
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
