"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();

  // Convert Firebase error codes to user-friendly messages
  const getErrorMessage = (error: any): string => {
    const errorCode = error?.code || error?.message || "";

    if (errorCode.includes("auth/invalid-credential") || errorCode.includes("auth/wrong-password")) {
      return "Invalid email or password. Please try again.";
    }
    if (errorCode.includes("auth/user-not-found")) {
      return "No account found with this email address.";
    }
    if (errorCode.includes("auth/invalid-email")) {
      return "Please enter a valid email address.";
    }
    if (errorCode.includes("auth/user-disabled")) {
      return "This account has been disabled. Please contact support.";
    }
    if (errorCode.includes("auth/too-many-requests")) {
      return "Too many failed attempts. Please try again later.";
    }
    if (errorCode.includes("auth/network-request-failed")) {
      return "Network error. Please check your connection and try again.";
    }
    if (errorCode.includes("auth/popup-closed-by-user")) {
      return "Sign-in cancelled. Please try again.";
    }
    if (errorCode.includes("auth/popup-blocked")) {
      return "Pop-up blocked. Please allow pop-ups for this site.";
    }

    return "An error occurred. Please try again.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);
      router.push("/"); // Redirect to home after successful login
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);

    try {
      await signInWithGoogle();
      router.push("/"); // Redirect to home after successful login
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#F0F3FF] via-[#FFFFFF] to-[#F2F5FF] dark:from-gray-900 dark:via-[#000000] dark:to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/assets/images/header/logo_bg_remove.png"
              alt="ek-website Logo"
              width={200}
              height={60}
              className="h-14 w-auto mx-auto"
            />
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-[#000000] rounded-[24px] shadow-xl dark:shadow-2xl p-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <div className="mb-8">
            <h2 className="text-[28px] font-bold text-brand-primary dark:text-white text-center mb-2 transition-colors">
              Welcome Back
            </h2>
            <p className="text-[14px] text-[#64748B] dark:text-gray-400 text-center transition-colors">
              Sign in to your account to continue
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-[12px] transition-colors">
              <p className="text-[13px] text-red-600 dark:text-red-400 text-center transition-colors">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-[14px] font-semibold text-brand-primary dark:text-white mb-2 transition-colors">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-[12px] text-[14px] text-brand-primary dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-[14px] font-semibold text-brand-primary dark:text-white mb-2 transition-colors">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-[12px] text-[14px] text-brand-primary dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-[#1B2556] dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-brand-secondary focus:ring-brand-secondary border-gray-300 dark:border-gray-600 rounded cursor-pointer bg-white dark:bg-[#1a1a1a] transition-colors"
                />
                <label htmlFor="remember-me" className="ml-2 block text-[13px] text-[#64748B] dark:text-gray-400 cursor-pointer transition-colors">
                  Remember me
                </label>
              </div>

              <Link href="/forgot-password" className="text-[13px] font-semibold text-brand-secondary dark:text-[#ff4d6d] hover:text-[#7D001A] dark:hover:text-[#ff6b8a] transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-brand-gradient text-white font-semibold rounded-[12px] hover:opacity-90 transition-opacity text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700 transition-colors"></div>
            </div>
            <div className="relative flex justify-center text-[13px]">
              <span className="px-4 bg-white dark:bg-[#000000] text-[#64748B] dark:text-gray-400 transition-colors">Or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-[12px] hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="text-[14px] font-medium text-brand-primary dark:text-white transition-colors">Continue with Google</span>
          </button>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-[14px] text-[#64748B] dark:text-gray-400 transition-colors">
            Don't have an account?{" "}
            <Link href="/register" className="font-semibold text-brand-secondary dark:text-[#ff4d6d] hover:text-[#7D001A] dark:hover:text-[#ff6b8a] transition-colors">
              Sign up
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-[14px] text-[#64748B] dark:text-gray-400 hover:text-brand-primary dark:hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
