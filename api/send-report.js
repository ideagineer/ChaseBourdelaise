// api/send-report.js
// Vercel Serverless Function (CommonJS)
// Receives: { name, email, company, pdfBase64, pdfFilename }
// Actions:  1. Email PDF via Resend  2. Subscribe to Beehiiv newsletter

const BEEHIIV_API_KEY = "cZ1LqaKbzLI6u3jrOsrtXvKv4lQ0S9HhVdWaRsIFw1dj6muYg2QV3VY2TZhpyYgd";
const BEEHIIV_PUB_ID  = "cf9a1761-8853-43a6-94db-9899326ade5c";

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://chasebourdelaise.com");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, company, pdfBase64, pdfFilename } = req.body || {};

  if (!email || !pdfBase64) {
    return res.status(400).json({ error: "Missing required fields: email, pdfBase64" });
  }

  const firstName = name ? name.split(" ")[0] : "there";
  const errors = [];

  // Strip data URI prefix — Resend needs raw base64 only, not the full data URI
  const rawBase64 = pdfBase64.replace(/^data:[^;]+;base64,/, "");

  // ─── 1. Send PDF via Resend ───────────────────────────────────────────────
  try {
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Chase Bourdelaise <hi@send.chasebourdelaise.com>",
        reply_to: "chase.bourdelaise@transwestern.com",
        to: [email],
        bcc: ["chase.bourdelaise@transwestern.com"],
        subject: `Your Space Assessment Report — ${company || "Workplace Strategy"}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a1a2e;">
            <div style="background: #051C2C; padding: 32px 40px;">
              <p style="color: #C9A84C; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; margin: 0;">
                Chase Bourdelaise · Transwestern
              </p>
            </div>
            <div style="padding: 40px;">
              <p style="font-size: 18px; margin: 0 0 20px;">Hi ${firstName},</p>
              <p style="font-size: 15px; line-height: 1.7; margin: 0 0 20px;">
                Thank you for completing the Space Assessment. Attached is your personalized
                workplace strategy report — built from the inputs you provided.
              </p>
              <p style="font-size: 15px; line-height: 1.7; margin: 0 0 20px;">
                I'll follow up shortly to walk through the findings and discuss next steps
                for your portfolio. In the meantime, feel free to reach out directly.
              </p>
              <p style="font-size: 15px; line-height: 1.7; margin: 0 0 32px;">
                Best,<br/>
                <strong>Chase Bourdelaise</strong><br/>
                Managing Director, Global Consulting Services<br/>
                Transwestern<br/>
                <a href="tel:2025911926" style="color: #051C2C;">202-591-1926</a>
              </p>
              <div style="border-top: 1px solid #D8DDE5; padding-top: 24px; font-size: 12px; color: #888;">
                <p style="margin: 0;">
                  This report was generated from your responses to the Space Assessment Tool
                  at <a href="https://chasebourdelaise.com" style="color: #051C2C;">chasebourdelaise.com</a>.
                </p>
              </div>
            </div>
          </div>
        `,
        attachments: [
          {
            filename: pdfFilename || "Space-Assessment-Report.pdf",
            content: rawBase64,
          },
        ],
      }),
    });

    if (!resendRes.ok) {
      const errBody = await resendRes.text();
      console.error("Resend error:", resendRes.status, errBody);
      errors.push(`Resend: ${resendRes.status} — ${errBody}`);
    }
  } catch (err) {
    console.error("Resend exception:", err);
    errors.push("Resend: network error");
  }

  // ─── 2. Subscribe to Beehiiv ─────────────────────────────────────────────
  try {
    const beehiivRes = await fetch(
      `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUB_ID}/subscriptions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${BEEHIIV_API_KEY}`,
        },
        body: JSON.stringify({
          email,
          reactivate_existing: false,
          send_welcome_email: true,
          utm_source: "space-assessment-tool",
          utm_medium: "website",
          utm_campaign: "tool-submission",
          referring_site: "chasebourdelaise.com",
          custom_fields: [
            { name: "First Name", value: firstName },
            { name: "Company",    value: company || "" },
          ],
        }),
      }
    );

    if (!beehiivRes.ok) {
      const errBody = await beehiivRes.text();
      console.error("Beehiiv error:", beehiivRes.status, errBody);
      errors.push(`Beehiiv: ${beehiivRes.status}`);
    }
  } catch (err) {
    console.error("Beehiiv exception:", err);
    errors.push("Beehiiv: network error");
  }

  // ─── Response ─────────────────────────────────────────────────────────────
  const resendFailed = errors.some((e) => e.startsWith("Resend"));
  if (resendFailed) {
    return res.status(500).json({ error: "Failed to send report email.", details: errors });
  }

  return res.status(200).json({
    success: true,
    message: "Report sent successfully.",
    warnings: errors.length ? errors : undefined,
  });
};
