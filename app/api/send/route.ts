import { NextRequest } from "next/server";
import { Resend } from "resend";
import { renderEmail } from "@/lib/renderEmailTemplate.server";
import { TemplateComponent } from "@/types";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(request: NextRequest) {
  try {
    if (!resend) {
      console.error("Resend API key is not configured");
      return Response.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    const { name, subject, content } = await request.json();

    if (!name || !subject || !content) {
      return Response.json(
        { error: "Missing required template data" },
        { status: 400 }
      );
    }

    // Dynamically render the email HTML
    const html = await renderEmail(content as TemplateComponent[]);

    console.log("Sending email with data:", { name, subject, content });

    // Extract image data to create attachments with Content-IDs for inline embedding
    const attachments: any[] = [];

    // First pass: Process images and generate CIDs
    const processedContent = content.map((component: TemplateComponent) => {
      if (component.type === "image" && component.src) {
        // Create a clean unique Content-ID for this image
        const contentId = `image-${component.id}`;

        // If it's a data URI
        if (component.src.startsWith("data:image")) {
          const matches = component.src.match(
            /^data:image\/(\w+);base64,(.+)$/
          );
          if (matches && matches.length === 3) {
            const imageType = matches[1];
            const base64Data = matches[2];

            // Add to attachments with Content-ID
            attachments.push({
              filename: `image-${component.id}.${imageType}`,
              content: base64Data,
              encoding: "base64",
              contentType: `image/${imageType}`,
              disposition: "inline",
              contentId, // Simplified Content-ID format
            });

            // Update the component to use the CID reference - critical for correct inline display
            return {
              ...component,
              originalSrc: component.src,
              src: `cid:${contentId}`,
            };
          }
        }
        // If it's an external URL, we'll keep it as is
        else if (
          component.src.startsWith("http://") ||
          component.src.startsWith("https://")
        ) {
          return component;
        }
      }
      return component;
    });

    // Use the processed content with CID references for rendering
    const updatedHtml = await renderEmail(
      processedContent as TemplateComponent[]
    );

    // Debug output to help diagnose the issue
    console.log(
      "Sending email with attachments:",
      attachments.map((a) => ({
        contentId: a.contentId,
        filename: a.filename,
      }))
    );

    const { data, error } = await resend.emails.send({
      from: "Place your no-reply email here",
      to: ["Place your to email here"],
      subject,
      html: updatedHtml,
      attachments,
    });

    if (error) {
      console.error("Resend API error:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({
      message: "Test email sent successfully",
      id: data?.id,
    });
  } catch (error: any) {
    console.error("Server error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
