"use client";

import React, { useState, useEffect } from "react";
import { EmailTemplate, TemplateComponent, ComponentItem } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import TemplateList from "./template/TemplateList";
import { useDragAndDrop } from "@/hooks/use-drag-and-drop";
import { useRouter } from "next/navigation";
import {
  createTemplate,
  getDefaultTemplateContent,
  removeComponentFromTemplate,
  updateComponentInTemplate,
  saveTemplatesToStorage,
  getTemplatesFromStorage,
  saveTemplateToStorage,
} from "@/lib/template-utils";

// Main component
const EmailTemplateBuilder: React.FC = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [activeTemplate, setActiveTemplate] = useState<EmailTemplate | null>(
    null
  );
  const [showTemplateList, setShowTemplateList] = useState<boolean>(true);

  // Load templates from local storage on component mount
  useEffect(() => {
    const storedTemplates = getTemplatesFromStorage();

    if (storedTemplates.length > 0) {
      // Ensure all templates have IDs
      const templatesWithIds = storedTemplates.map((template) => {
        if (!template.id) {
          return {
            ...template,
            id: Date.now() + Math.floor(Math.random() * 1000),
          };
        }
        return template;
      });

      // Save templates with IDs back to storage if any were updated
      if (templatesWithIds.some((t, i) => t.id !== storedTemplates[i].id)) {
        saveTemplatesToStorage(templatesWithIds);
      }

      setTemplates(templatesWithIds);
    } else {
      // Initialize with default templates if none exist
      const defaultTemplates = [
        {
          id: 1,
          name: "Welcome Email",
          subject: "Welcome to Our Service!",
          content: getDefaultTemplateContent(),
        },
        {
          id: 2,
          name: "Password Reset",
          subject: "Reset Your Password",
          content: getDefaultTemplateContent(),
        },
      ];

      setTemplates(defaultTemplates);
      saveTemplatesToStorage(defaultTemplates);
    }

    // Always show the template list when the component is mounted
    setShowTemplateList(true);
    setActiveTemplate(null);
  }, []);

  // Select a template to edit
  const selectTemplate = (template: EmailTemplate): void => {
    // Ensure the template has content
    if (!template.content.length) {
      template.content = getDefaultTemplateContent();
      saveTemplateToStorage(template);
    }

    // Navigate to the template page
    router.push(`/templates/${template.id}`);
  };

  // Create a new template
  const handleCreateTemplate = (): void => {
    const newTemplate = createTemplate();
    const updatedTemplates = [...templates, newTemplate];

    setTemplates(updatedTemplates);
    saveTemplatesToStorage(updatedTemplates);

    // Redirect to the template creation page with the new template ID
    router.push(`/create/${newTemplate.id}`);
  };

  // Delete template
  const deleteTemplate = (id: number, e: React.MouseEvent): void => {
    e.stopPropagation(); // Prevent template selection when clicking delete

    const { dismiss } = toast({
      title: "Delete Template",
      description: "Are you sure you want to delete this template?",
      duration: 5000, // Show for 5 seconds
      action: (
        <>
          <ToastAction
            altText="Yes, delete this template"
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
          </ToastAction>
          <ToastAction
            altText="Don't delete"
            onClick={() => {
              // Just dismiss the toast without deleting
              dismiss();
            }}
          >
            No
          </ToastAction>
        </>
      ),
    });
  };

  // Main render
  return (
    <div className="flex flex-col">
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <TemplateList
            templates={templates}
            onSelectTemplate={selectTemplate}
            onCreateTemplate={handleCreateTemplate}
            onDeleteTemplate={deleteTemplate}
          />
        </div>
      </div>
    </div>
  );
};

export default EmailTemplateBuilder;
