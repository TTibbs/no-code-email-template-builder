export type ComponentItem = {
  type: "header" | "text" | "image" | "button" | "divider" | "spacer";
  label: string;
};

export type TemplateComponent = {
  id: number;
  type: string;
  value?: string;
  align?: "left" | "center" | "right";
  color?: string;
  bgColor?: string;
  link?: string;
  height?: number;
};

export type EmailTemplate = {
  id: number;
  name: string;
  subject: string;
  content: TemplateComponent[];
};
