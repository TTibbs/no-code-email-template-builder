import React from "react";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TemplateListProps } from "@/types";
import { EmailTemplate } from "@/types";

const TemplateList: React.FC<TemplateListProps> = ({
  templates,
  onSelectTemplate,
  onCreateTemplate,
  onDeleteTemplate,
}) => {
  return (
    <div className="p-6 bg-gray-50 flex-1">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template: EmailTemplate) => (
            <div
              key={template.id}
              className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md cursor-pointer relative group"
              onClick={() => onSelectTemplate(template)}
            >
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 hidden group-hover:block cursor-pointer"
                onClick={(e) => onDeleteTemplate(template.id, e)}
              >
                <Trash2 size={16} />
              </button>
              <h3 className="font-medium">{template.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{template.subject}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplateList;
