// api/send-report.js
// Vercel Serverless Function (CommonJS)
// Receives structured space program data, sends rich HTML report email via Resend

const BEEHIIV_API_KEY = "cZ1LqaKbzLI6u3jrOsrtXvKv4lQ0S9HhVdWaRsIFw1dj6muYg2QV3VY2TZhpyYgd";
const BEEHIIV_PUB_ID  = "pub_cf9a1761-8853-43a6-94db-9899326ade5c";

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://chasebourdelaise.com");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const {
    name, email, company, title, phone, questions,
    rsf, rsfPerSeat, industryLabel, industryBenchmark,
    hcNow, hcYr3, hcYr5, daysInOffice, sharedPct,
    totalDesks, deskRatio, numOffices, numWS,
    layoutLabel, layoutSF, wsSF, rmSF, amSF,
    prog, usable, circPct, lossPct,
    rooms, amenities, amenNotes
  } = req.body || {};

  if (!email) return res.status(400).json({ error: "Missing email" });

  const firstName = name ? name.split(" ")[0] : "there";
  const dateStr = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const errors = [];

  const fmt  = (n) => (n > 0 ? Number(n).toLocaleString() : "—");
  const fmtSF = (n) => (n > 0 ? Number(n).toLocaleString() + " SF" : "—");
  const lo = rsf > 0 ? Math.round(rsf * 0.92 / 100) * 100 : 0;
  const hi = rsf > 0 ? Math.round(rsf * 1.08 / 100) * 100 : 0;

  // ── Contextual strategic questions ─────────────────────────────────────────
  const stratQuestions = [];

  if (Number(daysInOffice) <= 2) {
    stratQuestions.push(`Your team is in the office ${daysInOffice} day(s)/week — one of the lowest hybrid utilization patterns. Before committing to space, confirm with leadership whether this policy is permanent or transitional. A shift to 3+ days could materially increase your peak-day density and require more desks than this program projects.`);
  } else if (Number(daysInOffice) >= 4) {
    stratQuestions.push(`At ${daysInOffice} days/week in the office, your utilization is above the current market average of ~2.8 days. This validates a higher desk-to-person ratio and suggests you'll get strong ROI from investment in the physical environment — people are actually showing up.`);
  } else {
    stratQuestions.push(`Your ${daysInOffice}-day hybrid pattern is at the market average, but peak days (typically Tue–Thu) drive your real space requirement. Have you analyzed badge data or calendar utilization to understand actual peak occupancy vs. average attendance? That number is what truly sizes your footprint.`);
  }

  if (deskRatio && parseFloat(deskRatio) < 0.75) {
    stratQuestions.push(`Your desk-to-person ratio of ${deskRatio}:1 is aggressive. This works when sharing is actively managed — but without booking systems, clear protocols, and leadership buy-in, shared seating creates friction that erodes culture. What's your plan for day-to-day enforcement?`);
  } else if (deskRatio && parseFloat(deskRatio) > 0.95) {
    stratQuestions.push(`Your desk-to-person ratio of ${deskRatio}:1 is conservative — nearly one desk per person. This avoids hoteling friction but comes at a cost per seat. Even a modest increase in sharing (10–15%) could meaningfully reduce your footprint and your rent obligation over the lease term.`);
  }

  if (industryBenchmark && rsfPerSeat) {
    const diff = Number(rsfPerSeat) - Number(industryBenchmark);
    if (diff > 40) {
      stratQuestions.push(`Your program runs ${diff} RSF/seat above the ${industryLabel} benchmark of ${industryBenchmark} RSF/seat. This typically reflects a higher proportion of private offices, larger conference rooms, or above-average amenity investment. Before finalizing, ask whether these choices reflect genuine operational need — or legacy culture.`);
    } else if (diff < -30) {
      stratQuestions.push(`Your program runs ${Math.abs(diff)} RSF/seat below the ${industryLabel} benchmark of ${industryBenchmark} RSF/seat. This is efficient — but verify that meeting room counts, focus space, and amenities are truly adequate for your team's work patterns. A tight footprint that constrains collaboration often costs more in productivity than it saves in rent.`);
    } else {
      stratQuestions.push(`Your program at ${rsfPerSeat} RSF/seat is closely aligned with the ${industryLabel} benchmark of ${industryBenchmark} RSF/seat. This is a good sign that your inputs reflect market-calibrated assumptions. The test-fit study on your top candidate buildings will confirm whether the program lays out efficiently on their floor plates.`);
    }
  }

  stratQuestions.push(`Your Year 3 headcount is ${hcYr3} and Year 5 is ${hcYr5}. Are these projections conservative or aggressive? Over-building for growth you don't achieve is expensive. Does your lease structure include expansion options or rights of first refusal on adjacent space? This is one of the most valuable — and most frequently negotiated — lease provisions.`);

  stratQuestions.push(`At what headcount threshold would you need to expand? At what headcount would you start subleasing? Knowing these numbers before you sign protects you from being locked into the wrong size. I'll walk through this with you on our call.`);

  // ── Build rooms table HTML ──────────────────────────────────────────────────
  let roomsHTML = `<p style="font-size:13px;color:#8A9BB0;margin:0;font-family:Arial,sans-serif;">No meeting rooms specified.</p>`;
  if (rooms && rooms.length > 0) {
    const rows = rooms.map((r, i) => `
      <tr style="background:${i % 2 === 0 ? "#fff" : "#F8F9FB"};">
        <td style="padding:9px 12px;font-size:13px;color:#051C2C;border-bottom:1px solid #D8DDE5;font-family:Arial,sans-serif;">${r.name}</td>
        <td style="padding:9px 12px;font-size:13px;color:#051C2C;text-align:center;border-bottom:1px solid #D8DDE5;font-family:Arial,sans-serif;width:50px;">${r.qty}</td>
        <td style="padding:9px 12px;font-size:13px;color:#4A5568;text-align:right;border-bottom:1px solid #D8DDE5;font-family:Arial,sans-serif;width:90px;">${Number(r.total).toLocaleString()} SF</td>
      </tr>`).join("");
    roomsHTML = `
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        <tr style="background:#F8F9FB;">
          <td style="padding:8px 12px;font-size:10px;font-weight:600;color:#8A9BB0;text-transform:uppercase;letter-spacing:.1em;border-bottom:1px solid #D8DDE5;font-family:Arial,sans-serif;">Room Type</td>
          <td style="padding:8px 12px;font-size:10px;font-weight:600;color:#8A9BB0;text-transform:uppercase;letter-spacing:.1em;border-bottom:1px solid #D8DDE5;text-align:center;font-family:Arial,sans-serif;width:50px;">Qty</td>
          <td style="padding:8px 12px;font-size:10px;font-weight:600;color:#8A9BB0;text-transform:uppercase;letter-spacing:.1em;border-bottom:1px solid #D8DDE5;text-align:right;font-family:Arial,sans-serif;width:90px;">Total SF</td>
        </tr>
        ${rows}
        <tr style="background:#051C2C;">
          <td colspan="2" style="padding:10px 12px;font-size:12px;font-weight:700;color:#fff;font-family:Arial,sans-serif;">Total Meeting Room SF</td>
          <td style="padding:10px 12px;font-size:12px;font-weight:700;color:#fff;text-align:right;font-family:Arial,sans-serif;">${fmtSF(rmSF)}</td>
        </tr>
      </table>`;
  }

  // ── Build amenities HTML ────────────────────────────────────────────────────
  let amenHTML = "";
  if (amenities && amenities.length > 0) {
    amenHTML = `
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        ${amenities.map((a, i) => `
          <tr style="background:${i % 2 === 0 ? "#fff" : "#F8F9FB"};">
            <td style="padding:8px 12px;font-size:13px;color:#051C2C;border-bottom:1px solid #D8DDE5;font-family:Arial,sans-serif;">
              <span style="display:inline-block;width:6px;height:6px;background:#b45309;border-radius:1px;margin-right:8px;vertical-align:middle;"></span>${a.name}
            </td>
            <td style="padding:8px 12px;font-size:13px;color:#4A5568;text-align:right;border-bottom:1px solid #D8DDE5;font-family:Arial,sans-serif;">${a.sf} SF</td>
          </tr>`).join("")}
      </table>
      ${amenNotes ? `<p style="margin:12px 0 0;font-size:13px;color:#4A5568;font-family:Arial,sans-serif;"><strong style="color:#051C2C;">Additional notes:</strong> ${amenNotes}</p>` : ""}`;
  }

  // ── Build strategic questions HTML ──────────────────────────────────────────
  const questionsHTML = stratQuestions.map((q, i) => `
    <tr>
      <td style="padding:14px 0;border-bottom:1px solid #D8DDE5;vertical-align:top;">
        <table cellpadding="0" cellspacing="0"><tr>
          <td style="width:26px;vertical-align:top;padding-top:1px;">
            <div style="width:18px;height:18px;background:#051C2C;border-radius:50%;text-align:center;line-height:18px;font-size:9px;font-weight:700;color:#C9A84C;font-family:Arial,sans-serif;">${i + 1}</div>
          </td>
          <td style="font-size:13px;line-height:1.8;color:#4A5568;font-family:Arial,sans-serif;">${q}</td>
        </tr></table>
      </td>
    </tr>`).join("");

  // ── Team metrics rows ───────────────────────────────────────────────────────
  const teamRows = [
    ["People Today",          hcNow],
    ["Year 3 Headcount",      hcYr3],
    ["Year 5 Headcount",      hcYr5],
    ["Days In-Office / Week", daysInOffice + " days"],
    ["Shared Seating",        sharedPct + "% of staff"],
    ["Total Desks (Yr 3)",    fmt(totalDesks)],
    ["Desk : Person Ratio",   deskRatio + " : 1"],
    ["Private Offices",       fmt(numOffices)],
    ["Open Workstations",     fmt(numWS)],
    ["Layout Type",           layoutLabel],
    ["SF Per Desk",           layoutSF + " SF"],
  ].map(([label, val], i) => `
    <tr style="background:${i % 2 === 0 ? "#F8F9FB" : "#fff"};">
      <td style="padding:9px 12px;font-size:13px;color:#4A5568;border-bottom:1px solid #D8DDE5;font-family:Arial,sans-serif;">${label}</td>
      <td style="padding:9px 12px;font-size:13px;color:#051C2C;font-weight:600;text-align:right;border-bottom:1px solid #D8DDE5;font-family:Arial,sans-serif;">${val}</td>
    </tr>`).join("");

  // ── Assemble full HTML email ────────────────────────────────────────────────
  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Space Assessment Report — ${company || "Workplace Strategy"}</title></head>
<body style="margin:0;padding:0;background:#ECEEF1;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#ECEEF1;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- Header -->
  <tr><td style="background:#051C2C;padding:26px 40px 20px;">
    <p style="margin:0 0 5px;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#C9A84C;font-family:Arial,sans-serif;">Chase Bourdelaise &nbsp;·&nbsp; Transwestern</p>
    <p style="margin:0;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.3);font-family:Arial,sans-serif;">Space Assessment Report</p>
  </td></tr>

  <!-- RSF Hero -->
  <tr><td style="background:#051C2C;padding:4px 40px 32px;">
    <p style="margin:0 0 4px;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,.3);font-family:Arial,sans-serif;">Estimated Requirement</p>
    <p style="margin:0;font-size:54px;font-weight:700;color:#fff;letter-spacing:-2px;line-height:1;font-family:Arial,sans-serif;">${fmt(rsf)}</p>
    <p style="margin:4px 0 20px;font-size:12px;color:rgba(255,255,255,.4);font-family:Arial,sans-serif;">Rentable Square Feet${lo > 0 ? " &nbsp;·&nbsp; " + Number(lo).toLocaleString() + "–" + Number(hi).toLocaleString() + " RSF range" : ""}</p>
    <table cellpadding="0" cellspacing="0" width="100%"><tr>
      <td style="background:rgba(255,255,255,.06);border-top:2px solid #2251FF;padding:13px 16px;text-align:center;">
        <p style="margin:0 0 3px;font-size:8px;letter-spacing:1.5px;text-transform:uppercase;color:#2251FF;font-family:Arial,sans-serif;">RSF / Seat</p>
        <p style="margin:0;font-size:22px;font-weight:700;color:#fff;font-family:Arial,sans-serif;">${rsfPerSeat || "—"}</p>
      </td>
      <td style="width:3px;background:#051C2C;"></td>
      <td style="background:rgba(255,255,255,.06);border-top:2px solid #2251FF;padding:13px 16px;text-align:center;">
        <p style="margin:0 0 3px;font-size:8px;letter-spacing:1.5px;text-transform:uppercase;color:#2251FF;font-family:Arial,sans-serif;">Total Desks</p>
        <p style="margin:0;font-size:22px;font-weight:700;color:#fff;font-family:Arial,sans-serif;">${fmt(totalDesks)}</p>
      </td>
      <td style="width:3px;background:#051C2C;"></td>
      <td style="background:rgba(255,255,255,.06);border-top:2px solid ${industryBenchmark ? "#1a8a5e" : "#2251FF"};padding:13px 16px;text-align:center;">
        <p style="margin:0 0 3px;font-size:8px;letter-spacing:1.5px;text-transform:uppercase;color:${industryBenchmark ? "#1a8a5e" : "#2251FF"};font-family:Arial,sans-serif;">${industryLabel ? industryLabel + " Benchmark" : "Benchmark"}</p>
        <p style="margin:0;font-size:22px;font-weight:700;color:#fff;font-family:Arial,sans-serif;">${industryBenchmark ? industryBenchmark + " RSF" : "—"}</p>
      </td>
    </tr></table>
  </td></tr>

  <!-- Company bar -->
  <tr><td style="background:#0A2E47;padding:14px 40px;">
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="font-size:15px;font-weight:700;color:#fff;font-family:Arial,sans-serif;">${company || ""}</td>
      <td style="text-align:right;font-size:11px;color:rgba(255,255,255,.4);font-family:Arial,sans-serif;">${name || ""}${title ? " · " + title : ""} &nbsp;·&nbsp; ${dateStr}</td>
    </tr></table>
  </td></tr>

  <!-- Greeting -->
  <tr><td style="background:#fff;padding:36px 40px 24px;">
    <p style="margin:0 0 14px;font-size:17px;color:#051C2C;">Hi ${firstName},</p>
    <p style="margin:0;font-size:15px;line-height:1.8;color:#4A5568;font-family:Arial,sans-serif;">Your space program report is below — built from the inputs you provided and benchmarked against ${industryLabel ? industryLabel + " industry" : "market"} data. I'll follow up within one business day to walk through the findings and discuss next steps for your portfolio.</p>
  </td></tr>

  <!-- Space Breakdown -->
  <tr><td style="background:#fff;padding:8px 40px 32px;">
    <p style="margin:0 0 12px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#051C2C;font-weight:700;font-family:Arial,sans-serif;border-bottom:2px solid #051C2C;padding-bottom:9px;">Space Program Breakdown</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      <tr style="background:#F8F9FB;"><td style="padding:10px 12px;font-size:13px;color:#4A5568;border-bottom:1px solid #D8DDE5;font-family:Arial,sans-serif;"><span style="display:inline-block;width:8px;height:8px;background:#2251FF;border-radius:1px;margin-right:8px;vertical-align:middle;"></span>Individual Workspaces</td><td style="padding:10px 12px;font-size:13px;color:#051C2C;text-align:right;border-bottom:1px solid #D8DDE5;font-family:Arial,sans-serif;">${fmtSF(wsSF)}</td></tr>
      <tr><td style="padding:10px 12px;font-size:13px;color:#4A5568;border-bottom:1px solid #D8DDE5;font-family:Arial,sans-serif;"><span style="display:inline-block;width:8px;height:8px;background:#1a8a5e;border-radius:1px;margin-right:8px;vertical-align:middle;"></span>Meeting &amp; Collaborative Rooms</td><td style="padding:10px 12px;font-size:13px;color:#051C2C;text-align:right;border-bottom:1px solid #D8DDE5;font-family:Arial,sans-serif;">${fmtSF(rmSF)}</td></tr>
      <tr style="background:#F8F9FB;"><td style="padding:10px 12px;font-size:13px;color:#4A5568;border-bottom:1px solid #D8DDE5;font-family:Arial,sans-serif;"><span style="display:inline-block;width:8px;height:8px;background:#b45309;border-radius:1px;margin-right:8px;vertical-align:middle;"></span>Amenity &amp; Support Spaces</td><td style="padding:10px 12px;font-size:13px;color:#051C2C;text-align:right;border-bottom:1px solid #D8DDE5;font-family:Arial,sans-serif;">${fmtSF(amSF)}</td></tr>
      <tr><td style="padding:10px 12px;font-size:13px;font-weight:600;color:#051C2C;border-bottom:1px solid #D8DDE5;font-family:Arial,sans-serif;">Subtotal (Usable Program)</td><td style="padding:10px 12px;font-size:13px;font-weight:600;color:#051C2C;text-align:right;border-bottom:1px solid #D8DDE5;font-family:Arial,sans-serif;">${fmtSF(prog)}</td></tr>
      <tr style="background:#F8F9FB;"><td style="padding:10px 12px;font-size:13px;color:#4A5568;border-bottom:1px solid #D8DDE5;font-family:Arial,sans-serif;">Circulation (${circPct}%)</td><td style="padding:10px 12px;font-size:13px;color:#4A5568;text-align:right;border-bottom:1px solid #D8DDE5;font-family:Arial,sans-serif;">${fmtSF(Number(usable) - Number(prog))}</td></tr>
      <tr><td style="padding:10px 12px;font-size:13px;color:#4A5568;border-bottom:2px solid #051C2C;font-family:Arial,sans-serif;">Building Loss / Load Factor (${lossPct}%)</td><td style="padding:10px 12px;font-size:13px;color:#4A5568;text-align:right;border-bottom:2px solid #051C2C;font-family:Arial,sans-serif;">${fmtSF(Number(rsf) - Number(usable))}</td></tr>
      <tr style="background:#051C2C;"><td style="padding:12px 12px;font-size:14px;font-weight:700;color:#fff;font-family:Arial,sans-serif;">Total Rentable SF Estimate</td><td style="padding:12px 12px;font-size:14px;font-weight:700;color:#fff;text-align:right;font-family:Arial,sans-serif;">${fmtSF(rsf)}</td></tr>
    </table>
  </td></tr>

  <!-- Team Program -->
  <tr><td style="background:#fff;padding:8px 40px 32px;border-top:1px solid #D8DDE5;">
    <p style="margin:0 0 12px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#051C2C;font-weight:700;font-family:Arial,sans-serif;border-bottom:2px solid #051C2C;padding-bottom:9px;padding-top:16px;">Team &amp; Desk Program</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${teamRows}</table>
  </td></tr>

  <!-- Meeting Rooms -->
  ${rooms && rooms.length > 0 ? `
  <tr><td style="background:#fff;padding:8px 40px 32px;border-top:1px solid #D8DDE5;">
    <p style="margin:0 0 12px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#051C2C;font-weight:700;font-family:Arial,sans-serif;border-bottom:2px solid #051C2C;padding-bottom:9px;padding-top:16px;">Meeting &amp; Collaborative Rooms</p>
    ${roomsHTML}
  </td></tr>` : ""}

  <!-- Amenities -->
  ${amenities && amenities.length > 0 ? `
  <tr><td style="background:#fff;padding:8px 40px 32px;border-top:1px solid #D8DDE5;">
    <p style="margin:0 0 12px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#051C2C;font-weight:700;font-family:Arial,sans-serif;border-bottom:2px solid #051C2C;padding-bottom:9px;padding-top:16px;">Amenity &amp; Support Spaces</p>
    ${amenHTML}
  </td></tr>` : ""}

  <!-- Questions from form -->
  ${questions ? `
  <tr><td style="background:#fff;padding:8px 40px 24px;border-top:1px solid #D8DDE5;">
    <p style="margin:0 0 8px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#8A9BB0;font-family:Arial,sans-serif;padding-top:16px;">Your Questions / Comments</p>
    <p style="margin:0;font-size:14px;color:#4A5568;line-height:1.75;font-family:Arial,sans-serif;">${questions}</p>
  </td></tr>` : ""}

  <!-- Strategic Questions -->
  <tr><td style="background:#F8F9FB;padding:32px 40px;border-top:3px solid #051C2C;">
    <p style="margin:0 0 5px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#2251FF;font-weight:700;font-family:Arial,sans-serif;">Strategic Planning Guide</p>
    <p style="margin:0 0 20px;font-size:16px;font-weight:700;color:#051C2C;">Questions to consider before you finalize your program</p>
    <table width="100%" cellpadding="0" cellspacing="0">${questionsHTML}</table>
  </td></tr>

  <!-- Next Steps -->
  <tr><td style="background:#051C2C;padding:32px 40px;">
    <p style="margin:0 0 5px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#C9A84C;font-family:Arial,sans-serif;">Next Steps</p>
    <p style="margin:0 0 14px;font-size:18px;font-weight:700;color:#fff;">Where do we go from here?</p>
    <p style="margin:0 0 12px;font-size:14px;line-height:1.8;color:rgba(255,255,255,.65);font-family:Arial,sans-serif;">I'll reach out within one business day to walk through this program, validate the assumptions, and discuss your market and timeline. This call is free — no obligation, just a focused conversation about your space needs.</p>
    <p style="margin:0;font-size:12px;color:rgba(255,255,255,.3);font-style:italic;font-family:Arial,sans-serif;">This report is preliminary based on inputs provided. A licensed architect should verify all square footage assumptions against actual floor plates before any lease is executed.</p>
  </td></tr>

  <!-- Signature -->
  <tr><td style="background:#fff;padding:32px 40px;">
    <p style="margin:0 0 3px;font-size:14px;color:#4A5568;font-family:Arial,sans-serif;">Best,</p>
    <p style="margin:0 0 14px;font-size:16px;font-weight:700;color:#051C2C;">Chase Bourdelaise</p>
    <p style="margin:0;font-size:13px;color:#4A5568;line-height:2;font-family:Arial,sans-serif;">
      Managing Director, Global Consulting Services &amp; Portfolio Solutions<br>
      Transwestern &nbsp;·&nbsp; Laise Capital LLC<br>
      <a href="tel:2025911926" style="color:#051C2C;text-decoration:none;">202-591-1926</a> &nbsp;·&nbsp; <a href="mailto:chase.bourdelaise@transwestern.com" style="color:#051C2C;text-decoration:none;">chase.bourdelaise@transwestern.com</a><br>
      <a href="https://chasebourdelaise.com" style="color:#2251FF;text-decoration:none;">chasebourdelaise.com</a> &nbsp;·&nbsp; <a href="https://linkedin.com/in/tenantadvisor" style="color:#2251FF;text-decoration:none;">LinkedIn</a>
    </p>
  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#ECEEF1;padding:20px 40px;text-align:center;">
    <p style="margin:0;font-size:11px;color:#8A9BB0;font-family:Arial,sans-serif;">Generated from your responses at <a href="https://chasebourdelaise.com" style="color:#4A5568;text-decoration:none;">chasebourdelaise.com</a>. Your information is never sold or shared.</p>
  </td></tr>

</table>
</td></tr></table>
</body></html>`;

  // ── 1. Send via Resend ──────────────────────────────────────────────────────
  try {
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Chase Bourdelaise <hi@chasebourdelaise.com>",
        reply_to: "chase.bourdelaise@transwestern.com",
        to: [email],
        bcc: ["chase.bourdelaise@transwestern.com"],
        subject: `Your Space Program Report — ${company || "Workplace Strategy"}`,
        html,
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

  // ── 2. Subscribe to Beehiiv ─────────────────────────────────────────────────
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
