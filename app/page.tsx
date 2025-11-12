import { User01, Building01 } from "@untitledui/icons";
import Link from "next/link";
import Image from "next/image";
import logo from "@/app/assets/logo.svg";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block mb-6">
            <Image
              src={logo}
              alt="StaySync Logo"
              width={120}
              height={120}
              className="mx-auto hover:scale-105 transition-transform"
            />
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1b4332] mb-4">
            StaySync
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Smart Hostel & PG Management System for seamless room booking, meal
            planning, and maintenance tracking
          </p>
        </div>

        {/* Login Options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Tenant Login */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#a1cca5]/20 hover:shadow-md transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#a1cca5] rounded-full flex items-center justify-center mx-auto mb-6">
                <User01 className="w-8 h-8 text-[#1b4332]" />
              </div>
              <h2 className="text-2xl font-semibold text-[#1b4332] mb-3">
                I'm a Resident
              </h2>
              <p className="text-gray-600 mb-6">
                Book rooms, order meals, and submit maintenance requests
              </p>
              <Link href="/login/resident">
                <button className="w-full bg-[#1b4332] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#1b4332]/90 transition-colors">
                  Login as Resident
                </button>
              </Link>
            </div>
          </div>

          {/* Owner Login */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#a1cca5]/20 hover:shadow-md transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#a1cca5] rounded-full flex items-center justify-center mx-auto mb-6">
                <Building01 className="w-8 h-8 text-[#1b4332]" />
              </div>
              <h2 className="text-2xl font-semibold text-[#1b4332] mb-3">
                I'm an Owner
              </h2>
              <p className="text-gray-600 mb-6">
                Manage properties, allocate rooms, and track operations
              </p>
              <Link href="/login/owner">
                <button className="w-full bg-[#1b4332] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#1b4332]/90 transition-colors">
                  Login as Owner
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
