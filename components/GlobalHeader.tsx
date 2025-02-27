"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Home, List, Plus, User, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";

const GlobalHeader: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  // Determine the current page
  const isHomePage = pathname === "/";
  const isTemplatesPage = pathname === "/templates";
  const isTemplatePage =
    pathname.startsWith("/templates/") && pathname !== "/templates";
  const isCreatePage = pathname.startsWith("/create/");
  const isProfilePage = pathname.startsWith("/profile");

  // Get the page title based on the current route
  const getPageTitle = () => {
    if (isHomePage) return "Email Template Builder";
    if (isTemplatesPage) return "Your Email Templates";
    if (isTemplatePage) return "Edit Template";
    if (isCreatePage) return "Create New Template";
    if (isProfilePage) return "User Profile";
    return "Email Template Builder";
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              {getPageTitle()}
            </h1>
            {user && (
              <span className="ml-2 text-sm text-gray-500">
                Logged in as {user.name}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Home button */}
            <Button
              onClick={() => router.push("/")}
              className="p-2 rounded-md bg-white text-zinc-800 hover:bg-zinc-200 cursor-pointer"
              title="Home"
            >
              <Home size={20} />
            </Button>

            {/* Templates button */}
            <Button
              onClick={() => router.push("/templates")}
              className="p-2 rounded-md bg-white text-zinc-800 hover:bg-zinc-200 cursor-pointer"
              title="Templates"
            >
              <List size={20} />
            </Button>

            {/* Profile button */}
            <Button
              onClick={() => router.push("/profile")}
              className="p-2 rounded-md bg-white text-zinc-800 hover:bg-zinc-200 cursor-pointer"
              title={user ? `Profile: ${user.name}` : "Profile"}
            >
              <User size={20} />
              {user && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white"></span>
              )}
            </Button>

            {/* Logout button (only shown when user is logged in) */}
            {user && (
              <Button
                onClick={logout}
                className="p-2 rounded-md bg-white text-zinc-800 hover:bg-zinc-200 cursor-pointer"
                title="Logout"
              >
                <LogOut size={20} />
              </Button>
            )}

            {/* Create new template button */}
            <Button
              onClick={() => {
                const newTemplateId = Date.now();
                router.push(`/create/${newTemplateId}`);
              }}
              className={`ml-2 px-4 py-2 ${
                isCreatePage
                  ? "bg-emerald-700 hover:bg-emerald-800"
                  : "bg-emerald-600 hover:bg-emerald-700"
              } text-white rounded-md text-sm font-medium flex items-center gap-1 cursor-pointer`}
              title="Create New Template"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">New Template</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default GlobalHeader;
