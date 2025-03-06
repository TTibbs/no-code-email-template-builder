"use client";

import { EvervaultCard } from "@/components/ui/evervault-card";
import FallingText from "@/components/ui/FallingText";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Simulate loading state
  useEffect(() => {
    // Simulate a network request or data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-zinc-800 min-h-screen font-sans">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="bg-gradient-to-r from-zinc-200 to-zinc-300 p-8 md:p-16 rounded-bl-4xl rounded-br-4xl flex flex-col items-center justify-center h-[50vh] relative overflow-hidden">
            <div className="h-8 w-3/4 bg-zinc-400 rounded mb-4 max-w-3xl"></div>
            <div className="h-8 w-2/3 bg-zinc-400 rounded mb-4 max-w-2xl"></div>
            <div className="h-8 w-1/2 bg-zinc-400 rounded mb-8 max-w-xl"></div>
            <div className="h-12 w-48 bg-zinc-500 rounded-lg"></div>
          </div>

          {/* Email Creation Process skeleton */}
          <div className="px-4 md:px-16 py-16 bg-zinc-800">
            <div className="max-w-6xl mx-auto">
              <div className="h-10 w-64 bg-zinc-700 rounded mb-4 mx-auto"></div>
              <div className="w-24 h-1 bg-zinc-600 mb-12 mx-auto rounded-full"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="bg-zinc-900 rounded-xl overflow-hidden h-64"></div>
                <div>
                  <div className="h-8 w-3/4 bg-zinc-700 rounded mb-4"></div>
                  <div className="h-4 w-full bg-zinc-700 rounded mb-2"></div>
                  <div className="h-4 w-full bg-zinc-700 rounded mb-2"></div>
                  <div className="h-4 w-2/3 bg-zinc-700 rounded mb-4"></div>
                </div>

                <div>
                  <div className="h-8 w-3/4 bg-zinc-700 rounded mb-4"></div>
                  <div className="h-4 w-full bg-zinc-700 rounded mb-2"></div>
                  <div className="h-4 w-full bg-zinc-700 rounded mb-2"></div>
                  <div className="h-4 w-2/3 bg-zinc-700 rounded mb-4"></div>
                </div>
                <div className="bg-zinc-900 rounded-xl overflow-hidden h-64"></div>

                <div className="bg-zinc-900 rounded-xl overflow-hidden h-64"></div>
                <div>
                  <div className="h-8 w-3/4 bg-zinc-700 rounded mb-4"></div>
                  <div className="h-4 w-full bg-zinc-700 rounded mb-2"></div>
                  <div className="h-4 w-full bg-zinc-700 rounded mb-2"></div>
                  <div className="h-4 w-2/3 bg-zinc-700 rounded mb-4"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Features skeleton */}
          <div className="px-4 md:px-16 py-16 bg-zinc-900">
            <div className="max-w-6xl mx-auto">
              <div className="h-10 w-48 bg-zinc-700 rounded mb-4 mx-auto"></div>
              <div className="w-24 h-1 bg-zinc-700 mb-12 mx-auto rounded-full"></div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-zinc-800 p-6 rounded-xl border border-zinc-700 h-96"
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA skeleton */}
          <div className="bg-zinc-700 p-12 md:p-16 flex flex-col items-center">
            <div className="h-10 w-96 bg-zinc-600 rounded mb-6 mx-auto"></div>
            <div className="h-4 w-2/3 bg-zinc-600 rounded mb-8 mx-auto"></div>
            <div className="h-12 w-48 bg-zinc-500 rounded-lg mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-zinc-800 min-h-screen font-sans">
      <section className="bg-gradient-to-r from-zinc-100 to-zinc-200 p-8 md:p-16 rounded-bl-4xl rounded-br-4xl flex flex-col items-center justify-center h-[50vh] relative overflow-hidden shadow-xl">
        <FallingText
          text={`Welcome to the No-Code Email Template Builder. Build your email templates in minutes. Test and preview them to ensure they look great on all devices.`}
          highlightWords={[
            "No-Code",
            "Email",
            "Template",
            "Builder",
            "minutes",
            "Test",
            "preview",
            "devices",
          ]}
          trigger="click"
          backgroundColor="transparent"
          wireframes={false}
          gravity={0.3}
          fontSize="1.8rem"
          mouseConstraintStiffness={0.3}
        />

        <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            href="/templates/gallery"
            className="bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-emerald-700 transition-colors flex items-center justify-center"
          >
            Browse Templates <ArrowRight className="ml-2" size={16} />
          </Link>
        </div>

        <div className="mt-4 flex items-center">
          <span className="text-zinc-700 font-medium">
            Free, Simple, and Powerful Email Template Builder
          </span>
        </div>
      </section>

      <section className="px-4 md:px-16 py-16 bg-zinc-800" id="how-it-works">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
            The Email Creation Process
          </h2>
          <div className="w-24 h-1 bg-emerald-500 mb-12 mx-auto rounded-full"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <Image
              src="https://dxgjph0nw8.ufs.sh/f/fuQKGtDZvoF0YDw9NOt3m4gcCRZTw0PSxMEuVtGW67lhf1Op"
              alt="Template Selection"
              width={500}
              height={500}
            />
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                1. Choose Your Starting Point
              </h3>
              <p className="text-zinc-300 mb-6">
                Begin with a blank canvas or select from our library of
                professionally designed templates. Each template is fully
                customizable to match your brand's unique style and messaging
                needs.
              </p>
              <div className="flex items-center text-emerald-400">
                <ArrowRight className="mr-2" size={16} />
                <span className="font-medium">
                  Browse our template gallery to get started
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                2. Customize Your Design
              </h3>
              <p className="text-zinc-300 mb-6">
                Our intuitive editor makes it easy to personalize every aspect
                of your email. Add your content, change colors, adjust layouts,
                and incorporate your brand elements with simple drag-and-drop
                functionality.
              </p>
              <div className="flex items-center text-emerald-400">
                <ArrowRight className="mr-2" size={16} />
                <span className="font-medium">
                  No coding required - just point and click
                </span>
              </div>
            </div>
            <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-2xl">
              {/* Image placeholder - replace with your actual image */}
              <div className="bg-zinc-700 h-64 w-full flex items-center justify-center">
                <span className="text-zinc-400 text-lg">Coming Soon</span>
              </div>
            </div>

            <Image
              src="https://dxgjph0nw8.ufs.sh/f/fuQKGtDZvoF0rcP4tJTjW6q39X1vse2Sn5KCiHbltBoxFgfZ"
              alt="Template Selection"
              width={500}
              height={500}
            />
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                3. Test and Perfect
              </h3>
              <p className="text-zinc-300 mb-6">
                Preview how your email will appear across different devices and
                email clients. Send test emails to yourself or team members to
                ensure everything looks perfect before launching your campaign.
              </p>
              <div className="flex items-center text-emerald-400">
                <ArrowRight className="mr-2" size={16} />
                <span className="font-medium">
                  Ensure flawless delivery on any device
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-16 py-16 bg-zinc-900" id="features">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
            Features
          </h2>
          <div className="w-24 h-1 bg-emerald-500 mb-12 mx-auto rounded-full"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-zinc-800 p-6 rounded-xl border border-zinc-700 hover:border-zinc-500 transition-all duration-300 flex flex-col">
              <div className="flex flex-col items-center mx-auto relative h-72 w-full mb-4">
                <EvervaultCard text="Drag & Drop" />
              </div>
              <div className="text-center">
                <p className="text-zinc-400">
                  Easily create and modify email templates with our intuitive
                  drag and drop interface. No coding knowledge required.
                </p>
              </div>
            </div>

            <div className="bg-zinc-800 p-6 rounded-xl border border-zinc-700 hover:border-zinc-500 transition-all duration-300 flex flex-col">
              <div className="flex flex-col items-center mx-auto relative h-72 w-full mb-4">
                <EvervaultCard text="Image Upload" />
              </div>
              <div className="text-center">
                <p className="text-zinc-400">
                  Upload and incorporate your own images directly into your
                  email templates to create engaging visual content.
                </p>
              </div>
            </div>

            <div className="bg-zinc-800 p-6 rounded-xl border border-zinc-700 hover:border-zinc-500 transition-all duration-300 flex flex-col">
              <div className="flex flex-col items-center mx-auto relative h-72 w-full mb-4">
                <EvervaultCard text="Test Email" />
              </div>
              <div className="text-center">
                <p className="text-zinc-400">
                  Send test emails to preview how your templates will appear in
                  recipients' inboxes before finalizing them.
                </p>
              </div>
            </div>

            <div className="bg-zinc-800 p-6 rounded-xl border border-zinc-700 hover:border-zinc-500 transition-all duration-300 flex flex-col">
              <div className="flex flex-col items-center mx-auto relative h-72 w-full mb-4">
                <EvervaultCard text="Templates" />
              </div>
              <div className="text-center">
                <p className="text-zinc-400">
                  Save, organize, and reuse your email templates to maintain
                  consistency and save time on future campaigns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
