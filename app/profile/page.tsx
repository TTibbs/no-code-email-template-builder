"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Github } from "lucide-react";
import FallingText from "@/components/ui/FallingText";
import { Button } from "@/components/ui/button";
import { LinkPreview } from "@/components/ui/link-preview";

export default function ProfilePage() {
  return (
    <main className="bg-zinc-800 min-h-screen font-sans">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-zinc-100 to-zinc-200 p-8 md:p-16 rounded-bl-4xl rounded-br-4xl flex flex-col items-center justify-center h-[35vh] md:h-[40vh] relative overflow-hidden shadow-xl">
        <FallingText
          text="Profile System Coming Soon! This feature will be implemented based on user demand."
          highlightWords={[
            "Profile",
            "System",
            "Coming",
            "Soon",
            "implemented",
            "user",
            "demand",
          ]}
          trigger="click"
          backgroundColor="transparent"
          wireframes={false}
          gravity={0.3}
          fontSize="1.8rem"
          mouseConstraintStiffness={0.3}
        />
      </section>

      {/* Main Content */}
      <section className="px-4 md:px-16 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-zinc-900 p-10 rounded-xl border border-zinc-700 text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Profile System Not Yet Implemented
            </h2>
            <p className="text-zinc-400 mb-8 max-w-md mx-auto">
              We're focusing on core email template functionality first. If
              you'd like to see a profile system with user authentication and
              backend storage, please let us know on GitHub.
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link
                href="https://github.com/TTibbs/no-code-email-template-builder/issues"
                target="_blank"
              >
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg shadow-md transition-colors flex items-center justify-center cursor-pointer">
                  <Github size={18} className="mr-2" />
                  Request on GitHub
                </Button>
              </Link>

              <Link href="/templates/gallery">
                <Button
                  variant="outline"
                  className="bg-zinc-600 text-zinc-100 hover:bg-zinc-700 hover:text-zinc-200 px-6 py-3 rounded-lg shadow-md transition-colors flex items-center justify-center cursor-pointer"
                >
                  <ArrowRight size={18} className="mr-2" />
                  Browse Templates
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-zinc-900 p-8 rounded-xl border border-zinc-700">
            <h3 className="text-xl font-bold text-white mb-4">
              What Would You Like to See?
            </h3>
            <p className="text-zinc-400 mb-6">
              We're considering adding the following features to the profile
              system:
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <div className="bg-zinc-800 p-2 rounded-full mr-3 mt-1">
                  <ArrowRight size={14} className="text-emerald-400" />
                </div>
                <span className="text-zinc-300">
                  User authentication with email/password or OAuth
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-zinc-800 p-2 rounded-full mr-3 mt-1">
                  <ArrowRight size={14} className="text-emerald-400" />
                </div>
                <span className="text-zinc-300">
                  Saved templates library with cloud storage
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-zinc-800 p-2 rounded-full mr-3 mt-1">
                  <ArrowRight size={14} className="text-emerald-400" />
                </div>
                <span className="text-zinc-300">
                  Team collaboration features
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-zinc-800 p-2 rounded-full mr-3 mt-1">
                  <ArrowRight size={14} className="text-emerald-400" />
                </div>
                <span className="text-zinc-300">
                  Usage analytics and template performance metrics
                </span>
              </li>
            </ul>

            <div className="mt-6 text-center">
              <span className="block text-base text-zinc-400">
                Have other ideas? Let us know on{" "}
                <LinkPreview
                  url="https://github.com/TTibbs/no-code-email-template-builder/issues"
                  className="text-emerald-500"
                >
                  GitHub
                </LinkPreview>
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
