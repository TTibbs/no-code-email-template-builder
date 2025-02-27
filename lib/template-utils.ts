import { EmailTemplate, TemplateComponent } from "@/types";

// Create a new template
export const createTemplate = (): EmailTemplate => {
  return {
    id: Date.now(),
    name: "New Template",
    subject: "New Subject",
    content: [],
  };
};

// Get default content for a new template
export const getDefaultTemplateContent = (): TemplateComponent[] => {
  return [
    {
      id: 1,
      type: "header",
      value: "Welcome to our service",
      align: "center",
      color: "#333333",
    },
    {
      id: 2,
      type: "text",
      value:
        "We're glad to have you on board! Here's what you need to know to get started.",
      align: "left",
      color: "#666666",
    },
    {
      id: 3,
      type: "button",
      value: "Get Started",
      link: "#",
      align: "center",
      color: "#ffffff",
      bgColor: "#4F46E5",
    },
  ];
};

// Create a new component
export const createComponent = (type: string): TemplateComponent => {
  return {
    id: Date.now(),
    type,
    value:
      type === "header"
        ? "Header Text"
        : type === "text"
        ? "Add your text here"
        : type === "button"
        ? "Click Me"
        : "",
    align: "left",
    color: type === "button" ? "#ffffff" : "#333333",
    bgColor: type === "button" ? "#4F46E5" : "transparent",
    link: type === "button" ? "#" : "",
    height: type === "spacer" ? 20 : undefined,
  };
};

// Add component to template
export const addComponentToTemplate = (
  template: EmailTemplate,
  component: TemplateComponent
): EmailTemplate => {
  return {
    ...template,
    content: [...template.content, component],
  };
};

// Remove component from template
export const removeComponentFromTemplate = (
  template: EmailTemplate,
  componentId: number
): EmailTemplate => {
  return {
    ...template,
    content: template.content.filter((item) => item.id !== componentId),
  };
};

// Update component in template
export const updateComponentInTemplate = (
  template: EmailTemplate,
  componentId: number,
  updates: Partial<TemplateComponent>
): EmailTemplate => {
  return {
    ...template,
    content: template.content.map((item) =>
      item.id === componentId ? { ...item, ...updates } : item
    ),
  };
};

// Save templates to local storage
export const saveTemplatesToStorage = (templates: EmailTemplate[]): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("emailTemplates", JSON.stringify(templates));
  }
};

// Get templates from local storage
export const getTemplatesFromStorage = (): EmailTemplate[] => {
  if (typeof window !== "undefined") {
    const templates = localStorage.getItem("emailTemplates");
    return templates ? JSON.parse(templates) : [];
  }
  return [];
};

// Get a template by ID
export const getTemplateById = (id: number): EmailTemplate | null => {
  const templates = getTemplatesFromStorage();
  return templates.find((template) => template.id === id) || null;
};

// Save a single template
export const saveTemplateToStorage = (template: EmailTemplate): void => {
  const templates = getTemplatesFromStorage();
  const existingIndex = templates.findIndex((t) => t.id === template.id);

  if (existingIndex >= 0) {
    templates[existingIndex] = template;
  } else {
    templates.push(template);
  }

  saveTemplatesToStorage(templates);
};
