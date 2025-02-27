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

    const { data, error } = await resend.emails.send({
      from: "ByteWard Solutions <no-reply@bytewardsolutions.co.uk>",
      to: ["terry.ward@bytewardsolutions.co.uk"],
      subject,
      html,
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
