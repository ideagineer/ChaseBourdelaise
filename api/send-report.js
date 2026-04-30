// api/send-report.js
// Vercel serverless function — receives PDF as base64, emails it to the client
// Deploy: commit this file to /api/send-report.js in your GitHub repo
// Setup:  1. Sign up at resend.com (free: 3,000 emails/month)
//         2. Add and verify chasebourdelaise.com as a sending domain
//         3. Create an API key in Resend dashboard
//         4. In Vercel: Settings → Environment Variables → add RESEND_API_KEY

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, name, company, filename, pdf_b64, rsf, industry } = req.body || {};

  if (!to || !pdf_b64) {
    return res.status(400).json({ error: 'Missing required fields: to, pdf_b64' });
  }

  const RESEND_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_KEY) {
    console.error('RESEND_API_KEY not set in environment');
    return res.status(500).json({ error: 'Email service not configured' });
  }

  // Strip the data URI prefix to get raw base64
  // pdf_b64 arrives as "data:application/pdf;base64,JVBERi0x..."
  const base64Content = pdf_b64.includes(',') ? pdf_b64.split(',')[1] : pdf_b64;

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <style>
    body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; background: #f8f9fb; }
    .wrap { max-width: 600px; margin: 40px auto; background: #fff; }
    .header { background: #051C2C; padding: 36px 40px; }
    .header h1 { color: #fff; font-size: 20px; margin: 0 0 4px; font-weight: 600; }
    .header p { color: rgba(255,255,255,0.45); font-size: 13px; margin: 0; }
    .body { padding: 36px 40px; }
    .body h2 { font-size: 22px; color: #051C2C; margin: 0 0 12px; }
    .body p { font-size: 14px; line-height: 1.75; color: #4A5568; margin: 0 0 16px; }
    .metric { background: #F8F9FB; border-left: 3px solid #2251FF; padding: 14px 18px; margin: 20px 0; }
    .metric .lbl { font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: #8A9BB0; margin-bottom: 4px; }
    .metric .val { font-size: 28px; font-weight: 700; color: #051C2C; line-height: 1; }
    .metric .sub { font-size: 12px; color: #8A9BB0; margin-top: 4px; }
    .cta { display: inline-block; background: #2251FF; color: #fff; padding: 12px 24px; text-decoration: none; font-size: 13px; font-weight: 600; letter-spacing: 0.08em; margin: 8px 0 24px; }
    .footer { background: #051C2C; padding: 24px 40px; }
    .footer p { color: rgba(255,255,255,0.35); font-size: 11px; margin: 0; line-height: 1.7; }
    .footer a { color: rgba(255,255,255,0.55); text-decoration: none; }
  </style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <h1>Chase Bourdelaise</h1>
    <p>Tenant Advisory &amp; Portfolio Strategy &nbsp;·&nbsp; Transwestern</p>
  </div>
  <div class="body">
    <h2>Your Office Space Program</h2>
    <p>Hi ${name || 'there'},</p>
    <p>
      Thank you for completing the Office Space Assessment for <strong>${company || 'your organization'}</strong>. 
      Your preliminary space program report is attached to this email.
    </p>
    ${rsf ? `
    <div class="metric">
      <div class="lbl">Estimated Rentable Square Footage</div>
      <div class="val">${rsf} RSF</div>
      ${industry ? `<div class="sub">${industry} industry benchmark included</div>` : ''}
    </div>
    ` : ''}
    <p>
      The attached PDF includes your full space program breakdown, meeting room program, 
      amenity list, a strategic planning guide with questions to work through before 
      finalizing your program, and a summary of next steps.
    </p>
    <p>
      I'll be reaching out personally to review the numbers, answer any questions, and — 
      if the timing is right — begin looking at the market together. In the meantime, 
      feel free to reply to this email or call me directly.
    </p>
    <a href="https://www.chasebourdelaise.com/contact.html" class="cta">Schedule a Call</a>
    <p style="font-size:13px;color:#8A9BB0;margin-top:8px;">
      This report is preliminary and based solely on the inputs you provided. 
      All numbers should be verified through an architect's test-fit.
    </p>
  </div>
  <div class="footer">
    <p>
      <strong style="color:rgba(255,255,255,0.75);">Chase Bourdelaise</strong><br/>
      Managing Director &nbsp;·&nbsp; Transwestern &nbsp;·&nbsp; Laise Capital LLC<br/>
      <a href="mailto:chase.bourdelaise@transwestern.com">chase.bourdelaise@transwestern.com</a>
      &nbsp;·&nbsp; (202) 591-1926<br/>
      <a href="https://www.chasebourdelaise.com">chasebourdelaise.com</a>
    </p>
  </div>
</div>
</body>
</html>
`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Chase Bourdelaise <hi@send.chasebourdelaise.com>',
        to: [to],
        reply_to: 'chase.bourdelaise@transwestern.com',
        subject: `Your Office Space Program — ${company || 'Space Assessment'}`,
        html: emailHtml,
        attachments: [
          {
            filename: filename || 'Space-Program.pdf',
            content: base64Content,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend error:', data);
      return res.status(response.status).json({ error: data.message || 'Email send failed' });
    }

    // Also BCC Chase so he sees every submission
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Space Assessment Tool <hi@send.chasebourdelaise.com>',
        to: ['chase.bourdelaise@transwestern.com'],
        subject: `[New Lead] Space Assessment — ${company} (${to})`,
        html: `<p>New space assessment submitted by <strong>${name}</strong> at <strong>${company}</strong> (${to}).</p><p>Est. RSF: <strong>${rsf}</strong> | Industry: ${industry}</p><p>PDF report attached — this is what they received.</p>`,
        attachments: [{ filename: filename || 'Space-Program.pdf', content: base64Content }],
      }),
    }).catch(e => console.warn('Chase copy failed:', e.message));

    return res.status(200).json({ success: true, id: data.id });

  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: err.message });
  }
}
