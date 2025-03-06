import React from "react";
import { Copy, Send, Save } from "lucide-react";

interface EmailTemplateActionsProps {
  onDuplicate: () => void;
  onSendTest: () => void;
  onSave: () => void;
  isSubmitting: boolean;
}

export function EmailTemplateActions({
  onDuplicate,
  onSendTest,
  onSave,
  isSubmitting,
}: EmailTemplateActionsProps) {
  return (
    <div className="bg-zinc-800 border-b border-zinc-700 p-2 flex justify-end">
      <div className="flex gap-2">
        <button
          className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 rounded text-sm font-medium flex items-center gap-1 cursor-pointer"
          onClick={onDuplicate}
        >
          <Copy size={16} />
          Duplicate
        </button>
        <button
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-emerald-500 rounded text-sm font-medium flex items-center gap-1 cursor-pointer"
          onClick={onSendTest}
          disabled={isSubmitting}
        >
          <Send size={16} />
          {isSubmitting ? "Sending..." : "Send Test"}
        </button>
        <button
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-700 text-white rounded text-sm font-medium flex items-center gap-1 cursor-pointer"
          onClick={onSave}
        >
          <Save size={16} />
          Save
        </button>
      </div>
    </div>
  );
}
