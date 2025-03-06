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
  src?: string | undefined;
};

export type EmailTemplate = {
  id: number;
  name: string;
  subject: string;
  content: TemplateComponent[];
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: string;
  preferences?: {
    theme?: "light" | "dark";
    emailNotifications?: boolean;
  };
};
