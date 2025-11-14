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

interface MenuItem {
  id: string;
  name: string;
  description: string;
  photo?: string;
  category: "breakfast" | "lunch" | "dinner" | "snacks";
}

interface MealSlot {
  id: string;
  menuItemId: string;
  date: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snacks";
  totalSlots: number;
  bookedSlots: number;
  ownerEmail: string;
  hostelName: string;
}

interface MealBooking {
  id: string;
  residentEmail: string;
  residentName: string;
  mealSlotId: string;
  bookedAt: string;
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
        {activeTab === "meals" && <MealPlanningTab user={user} />}
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
function MealPlanningTab({ user }: { user: any }) {
  const [availableMeals, setAvailableMeals] = useState<
    (MealSlot & { menuItem: MenuItem })[]
  >([]);
  const [myBookings, setMyBookings] = useState<
    (MealBooking & { mealSlot: MealSlot; menuItem: MenuItem })[]
  >([]);
  const [userHostel, setUserHostel] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is enrolled in any hostel
    const applications = JSON.parse(
      localStorage.getItem("roomApplications") || "[]"
    );
    const approvedApplication = applications.find(
      (app: RoomApplication) =>
        app.residentEmail === user.email && app.status === "approved"
    );

    if (!approvedApplication) {
      setUserHostel(null);
      return;
    }

    setUserHostel(approvedApplication.hostelName);

    // Get all meal slots for user's hostel only
    const allSlots = JSON.parse(localStorage.getItem("mealSlots") || "[]");
    const menuItems = JSON.parse(localStorage.getItem("menuItems") || "[]");

    // Filter future meals only for user's hostel
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const today = now.toISOString().split("T")[0];

    const futureMeals = allSlots.filter((slot: MealSlot) => {
      // Only show meals from user's hostel
      if (slot.hostelName !== approvedApplication.hostelName) {
        return false;
      }

      const slotDate = new Date(slot.date);
      const slotDay = slot.date;

      // If it's today, check if the meal time hasn't passed
      if (slotDay === today) {
        const mealTimes = {
          breakfast: 10 * 60, // 10:00 AM
          lunch: 14 * 60, // 2:00 PM
          snacks: 17 * 60, // 5:00 PM
          dinner: 21 * 60, // 9:00 PM
        };
        return currentTime < mealTimes[slot.mealType];
      }

      // For future dates, include all meals
      return slotDate > now;
    });

    // Add menu item details
    const mealsWithItems = futureMeals
      .map((slot: MealSlot) => ({
        ...slot,
        menuItem: menuItems.find(
          (item: MenuItem) => item.id === slot.menuItemId
        ),
      }))
      .filter((meal: MenuItem & { menuItem: MenuItem }) => meal.menuItem);

    setAvailableMeals(mealsWithItems);

    // Get my bookings for this hostel only
    const allBookings = JSON.parse(
      localStorage.getItem("mealBookings") || "[]"
    );
    const myMealBookings = allBookings.filter(
      (booking: MealBooking) => booking.residentEmail === user.email
    );

    const bookingsWithDetails = myMealBookings
      .map((booking: MealBooking) => {
        const mealSlot = allSlots.find(
          (slot: MealSlot) => slot.id === booking.mealSlotId
        );
        const menuItem = menuItems.find(
          (item: MenuItem) => item.id === mealSlot?.menuItemId
        );
        return {
          ...booking,
          mealSlot,
          menuItem,
        };
      })
      .filter(
        (booking: MealBooking & { mealSlot: MealSlot; menuItem: MenuItem }) =>
          booking.mealSlot &&
          booking.menuItem &&
          booking.mealSlot.hostelName === approvedApplication.hostelName
      );

    setMyBookings(bookingsWithDetails);
  }, [user.email]);

  // Show not enrolled message if user is not part of any hostel
  if (userHostel === null) {
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
            You are not a part of a hostel/PG yet
          </h3>
          <p className="text-gray-600">
            Please apply for a room and get approved to access meal planning.
          </p>
        </div>
      </div>
    );
  }

  const handleBookMeal = (mealSlot: MealSlot) => {
    // Check if already booked
    const alreadyBooked = myBookings.some(
      (booking) => booking.mealSlotId === mealSlot.id
    );
    if (alreadyBooked) {
      alert("You have already booked this meal!");
      return;
    }

    // Check if slots available
    if (mealSlot.bookedSlots >= mealSlot.totalSlots) {
      alert("No slots available for this meal!");
      return;
    }

    // Create booking
    const newBooking: MealBooking = {
      id: Date.now().toString(),
      residentEmail: user.email,
      residentName: user.name,
      mealSlotId: mealSlot.id,
      bookedAt: new Date().toISOString(),
    };

    // Update bookings
    const allBookings = JSON.parse(
      localStorage.getItem("mealBookings") || "[]"
    );
    allBookings.push(newBooking);
    localStorage.setItem("mealBookings", JSON.stringify(allBookings));

    // Update meal slot booked count
    const allSlots = JSON.parse(localStorage.getItem("mealSlots") || "[]");
    const updatedSlots = allSlots.map((slot: MealSlot) =>
      slot.id === mealSlot.id
        ? { ...slot, bookedSlots: slot.bookedSlots + 1 }
        : slot
    );
    localStorage.setItem("mealSlots", JSON.stringify(updatedSlots));

    // Refresh data
    window.location.reload();
  };

  const isBooked = (mealSlotId: string) => {
    return myBookings.some((booking) => booking.mealSlotId === mealSlotId);
  };

  const groupMealsByDate = (meals: typeof availableMeals) => {
    return meals.reduce((groups, meal) => {
      const date = meal.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(meal);
      return groups;
    }, {} as Record<string, typeof availableMeals>);
  };

  const groupedMeals = groupMealsByDate(availableMeals);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1b4332]">Meal Planning</h2>
        <div className="text-sm text-gray-600">
          Hostel:{" "}
          <span className="font-medium text-[#1b4332]">{userHostel}</span>
        </div>
      </div>

      {/* Available Meals */}
      <div>
        <h3 className="text-xl font-semibold text-[#1b4332] mb-4">
          Available Meals
        </h3>

        {Object.keys(groupedMeals).length === 0 ? (
          <div className="bg-white rounded-lg p-8 shadow-sm border border-[#a1cca5]/20 text-center">
            <Image
              src={Utensil}
              alt="Utensil"
              className="w-16 h-16 text-[#a1cca5] mx-auto mb-4"
            />
            <h3 className="text-lg font-semibold text-[#1b4332] mb-2">
              No Meals Available
            </h3>
            <p className="text-gray-600">No meals have been scheduled yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedMeals).map(([date, meals]) => (
              <div
                key={date}
                className="bg-white rounded-lg p-6 shadow-sm border border-[#a1cca5]/20"
              >
                <h4 className="text-lg font-semibold text-[#1b4332] mb-4">
                  {new Date(date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {meals.map((meal) => (
                    <div
                      key={meal.id}
                      className="border border-[#a1cca5]/20 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-medium text-[#1b4332] bg-[#a1cca5]/20 px-2 py-1 rounded-full capitalize">
                          {meal.mealType}
                        </span>
                        <span className="text-xs text-gray-500">
                          {meal.bookedSlots}/{meal.totalSlots}
                        </span>
                      </div>

                      <h5 className="font-semibold text-[#1b4332] mb-1">
                        {meal.menuItem.name}
                      </h5>
                      <p className="text-sm text-gray-600 mb-3">
                        {meal.menuItem.description}
                      </p>

                      {isBooked(meal.id) ? (
                        <button
                          disabled
                          className="w-full bg-green-100 text-green-800 py-2 rounded-lg font-medium cursor-not-allowed"
                        >
                          Booked ✓
                        </button>
                      ) : meal.bookedSlots >= meal.totalSlots ? (
                        <button
                          disabled
                          className="w-full bg-red-100 text-red-800 py-2 rounded-lg font-medium cursor-not-allowed"
                        >
                          Fully Booked
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBookMeal(meal)}
                          className="w-full bg-[#a1cca5] text-[#1b4332] py-2 rounded-lg font-medium hover:bg-[#a1cca5]/80 transition-colors"
                        >
                          Book Meal
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Bookings */}
      {myBookings.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-[#1b4332] mb-4">
            My Meal Bookings
          </h3>
          <div className="space-y-3">
            {myBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg p-4 shadow-sm border border-[#a1cca5]/20"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-[#1b4332]">
                      {booking.menuItem.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {booking.mealSlot.mealType}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(booking.mealSlot.date).toLocaleDateString()} •
                      Booked: {new Date(booking.bookedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Confirmed
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
