import { TemplateComponent } from "./common";

export interface ComponentRendererProps {
  component: TemplateComponent;
  onRemove: (id: number) => void;
  onUpdate: (id: number, updates: Partial<TemplateComponent>) => void;
  index: number;
  isDragging: boolean;
  showDropBefore: boolean;
  showDropAfter: boolean;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragEnter: (e: React.DragEvent) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export interface ComponentListProps {
  components: { type: string; label: string }[];
  onDragStart: (e: React.DragEvent, type: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
}

export interface TemplateListProps {
  templates: any[];
  onSelectTemplate: (template: any) => void;
  onCreateTemplate: () => void;
  onDeleteTemplate: (id: number, e: React.MouseEvent) => void;
}
