"use client";

import React, { useState, useEffect } from "react";
import { EmailTemplate, TemplateComponent, ComponentItem } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import Header from "./Header";
import ComponentList from "./template/ComponentList";
import ComponentRenderer from "./template/ComponentRenderer";
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
} from "@/lib/template-utils";

// Main component
const EmailTemplateBuilder: React.FC = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeTemplate, setActiveTemplate] = useState<EmailTemplate | null>(
    null
  );
  const [showTemplateList, setShowTemplateList] = useState<boolean>(true);

  // Load templates from local storage on component mount
  useEffect(() => {
    const storedTemplates = getTemplatesFromStorage();

    if (storedTemplates.length > 0) {
      setTemplates(storedTemplates);
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

  // Select a template to edit
  const selectTemplate = (template: EmailTemplate): void => {
    setActiveTemplate({
      ...template,
      content: template.content.length
        ? template.content
        : getDefaultTemplateContent(),
    });
    setShowTemplateList(false);
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

  // Remove component from the template
  const removeComponent = (id: number): void => {
    if (!activeTemplate) return;
    setActiveTemplate(removeComponentFromTemplate(activeTemplate, id));
  };

  // Update component properties
  const updateComponent = (
    id: number,
    updates: Partial<TemplateComponent>
  ): void => {
    if (!activeTemplate) return;
    setActiveTemplate(updateComponentInTemplate(activeTemplate, id, updates));
  };

  // Save template changes
  const saveTemplate = (): void => {
    if (!activeTemplate) return;

    const updatedTemplates = templates.map((template) =>
      template.id === activeTemplate.id ? activeTemplate : template
    );

    setTemplates(updatedTemplates);
    saveTemplatesToStorage(updatedTemplates);
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
      throw error;
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

              // If the active template is being deleted, go back to template list
              if (activeTemplate && activeTemplate.id === id) {
                setActiveTemplate(null);
                setShowTemplateList(true);
              }

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
    <div className="flex h-full flex-col">
      {/* Header */}
      <Header
        templates={templates}
        activeTemplate={activeTemplate}
        showTemplateList={showTemplateList}
        onSaveTemplate={saveTemplate}
        onSendTestEmail={sendTestEmail}
        onShowTemplateList={() => setShowTemplateList(true)}
      />

      {/* Main Content */}
      {showTemplateList ? (
        <TemplateList
          templates={templates}
          onSelectTemplate={selectTemplate}
          onCreateTemplate={handleCreateTemplate}
          onDeleteTemplate={deleteTemplate}
        />
      ) : (
        <div className="flex flex-1 overflow-hidden">
          {/* Components Panel */}
          <ComponentList
            components={components}
            onDragStart={handleComponentDragStart}
            onDragEnd={handleDragEnd}
          />

          {/* Email Editor */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Subject Editor */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="max-w-xl mx-auto">
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

            {/* Email Body Editor */}
            <div
              className="flex-1 overflow-y-auto p-6 bg-gray-100"
              onDragOver={handleTemplateAreaDragOver}
              onDrop={handleDrop}
            >
              <div className="max-w-xl mx-auto bg-white rounded-lg shadow-sm p-6 min-h-full">
                {activeTemplate && renderEmailPreview()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailTemplateBuilder;
