"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EmailTemplate } from "@/types";
import { useToast } from "@/hooks/use-toast";
import {
  getTemplatesFromStorage,
  saveTemplatesToStorage,
} from "@/lib/template-utils";
import { Trash2, Plus, Edit, Copy } from "lucide-react";

export default function TemplatesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load templates from local storage
  useEffect(() => {
    const storedTemplates = getTemplatesFromStorage();
    setTemplates(storedTemplates);
    setIsLoading(false);
  }, []);

  // Create a new template
  const handleCreateTemplate = (): void => {
    const newTemplateId = Date.now();
    router.push(`/create/${newTemplateId}`);
  };

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
            className="px-3 py-1 bg-gray-200 rounded text-sm"
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
    return <div className="p-8 text-center">Loading templates...</div>;
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Templates Grid */}
      <div className="flex-1 p-6 bg-gray-50 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {templates.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-medium text-gray-600 mb-4">
                No templates found
              </h2>
              <p className="text-gray-500 mb-6">
                Create your first email template to get started
              </p>
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium flex items-center gap-1 mx-auto"
                onClick={handleCreateTemplate}
              >
                <Plus size={16} />
                Create Template
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 group"
                >
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h3
                      className="font-medium text-emerald-700 truncate cursor-pointer"
                      onClick={() => handleEditTemplate(template.id)}
                    >
                      {template.name}
                    </h3>
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="p-1 text-gray-400 hover:text-blue-500 rounded cursor-pointer"
                        onClick={(e) => handleDuplicateTemplate(template, e)}
                        title="Duplicate template"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        className="p-1 text-gray-400 hover:text-red-500 rounded cursor-pointer"
                        onClick={(e) => handleDeleteTemplate(template.id, e)}
                        title="Delete template"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-500 truncate mb-3">
                      {template.subject}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">
                        {template.content.length} components
                      </span>
                      <button
                        className="text-sm flex items-center gap-1 text-zinc-500 hover:text-emerald-700 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTemplate(template.id);
                        }}
                      >
                        <Edit size={12} />
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
