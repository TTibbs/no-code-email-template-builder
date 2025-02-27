import React from "react";
import { AlignLeft, AlignCenter, AlignRight, X } from "lucide-react";
import { ComponentRendererProps } from "@/types";

const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  component,
  onRemove,
  onUpdate,
  index,
  isDragging,
  showDropBefore,
  showDropAfter,
  onDragStart,
  onDragOver,
  onDragEnter,
  onDragEnd,
  onDrop,
}) => {
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
        onDragStart={(e) => onDragStart(e, index)}
        onDragOver={(e) => onDragOver(e, index)}
        onDragEnter={onDragEnter}
        onDragEnd={onDragEnd}
        onDrop={onDrop}
      >
        {/* Remove Button - Always visible */}
        <button
          className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 z-20"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(component.id);
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
                onUpdate(component.id, { align: "left" });
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
                onUpdate(component.id, { align: "center" });
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
                onUpdate(component.id, { align: "right" });
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
                  onUpdate(component.id, { value: e.target.value })
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
                  onUpdate(component.id, { value: e.target.value })
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
                    onUpdate(component.id, { value: e.target.value })
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
                onUpdate(component.id, {
                  height: component.height + 10,
                })
              }
            ></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComponentRenderer;
