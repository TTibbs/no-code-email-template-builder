import React from "react";
import { EmailTemplate } from "@/types";

interface EmailTemplateMetadataProps {
  template: EmailTemplate;
  onUpdate: (updates: Partial<EmailTemplate>) => void;
}

export function EmailTemplateMetadata({
  template,
  onUpdate,
}: EmailTemplateMetadataProps) {
  return (
    <div className="bg-zinc-800 border-b border-zinc-700 p-4">
      <div className="max-w-xl mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Template Name
            </label>
            <input
              className="w-full p-2 border border-zinc-600 text-zinc-300 rounded bg-zinc-700"
              value={template?.name || ""}
              onChange={(e) =>
                onUpdate({
                  name: e.target.value,
                })
              }
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">
            Subject Line
          </label>
          <input
            className="w-full p-2 border border-zinc-600 text-zinc-300 rounded bg-zinc-700"
            value={template?.subject || ""}
            onChange={(e) =>
              onUpdate({
                subject: e.target.value,
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
