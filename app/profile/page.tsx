"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { getMockUsers } from "@/lib/cookie-utils";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, isLoading, login, logout } = useAuth();
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // Load all users for the demo
  useEffect(() => {
    setAllUsers(getMockUsers());
  }, []);

  // Handle user selection (for demo purposes)
  const handleSelectUser = (userId: string): void => {
    login(userId);
    // The redirect is handled in the login function
  };

  // Handle logout
  const handleLogout = (): void => {
    logout();
    // The redirect is handled in the logout function
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>

      {user ? (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                  <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    Current User
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium"
            >
              Sign Out
            </button>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-medium mb-3">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">User ID</p>
                <p className="font-medium">{user.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created At</p>
                <p className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Theme Preference</p>
                <p className="font-medium capitalize">
                  {user.preferences?.theme || "Default"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email Notifications</p>
                <p className="font-medium">
                  {user.preferences?.emailNotifications !== undefined
                    ? user.preferences.emailNotifications
                      ? "Enabled"
                      : "Disabled"
                    : "Not set"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={() => router.push(`/profile/${user.id}`)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium"
            >
              View Detailed Profile
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <p className="text-yellow-800">
            No user is currently logged in. Select a user below to continue.
          </p>
        </div>
      )}

      {/* User Selector (for demo purposes) */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium mb-4">Select User (Demo)</h3>
        <p className="text-sm text-gray-500 mb-4">
          Since this is a demo without a real authentication system, you can
          select a user to log in as.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {allUsers.map((mockUser) => (
            <div
              key={mockUser.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                user?.id === mockUser.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
              }`}
              onClick={() => handleSelectUser(mockUser.id)}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {mockUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="ml-3">
                  <p className="font-medium">{mockUser.name}</p>
                  <p className="text-xs text-gray-500">{mockUser.email}</p>
                  {user?.id === mockUser.id && (
                    <span className="inline-block px-2 py-0.5 text-xs rounded-full mt-1 bg-green-100 text-green-800">
                      Current
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
