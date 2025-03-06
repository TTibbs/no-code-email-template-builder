"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EmailTemplate } from "@/types";
import { useToast } from "@/hooks/use-toast";
import {
  getTemplatesFromStorage,
  saveTemplatesToStorage,
} from "@/lib/template-utils";
import { Trash2, Edit, Copy, Mail, Archive, ArrowRight } from "lucide-react";
import FallingText from "@/components/ui/FallingText";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LinkPreview } from "@/components/ui/link-preview";

export default function TemplatesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load templates from local storage
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      const storedTemplates = getTemplatesFromStorage();
      setTemplates(storedTemplates);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Edit a template
  const handleEditTemplate = (id: number): void => {
    router.push(`/templates/${id}`);
  };

  // Duplicate a template
  const handleDuplicateTemplate = (
    template: EmailTemplate,
    e: React.MouseEvent
  ): void => {
    e.stopPropagation(); // Prevent template selection when clicking duplicate

    // Create a new template based on the current one
    const newTemplate: EmailTemplate = {
      id: Date.now(),
      name: `${template.name} (Copy)`,
      subject: template.subject,
      content: [...template.content],
    };

    // Save the new template
    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    saveTemplatesToStorage(updatedTemplates);

    // Show success message
    toast({
      title: "Success",
      description: "Template duplicated successfully",
    });

    // Navigate to the new template
    router.push(`/templates/${newTemplate.id}`);
  };

  // Delete a template
  const handleDeleteTemplate = (id: number, e: React.MouseEvent): void => {
    e.stopPropagation(); // Prevent template selection when clicking delete

    const { dismiss } = toast({
      title: "Delete Template",
      description: "Are you sure you want to delete this template?",
      duration: 5000, // Show for 5 seconds
      action: (
        <div className="flex gap-2">
          <button
            className="px-3 py-1 bg-red-600 text-white rounded text-sm"
            onClick={() => {
              // Remove the template from the templates array
              const updatedTemplates = templates.filter(
                (template) => template.id !== id
              );
              setTemplates(updatedTemplates);
              saveTemplatesToStorage(updatedTemplates);

              // Dismiss the toast
              dismiss();

              // Show success toast
              toast({
                title: "Success",
                description: "Template deleted successfully",
                duration: 3000, // Show for 3 seconds
              });
            }}
          >
            Yes
          </button>
          <button
            className="px-3 py-1 bg-zinc-600 text-white rounded text-sm hover:bg-zinc-500"
            onClick={() => {
              // Just dismiss the toast without deleting
              dismiss();
            }}
          >
            No
          </button>
        </div>
      ),
    });
  };

  if (isLoading) {
    return (
      <div className="bg-zinc-800 min-h-screen font-sans">
        {/* Header Section Skeleton */}
        <section className="bg-gradient-to-r from-zinc-100 to-zinc-200 md:px-72 rounded-bl-4xl rounded-br-4xl flex flex-col items-center justify-center h-[40vh] relative overflow-hidden shadow-xl animate-pulse">
          <div className="h-8 w-3/4 bg-zinc-300 rounded mb-4 max-w-3xl"></div>
          <div className="h-8 w-2/3 bg-zinc-300 rounded mb-4 max-w-2xl"></div>
          <div className="h-8 w-1/2 bg-zinc-300 rounded mb-8 max-w-xl"></div>
          <div className="mt-12 mb-4">
            <div className="h-12 w-48 bg-zinc-400 rounded-lg"></div>
          </div>
        </section>

        {/* Templates Grid Skeleton */}
        <section className="px-4 md:px-16 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-zinc-900 rounded-xl border border-zinc-700 overflow-hidden animate-pulse"
                >
                  <div className="p-5 border-b border-zinc-800 bg-zinc-800/50">
                    <div className="h-5 w-1/2 bg-zinc-700 rounded"></div>
                  </div>
                  <div className="p-6">
                    <div className="w-12 h-12 bg-zinc-800 rounded-lg mb-4"></div>
                    <div className="h-4 w-3/4 bg-zinc-800 rounded mb-2"></div>
                    <div className="h-4 w-1/2 bg-zinc-800 rounded"></div>
                  </div>
                  <div className="bg-zinc-800/30 p-4 border-t border-zinc-800 flex justify-between">
                    <div className="h-4 w-16 bg-zinc-700 rounded"></div>
                    <div className="h-4 w-20 bg-zinc-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <main className="bg-zinc-800 min-h-screen font-sans">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-zinc-100 to-zinc-200 p-8 md:p-16 rounded-bl-4xl rounded-br-4xl flex flex-col items-center justify-center h-[30vh] relative overflow-hidden shadow-xl">
        <FallingText
          text={`Manage your email templates. Browse the gallery to find templates, then edit or duplicate them for your campaigns.`}
          highlightWords={[
            "Manage",
            "templates",
            "Browse",
            "gallery",
            "edit",
            "duplicate",
            "campaigns",
          ]}
          trigger="click"
          backgroundColor="transparent"
          wireframes={false}
          gravity={0.3}
          fontSize="1.8rem"
          mouseConstraintStiffness={0.3}
        />
        <div className="mt-4">
          <span className="block text-base">
            Want me removed from this page? Bug me on{" "}
            <LinkPreview
              url="https://github.com/TTibbs/no-code-email-template-builder/issues"
              className="text-emerald-500"
            >
              GitHub
            </LinkPreview>
          </span>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="px-4 md:px-16 py-8">
        <div className="max-w-6xl mx-auto">
          {templates.length === 0 ? (
            <div className="bg-zinc-900 p-10 rounded-xl border border-zinc-700 text-center">
              <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Archive size={32} className="text-zinc-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                No templates found
              </h2>
              <p className="text-zinc-400 mb-8 max-w-md mx-auto">
                Browse the template gallery to find and use pre-made templates
                for your email campaigns
              </p>
              <Link href="/templates/gallery">
                <Button className="bg-emerald-500 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg shadow-md transition-colors flex items-center justify-center mx-auto">
                  <ArrowRight size={18} className="mr-2" />
                  Browse Templates
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Template Cards */}
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="bg-zinc-900 rounded-xl border border-zinc-700 hover:border-emerald-500 transition-all duration-300 overflow-hidden group hover:shadow-lg hover:shadow-emerald-900/20"
                >
                  <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-800/50">
                    <h3
                      className="font-medium text-emerald-500 hover:text-emerald-400 truncate cursor-pointer transition-colors"
                      onClick={() => handleEditTemplate(template.id)}
                    >
                      {template.name}
                    </h3>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="p-1.5 text-zinc-400 hover:text-emerald-500 rounded-full hover:bg-zinc-800 cursor-pointer transition-colors"
                        onClick={(e) => handleDuplicateTemplate(template, e)}
                        title="Duplicate template"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        className="p-1.5 text-zinc-400 hover:text-red-500 rounded-full hover:bg-zinc-800 cursor-pointer transition-colors"
                        onClick={(e) => handleDeleteTemplate(template.id, e)}
                        title="Delete template"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div
                    className="p-6 cursor-pointer"
                    onClick={() => handleEditTemplate(template.id)}
                  >
                    <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center mb-4 flex-shrink-0">
                      <Mail size={20} className="text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-zinc-400 text-sm mb-2 truncate">
                        Subject: {template.subject}
                      </p>
                      <p className="text-zinc-500 text-xs">
                        {template.content.length} components
                      </p>
                    </div>
                  </div>
                  <div className="bg-zinc-800/30 p-4 flex justify-between items-center border-t border-zinc-800">
                    <button
                      className="text-sm text-zinc-400 hover:text-emerald-500 transition-colors flex items-center duration-300 ease-linear cursor-pointer"
                      onClick={() => handleEditTemplate(template.id)}
                    >
                      <Edit size={14} className="mr-1" /> Edit
                    </button>
                    <button
                      className="text-sm text-zinc-400 hover:text-emerald-500 transition-colors flex items-center duration-300 ease-linear cursor-pointer"
                      onClick={(e) => handleDuplicateTemplate(template, e)}
                    >
                      <Copy size={14} className="mr-1" /> Duplicate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
