"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff } from "@untitledui/icons";
import Link from "next/link";

export default function OwnerLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    setTimeout(() => {
      const existingUser = localStorage.getItem(`owner_${formData.email}`);

      if (existingUser) {
        const userData = JSON.parse(existingUser);
        if (userData.password === formData.password) {
          localStorage.setItem(
            "currentUser",
            JSON.stringify({
              type: "owner",
              email: formData.email,
              ...userData,
            })
          );

          // Check if hostel is already set up
          if (userData.hostelCompleted) {
            router.push("/owner-dashboard");
          } else {
            router.push("/addhostel");
          }
        } else {
          setErrors({ password: "Invalid password" });
        }
      } else {
        // Create new account
        const newUser = {
          email: formData.email,
          password: formData.password,
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem(
          `owner_${formData.email}`,
          JSON.stringify(newUser)
        );
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            type: "owner",
            email: formData.email,
            needsHostel: true,
          })
        );
        router.push("/addhostel");
      }
      setIsLoading(false);
    }, 1000);
  };

  const isFormValid =
    formData.email && formData.password && Object.keys(errors).length === 0;

  return (
    <div className="min-h-screen bg-[#fefae0] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#a1cca5]/20">
          <div className="flex items-center mb-6">
            <Link
              href="/"
              className="text-[#1b4332] hover:text-[#a1cca5] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-[#1b4332] ml-4">
              Owner Login
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#1b4332] mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.email ? "border-red-500" : "border-[#a1cca5]/30"
                } focus:outline-none focus:ring-2 focus:ring-[#a1cca5] focus:border-transparent`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#1b4332] mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.password ? "border-red-500" : "border-[#a1cca5]/30"
                  } focus:outline-none focus:ring-2 focus:ring-[#a1cca5] focus:border-transparent pr-12`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#1b4332]"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                isFormValid && !isLoading
                  ? "bg-[#1b4332] text-white hover:bg-[#1b4332]/90"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            New account will be created automatically if email doesn't exist
          </p>
        </div>
      </div>
    </div>
  );
}
