"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Home, List, Plus } from "lucide-react";
import { Button } from "./ui/button";

const GlobalHeader: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  // Determine the current page
  const isHomePage = pathname === "/";
  const isTemplatesPage = pathname === "/template";
  const isTemplatePage =
    pathname.startsWith("/template/") && pathname !== "/template";
  const isCreatePage = pathname.startsWith("/create/");

  // Get the page title based on the current route
  const getPageTitle = () => {
    if (isHomePage) return "Email Template Builder";
    if (isTemplatesPage) return "Your Email Templates";
    if (isTemplatePage) return "Edit Template";
    if (isCreatePage) return "Create New Template";
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

            {/* Create new template button */}
            <Button
              onClick={() => {
                const newTemplateId = Date.now();
                router.push(`/create/${newTemplateId}`);
              }}
              className="ml-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm font-medium flex items-center gap-1 cursor-pointer"
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
