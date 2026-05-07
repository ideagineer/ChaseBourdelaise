// api/send-report.js
// Vercel Serverless Function (CommonJS)
// Receives structured space program data, sends rich HTML report email via Resend

const BEEHIIV_API_KEY = "cZ1LqaKbzLI6u3jrOsrtXvKv4lQ0S9HhVdWaRsIFw1dj6muYg2QV3VY2TZhpyYgd";
const BEEHIIV_PUB_ID  = "pub_cf9a1761-8853-43a6-94db-9899326ade5c";

const DISCOVERY = [
  {
    title: "People & Hybrid Work",
    color: "#2251FF",
    questions: [
      "What is your company's official hybrid work policy — and is it enforced or aspirational?",
      "Does the policy vary by department, seniority, or role type?",
      "What is the actual average number of days per week employees are in-office (not the policy — the reality)?",
      "Do you have badge data, calendar analytics, or Wi-Fi utilization data to validate actual occupancy?",
      "Do you have a 'peak day' problem — Tuesday through Thursday near or at full capacity?",
      "What percentage of your workforce is fully remote and never comes in?",
      "Are there employees in other cities or states who may relocate to this office?",
      "Do any employees work irregular hours or shifts (nights, weekends)?",
      "Are there any planned hiring surges, reductions, acquisitions, or divestitures in the next five years?",
      "Is there any scenario in the next 36 months that could materially change your headcount — up or down?",
      "Do you anticipate any business model changes affecting office use (e.g. moving to fully remote, spinning off a division)?",
    ]
  },
  {
    title: "Workspace Layout & Culture",
    color: "#1a8a5e",
    questions: [
      "How would you describe your company culture in three words?",
      "Is the office a destination people want to be — or an obligation?",
      "Do employees collaborate more in-person or asynchronously?",
      "Is there a strong internal hierarchy where status correlates with private office size?",
      "Who qualifies for a private office — is there a defined title threshold or criteria?",
      "Is there a standard office size by level? Describe it.",
      "Do employees retain assigned offices when traveling or working remotely?",
      "Are there any 'sacred' existing offices that leadership will expect to be replicated?",
      "If moving toward open plan — have you addressed the change management? Who loses their office first?",
      "What are your current acoustic challenges? Open plan amplifies existing problems.",
      "Will any workstations require specialized furniture (ergonomic, accessibility, standing desks)?",
      "What is the one thing employees say they wish the office had?",
      "Does your workforce skew junior, senior, or mixed — and how does that affect collaboration patterns?",
      "Do you celebrate milestones, host team events, or hold regular all-hands? What space does that require?",
      "Are there any cultural or religious observances that affect space needs (prayer rooms, dietary, etc.)?",
    ]
  },
  {
    title: "Brand Identity & Design Language",
    color: "#7c3aed",
    questions: [
      "What are your brand colors? (hex codes or Pantone references preferred)",
      "Do you have a logo or brand mark that should appear in the space — entry, walls, glass?",
      "Describe your desired aesthetic in three words (e.g. 'warm, modern, bold').",
      "What materials and finishes resonate with your brand? (wood, metal, glass, concrete, textile, stone)",
      "Do you have existing brand guidelines covering interior environments?",
      "Are there any brand taboos — colors, patterns, or aesthetics to avoid?",
      "How do you feel about biophilic design (plants, natural light, living walls, water features)?",
      "Do you have existing furniture, art, or equipment to incorporate into the new space?",
      "Share any reference images — offices, hotel lobbies, retail environments — that represent your desired look.",
      "How important is it for your office to reflect your brand to clients and visitors?",
      "Do you entertain clients in the office? How frequently, and at what level of formality?",
    ]
  },
  {
    title: "Meeting Rooms & Conference Technology",
    color: "#0891b2",
    questions: [
      "Do you use a room booking system? (Robin, Envoy, Google Calendar, Microsoft Exchange, etc.)",
      "Are there conference rooms that need to be bookable externally by clients or visitors?",
      "Do any rooms need to combine or divide using operable partitions?",
      "Are there dedicated client-facing or board-level rooms requiring premium finishes and AV?",
      "What is your current conference room utilization rate — and do you have the data to support it?",
      "Do you require any outdoor meeting space, rooftop, or terrace access?",
      "What is your primary video conferencing platform? (Zoom, Teams, Google Meet, Webex)",
      "Do you want all conference rooms to be video-conference-ready by default?",
      "Do any rooms need a professional-grade boardroom AV system?",
      "Do you need room booking display panels at each conference room entrance?",
      "Do you need digital signage throughout the space?",
      "Do you need a live-streaming or broadcast-capable space?",
      "Are any spaces used for audio recording, podcasting, or music production?",
      "What is your standard laptop connection or docking setup across the organization?",
    ]
  },
  {
    title: "Reception & Arrival Experience",
    color: "#b45309",
    questions: [
      "Do you need a staffed reception desk — and how many staff simultaneously?",
      "Should the reception area make a brand statement with premium finishes and signage?",
      "Is the reception space also an introduction to your brand, product, or culture?",
      "Do you need a visitor check-in or badge printing station (e.g. Envoy, iLobby)?",
      "Do you need visitor seating in the lobby or waiting area?",
      "Is there a package and delivery intake area needed at reception?",
      "Do you need a product display or brand showcase at the entry?",
      "How many visitors do you typically receive per day?",
    ]
  },
  {
    title: "IT Infrastructure & Specialized Systems",
    color: "#374151",
    questions: [
      "Who manages your IT — internal team, managed service provider, or hybrid?",
      "Do you require a dedicated server room or data room with raised access floor?",
      "What is the estimated server room cooling requirement (tons or BTUs)?",
      "How many network closets or IDF rooms do you need?",
      "What is your primary internet connectivity requirement — and do you need redundancy?",
      "Do you require redundant power or UPS for critical systems?",
      "Do you use a cloud-first or on-premise server strategy?",
      "Do you need dedicated Wi-Fi infrastructure design with high density access points?",
      "Are there any areas requiring a Faraday cage or RF shielding?",
      "Do you require emergency power or generator backup?",
      "Is there any heavy or specialized equipment requiring structural floor load evaluation?",
      "Are there any 208V or 480V electrical requirements for equipment?",
      "Do you have plumbing requirements beyond a standard kitchen and restroom?",
      "Are there any specialized HVAC or ventilation requirements?",
      "Do you have any requirements for compressed air or specialty gases?",
      "Is there any noise-generating equipment or operation that requires acoustic isolation?",
    ]
  },
  {
    title: "Location, Building & Market",
    color: "#059669",
    questions: [
      "What is your target city or market?",
      "What are your preferred submarkets, listed in priority order?",
      "Are there any geographic boundaries or hard constraints (e.g. within X miles of a specific address)?",
      "Are there specific submarkets or buildings to avoid — and why?",
      "Is proximity to a Metro or transit hub required or strongly preferred?",
      "Are there specific buildings you are already interested in?",
      "Are there buildings where you've had a negative experience with a landlord or property manager?",
      "Do you need to be near specific clients, partners, or suppliers?",
      "Is proximity to restaurants, hotels, and gyms important for talent recruitment and retention?",
      "What target building class? (Class A trophy, Class A, Class B, flex/creative)",
      "Is new construction or newly delivered space preferred, acceptable, or irrelevant?",
      "What is your preferred floor plate size?",
      "Which floors are preferred — and are there any floors to avoid?",
      "Are there minimum ceiling height requirements?",
      "Do you need column-free space for large open floor areas?",
      "Do you require direct or exclusive elevator access to your floor?",
      "Is a dedicated loading dock or freight elevator required?",
      "Do you require 24/7 building access with after-hours HVAC?",
      "Is on-site building management and responsive property management important?",
      "Do you need outdoor space as part of the lease (terrace, rooftop, balcony)?",
      "Are there any structural requirements — raised floor, specific floor load capacity, dedicated power?",
    ]
  },
  {
    title: "Parking & Transportation",
    color: "#6b7280",
    questions: [
      "How many reserved parking spaces do you require?",
      "How many total spaces (reserved plus unreserved) do you need?",
      "Do you need executive or premium parking spots — covered, assigned, with EV charging?",
      "Is covered or structured parking required, or will surface lots be accepted?",
      "Do you need a parking validation program for clients and visitors?",
      "Is bicycle parking and secure storage needed?",
      "Are showers and changing rooms needed for cyclists or gym users?",
      "Is a shuttle or corporate transportation program important?",
      "Do you have any fleet vehicle parking requirements?",
      "Is proximity to a ride-share drop-off zone or transit hub a differentiator for your employees?",
    ]
  },
  {
    title: "Security & Compliance",
    color: "#dc2626",
    questions: [
      "What security zones do you need? (public, employee-only, executive, server room, etc.)",
      "Do you need card or badge access control on the suite entrance?",
      "Do you need access control on any interior doors?",
      "Do you need any mantrap or airlock entry systems?",
      "Do you need a dedicated security desk or guard station?",
      "Are there any government security clearance or SCIF requirements?",
      "Do you need a visitor management system integrated with access control?",
      "Are there any compliance standards affecting your security design? (SOC 2, HIPAA, FedRAMP, etc.)",
      "Do you need interior CCTV and camera coverage — and who monitors it?",
      "Do you have proprietary equipment, IP, or trade secrets that must be in a secured area?",
      "Do any employees work with highly sensitive, classified, or regulated information?",
    ]
  },
  {
    title: "Sustainability & Wellness",
    color: "#16a34a",
    questions: [
      "Do you have corporate sustainability or ESG commitments that affect space selection or design?",
      "Is access to natural light a priority for your team?",
      "Are there goals around reducing your office carbon footprint?",
      "Is LEED, WELL Building Standard, or ENERGY STAR certification a goal or requirement?",
      "Do you have a clear-desk policy or office waste reduction program?",
      "Is access to outdoor space (terrace, park, rooftop) a significant priority for employee wellness?",
      "Do you have an existing EV fleet or EV charging benefit for employees?",
      "Are air quality, biophilic elements, or circadian lighting meaningful to your culture?",
    ]
  },
];

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

  const fmt   = (n) => (n > 0 ? Number(n).toLocaleString() : "—");
  const fmtSF = (n) => (n > 0 ? Number(n).toLocaleString() + " SF" : "—");
  const lo = rsf > 0 ? Math.round(rsf * 0.92 / 100) * 100 : 0;
  const hi = rsf > 0 ? Math.round(rsf * 1.08 / 100) * 100 : 0;

  // ── Contextual strategic questions (program-aware) ──────────────────────────
  const stratQuestions = [];

  if (Number(daysInOffice) <= 2) {
    stratQuestions.push(`Your team is in the office ${daysInOffice} day(s) per week — one of the lowest hybrid utilization patterns in the market. Before committing to space, confirm with leadership whether this is permanent policy or transitional. A shift to 3+ days could materially increase your peak-day density and require more desks than this program projects.`);
  } else if (Number(daysInOffice) >= 4) {
    stratQuestions.push(`At ${daysInOffice} days per week in-office, your utilization is above the current market average of ~2.8 days. This validates a higher desk-to-person ratio and suggests you'll get strong ROI from investment in the physical environment — your people are actually showing up. Make sure the space is worth commuting to.`);
  } else {
    stratQuestions.push(`Your ${daysInOffice}-day hybrid pattern is at the market average, but peak days — typically Tuesday through Thursday — drive your real space requirement, not the average. Have you analyzed badge data or calendar utilization to understand actual peak occupancy? That number is what truly sizes your footprint.`);
  }

  if (deskRatio && parseFloat(deskRatio) < 0.75) {
    stratQuestions.push(`Your desk-to-person ratio of ${deskRatio}:1 is aggressive. This works when sharing is actively managed — but without booking systems, clear protocols, and leadership buy-in, shared seating creates friction that erodes culture faster than it saves rent. What is your enforcement plan?`);
  } else if (deskRatio && parseFloat(deskRatio) > 0.95) {
    stratQuestions.push(`Your desk-to-person ratio of ${deskRatio}:1 is conservative — nearly one desk per person. This avoids hoteling friction but costs rent per seat. Even a modest increase in sharing (10–15%) could meaningfully reduce your footprint and your total lease obligation over the term.`);
  }

  if (industryBenchmark && rsfPerSeat) {
    const diff = Number(rsfPerSeat) - Number(industryBenchmark);
    if (diff > 40) {
      stratQuestions.push(`Your program runs ${diff} RSF/seat above the ${industryLabel} benchmark of ${industryBenchmark} RSF/seat. This typically reflects a higher proportion of private offices, larger conference rooms, or above-average amenity investment. Ask whether these choices reflect genuine operational need — or legacy culture. Every 10 RSF/seat you reduce is real money over a 10-year lease.`);
    } else if (diff < -30) {
      stratQuestions.push(`Your program runs ${Math.abs(diff)} RSF/seat below the ${industryLabel} benchmark of ${industryBenchmark} RSF/seat. This is efficient — but verify that meeting room counts, focus space, and amenities are truly adequate for your team's actual work patterns. A tight footprint that constrains collaboration often costs more in productivity than it saves in rent.`);
    } else {
      stratQuestions.push(`Your program at ${rsfPerSeat} RSF/seat is closely aligned with the ${industryLabel} benchmark of ${industryBenchmark} RSF/seat. This is a good signal that your inputs reflect market-calibrated assumptions. The test-fit study on your top candidate buildings will confirm whether the program lays out efficiently on their floor plates.`);
    }
  }

  stratQuestions.push(`Your Year 3 headcount is ${hcYr3} and Year 5 is ${hcYr5}. Are these conservative or aggressive? Over-building for growth you don't achieve is expensive. Under-building creates operational friction and a premature lease renewal from a position of weakness. Does your lease structure include expansion options or rights of first refusal on adjacent space? This is one of the most valuable — and most frequently negotiated — provisions in any lease.`);

  stratQuestions.push(`At what headcount threshold would you need to expand? At what headcount would you start subleasing? Know these numbers before you sign. They should be embedded in the lease as option triggers, not discovered in year three when you're locked in.`);

  // ── Rooms table ─────────────────────────────────────────────────────────────
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

  // ── Amenities ────────────────────────────────────────────────────────────────
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

  // ── Contextual strategic questions HTML ──────────────────────────────────────
  const stratQuestionsHTML = stratQuestions.map((q, i) => `
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

  // ── Discovery questions HTML ─────────────────────────────────────────────────
  const discoveryHTML = DISCOVERY.map(cat => `
    <tr>
      <td style="padding:18px 0 6px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="border-left:3px solid ${cat.color};padding-left:10px;">
              <p style="margin:0;font-size:9px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${cat.color};font-family:Arial,sans-serif;">${cat.title}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    ${cat.questions.map((q, qi) => `
    <tr>
      <td style="padding:5px 0 5px 14px;border-bottom:1px solid #F0F2F5;vertical-align:top;">
        <table cellpadding="0" cellspacing="0"><tr>
          <td style="width:16px;vertical-align:top;padding-top:5px;">
            <div style="width:5px;height:5px;background:${cat.color};border-radius:50%;opacity:.5;"></div>
          </td>
          <td style="font-size:12px;line-height:1.75;color:#4A5568;font-family:Arial,sans-serif;">${q}</td>
        </tr></table>
      </td>
    </tr>`).join("")}
  `).join("");

  // ── Team metrics rows ────────────────────────────────────────────────────────
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

  // ── Full email ───────────────────────────────────────────────────────────────
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
    <p style="margin:0;font-size:15px;line-height:1.8;color:#4A5568;font-family:Arial,sans-serif;">Your space program report is below — built from the inputs you provided and benchmarked against ${industryLabel ? industryLabel + " industry" : "market"} data. I'll follow up within one business day to walk through the findings, answer your questions, and discuss next steps for your portfolio.</p>
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

  <!-- User questions -->
  ${questions ? `
  <tr><td style="background:#fff;padding:8px 40px 24px;border-top:1px solid #D8DDE5;">
    <p style="margin:0 0 8px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#8A9BB0;font-family:Arial,sans-serif;padding-top:16px;">Your Questions / Comments</p>
    <p style="margin:0;font-size:14px;color:#4A5568;line-height:1.75;font-family:Arial,sans-serif;">${questions}</p>
  </td></tr>` : ""}

  <!-- Strategic Questions (program-aware, dynamic) -->
  <tr><td style="background:#F8F9FB;padding:32px 40px;border-top:3px solid #051C2C;">
    <p style="margin:0 0 5px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#2251FF;font-weight:700;font-family:Arial,sans-serif;">Strategic Planning Guide</p>
    <p style="margin:0 0 20px;font-size:16px;font-weight:700;color:#051C2C;">Questions specific to your program</p>
    <p style="margin:0 0 18px;font-size:13px;color:#4A5568;line-height:1.7;font-family:Arial,sans-serif;">The following observations are generated directly from your inputs — headcount, days in office, desk ratio, and benchmark comparison. They are not generic; they reflect your specific program.</p>
    <table width="100%" cellpadding="0" cellspacing="0">${stratQuestionsHTML}</table>
  </td></tr>

  <!-- Discovery Questions (comprehensive) -->
  <tr><td style="background:#fff;padding:32px 40px;border-top:3px solid #C9A84C;">
    <p style="margin:0 0 5px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#C9A84C;font-weight:700;font-family:Arial,sans-serif;">Discovery Questions</p>
    <p style="margin:0 0 12px;font-size:16px;font-weight:700;color:#051C2C;">Complete workplace strategy intake</p>
    <p style="margin:0 0 24px;font-size:13px;color:#4A5568;line-height:1.75;font-family:Arial,sans-serif;">These questions form the foundation of a full workplace strategy engagement. You don't need to answer all of them before our call — but reviewing them will help you surface the constraints, preferences, and priorities that shape your program. Bring your thinking. I'll bring the framework.</p>
    <table width="100%" cellpadding="0" cellspacing="0">${discoveryHTML}</table>
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

  // ── 1. Send via Resend ───────────────────────────────────────────────────────
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

  // ── 2. Subscribe to Beehiiv ──────────────────────────────────────────────────
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
