import React from "react";
import { EmailTemplate, ComponentItem } from "@/types";
import { EmailTemplateActions } from "./EmailTemplateActions";
import { EmailTemplateMetadata } from "./EmailTemplateMetadata";
import { EmailBodyEditor } from "./EmailBodyEditor";
import ComponentList from "@/components/template/ComponentList";

interface EmailTemplateLayoutProps {
  template: EmailTemplate | null;
  isSubmitting: boolean;
  components: ComponentItem[];
  onDuplicate: () => void;
  onSendTest: () => void;
  onSave: () => void;
  onUpdateTemplate: (updates: Partial<EmailTemplate>) => void;
  onComponentDragStart: (e: React.DragEvent, type: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onTemplateAreaDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  children: React.ReactNode;
}

export function EmailTemplateLayout({
  template,
  isSubmitting,
  components,
  onDuplicate,
  onSendTest,
  onSave,
  onUpdateTemplate,
  onComponentDragStart,
  onDragEnd,
  onTemplateAreaDragOver,
  onDrop,
  children,
}: EmailTemplateLayoutProps) {
  if (!template) {
    return <div className="p-8 text-center flex-1">Loading template...</div>;
  }

  return (
    <div className="flex flex-col flex-1">
      {/* Action Buttons */}
      <EmailTemplateActions
        onDuplicate={onDuplicate}
        onSendTest={onSendTest}
        onSave={onSave}
        isSubmitting={isSubmitting}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Components Panel */}
        <ComponentList
          components={components}
          onDragStart={onComponentDragStart}
          onDragEnd={onDragEnd}
        />

        {/* Email Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Template Name and Subject Editor */}
          <EmailTemplateMetadata
            template={template}
            onUpdate={onUpdateTemplate}
          />

          {/* Email Body Editor */}
          <EmailBodyEditor onDragOver={onTemplateAreaDragOver} onDrop={onDrop}>
            {children}
          </EmailBodyEditor>
        </div>
      </div>
    </div>
  );
}
