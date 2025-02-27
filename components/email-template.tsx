import * as React from "react";
import { TemplateComponent } from "@/types";

interface EmailTemplateProps {
  content: TemplateComponent[];
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({ content }) => (
  <div
    style={{
      fontFamily: "Arial, sans-serif",
      color: "#333",
      maxWidth: "600px",
      margin: "0 auto",
      padding: "20px",
      border: "1px solid #eaeaea",
      borderRadius: "5px",
    }}
  >
    {content.map((component) => {
      switch (component.type) {
        case "header":
          return (
            <h1
              key={component.id}
              style={{
                textAlign: component.align,
                color: component.color,
              }}
            >
              {component.value}
            </h1>
          );
        case "text":
          return (
            <p
              key={component.id}
              style={{
                textAlign: component.align,
                color: component.color,
              }}
            >
              {component.value}
            </p>
          );
        case "button":
          return (
            <div key={component.id} style={{ textAlign: component.align }}>
              <a
                href={component.link}
                style={{
                  display: "inline-block",
                  padding: "10px 20px",
                  backgroundColor: component.bgColor,
                  color: component.color,
                  textDecoration: "none",
                  borderRadius: "4px",
                }}
              >
                {component.value}
              </a>
            </div>
          );
        case "divider":
          return (
            <hr
              key={component.id}
              style={{
                border: "0",
                borderTop: "1px solid #eaeaea",
                margin: "20px 0",
              }}
            />
          );
        case "spacer":
          return (
            <div
              key={component.id}
              style={{ height: `${component.height}px` }}
            />
          );
        default:
          return null;
      }
    })}
  </div>
);
