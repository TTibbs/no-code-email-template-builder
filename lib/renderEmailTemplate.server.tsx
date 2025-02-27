import { EmailTemplate } from "@/components/email-template";
import { TemplateComponent } from "@/types";

export async function renderEmail(
  content: TemplateComponent[]
): Promise<string> {
  const ReactDOMServer = await import("react-dom/server");
  return ReactDOMServer.renderToStaticMarkup(
    <EmailTemplate content={content} />
  );
}
