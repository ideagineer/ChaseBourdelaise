// api/send-report.js
// CommonJS — required for Vercel static-site repos without package.json type:module
// Vercel automatically parses JSON bodies when Content-Type: application/json

module.exports = async function handler(req, res) {
  // CORS — allows browser fetch from any origin
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Vercel parses JSON body automatically for Content-Type: application/json
  const body = req.body || {};
  const { to, name, company, filename, pdf_b64, rsf, industry } = body;

  // Validate
  if (!to) return res.status(400).json({ error: 'Missing: to' });
  if (!pdf_b64) return res.status(400).json({ error: 'Missing: pdf_b64' });

  const RESEND_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_KEY) {
    console.error('[send-report] RESEND_API_KEY not set');
    return res.status(500).json({ error: 'Email service not configured — RESEND_API_KEY missing' });
  }

  // Strip the data:application/pdf;base64, prefix if present
  const b64 = pdf_b64.includes(',') ? pdf_b64.split(',')[1] : pdf_b64;

  console.log('[send-report] Sending to:', to, '| company:', company, '| PDF bytes (approx):', Math.round(b64.length * 0.75));

  const emailHtml = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/>
<style>
  body{font-family:Arial,sans-serif;color:#333;margin:0;padding:0;background:#f8f9fb;}
  .wrap{max-width:600px;margin:40px auto;background:#fff;}
  .hdr{background:#051C2C;padding:36px 40px;}
  .hdr h1{color:#fff;font-size:20px;margin:0 0 4px;font-weight:600;}
  .hdr p{color:rgba(255,255,255,0.45);font-size:13px;margin:0;}
  .body{padding:36px 40px;}
  .body h2{font-size:22px;color:#051C2C;margin:0 0 12px;}
  .body p{font-size:14px;line-height:1.75;color:#4A5568;margin:0 0 16px;}
  .metric{background:#F8F9FB;border-left:3px solid #2251FF;padding:14px 18px;margin:20px 0;}
  .metric .lbl{font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#8A9BB0;margin-bottom:4px;}
  .metric .val{font-size:28px;font-weight:700;color:#051C2C;line-height:1;}
  .metric .sub{font-size:12px;color:#8A9BB0;margin-top:4px;}
  .cta{display:inline-block;background:#2251FF;color:#fff !important;padding:12px 24px;text-decoration:none;font-size:13px;font-weight:600;margin:8px 0 24px;}
  .ftr{background:#051C2C;padding:24px 40px;}
  .ftr p{color:rgba(255,255,255,0.35);font-size:11px;margin:0;line-height:1.8;}
  .ftr a{color:rgba(255,255,255,0.55);text-decoration:none;}
</style>
</head>
<body>
<div class="wrap">
  <div class="hdr">
    <h1>Chase Bourdelaise</h1>
    <p>Tenant Advisory &amp; Portfolio Strategy &nbsp;&middot;&nbsp; Transwestern</p>
  </div>
  <div class="body">
    <h2>Your Office Space Program</h2>
    <p>Hi ${name || 'there'},</p>
    <p>Thank you for completing the Office Space Assessment for <strong>${company || 'your organization'}</strong>. Your preliminary space program report is attached to this email.</p>
    ${rsf ? `<div class="metric">
      <div class="lbl">Estimated Rentable Square Footage</div>
      <div class="val">${rsf} RSF</div>
      ${industry ? `<div class="sub">${industry} industry benchmark included</div>` : ''}
    </div>` : ''}
    <p>The report includes your full space program breakdown, meeting room program, amenity list, a strategic planning guide, and a summary of next steps in the real estate process.</p>
    <p>I'll be reaching out personally to walk through the numbers and — if the timing is right — begin looking at the market together. In the meantime, feel free to reply to this email or call me directly.</p>
    <a href="https://www.chasebourdelaise.com/contact.html" class="cta">Schedule a Call</a>
    <p style="font-size:12px;color:#8A9BB0;margin-top:4px;">This report is preliminary. Verify all figures through an architect's test-fit.</p>
  </div>
  <div class="ftr">
    <p>
      <strong style="color:rgba(255,255,255,0.75);">Chase Bourdelaise</strong><br/>
      Managing Director &nbsp;&middot;&nbsp; Transwestern &nbsp;&middot;&nbsp; Laise Capital LLC<br/>
      <a href="mailto:chase.bourdelaise@transwestern.com">chase.bourdelaise@transwestern.com</a> &nbsp;&middot;&nbsp; (202) 591-1926<br/>
      <a href="https://www.chasebourdelaise.com">chasebourdelaise.com</a>
    </p>
  </div>
</div>
</body>
</html>`;

  try {
    // ── Send to client ────────────────────────────────────────────────────
    const clientRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Chase Bourdelaise <hi@send.chasebourdelaise.com>',
        to: [to],
        reply_to: 'chase.bourdelaise@transwestern.com',
        subject: `Your Office Space Program \u2014 ${company || 'Space Assessment'}`,
        html: emailHtml,
        attachments: [{
          filename: filename || 'Space-Program.pdf',
          content: b64
        }]
      })
    });

    const clientData = await clientRes.json();

    if (!clientRes.ok) {
      console.error('[send-report] Resend error sending to client:', JSON.stringify(clientData));
      return res.status(clientRes.status).json({ error: clientData.message || 'Send failed', detail: clientData });
    }

    console.log('[send-report] Client email sent, id:', clientData.id);

    // ── Send copy to Chase (fire and forget) ─────────────────────────────
    fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Space Assessment <hi@send.chasebourdelaise.com>',
        to: ['chase.bourdelaise@transwestern.com'],
        reply_to: to,
        subject: `[New Lead] ${company || 'Unknown'} \u2014 ${to}`,
        html: `<p><strong>${name}</strong> at <strong>${company}</strong> (${to}) submitted a space assessment.</p>
               <p>Est. RSF: <strong>${rsf}</strong> | Industry: ${industry}</p>
               <p>PDF attached &mdash; same report they received.</p>`,
        attachments: [{
          filename: filename || 'Space-Program.pdf',
          content: b64
        }]
      })
    }).then(r => r.json()).then(d => {
      console.log('[send-report] Chase copy sent, id:', d.id || d.message);
    }).catch(e => {
      console.warn('[send-report] Chase copy failed:', e.message);
    });

    return res.status(200).json({ success: true, id: clientData.id });

  } catch (err) {
    console.error('[send-report] Unexpected error:', err.message, err.stack);
    return res.status(500).json({ error: err.message });
  }
};
