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
        {activeTab === "meals" && <MealManagementTab user={user} />}
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
function MealManagementTab({ user }: { user: any }) {
  const [activeView, setActiveView] = useState<"menu" | "schedule">("menu");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [mealSlots, setMealSlots] = useState<MealSlot[]>([]);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showScheduleMeal, setShowScheduleMeal] = useState(false);

  useEffect(() => {
    // Load menu items
    const items = JSON.parse(localStorage.getItem("menuItems") || "[]");
    setMenuItems(items);

    // Load meal slots for this owner
    const slots = JSON.parse(localStorage.getItem("mealSlots") || "[]");
    const mySlots = slots.filter(
      (slot: MealSlot) => slot.ownerEmail === user.email
    );
    setMealSlots(mySlots);
  }, [user.email]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1b4332]">Meal Management</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setActiveView("menu")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeView === "menu"
                ? "bg-[#1b4332] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Menu Items
          </button>
          <button
            onClick={() => setActiveView("schedule")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeView === "schedule"
                ? "bg-[#1b4332] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Schedule Meals
          </button>
        </div>
      </div>

      {activeView === "menu" && (
        <MenuItemsView
          menuItems={menuItems}
          setMenuItems={setMenuItems}
          showAddItem={showAddItem}
          setShowAddItem={setShowAddItem}
        />
      )}

      {activeView === "schedule" && (
        <ScheduleMealsView
          menuItems={menuItems}
          mealSlots={mealSlots}
          setMealSlots={setMealSlots}
          user={user}
          showScheduleMeal={showScheduleMeal}
          setShowScheduleMeal={setShowScheduleMeal}
        />
      )}
    </div>
  );
}

// Menu Items View Component
function MenuItemsView({
  menuItems,
  setMenuItems,
  showAddItem,
  setShowAddItem,
}: {
  menuItems: MenuItem[];
  setMenuItems: (items: MenuItem[]) => void;
  showAddItem: boolean;
  setShowAddItem: (show: boolean) => void;
}) {
  const defaultItems: MenuItem[] = [
    {
      id: "1",
      name: "Aloo Paratha",
      description: "Stuffed potato flatbread with butter",
      category: "breakfast",
    },
    {
      id: "2",
      name: "Poha",
      description: "Flattened rice with vegetables and spices",
      category: "breakfast",
    },
    {
      id: "3",
      name: "Dal Rice",
      description: "Lentil curry with steamed rice",
      category: "lunch",
    },
    {
      id: "4",
      name: "Rajma Chawal",
      description: "Kidney bean curry with rice",
      category: "lunch",
    },
    {
      id: "5",
      name: "Roti Sabzi",
      description: "Indian bread with vegetable curry",
      category: "dinner",
    },
    {
      id: "6",
      name: "Samosa",
      description: "Crispy fried pastry with spiced filling",
      category: "snacks",
    },
  ];

  useEffect(() => {
    if (menuItems.length === 0) {
      setMenuItems(defaultItems);
      localStorage.setItem("menuItems", JSON.stringify(defaultItems));
    }
  }, []);

  const handleAddItem = (newItem: Omit<MenuItem, "id">) => {
    const item: MenuItem = {
      ...newItem,
      id: Date.now().toString(),
    };
    const updatedItems = [...menuItems, item];
    setMenuItems(updatedItems);
    localStorage.setItem("menuItems", JSON.stringify(updatedItems));
    setShowAddItem(false);
  };

  const categories = ["breakfast", "lunch", "dinner", "snacks"] as const;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-[#1b4332]">Menu Items</h3>
        <button
          onClick={() => setShowAddItem(true)}
          className="bg-[#1b4332] text-white px-4 py-2 rounded-lg hover:bg-[#1b4332]/90 transition-colors"
        >
          <Plus className="w-4 h-4 inline mr-2" />
          Add Item
        </button>
      </div>

      {categories.map((category) => (
        <div
          key={category}
          className="bg-white rounded-lg p-6 shadow-sm border border-[#a1cca5]/20"
        >
          <h4 className="text-lg font-semibold text-[#1b4332] mb-4 capitalize">
            {category}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menuItems
              .filter((item) => item.category === category)
              .map((item) => (
                <div
                  key={item.id}
                  className="border border-[#a1cca5]/20 rounded-lg p-4"
                >
                  <h5 className="font-medium text-[#1b4332]">{item.name}</h5>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.description}
                  </p>
                </div>
              ))}
          </div>
        </div>
      ))}

      {showAddItem && (
        <AddMenuItemModal
          onAdd={handleAddItem}
          onClose={() => setShowAddItem(false)}
        />
      )}
    </div>
  );
}

// Add Menu Item Modal
function AddMenuItemModal({
  onAdd,
  onClose,
}: {
  onAdd: (item: Omit<MenuItem, "id">) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "breakfast" as MenuItem["category"],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.description.trim()) {
      onAdd(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-[#1b4332] mb-4">
          Add Menu Item
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1b4332] mb-2">
              Item Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-[#a1cca5]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a1cca5]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1b4332] mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-[#a1cca5]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a1cca5]"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1b4332] mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as MenuItem["category"],
                })
              }
              className="w-full px-3 py-2 border border-[#a1cca5]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a1cca5]"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snacks">Snacks</option>
            </select>
          </div>
          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-[#1b4332] text-white py-2 rounded-lg hover:bg-[#1b4332]/90 transition-colors"
            >
              Add Item
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Schedule Meals View Component
function ScheduleMealsView({
  menuItems,
  mealSlots,
  setMealSlots,
  user,
  showScheduleMeal,
  setShowScheduleMeal,
}: {
  menuItems: MenuItem[];
  mealSlots: MealSlot[];
  setMealSlots: (slots: MealSlot[]) => void;
  user: any;
  showScheduleMeal: boolean;
  setShowScheduleMeal: (show: boolean) => void;
}) {
  const handleScheduleMeal = (
    mealData: Omit<MealSlot, "id" | "bookedSlots" | "ownerEmail" | "hostelName">
  ) => {
    const newSlot: MealSlot = {
      ...mealData,
      id: Date.now().toString(),
      bookedSlots: 0,
      ownerEmail: user.email,
      hostelName: user.hostel?.name || "Unknown Hostel",
    };

    const allSlots = JSON.parse(localStorage.getItem("mealSlots") || "[]");
    allSlots.push(newSlot);
    localStorage.setItem("mealSlots", JSON.stringify(allSlots));

    const updatedMySlots = [...mealSlots, newSlot];
    setMealSlots(updatedMySlots);
    setShowScheduleMeal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-[#1b4332]">
          Scheduled Meals
        </h3>
        <button
          onClick={() => setShowScheduleMeal(true)}
          className="bg-[#1b4332] text-white px-4 py-2 rounded-lg hover:bg-[#1b4332]/90 transition-colors"
        >
          <Plus className="w-4 h-4 inline mr-2" />
          Schedule Meal
        </button>
      </div>

      {mealSlots.length === 0 ? (
        <div className="bg-white rounded-lg p-8 shadow-sm border border-[#a1cca5]/20 text-center">
          <Image
            src={Utensil}
            alt="Utensil"
            className="w-16 h-16 text-[#a1cca5] mx-auto mb-4"
          />
          <h3 className="text-lg font-semibold text-[#1b4332] mb-2">
            No Meals Scheduled
          </h3>
          <p className="text-gray-600">Schedule meals for your residents.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {mealSlots.map((slot) => {
            const menuItem = menuItems.find(
              (item) => item.id === slot.menuItemId
            );
            return (
              <div
                key={slot.id}
                className="bg-white rounded-lg p-6 shadow-sm border border-[#a1cca5]/20"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-semibold text-[#1b4332]">
                      {menuItem?.name || "Unknown Item"}
                    </h4>
                    <p className="text-gray-600">{menuItem?.description}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>Date: {slot.date}</p>
                      <p>Meal Type: {slot.mealType}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-semibold text-[#1b4332]">
                      {slot.bookedSlots}/{slot.totalSlots}
                    </span>
                    <p className="text-sm text-gray-600">Booked/Total</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showScheduleMeal && (
        <ScheduleMealModal
          menuItems={menuItems}
          onSchedule={handleScheduleMeal}
          onClose={() => setShowScheduleMeal(false)}
        />
      )}
    </div>
  );
}

// Schedule Meal Modal
function ScheduleMealModal({
  menuItems,
  onSchedule,
  onClose,
}: {
  menuItems: MenuItem[];
  onSchedule: (
    meal: Omit<MealSlot, "id" | "bookedSlots" | "ownerEmail" | "hostelName">
  ) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    menuItemId: "",
    date: "",
    mealType: "breakfast" as MealSlot["mealType"],
    totalSlots: 10,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.menuItemId && formData.date && formData.totalSlots > 0) {
      onSchedule(formData);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-[#1b4332] mb-4">
          Schedule Meal
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1b4332] mb-2">
              Menu Item
            </label>
            <select
              value={formData.menuItemId}
              onChange={(e) =>
                setFormData({ ...formData, menuItemId: e.target.value })
              }
              className="w-full px-3 py-2 border border-[#a1cca5]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a1cca5]"
              required
            >
              <option value="">Select an item</option>
              {menuItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.category})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1b4332] mb-2">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              min={today}
              className="w-full px-3 py-2 border border-[#a1cca5]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a1cca5]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1b4332] mb-2">
              Meal Type
            </label>
            <select
              value={formData.mealType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  mealType: e.target.value as MealSlot["mealType"],
                })
              }
              className="w-full px-3 py-2 border border-[#a1cca5]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a1cca5]"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snacks">Snacks</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1b4332] mb-2">
              Total Slots
            </label>
            <input
              type="number"
              value={formData.totalSlots}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  totalSlots: parseInt(e.target.value) || 0,
                })
              }
              min="1"
              className="w-full px-3 py-2 border border-[#a1cca5]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a1cca5]"
              required
            />
          </div>
          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-[#1b4332] text-white py-2 rounded-lg hover:bg-[#1b4332]/90 transition-colors"
            >
              Schedule
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
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
