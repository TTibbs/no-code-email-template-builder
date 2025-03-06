import React from "react";
import { Trash2 } from "lucide-react";
import { TemplateListProps } from "@/types";
import { EmailTemplate } from "@/types";

const TemplateList: React.FC<TemplateListProps> = ({
  templates,
  onSelectTemplate,
  onDeleteTemplate,
}) => {
  return (
    <div className="p-6 border-4 border-emerald-600 rounded-lg flex-1">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
          {templates.map((template: EmailTemplate) => (
            <div
              key={template.id}
              className="bg-zinc-800 p-6 rounded-lg border border-zinc-700 hover:shadow-md cursor-pointer relative group space-y-2"
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
