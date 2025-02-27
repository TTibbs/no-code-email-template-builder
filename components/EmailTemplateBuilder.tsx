"use client";

import React, { useState } from "react";
import {
  Trash2,
  Plus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Save,
  FileText,
  Send,
  X,
} from "lucide-react";
import { EmailTemplate, TemplateComponent, ComponentItem } from "@/types";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

// Main component
const EmailTemplateBuilder: React.FC = () => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<EmailTemplate[]>([
    {
      id: 1,
      name: "Welcome Email",
      subject: "Welcome to Our Service!",
      content: [],
    },
    {
      id: 2,
      name: "Password Reset",
      subject: "Reset Your Password",
      content: [],
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeTemplate, setActiveTemplate] = useState<EmailTemplate | null>(
    null
  );
  const [showTemplateList, setShowTemplateList] = useState<boolean>(true);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [draggedComponentType, setDraggedComponentType] = useState<
    string | null
  >(null);

  // Available components for the builder
  const components: ComponentItem[] = [
    { type: "header", label: "Header" },
    { type: "text", label: "Text Block" },
    { type: "image", label: "Image" },
    { type: "button", label: "Button" },
    { type: "divider", label: "Divider" },
    { type: "spacer", label: "Spacer" },
  ];

  // Select a template to edit
  const selectTemplate = (template: EmailTemplate): void => {
    setActiveTemplate({
      ...template,
      content: template.content.length
        ? template.content
        : [
            {
              id: 1,
              type: "header",
              value: "Welcome to our service",
              align: "center",
              color: "#333333",
            },
            {
              id: 2,
              type: "text",
              value:
                "We're glad to have you on board! Here's what you need to know to get started.",
              align: "left",
              color: "#666666",
            },
            {
              id: 3,
              type: "button",
              value: "Get Started",
              link: "#",
              align: "center",
              color: "#ffffff",
              bgColor: "#4F46E5",
            },
          ],
    });
    setShowTemplateList(false);
  };

  // Create a new template
  const createTemplate = (): void => {
    const newTemplate: EmailTemplate = {
      id: Date.now(),
      name: "New Template",
      subject: "New Subject",
      content: [],
    };
    setTemplates([...templates, newTemplate]);
    selectTemplate(newTemplate);
  };

  // Add new component to the template
  const addComponent = (type: string): void => {
    if (!activeTemplate) return;

    const newComponent: TemplateComponent = {
      id: Date.now(),
      type,
      value:
        type === "header"
          ? "Header Text"
          : type === "text"
          ? "Add your text here"
          : type === "button"
          ? "Click Me"
          : "",
      align: "left",
      color: type === "button" ? "#ffffff" : "#333333",
      bgColor: type === "button" ? "#4F46E5" : "transparent",
      link: type === "button" ? "#" : "",
      height: type === "spacer" ? 20 : undefined,
    };

    setActiveTemplate({
      ...activeTemplate,
      content: [...activeTemplate.content, newComponent],
    });
  };

  // Remove component from the template
  const removeComponent = (id: number): void => {
    if (!activeTemplate) return;

    setActiveTemplate({
      ...activeTemplate,
      content: activeTemplate.content.filter((item) => item.id !== id),
    });
  };

  // Update component properties
  const updateComponent = (
    id: number,
    updates: Partial<TemplateComponent>
  ): void => {
    if (!activeTemplate) return;

    setActiveTemplate({
      ...activeTemplate,
      content: activeTemplate.content.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    });
  };

  // Handle component drag start
  const handleComponentDragStart = (e: React.DragEvent, type: string): void => {
    e.dataTransfer.effectAllowed = "copy";
    setDraggedComponentType(type);
  };

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, index: number): void => {
    setDraggedItem(index);
    setDraggedComponentType(null);
    // Set drag preview opacity
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = "0.4";
    }
    // Set drag effect
    e.dataTransfer.effectAllowed = "move";
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, index: number): void => {
    e.preventDefault();
    e.stopPropagation();

    // Set the drop effect based on whether we're dragging a new component or reordering
    e.dataTransfer.dropEffect = draggedComponentType ? "copy" : "move";

    if (draggedItem === index && !draggedComponentType) return;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const y = e.clientY - rect.top;
    const isInUpperHalf = y < rect.height / 2;

    setDragOverIndex(isInUpperHalf ? index : index + 1);
  };

  // Handle template area drag over
  const handleTemplateAreaDragOver = (e: React.DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = draggedComponentType ? "copy" : "move";

    if (!activeTemplate || activeTemplate.content.length === 0) {
      setDragOverIndex(0);
    }
  };

  // Handle drag enter
  const handleDragEnter = (e: React.DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
  };

  // Handle drag end
  const handleDragEnd = (e: React.DragEvent): void => {
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = "1";
    }
    setDraggedItem(null);
    setDragOverIndex(null);
    setDraggedComponentType(null);
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();

    if (!activeTemplate) {
      handleDragEnd(e);
      return;
    }

    if (draggedComponentType) {
      // Handle dropping a new component from the component list
      const newComponent: TemplateComponent = {
        id: Date.now(),
        type: draggedComponentType,
        value:
          draggedComponentType === "header"
            ? "Header Text"
            : draggedComponentType === "text"
            ? "Add your text here"
            : draggedComponentType === "button"
            ? "Click Me"
            : "",
        align: "left",
        color: draggedComponentType === "button" ? "#ffffff" : "#333333",
        bgColor: draggedComponentType === "button" ? "#4F46E5" : "transparent",
        link: draggedComponentType === "button" ? "#" : "",
        height: draggedComponentType === "spacer" ? 20 : undefined,
      };

      const content = [...activeTemplate.content];
      const insertIndex =
        dragOverIndex !== null ? dragOverIndex : content.length;
      content.splice(insertIndex, 0, newComponent);

      setActiveTemplate({
        ...activeTemplate,
        content,
      });
    } else if (draggedItem !== null && dragOverIndex !== null) {
      // Handle reordering existing components
      const content = [...activeTemplate.content];
      const item = content[draggedItem];
      content.splice(draggedItem, 1);
      const adjustedIndex =
        dragOverIndex > draggedItem ? dragOverIndex - 1 : dragOverIndex;
      content.splice(adjustedIndex, 0, item);

      setActiveTemplate({
        ...activeTemplate,
        content,
      });
    }

    handleDragEnd(e);
  };

  // Save template changes
  const saveTemplate = (): void => {
    if (!activeTemplate) return;

    setTemplates(
      templates.map((template) =>
        template.id === activeTemplate.id ? activeTemplate : template
      )
    );
    alert("Template saved successfully!");
  };

  // Send test email
  const sendTestEmail = async () => {
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
        <div key={component.id}>
          {showDropBefore && (
            <div className="h-1 bg-blue-500 rounded-full my-2 transition-all duration-200" />
          )}
          <div
            className={`relative border-2 ${isDragging ? "opacity-40" : ""} ${
              showDropBefore || showDropAfter
                ? "border-blue-500"
                : "border-transparent"
            } hover:border-gray-300 group mb-4 cursor-move bg-white transition-all duration-200`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnter={handleDragEnter}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
          >
            {/* Remove Button - Always visible */}
            <button
              className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 z-20"
              onClick={(e) => {
                e.stopPropagation();
                removeComponent(component.id);
              }}
            >
              <X size={14} />
            </button>

            {/* Formatting Controls - Visible on hover */}
            <div className="absolute top-0 right-6 hidden group-hover:flex bg-white border border-gray-200 rounded shadow z-10">
              <button
                className="p-1 hover:bg-gray-100"
                onClick={() => {
                  if (
                    component.type === "header" ||
                    component.type === "text" ||
                    component.type === "button"
                  ) {
                    updateComponent(component.id, { align: "left" });
                  }
                }}
              >
                <AlignLeft size={14} />
              </button>
              <button
                className="p-1 hover:bg-gray-100"
                onClick={() => {
                  if (
                    component.type === "header" ||
                    component.type === "text" ||
                    component.type === "button"
                  ) {
                    updateComponent(component.id, { align: "center" });
                  }
                }}
              >
                <AlignCenter size={14} />
              </button>
              <button
                className="p-1 hover:bg-gray-100"
                onClick={() => {
                  if (
                    component.type === "header" ||
                    component.type === "text" ||
                    component.type === "button"
                  ) {
                    updateComponent(component.id, { align: "right" });
                  }
                }}
              >
                <AlignRight size={14} />
              </button>
            </div>

            <div className="p-2">
              {component.type === "header" && (
                <div
                  className={`text-xl font-bold text-${component.align}`}
                  style={{ color: component.color }}
                >
                  <input
                    className="w-full bg-transparent border-0 focus:outline-none focus:ring-0"
                    value={component.value}
                    onChange={(e) =>
                      updateComponent(component.id, { value: e.target.value })
                    }
                  />
                </div>
              )}

              {component.type === "text" && (
                <div
                  className={`text-${component.align}`}
                  style={{ color: component.color }}
                >
                  <textarea
                    className="w-full bg-transparent border-0 focus:outline-none focus:ring-0 resize-none"
                    value={component.value}
                    onChange={(e) =>
                      updateComponent(component.id, { value: e.target.value })
                    }
                  />
                </div>
              )}

              {component.type === "button" && (
                <div className={`text-${component.align}`}>
                  <div className="inline-block">
                    <input
                      className="px-4 py-2 rounded text-center focus:outline-none focus:ring-0 w-full"
                      value={component.value}
                      onChange={(e) =>
                        updateComponent(component.id, { value: e.target.value })
                      }
                      style={{
                        backgroundColor: component.bgColor,
                        color: component.color,
                      }}
                    />
                  </div>
                </div>
              )}

              {component.type === "divider" && (
                <hr className="my-4 border-gray-200" />
              )}

              {component.type === "image" && (
                <div className={`text-${component.align}`}>
                  <div className="bg-gray-100 p-8 flex items-center justify-center text-gray-500">
                    <span>Image Placeholder</span>
                  </div>
                </div>
              )}

              {component.type === "spacer" && (
                <div
                  style={{ height: `${component.height}px` }}
                  className="bg-gray-50"
                  onClick={() =>
                    component.height &&
                    updateComponent(component.id, {
                      height: component.height + 10,
                    })
                  }
                ></div>
              )}
            </div>
          </div>
        </div>
      );
    });
  };

  // Delete template
  const deleteTemplate = (id: number, e: React.MouseEvent): void => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this template?")) {
      setTemplates(templates.filter((template) => template.id !== id));
    }
  };

  // Main render
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Email Template Builder</h1>
        {!showTemplateList && activeTemplate && (
          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium flex items-center gap-1 cursor-pointer"
              onClick={() => setShowTemplateList(true)}
            >
              <FileText size={16} />
              Templates
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
        )}
      </div>

      {/* Main Content */}
      {showTemplateList ? (
        <div className="p-6 bg-gray-50 flex-1">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium">Your Email Templates</h2>
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={createTemplate}
              >
                <Plus size={16} />
                New Template
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md cursor-pointer relative group"
                  onClick={() => selectTemplate(template)}
                >
                  <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 hidden group-hover:block cursor-pointer"
                    onClick={(e) => deleteTemplate(template.id, e)}
                  >
                    <Trash2 size={16} />
                  </button>
                  <h3 className="font-medium">{template.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {template.subject}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          {/* Components Panel */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
            <h2 className="text-sm font-medium mb-4">Components</h2>
            <div className="space-y-2">
              {components.map((component) => (
                <div
                  key={component.type}
                  className="bg-white p-3 rounded border border-gray-200 hover:border-blue-500 cursor-grab shadow-sm transition-colors duration-200"
                  draggable
                  onDragStart={(e) =>
                    handleComponentDragStart(e, component.type)
                  }
                  onDragEnd={handleDragEnd}
                >
                  <span className="text-sm">{component.label}</span>
                </div>
              ))}
            </div>
          </div>

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
