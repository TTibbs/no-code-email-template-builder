import { useState } from "react";
import { EmailTemplate, TemplateComponent } from "@/types";

interface UseDragAndDropProps {
  activeTemplate: EmailTemplate | null;
  setActiveTemplate: (template: EmailTemplate | null) => void;
}

export function useDragAndDrop({
  activeTemplate,
  setActiveTemplate,
}: UseDragAndDropProps) {
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [draggedComponentType, setDraggedComponentType] = useState<
    string | null
  >(null);

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

  return {
    draggedItem,
    dragOverIndex,
    draggedComponentType,
    handleComponentDragStart,
    handleDragStart,
    handleDragOver,
    handleTemplateAreaDragOver,
    handleDragEnter,
    handleDragEnd,
    handleDrop,
  };
}
