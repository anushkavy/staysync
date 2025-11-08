"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building01, Plus, X } from "@untitledui/icons";

interface RoomType {
  type: string;
  total: number;
  vacant: number;
}

export default function AddHostel() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    // Owner Details
    ownerName: "",
    ownerPhone: "",
    ownerEmail: "",
    // Hostel Details
    name: "",
    location: "",
    pincode: "",
    image: null as File | null,
  });
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([
    { type: "Single", total: 0, vacant: 0 },
  ]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Owner validation
    if (!formData.ownerName.trim()) {
      newErrors.ownerName = "Owner name is required";
    } else if (formData.ownerName.trim().length < 2) {
      newErrors.ownerName = "Owner name must be at least 2 characters";
    }

    if (!formData.ownerPhone) {
      newErrors.ownerPhone = "Owner phone number is required";
    } else if (!/^\d{10}$/.test(formData.ownerPhone)) {
      newErrors.ownerPhone = "Phone number must be exactly 10 digits";
    }

    if (!formData.ownerEmail) {
      newErrors.ownerEmail = "Owner email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.ownerEmail)) {
      newErrors.ownerEmail = "Please enter a valid email";
    }

    // Hostel validation
    if (!formData.name.trim()) {
      newErrors.name = "PG name is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.pincode) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be exactly 6 digits";
    }

    roomTypes.forEach((room, index) => {
      if (!room.type.trim()) {
        newErrors[`roomType_${index}`] = "Room type is required";
      }
      if (room.total < 0) {
        newErrors[`total_${index}`] = "Total rooms cannot be negative";
      }
      if (room.vacant < 0 || room.vacant > room.total) {
        newErrors[`vacant_${index}`] =
          "Vacant rooms must be between 0 and total rooms";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setFormData({ ...formData, pincode: value });
  };

  const handleOwnerPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData({ ...formData, ownerPhone: value });
  };

  const addRoomType = () => {
    setRoomTypes([...roomTypes, { type: "", total: 0, vacant: 0 }]);
  };

  const removeRoomType = (index: number) => {
    if (roomTypes.length > 1) {
      setRoomTypes(roomTypes.filter((_, i) => i !== index));
    }
  };

  const updateRoomType = (
    index: number,
    field: keyof RoomType,
    value: string | number
  ) => {
    const updated = roomTypes.map((room, i) =>
      i === index ? { ...room, [field]: value } : room
    );
    setRoomTypes(updated);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }
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
        localStorage.getItem(`owner_${currentUser.email}`) || "{}"
      );

      const hostelData = {
        name: formData.name,
        location: formData.location,
        pincode: formData.pincode,
        roomTypes: roomTypes,
        image: formData.image?.name || null,
        createdAt: new Date().toISOString(),
      };

      const updatedUser = {
        ...existingUserData,
        // Owner details
        ownerName: formData.ownerName,
        ownerPhone: formData.ownerPhone,
        ownerEmail: formData.ownerEmail,
        // Hostel data
        hostel: hostelData,
        hostelCompleted: true,
      };

      localStorage.setItem(
        `owner_${currentUser.email}`,
        JSON.stringify(updatedUser)
      );
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          ...currentUser,
          ...updatedUser,
          needsHostel: false,
        })
      );

      router.push("/owner-dashboard");
      setIsLoading(false);
    }, 1000);
  };

  const isFormValid =
    formData.ownerName.trim() &&
    formData.ownerPhone &&
    formData.ownerEmail &&
    formData.name.trim() &&
    formData.location.trim() &&
    formData.pincode &&
    roomTypes.every(
      (room) =>
        room.type.trim() &&
        room.total >= 0 &&
        room.vacant >= 0 &&
        room.vacant <= room.total
    ) &&
    Object.keys(errors).length === 0;

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#a1cca5]/20">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#a1cca5] rounded-full flex items-center justify-center mx-auto mb-4">
              <Building01 className="w-8 h-8 text-[#1b4332]" />
            </div>
            <h1 className="text-2xl font-bold text-[#1b4332]">
              Add Your PG/Hostel
            </h1>
            <p className="text-gray-600 mt-2">
              Tell us about yourself and your property
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Owner Details Section */}
            <div className="border-b border-[#a1cca5]/20 pb-6">
              <h3 className="text-lg font-semibold text-[#1b4332] mb-4">
                Owner Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="ownerName"
                    className="block text-sm font-medium text-[#1b4332] mb-2"
                  >
                    Owner Name
                  </label>
                  <input
                    type="text"
                    id="ownerName"
                    value={formData.ownerName}
                    onChange={(e) =>
                      setFormData({ ...formData, ownerName: e.target.value })
                    }
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.ownerName
                        ? "border-red-500"
                        : "border-[#a1cca5]/30"
                    } focus:outline-none focus:ring-2 focus:ring-[#a1cca5] focus:border-transparent`}
                    placeholder="Enter your full name"
                  />
                  {errors.ownerName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.ownerName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="ownerPhone"
                    className="block text-sm font-medium text-[#1b4332] mb-2"
                  >
                    Owner Phone Number
                  </label>
                  <input
                    type="tel"
                    id="ownerPhone"
                    value={formData.ownerPhone}
                    onChange={handleOwnerPhoneChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.ownerPhone
                        ? "border-red-500"
                        : "border-[#a1cca5]/30"
                    } focus:outline-none focus:ring-2 focus:ring-[#a1cca5] focus:border-transparent`}
                    placeholder="Enter 10-digit phone number"
                  />
                  {errors.ownerPhone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.ownerPhone}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="ownerEmail"
                    className="block text-sm font-medium text-[#1b4332] mb-2"
                  >
                    Owner Email Address
                  </label>
                  <input
                    type="email"
                    id="ownerEmail"
                    value={formData.ownerEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, ownerEmail: e.target.value })
                    }
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.ownerEmail
                        ? "border-red-500"
                        : "border-[#a1cca5]/30"
                    } focus:outline-none focus:ring-2 focus:ring-[#a1cca5] focus:border-transparent`}
                    placeholder="Enter your email"
                  />
                  {errors.ownerEmail && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.ownerEmail}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Hostel Details Section */}
            <div>
              <h3 className="text-lg font-semibold text-[#1b4332] mb-4">
                PG/Hostel Details
              </h3>
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-[#1b4332] mb-2"
                  >
                    PG/Hostel Name
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
                    placeholder="Enter PG/Hostel name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-[#1b4332] mb-2"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.location ? "border-red-500" : "border-[#a1cca5]/30"
                    } focus:outline-none focus:ring-2 focus:ring-[#a1cca5] focus:border-transparent`}
                    placeholder="Enter location/address"
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.location}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="pincode"
                    className="block text-sm font-medium text-[#1b4332] mb-2"
                  >
                    Pincode
                  </label>
                  <input
                    type="text"
                    id="pincode"
                    value={formData.pincode}
                    onChange={handlePincodeChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.pincode ? "border-red-500" : "border-[#a1cca5]/30"
                    } focus:outline-none focus:ring-2 focus:ring-[#a1cca5] focus:border-transparent`}
                    placeholder="Enter 6-digit pincode"
                  />
                  {errors.pincode && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.pincode}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1b4332] mb-2">
                    Room Types & Availability
                  </label>
                  {roomTypes.map((room, index) => (
                    <div
                      key={index}
                      className="border border-[#a1cca5]/20 rounded-lg p-4 mb-4"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-[#1b4332]">
                          Room Type {index + 1}
                        </h4>
                        {roomTypes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRoomType(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <input
                            type="text"
                            value={room.type}
                            onChange={(e) =>
                              updateRoomType(index, "type", e.target.value)
                            }
                            className={`w-full px-3 py-2 rounded border ${
                              errors[`roomType_${index}`]
                                ? "border-red-500"
                                : "border-[#a1cca5]/30"
                            } focus:outline-none focus:ring-1 focus:ring-[#a1cca5]`}
                            placeholder="e.g., Single, Double"
                          />
                          {errors[`roomType_${index}`] && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors[`roomType_${index}`]}
                            </p>
                          )}
                        </div>
                        <div>
                          <input
                            type="number"
                            value={room.total}
                            onChange={(e) =>
                              updateRoomType(
                                index,
                                "total",
                                parseInt(e.target.value) || 0
                              )
                            }
                            className={`w-full px-3 py-2 rounded border ${
                              errors[`total_${index}`]
                                ? "border-red-500"
                                : "border-[#a1cca5]/30"
                            } focus:outline-none focus:ring-1 focus:ring-[#a1cca5]`}
                            placeholder="Total rooms"
                            min="0"
                          />
                          {errors[`total_${index}`] && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors[`total_${index}`]}
                            </p>
                          )}
                        </div>
                        <div>
                          <input
                            type="number"
                            value={room.vacant}
                            onChange={(e) =>
                              updateRoomType(
                                index,
                                "vacant",
                                parseInt(e.target.value) || 0
                              )
                            }
                            className={`w-full px-3 py-2 rounded border ${
                              errors[`vacant_${index}`]
                                ? "border-red-500"
                                : "border-[#a1cca5]/30"
                            } focus:outline-none focus:ring-1 focus:ring-[#a1cca5]`}
                            placeholder="Vacant rooms"
                            min="0"
                            max={room.total}
                          />
                          {errors[`vacant_${index}`] && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors[`vacant_${index}`]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addRoomType}
                    className="flex items-center text-[#1b4332] hover:text-[#a1cca5] transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Room Type
                  </button>
                </div>

                <div>
                  <label
                    htmlFor="image"
                    className="block text-sm font-medium text-[#1b4332] mb-2"
                  >
                    PG Image (Optional)
                  </label>
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-3 rounded-lg border border-[#a1cca5]/30 focus:outline-none focus:ring-2 focus:ring-[#a1cca5] focus:border-transparent"
                  />
                </div>
              </div>
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
              {isLoading ? "Adding PG..." : "Add PG/Hostel"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
