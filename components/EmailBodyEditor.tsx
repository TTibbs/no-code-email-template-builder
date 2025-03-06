import React from "react";

interface EmailBodyEditorProps {
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  children: React.ReactNode;
}

export function EmailBodyEditor({
  onDragOver,
  onDrop,
  children,
}: EmailBodyEditorProps) {
  return (
    <div
      className="flex-1 overflow-y-auto p-6 bg-zinc-900"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-sm p-6 min-h-full">
        {children}
      </div>
    </div>
  );
}
