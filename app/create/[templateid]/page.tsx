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
import ComponentList from "@/components/template/ComponentList";
import ComponentRenderer from "@/components/template/ComponentRenderer";
import { useDragAndDrop } from "@/hooks/use-drag-and-drop";
import { Save, Send, Copy } from "lucide-react";

export default function TemplateCreatePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const templateId = params.templateid as string;

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeTemplate, setActiveTemplate] = useState<EmailTemplate | null>(
    null
  );

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

  if (!activeTemplate) {
    return <div className="p-8 text-center">Loading template...</div>;
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Action Buttons */}
      <div className="bg-white border-b border-gray-200 p-2 flex justify-end">
        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium flex items-center gap-1 cursor-pointer"
            onClick={handleDuplicateTemplate}
          >
            <Copy size={16} />
            Duplicate
          </button>
          <button
            className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded text-sm font-medium flex items-center gap-1 cursor-pointer"
            onClick={sendTestEmail}
            disabled={isSubmitting}
          >
            <Send size={16} />
            {isSubmitting ? "Sending..." : "Send Test"}
          </button>
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium flex items-center gap-1 cursor-pointer"
            onClick={saveTemplate}
          >
            <Save size={16} />
            Save
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Components Panel */}
        <ComponentList
          components={components}
          onDragStart={handleComponentDragStart}
          onDragEnd={handleDragEnd}
        />

        {/* Email Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Template Name and Subject Editor */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="max-w-xl mx-auto space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Template Name
                  </label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded"
                    value={activeTemplate?.name || ""}
                    onChange={(e) =>
                      activeTemplate &&
                      setActiveTemplate({
                        ...activeTemplate,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Line
                </label>
                <input
                  className="w-full p-2 border border-gray-300 rounded"
                  value={activeTemplate?.subject || ""}
                  onChange={(e) =>
                    activeTemplate &&
                    setActiveTemplate({
                      ...activeTemplate,
                      subject: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Email Body Editor */}
          <div
            className="flex-1 overflow-y-auto p-6 bg-gray-100"
            onDragOver={handleTemplateAreaDragOver}
            onDrop={handleDrop}
          >
            <div className="max-w-xl mx-auto bg-white rounded-lg shadow-sm p-6 min-h-full">
              {renderEmailPreview()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
