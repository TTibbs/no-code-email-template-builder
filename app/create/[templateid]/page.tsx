"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { EmailTemplate, TemplateComponent, ComponentItem } from "@/types";
import { useToast } from "@/hooks/use-toast";
import {
  createTemplate,
  getDefaultTemplateContent,
  removeComponentFromTemplate,
  updateComponentInTemplate,
  getTemplateById,
  saveTemplateToStorage,
} from "@/lib/template-utils";
import ComponentRenderer from "@/components/template/ComponentRenderer";
import { useDragAndDrop } from "@/hooks/use-drag-and-drop";
import { EmailTemplateLayout } from "@/components/EmailTemplateLayout";

export default function TemplateCreatePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const templateId = params.templateid as string;

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeTemplate, setActiveTemplate] = useState<EmailTemplate | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate a network request or data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Available components for the builder
  const components: ComponentItem[] = [
    { type: "header", label: "Header" },
    { type: "text", label: "Text Block" },
    { type: "image", label: "Image" },
    { type: "button", label: "Button" },
    { type: "divider", label: "Divider" },
    { type: "spacer", label: "Spacer" },
  ];

  // Use the drag and drop hook
  const {
    draggedItem,
    dragOverIndex,
    handleComponentDragStart,
    handleDragStart,
    handleDragOver,
    handleTemplateAreaDragOver,
    handleDragEnter,
    handleDragEnd,
    handleDrop,
  } = useDragAndDrop({
    activeTemplate,
    setActiveTemplate,
  });

  // Load template from local storage
  useEffect(() => {
    try {
      const id = parseInt(templateId);

      if (isNaN(id)) {
        // Invalid ID format, redirect to home
        toast({
          title: "Error",
          description: "Invalid template ID",
          variant: "destructive",
        });
        router.push("/");
        return;
      }

      const template = getTemplateById(id);

      if (template) {
        // Template exists, use it
        setActiveTemplate(template);
      } else {
        // Template doesn't exist, create a new one
        const newTemplate: EmailTemplate = {
          id: id,
          name: "New Template",
          subject: "New Subject",
          content: getDefaultTemplateContent(),
        };

        setActiveTemplate(newTemplate);
        saveTemplateToStorage(newTemplate);
      }
    } catch (error) {
      console.error("Error loading template:", error);
      toast({
        title: "Error",
        description: "Failed to load template",
        variant: "destructive",
      });
      router.push("/");
    }
  }, [templateId, router, toast]);

  // Remove component from the template
  const removeComponent = (id: number): void => {
    if (!activeTemplate) return;
    const updatedTemplate = removeComponentFromTemplate(activeTemplate, id);
    setActiveTemplate(updatedTemplate);
    saveTemplateToStorage(updatedTemplate);
  };

  // Update component properties
  const updateComponent = (
    id: number,
    updates: Partial<TemplateComponent>
  ): void => {
    if (!activeTemplate) return;
    const updatedTemplate = updateComponentInTemplate(
      activeTemplate,
      id,
      updates
    );
    setActiveTemplate(updatedTemplate);
    saveTemplateToStorage(updatedTemplate);
  };

  // Save template changes
  const saveTemplate = (): void => {
    if (!activeTemplate) return;
    saveTemplateToStorage(activeTemplate);

    toast({
      title: "Success",
      description: "Template saved successfully",
    });

    // Optionally redirect to the template page after saving
    router.push(`/templates/${activeTemplate.id}`);
  };

  // Send test email
  const sendTestEmail = async (): Promise<void> => {
    if (!activeTemplate) {
      toast({
        title: "Error",
        description: "Please select a template first",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: activeTemplate.name,
          subject: activeTemplate.subject,
          content: activeTemplate.content,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Test email sent successfully.",
        });
      } else {
        toast({
          title: "Error",
          description:
            data.error || "Failed to send test email. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sending test email:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render email preview
  const renderEmailPreview = (): React.ReactNode => {
    if (!activeTemplate || !activeTemplate.content.length) {
      return (
        <div className="text-center py-8 text-gray-500">
          <p>
            Your template is empty. Drag components from the left panel to build
            your email.
          </p>
        </div>
      );
    }

    return activeTemplate.content.map((component, index) => {
      const isDragging = draggedItem === index;
      const showDropBefore = dragOverIndex === index;
      const showDropAfter = dragOverIndex === index + 1;

      return (
        <ComponentRenderer
          key={component.id}
          component={component}
          onRemove={removeComponent}
          onUpdate={updateComponent}
          index={index}
          isDragging={isDragging}
          showDropBefore={showDropBefore}
          showDropAfter={showDropAfter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragEnd={handleDragEnd}
          onDrop={handleDrop}
        />
      );
    });
  };

  // Duplicate this template
  const handleDuplicateTemplate = () => {
    if (!activeTemplate) return;

    // Create a new template based on the current one
    const newTemplate: EmailTemplate = {
      id: Date.now(),
      name: `${activeTemplate.name} (Copy)`,
      subject: activeTemplate.subject,
      content: [...activeTemplate.content],
    };

    // Save the new template
    saveTemplateToStorage(newTemplate);

    // Show success message
    toast({
      title: "Success",
      description: "Template duplicated successfully",
    });

    // Navigate to the new template
    router.push(`/templates/${newTemplate.id}`);
  };

  // Handle template updates
  const handleUpdateTemplate = (updates: Partial<EmailTemplate>) => {
    if (!activeTemplate) return;
    setActiveTemplate({
      ...activeTemplate,
      ...updates,
    });
  };

  // Show skeleton while loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-900">
        <div className="flex flex-col h-screen">
          {/* Action Buttons Skeleton */}
          <div className="bg-zinc-800 border-b border-zinc-700 p-4 flex justify-between items-center animate-pulse">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-zinc-700 rounded-full"></div>
              <div className="h-6 w-32 bg-zinc-700 rounded"></div>
            </div>
            <div className="flex space-x-2">
              <div className="h-9 w-24 bg-zinc-700 rounded-md"></div>
              <div className="h-9 w-24 bg-zinc-700 rounded-md"></div>
              <div className="h-9 w-24 bg-emerald-700/30 rounded-md"></div>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="flex flex-1 overflow-hidden">
            {/* Components Panel Skeleton */}
            <div className="w-64 bg-zinc-800 border-r border-zinc-700 p-4 animate-pulse">
              <div className="h-6 w-32 bg-zinc-700 rounded mb-4"></div>
              <div className="space-y-3">
                {components.map((_, i) => (
                  <div key={i} className="h-12 bg-zinc-700 rounded-lg"></div>
                ))}
              </div>
            </div>

            {/* Email Editor Skeleton */}
            <div className="flex-1 flex flex-col overflow-hidden animate-pulse">
              {/* Template Name and Subject Editor Skeleton */}
              <div className="p-4 border-b border-zinc-700 bg-zinc-800">
                <div className="h-8 w-64 bg-zinc-700 rounded mb-3"></div>
                <div className="h-6 w-full max-w-md bg-zinc-700 rounded"></div>
              </div>

              {/* Email Body Editor Skeleton */}
              <div className="flex-1 p-6 bg-zinc-900 overflow-auto">
                <div className="max-w-2xl mx-auto bg-white rounded-lg p-6 space-y-6">
                  <div className="h-10 bg-zinc-200 rounded-md w-3/4 mx-auto"></div>
                  <div className="h-24 bg-zinc-200 rounded-md"></div>
                  <div className="h-12 bg-zinc-200 rounded-md w-1/2 mx-auto"></div>
                  <div className="h-24 bg-zinc-200 rounded-md"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <EmailTemplateLayout
      template={activeTemplate}
      isSubmitting={isSubmitting}
      components={components}
      onDuplicate={handleDuplicateTemplate}
      onSendTest={sendTestEmail}
      onSave={saveTemplate}
      onUpdateTemplate={handleUpdateTemplate}
      onComponentDragStart={handleComponentDragStart}
      onDragEnd={handleDragEnd}
      onTemplateAreaDragOver={handleTemplateAreaDragOver}
      onDrop={handleDrop}
    >
      {renderEmailPreview()}
    </EmailTemplateLayout>
  );
}
