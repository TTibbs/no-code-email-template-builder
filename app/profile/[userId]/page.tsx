"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { User } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { getMockUserById } from "@/lib/cookie-utils";
import { useAuth } from "@/contexts/AuthContext";

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user: currentUser, login, logout } = useAuth();
  const userId = params.userId as string;

  const [user, setUser] = useState<User | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load user data based on the userId parameter
  useEffect(() => {
    if (userId) {
      const userData = getMockUserById(userId);

      if (userData) {
        setUser(userData);
      } else {
        toast({
          title: "Error",
          description: "User not found",
          variant: "destructive",
        });
        router.push("/profile");
      }
    }

    setIsLoading(false);
  }, [userId, router, toast]);

  // Switch to this user
  const handleSwitchToUser = (): void => {
    if (user) {
      login(user.id);
    }
  };

  // Handle logout
  const handleLogout = (): void => {
    logout();
  };

  // Go back to the main profile page
  const handleBackToProfiles = (): void => {
    router.push("/profile");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            User not found. The requested user does not exist.
          </p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleBackToProfiles}
          >
            Back to Profiles
          </button>
        </div>
      </div>
    );
  }

  const isCurrentUser = currentUser?.id === user.id;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">User Profile: {user.name}</h1>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium"
            onClick={handleBackToProfiles}
          >
            Back to Profiles
          </button>

          {isCurrentUser ? (
            <button
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium"
              onClick={handleLogout}
            >
              Sign Out
            </button>
          ) : (
            <button
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium"
              onClick={handleSwitchToUser}
            >
              Switch to This User
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div className="ml-6">
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <span className="inline-block px-3 py-1 text-sm rounded-full mt-2 bg-blue-100 text-blue-800">
              {user.role}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-xl font-medium mb-4">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">User ID</p>
              <p className="font-medium">{user.id}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Created At</p>
              <p className="font-medium">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Theme Preference</p>
              <p className="font-medium capitalize">
                {user.preferences?.theme || "Default"}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
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

        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-xl font-medium mb-4">Email Templates</h3>
          <p className="text-gray-500">
            This section would display templates created by this user when
            connected to a real database.
          </p>
        </div>
      </div>
    </div>
  );
}
