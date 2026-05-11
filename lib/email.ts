import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendBulkEmailParams {
  to: string[];
  subject: string;
  html: string;
}

export async function sendBulkEmail({ to, subject, html }: SendBulkEmailParams) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_placeholder") {
    console.warn("[email] RESEND_API_KEY no configurado — correo simulado");
    return { success: true, simulated: true };
  }

  const results = [];
  for (let i = 0; i < to.length; i += 50) {
    const batch = to.slice(i, i + 50);
    const result = await resend.emails.send({
      from: "Club de Golf México <noreply@clubdegolfmexico.mx>",
      to: batch,
      subject,
      html,
    });
    results.push(result);
  }
  return { success: true, results };
}

export function buildEmailHtml(subject: string, body: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: sans-serif; color: #1A3D2B; max-width: 600px; margin: 0 auto; }
    .header { background: #1A3D2B; padding: 24px; text-align: center; }
    .header h1 { color: #B8922A; margin: 0; font-size: 20px; }
    .content { padding: 32px 24px; line-height: 1.6; }
    .footer { background: #F7F3EC; padding: 16px 24px; font-size: 12px; color: #666; text-align: center; }
  </style>
</head>
<body>
  <div class="header"><h1>Club de Golf México</h1></div>
  <div class="content">
    <h2>${subject}</h2>
    <div>${body.replace(/\n/g, "<br>")}</div>
  </div>
  <div class="footer">
    Residencial Club de Golf México · Arenal Tepepan, Tlalpan, CDMX
  </div>
</body>
</html>`;
}
