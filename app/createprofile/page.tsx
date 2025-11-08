"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User01 } from "@untitledui/icons";

export default function CreateProfile() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData({ ...formData, phone: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    setTimeout(() => {
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "{}"
      );
      const existingUserData = JSON.parse(
        localStorage.getItem(`resident_${currentUser.email}`) || "{}"
      );

      const updatedUser = {
        ...existingUserData,
        name: formData.name,
        phone: formData.phone,

        profileCompleted: true,
      };

      localStorage.setItem(
        `resident_${currentUser.email}`,
        JSON.stringify(updatedUser)
      );
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          ...currentUser,
          ...updatedUser,
          needsProfile: false,
        })
      );

      router.push("/dashboard");
      setIsLoading(false);
    }, 1000);
  };

  const isFormValid =
    formData.name.trim() && formData.phone && Object.keys(errors).length === 0;

  return (
    <div className="min-h-screen bg-[#fefae0] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#a1cca5]/20">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#a1cca5] rounded-full flex items-center justify-center mx-auto mb-4">
              <User01 className="w-8 h-8 text-[#1b4332]" />
            </div>
            <h1 className="text-2xl font-bold text-[#1b4332]">
              Complete Your Profile
            </h1>
            <p className="text-gray-600 mt-2">Tell us a bit about yourself</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[#1b4332] mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.name ? "border-red-500" : "border-[#a1cca5]/30"
                } focus:outline-none focus:ring-2 focus:ring-[#a1cca5] focus:border-transparent`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-[#1b4332] mb-2"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={handlePhoneChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.phone ? "border-red-500" : "border-[#a1cca5]/30"
                } focus:outline-none focus:ring-2 focus:ring-[#a1cca5] focus:border-transparent`}
                placeholder="Enter 10-digit phone number"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
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
              {isLoading ? "Creating Profile..." : "Complete Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
