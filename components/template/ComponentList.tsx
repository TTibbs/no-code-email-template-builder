import React from "react";
import { ComponentListProps } from "@/types";

const ComponentList: React.FC<ComponentListProps> = ({
  components,
  onDragStart,
  onDragEnd,
}) => {
  return (
    <div className="w-64 bg-zinc-800 border-r border-zinc-700 p-4 overflow-y-auto">
      <h2 className="text-sm font-medium mb-4 text-zinc-300">Components</h2>
      <div className="space-y-2 text-zinc-300">
        {components.map((component) => (
          <div
            key={component.type}
            className="bg-zinc-700 p-3 rounded border border-zinc-600 hover:border-emerald-500 cursor-grab shadow-sm transition-colors duration-200"
            draggable
            onDragStart={(e) => onDragStart(e, component.type)}
            onDragEnd={onDragEnd}
          >
            <span className="text-sm">{component.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComponentList;
