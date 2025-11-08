"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building01, Tool01, LogOut01, User01, Plus } from "@untitledui/icons";
import Utensil from "@/app/assets/utensils.svg";
import Image from "next/image";

type TabType = "rooms" | "meals" | "maintenance";

interface RoomApplication {
  id: string;
  residentEmail: string;
  residentName: string;
  ownerEmail: string;
  hostelName: string;
  roomType: string;
  status: "pending" | "approved" | "rejected";
  appliedDate: string;
}

interface MaintenanceRequest {
  id: string;
  residentEmail: string;
  residentName: string;
  ownerEmail: string;
  hostelName: string;
  roomNumber?: string;
  type: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  date: string;
}

export default function OwnerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("rooms");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      router.push("/");
      return;
    }

    const userData = JSON.parse(currentUser);
    if (userData.type !== "owner") {
      router.push("/");
      return;
    }

    setUser(userData);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    router.push("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-[#a1cca5]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-[#1b4332]">StaySync</h1>
              <span className="ml-4 text-gray-600">Owner Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-[#1b4332]">
                <Building01 className="w-5 h-5 mr-2" />
                <span className="font-medium">
                  {user.hostel?.name || user.ownerName}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-[#1b4332] transition-colors"
              >
                <LogOut01 className="w-5 h-5 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-[#a1cca5]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("rooms")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "rooms"
                  ? "border-[#1b4332] text-[#1b4332]"
                  : "border-transparent text-gray-500 hover:text-[#1b4332] hover:border-[#a1cca5]"
              }`}
            >
              <Building01 className="w-5 h-5 inline mr-2" />
              Room Management
            </button>
            <button
              onClick={() => setActiveTab("meals")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "meals"
                  ? "border-[#1b4332] text-[#1b4332]"
                  : "border-transparent text-gray-500 hover:text-[#1b4332] hover:border-[#a1cca5]"
              }`}
            >
              <Image
                src={Utensil}
                alt="Utensil"
                className="w-5 h-5 inline mr-2"
              />
              Meal Management
            </button>
            <button
              onClick={() => setActiveTab("maintenance")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "maintenance"
                  ? "border-[#1b4332] text-[#1b4332]"
                  : "border-transparent text-gray-500 hover:text-[#1b4332] hover:border-[#a1cca5]"
              }`}
            >
              <Tool01 className="w-5 h-5 inline mr-2" />
              Maintenance
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "rooms" && <RoomManagementTab user={user} />}
        {activeTab === "meals" && <MealManagementTab />}
        {activeTab === "maintenance" && (
          <MaintenanceManagementTab user={user} />
        )}
      </div>
    </div>
  );
}

// Room Management Tab Component
function RoomManagementTab({ user }: { user: any }) {
  const [roomApplications, setRoomApplications] = useState<RoomApplication[]>(
    []
  );

  useEffect(() => {
    const applications = JSON.parse(
      localStorage.getItem("roomApplications") || "[]"
    );
    const myApplications = applications.filter(
      (app: RoomApplication) => app.ownerEmail === user.email
    );
    setRoomApplications(myApplications);
  }, [user.email]);

  const handleApproveApplication = (applicationId: string) => {
    const applications = JSON.parse(
      localStorage.getItem("roomApplications") || "[]"
    );
    const updatedApplications = applications.map((app: RoomApplication) =>
      app.id === applicationId ? { ...app, status: "approved" } : app
    );
    localStorage.setItem(
      "roomApplications",
      JSON.stringify(updatedApplications)
    );

    setRoomApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId ? { ...app, status: "approved" } : app
      )
    );
  };

  const handleRejectApplication = (applicationId: string) => {
    const applications = JSON.parse(
      localStorage.getItem("roomApplications") || "[]"
    );
    const updatedApplications = applications.map((app: RoomApplication) =>
      app.id === applicationId ? { ...app, status: "rejected" } : app
    );
    localStorage.setItem(
      "roomApplications",
      JSON.stringify(updatedApplications)
    );

    setRoomApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId ? { ...app, status: "rejected" } : app
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Room Statistics */}
      {user.hostel?.roomTypes && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {user.hostel.roomTypes.map((roomType: any, index: number) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-sm border border-[#a1cca5]/20"
            >
              <h3 className="text-lg font-semibold text-[#1b4332] mb-2">
                {roomType.type} Rooms
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-medium">{roomType.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vacant:</span>
                  <span className="font-medium text-green-600">
                    {roomType.vacant}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Occupied:</span>
                  <span className="font-medium text-blue-600">
                    {roomType.total - roomType.vacant}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Room Applications */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#1b4332]">
            Room Applications
          </h2>
          <button className="bg-[#1b4332] text-white px-4 py-2 rounded-lg hover:bg-[#1b4332]/90 transition-colors">
            <Plus className="w-4 h-4 inline mr-2" />
            Assign Room
          </button>
        </div>

        {roomApplications.length === 0 ? (
          <div className="bg-white rounded-lg p-8 shadow-sm border border-[#a1cca5]/20 text-center">
            <Building01 className="w-16 h-16 text-[#a1cca5] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#1b4332] mb-2">
              No Applications
            </h3>
            <p className="text-gray-600">
              No room applications have been submitted yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {roomApplications.map((application) => (
              <div
                key={application.id}
                className="bg-white rounded-lg p-6 shadow-sm border border-[#a1cca5]/20"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#1b4332]">
                      {application.residentName}
                    </h3>
                    <p className="text-gray-600">{application.residentEmail}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600">
                        Room Type:{" "}
                        <span className="font-medium">
                          {application.roomType}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Applied: {application.appliedDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        application.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : application.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {application.status.toUpperCase()}
                    </span>
                    {application.status === "pending" && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            handleApproveApplication(application.id)
                          }
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleRejectApplication(application.id)
                          }
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Meal Management Tab Component
function MealManagementTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#1b4332]">Meal Management</h2>
      <div className="bg-white rounded-lg p-8 shadow-sm border border-[#a1cca5]/20 text-center">
        <Image
          src={Utensil}
          alt="Utensil"
          className="w-16 h-16 text-[#a1cca5] mx-auto mb-4"
        />
        <h3 className="text-lg font-semibold text-[#1b4332] mb-2">
          Coming Soon
        </h3>
        <p className="text-gray-600">
          Meal management features will be available soon.
        </p>
      </div>
    </div>
  );
}

// Maintenance Management Tab Component
function MaintenanceManagementTab({ user }: { user: any }) {
  const [maintenanceRequests, setMaintenanceRequests] = useState<
    MaintenanceRequest[]
  >([]);

  useEffect(() => {
    const requests = JSON.parse(
      localStorage.getItem("maintenanceRequests") || "[]"
    );
    const myRequests = requests.filter(
      (req: MaintenanceRequest) => req.ownerEmail === user.email
    );
    setMaintenanceRequests(myRequests);
  }, [user.email]);

  const handleUpdateStatus = (requestId: string, newStatus: string) => {
    const requests = JSON.parse(
      localStorage.getItem("maintenanceRequests") || "[]"
    );
    const updatedRequests = requests.map((req: MaintenanceRequest) =>
      req.id === requestId ? { ...req, status: newStatus } : req
    );
    localStorage.setItem(
      "maintenanceRequests",
      JSON.stringify(updatedRequests)
    );

    setMaintenanceRequests((prev) =>
      prev.map((request) =>
        request.id === requestId
          ? {
              ...request,
              status: newStatus as "pending" | "in-progress" | "completed",
            }
          : request
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1b4332]">
          Maintenance Requests
        </h2>
        <button className="bg-[#1b4332] text-white px-4 py-2 rounded-lg hover:bg-[#1b4332]/90 transition-colors">
          Generate Report
        </button>
      </div>

      {maintenanceRequests.length === 0 ? (
        <div className="bg-white rounded-lg p-8 shadow-sm border border-[#a1cca5]/20 text-center">
          <Tool01 className="w-16 h-16 text-[#a1cca5] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#1b4332] mb-2">
            No Maintenance Requests
          </h3>
          <p className="text-gray-600">
            No maintenance requests have been submitted yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {maintenanceRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-lg p-6 shadow-sm border border-[#a1cca5]/20"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="text-lg font-semibold text-[#1b4332]">
                      {request.type}
                    </h3>
                    {request.roomNumber && (
                      <span className="text-sm text-gray-600">
                        Room {request.roomNumber}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-2">{request.description}</p>
                  <div className="text-sm text-gray-500">
                    <p>Resident: {request.residentName}</p>
                    <p>Submitted: {request.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      request.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : request.status === "in-progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {request.status.replace("-", " ").toUpperCase()}
                  </span>
                  <select
                    value={request.status}
                    onChange={(e) =>
                      handleUpdateStatus(request.id, e.target.value)
                    }
                    className="border border-[#a1cca5]/30 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#a1cca5]"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
