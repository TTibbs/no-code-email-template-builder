import { EmailTemplate } from "@/types";
import { Send, Save, FileText, Grid } from "lucide-react";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface HeaderProps {
  templates: EmailTemplate[];
  activeTemplate: EmailTemplate | null;
  showTemplateList: boolean;
  onSaveTemplate: () => void;
  onSendTestEmail: () => Promise<void>;
  onShowTemplateList: () => void;
}

export default function Header({
  activeTemplate,
  showTemplateList,
  onSaveTemplate,
  onSendTestEmail,
  onShowTemplateList,
}: HeaderProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSaveTemplate = () => {
    onSaveTemplate();
    toast({
      title: "Success",
      description: "Template saved successfully!",
    });
  };

  const handleSendTestEmail = async () => {
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
      await onSendTestEmail();
      // Note: The success toast is handled in the parent component
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

  const handleViewAllTemplates = () => {
    router.push("/templates");
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold">Email Template Builder</h1>
        {!showTemplateList && activeTemplate && (
          <span className="ml-2 text-gray-500"> / {activeTemplate.name}</span>
        )}
      </div>
      {!showTemplateList && activeTemplate && (
        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium flex items-center gap-1 cursor-pointer"
            onClick={onShowTemplateList}
          >
            <FileText size={16} />
            Templates
          </button>
          <button
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium flex items-center gap-1 cursor-pointer"
            onClick={handleViewAllTemplates}
          >
            <Grid size={16} />
            View All
          </button>
          <button
            className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded text-sm font-medium flex items-center gap-1 cursor-pointer"
            onClick={handleSendTestEmail}
            disabled={isSubmitting}
          >
            <Send size={16} />
            {isSubmitting ? "Sending..." : "Send Test"}
          </button>
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium flex items-center gap-1 cursor-pointer"
            onClick={handleSaveTemplate}
          >
            <Save size={16} />
            Save
          </button>
        </div>
      )}
    </div>
  );
}
