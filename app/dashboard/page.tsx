"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Home01, Tool01, LogOut01, User01 } from "@untitledui/icons";
import Utensil from "@/app/assets/utensils.svg";
import Image from "next/image";
import Link from "next/link";
import logo from "@/app/assets/logo.svg";

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

export default function ResidentDashboard() {
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
    if (userData.type !== "resident") {
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
              <Link href="/" className="flex items-center">
                <Image
                  src={logo}
                  alt="StaySync"
                  width={32}
                  height={32}
                  className="mr-2"
                />
                <h1 className="text-2xl font-bold text-[#1b4332]">StaySync</h1>
              </Link>
              <span className="ml-4 text-gray-600">Resident Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-[#1b4332]">
                <User01 className="w-5 h-5 mr-2" />
                <span className="font-medium">{user.name}</span>
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
              <Home01 className="w-5 h-5 inline mr-2" />
              Room Booking
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
                className="w-[32px] inline mr-2"
              />
              Meal Planning
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
        {activeTab === "rooms" && <RoomBookingTab user={user} />}
        {activeTab === "meals" && <MealPlanningTab />}
        {activeTab === "maintenance" && <MaintenanceTab user={user} />}
      </div>
    </div>
  );
}

// Room Booking Tab Component
function RoomBookingTab({ user }: { user: any }) {
  const [availableHostels, setAvailableHostels] = useState<any[]>([]);
  const [myApplications, setMyApplications] = useState<RoomApplication[]>([]);

  useEffect(() => {
    // Get all owners from localStorage
    const hostels: any[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("owner_")) {
        const ownerData = JSON.parse(localStorage.getItem(key) || "{}");
        if (ownerData.hostelCompleted && ownerData.hostel) {
          hostels.push({
            ...ownerData,
            ownerEmail: key.replace("owner_", ""),
          });
        }
      }
    }
    setAvailableHostels(hostels);

    // Get my applications
    const applications = JSON.parse(
      localStorage.getItem("roomApplications") || "[]"
    );
    const myApps = applications.filter(
      (app: RoomApplication) => app.residentEmail === user.email
    );
    setMyApplications(myApps);
  }, [user.email]);

  const handleApplyForRoom = (hostel: any, roomType: any) => {
    const applicationId = Date.now().toString();
    const newApplication: RoomApplication = {
      id: applicationId,
      residentEmail: user.email,
      residentName: user.name,
      ownerEmail: hostel.ownerEmail,
      hostelName: hostel.hostel.name,
      roomType: roomType.type,
      status: "pending",
      appliedDate: new Date().toISOString().split("T")[0],
    };

    const existingApplications = JSON.parse(
      localStorage.getItem("roomApplications") || "[]"
    );
    existingApplications.push(newApplication);
    localStorage.setItem(
      "roomApplications",
      JSON.stringify(existingApplications)
    );

    setMyApplications((prev) => [...prev, newApplication]);
    alert(`Applied for ${roomType.type} room at ${hostel.hostel.name}`);
  };

  const hasAppliedForRoom = (hostelName: string, roomType: string) => {
    return myApplications.some(
      (app) =>
        app.hostelName === hostelName &&
        app.roomType === roomType &&
        app.status === "pending"
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1b4332]">
          Available PGs/Hostels
        </h2>
      </div>

      {availableHostels.length === 0 ? (
        <div className="bg-white rounded-lg p-8 shadow-sm border border-[#a1cca5]/20 text-center">
          <Home01 className="w-16 h-16 text-[#a1cca5] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#1b4332] mb-2">
            No PGs Available
          </h3>
          <p className="text-gray-600">
            There are currently no PGs/Hostels available for booking.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {availableHostels.map((hostel, hostelIndex) => (
            <div
              key={hostelIndex}
              className="bg-white rounded-lg p-6 shadow-sm border border-[#a1cca5]/20"
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-[#1b4332]">
                  {hostel.hostel.name}
                </h3>
                <p className="text-gray-600">
                  {hostel.hostel.location} - {hostel.hostel.pincode}
                </p>
                <p className="text-sm text-gray-500">
                  Owner: {hostel.ownerName}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hostel.hostel.roomTypes.map(
                  (roomType: any, roomIndex: number) => (
                    <div
                      key={roomIndex}
                      className="border border-[#a1cca5]/20 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-[#1b4332]">
                            {roomType.type} Room
                          </h4>
                          <p className="text-sm text-gray-600">
                            Total: {roomType.total}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            roomType.vacant > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {roomType.vacant > 0
                            ? `${roomType.vacant} Available`
                            : "Full"}
                        </span>
                      </div>

                      {roomType.vacant > 0 ? (
                        hasAppliedForRoom(hostel.hostel.name, roomType.type) ? (
                          <button
                            disabled
                            className="w-full bg-gray-300 text-gray-500 py-2 rounded-lg font-medium cursor-not-allowed"
                          >
                            Application Pending
                          </button>
                        ) : (
                          <button
                            onClick={() => handleApplyForRoom(hostel, roomType)}
                            className="w-full bg-[#a1cca5] text-[#1b4332] py-2 rounded-lg font-medium hover:bg-[#a1cca5]/80 transition-colors"
                          >
                            Apply for Room
                          </button>
                        )
                      ) : (
                        <button
                          disabled
                          className="w-full bg-gray-300 text-gray-500 py-2 rounded-lg font-medium cursor-not-allowed"
                        >
                          No Vacancy
                        </button>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* My Applications */}
      {myApplications.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-[#1b4332] mb-4">
            My Applications
          </h3>
          <div className="space-y-3">
            {myApplications.map((application) => (
              <div
                key={application.id}
                className="bg-white rounded-lg p-4 shadow-sm border border-[#a1cca5]/20"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-[#1b4332]">
                      {application.hostelName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {application.roomType} Room
                    </p>
                    <p className="text-xs text-gray-500">
                      Applied: {application.appliedDate}
                    </p>
                  </div>
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
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Meal Planning Tab Component
function MealPlanningTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#1b4332]">Meal Planning</h2>
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
          Meal planning features will be available soon.
        </p>
      </div>
    </div>
  );
}

// Maintenance Tab Component
function MaintenanceTab({ user }: { user: any }) {
  const [myRequests, setMyRequests] = useState<MaintenanceRequest[]>([]);

  useEffect(() => {
    const requests = JSON.parse(
      localStorage.getItem("maintenanceRequests") || "[]"
    );
    const myReqs = requests.filter(
      (req: MaintenanceRequest) => req.residentEmail === user.email
    );
    setMyRequests(myReqs);
  }, [user.email]);

  const handleNewRequest = () => {
    // This would open a modal or navigate to a form
    alert("New maintenance request form would open here");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1b4332]">
          My Maintenance Requests
        </h2>
        <button
          onClick={handleNewRequest}
          className="bg-[#1b4332] text-white px-4 py-2 rounded-lg hover:bg-[#1b4332]/90 transition-colors"
        >
          New Request
        </button>
      </div>

      {myRequests.length === 0 ? (
        <div className="bg-white rounded-lg p-8 shadow-sm border border-[#a1cca5]/20 text-center">
          <Tool01 className="w-16 h-16 text-[#a1cca5] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#1b4332] mb-2">
            No Maintenance Requests
          </h3>
          <p className="text-gray-600">
            You haven't submitted any maintenance requests yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {myRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-lg p-6 shadow-sm border border-[#a1cca5]/20"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-[#1b4332]">
                    {request.type}
                  </h3>
                  <p className="text-gray-600 mt-1">{request.description}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Hostel: {request.hostelName}</p>
                    {request.roomNumber && <p>Room: {request.roomNumber}</p>}
                    <p>Submitted: {request.date}</p>
                  </div>
                </div>
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
