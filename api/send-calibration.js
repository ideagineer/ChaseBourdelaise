// api/send-calibration.js
// Vercel Serverless Function (CommonJS)
// Receives {name, email, company}, sends Chase-branded HTML email containing
// the Pre-Tour Calibration Guide, and subscribes the user to The Occupier Brief.

const BEEHIIV_API_KEY = "cZ1LqaKbzLI6u3jrOsrtXvKv4lQ0S9HhVdWaRsIFw1dj6muYg2QV3VY2TZhpyYgd";
const BEEHIIV_PUB_ID  = "pub_cf9a1761-8853-43a6-94db-9899326ade5c";

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://chasebourdelaise.com");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")    return res.status(405).json({ error: "Method not allowed" });

  const { name, email, company } = req.body || {};
  if (!email) return res.status(400).json({ error: "Missing email" });

  const firstName = name ? String(name).split(" ")[0] : "there";
  const errors = [];

  // ── Email body (table-based, email-client safe) ─────────────────────────────
  const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Pre-Tour Calibration Guide</title>
</head>
<body style="margin:0;padding:0;background:#ECEEF1;font-family:Arial,Helvetica,sans-serif;color:#051C2C;-webkit-font-smoothing:antialiased;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ECEEF1;">
<tr><td align="center" style="padding:24px 12px;">
<table width="640" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;width:100%;background:#fff;border-radius:6px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.04);">

  <!-- ============================================================ -->
  <!-- HERO                                                          -->
  <!-- ============================================================ -->
  <tr><td style="background:#051C2C;padding:36px 40px 32px;">
    <p style="margin:0 0 6px;font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:#C9A84C;font-family:Arial,sans-serif;font-weight:700;">Pre-Tour Calibration Guide</p>
    <h1 style="margin:0 0 12px;font-family:Georgia,'Times New Roman',serif;font-size:32px;line-height:1.15;color:#fff;font-weight:400;letter-spacing:-0.5px;">Touring with intent.</h1>
    <p style="margin:0;font-size:15px;line-height:1.55;color:rgba(255,255,255,.75);font-family:Arial,sans-serif;">A short guide to thinking the way a seasoned advisor does &mdash; while you're still standing in the lobby.</p>
  </td></tr>

  <!-- Greeting -->
  <tr><td style="padding:28px 40px 8px;">
    <p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:#051C2C;font-family:Arial,sans-serif;">${firstName === "there" ? "Hi there" : `Hi ${firstName}`},</p>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:#4A5568;font-family:Arial,sans-serif;">Thanks for downloading the Pre-Tour Calibration Guide. The framework below is what I walk clients through before we set foot in the first building &mdash; the questions, the lenses, and the conditions that separate a polished tour from a useful one.</p>
    <p style="margin:0 0 4px;font-size:15px;line-height:1.65;color:#4A5568;font-family:Arial,sans-serif;">Print it, forward it to your project team, or pull it up on your phone between stops. It's yours.</p>
  </td></tr>

  <!-- Purpose -->
  <tr><td style="padding:24px 40px 8px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F8F9FB;border-left:3px solid #C9A84C;">
      <tr><td style="padding:18px 22px;">
        <p style="margin:0 0 6px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#8A9BB0;font-family:Arial,sans-serif;font-weight:700;">Purpose</p>
        <p style="margin:0;font-size:14px;line-height:1.65;color:#051C2C;font-family:Arial,sans-serif;">Today isn't about finding a space that "works." It's about <b style="color:#051C2C;">pressure-testing which option best supports your people, leadership, clients, brand, operations and long-term flexibility.</b> The best space is rarely the most finished one &mdash; it's the one that delivers the strongest combination of experience, economics, speed and strategic fit.</p>
      </td></tr>
    </table>
  </td></tr>

  <!-- ============================================================ -->
  <!-- 01 — FIXED VS CHANGEABLE                                      -->
  <!-- ============================================================ -->
  <tr><td style="padding:36px 40px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td width="36" valign="top" style="font-family:Georgia,serif;font-size:22px;color:#C9A84C;font-weight:400;line-height:1;padding-top:4px;">01</td>
      <td valign="top">
        <h2 style="margin:0 0 4px;font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:1.2;color:#051C2C;font-weight:400;">Separate what's fixed from what's changeable.</h2>
        <p style="margin:0;font-size:14px;line-height:1.6;color:#6B7785;font-family:Arial,sans-serif;font-style:italic;">Most spaces can be modified. As you walk, sort the room into two columns in your head &mdash; it changes what's actually a deal-breaker.</p>
      </td>
    </tr></table>
  </td></tr>

  <tr><td style="padding:18px 40px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td width="48%" valign="top" style="background:#F0F7F2;border-top:3px solid #1a8a5e;padding:18px 18px 14px;">
          <p style="margin:0 0 4px;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#1a8a5e;font-family:Arial,sans-serif;font-weight:700;">In play</p>
          <p style="margin:0 0 10px;font-size:15px;font-weight:700;color:#051C2C;font-family:Arial,sans-serif;">Likely changeable</p>
          <p style="margin:0;font-size:13px;line-height:1.85;color:#051C2C;font-family:Arial,sans-serif;">Paint, carpet, finishes<br>Lighting and signage<br>Furniture layout<br>Office doors &amp; glass fronts<br>Select walls, conf-room sizes<br>Kitchenette millwork<br>Reception configuration<br>Brand &amp; visual identity</p>
        </td>
        <td width="4%">&nbsp;</td>
        <td width="48%" valign="top" style="background:#F8F9FB;border-top:3px solid #051C2C;padding:18px 18px 14px;">
          <p style="margin:0 0 4px;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#051C2C;font-family:Arial,sans-serif;font-weight:700;">Locked in</p>
          <p style="margin:0 0 10px;font-size:15px;font-weight:700;color:#051C2C;font-family:Arial,sans-serif;">Harder to change</p>
          <p style="margin:0;font-size:13px;line-height:1.85;color:#051C2C;font-family:Arial,sans-serif;">Building arrival experience<br>Window line &amp; natural light<br>Ceiling heights<br>Column spacing<br>Restrooms &amp; common areas<br>Parking &amp; elevators<br>HVAC zones &amp; mechanicals<br>Floor plate &amp; circulation</p>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- ============================================================ -->
  <!-- 02 — FIVE LENSES                                              -->
  <!-- ============================================================ -->
  <tr><td style="padding:36px 40px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td width="36" valign="top" style="font-family:Georgia,serif;font-size:22px;color:#C9A84C;font-weight:400;line-height:1;padding-top:4px;">02</td>
      <td valign="top">
        <h2 style="margin:0 0 4px;font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:1.2;color:#051C2C;font-weight:400;">Walk the space through five sets of eyes.</h2>
        <p style="margin:0;font-size:14px;line-height:1.6;color:#6B7785;font-family:Arial,sans-serif;font-style:italic;">Step into each role for a moment as you move. The space rarely scores the same across all five &mdash; that's the point.</p>
      </td>
    </tr></table>
  </td></tr>

  <tr><td style="padding:18px 40px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      ${[
        { num: "01 / Executive", title: "The Leader", body: "Arrival to suite &mdash; <em>does this signal where the company is going?</em> Would leadership feel proud bringing a board member, banker or major client through?" },
        { num: "02 / People",    title: "The Employee", body: "<em>Would I want to come in on a Tuesday?</em> Commute, daylight, energy, places to eat and step out." },
        { num: "03 / Brand",     title: "The Client", body: "<em>Is this easy to find and clearly &lsquo;them&rsquo;?</em> Visitor parking, suite entry, the path to a conference room." },
        { num: "04 / Function",  title: "Operations &amp; IT", body: "<em>Will Day One actually work?</em> IT closet, power and data, AV, HVAC zoning, after-hours access." },
        { num: "05 / Risk",      title: "Finance", body: "<em>What's truly included vs. just present?</em> Furniture, cabling, landlord delivery, hidden cost to make it usable." },
      ].map(l => `
      <tr><td style="padding-bottom:10px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #E5E8EC;">
          <tr>
            <td width="140" valign="top" style="background:#051C2C;padding:14px 14px;">
              <p style="margin:0 0 4px;font-size:9.5px;letter-spacing:1.5px;text-transform:uppercase;color:#C9A84C;font-family:Arial,sans-serif;font-weight:700;">${l.num}</p>
              <p style="margin:0;font-family:Georgia,serif;font-size:16px;color:#fff;font-weight:400;line-height:1.2;">${l.title}</p>
            </td>
            <td valign="middle" style="padding:14px 16px;">
              <p style="margin:0;font-size:13px;line-height:1.6;color:#051C2C;font-family:Arial,sans-serif;">${l.body}</p>
            </td>
          </tr>
        </table>
      </td></tr>`).join("")}
    </table>
  </td></tr>

  <!-- ============================================================ -->
  <!-- 03 — SIX MOMENTS                                              -->
  <!-- ============================================================ -->
  <tr><td style="padding:36px 40px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td width="36" valign="top" style="font-family:Georgia,serif;font-size:22px;color:#C9A84C;font-weight:400;line-height:1;padding-top:4px;">03</td>
      <td valign="top">
        <h2 style="margin:0 0 4px;font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:1.2;color:#051C2C;font-weight:400;">Run the building through real moments.</h2>
        <p style="margin:0;font-size:14px;line-height:1.6;color:#6B7785;font-family:Arial,sans-serif;font-style:italic;">Floor plans don't fail buildings &mdash; Mondays do. Test each space against the scenarios it will actually live through.</p>
      </td>
    </tr></table>
  </td></tr>

  <tr><td style="padding:18px 40px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      ${[
        { clock: "8:15 AM &mdash; Monday",          title: "The arrival",           body: "Parking, lobby, elevator, suite entry. Does the building wake people up, or drain them before they sit down?" },
        { clock: "10:00 AM &mdash; Client day",     title: "The first impression",  body: "From street to seat in the conference room. Where does a visitor feel lost, and where do they feel impressed?" },
        { clock: "4:00 PM &mdash; Friday",          title: "The culture test",      body: "Where does the team actually gather? Is there a caf&eacute;, lounge, patio or walkable spot that supports an end-of-week beat?" },
        { clock: "Final round &mdash; Recruiting",  title: "The candidate walk",    body: "Would the space help close a hire &mdash; or would you find yourself explaining things away on the tour?" },
        { clock: "Two years out &mdash; &plusmn;20%", title: "The flex test",       body: "If headcount swings up or down twenty percent, can this footprint expand, contract or sublease without drama?" },
        { clock: "Day 90 &mdash; Post-move",        title: "The first complaint",   body: "What will people grumble about first? Temperature, parking, rooms, noise, food? Try to hear it before you sign." },
      ].map(m => `
      <tr><td style="padding-bottom:10px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F8F9FB;border-left:3px solid #2251FF;">
          <tr><td style="padding:14px 18px;">
            <p style="margin:0 0 4px;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#2251FF;font-family:Arial,sans-serif;font-weight:700;">${m.clock}</p>
            <p style="margin:0 0 4px;font-family:Georgia,serif;font-size:16px;font-weight:400;color:#051C2C;">${m.title}</p>
            <p style="margin:0;font-size:13px;line-height:1.6;color:#4A5568;font-family:Arial,sans-serif;">${m.body}</p>
          </td></tr>
        </table>
      </td></tr>`).join("")}
    </table>
  </td></tr>

  <!-- ============================================================ -->
  <!-- 04 — NEIGHBORHOOD TEST                                        -->
  <!-- ============================================================ -->
  <tr><td style="padding:36px 40px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td width="36" valign="top" style="font-family:Georgia,serif;font-size:22px;color:#C9A84C;font-weight:400;line-height:1;padding-top:4px;">04</td>
      <td valign="top">
        <h2 style="margin:0 0 4px;font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:1.2;color:#051C2C;font-weight:400;">Look past the four walls.</h2>
        <p style="margin:0;font-size:14px;line-height:1.6;color:#6B7785;font-family:Arial,sans-serif;font-style:italic;">Recruiting, retention and Tuesday attendance all live outside the suite. Walk a five-minute radius in your head as you stand at the front door.</p>
      </td>
    </tr></table>
  </td></tr>

  <tr><td style="padding:18px 40px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#051C2C;">
      <tr><td style="padding:22px 24px;">
        <p style="margin:0 0 6px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#C9A84C;font-family:Arial,sans-serif;font-weight:700;">The neighborhood test</p>
        <p style="margin:0 0 18px;font-family:Georgia,serif;font-size:17px;line-height:1.45;color:rgba(255,255,255,.85);font-style:italic;">If the building is the office, the neighborhood is the amenity package &mdash; and the amenity package writes the return-to-office story.</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td width="48%" valign="top" style="font-size:13px;line-height:1.85;color:rgba(255,255,255,.78);font-family:Arial,sans-serif;">
              <b style="color:#fff;">Coffee &amp; lunch</b> &mdash; quick walkable options, not just a single overpriced lobby caf&eacute;.<br><br>
              <b style="color:#fff;">Transit &amp; commute</b> &mdash; rail / bus access, drive times from where your team actually lives.<br><br>
              <b style="color:#fff;">Parking experience</b> &mdash; ratio, visitor flow, garage condition, EV charging.<br><br>
              <b style="color:#fff;">Fitness &amp; wellness</b> &mdash; on-site gym, nearby studios, walking paths, daylight.
            </td>
            <td width="4%">&nbsp;</td>
            <td width="48%" valign="top" style="font-size:13px;line-height:1.85;color:rgba(255,255,255,.78);font-family:Arial,sans-serif;">
              <b style="color:#fff;">Hotels &amp; client venues</b> &mdash; where visiting clients or candidates would stay and meet.<br><br>
              <b style="color:#fff;">After hours</b> &mdash; does the area stay alive at 6 PM, or empty out the moment offices close?<br><br>
              <b style="color:#fff;">Safety &amp; sense of place</b> &mdash; well-lit, active sidewalks, professional context.<br><br>
              <b style="color:#fff;">Errands</b> &mdash; banks, dry cleaning, pharmacy, daycare, grocery within reach.
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </td></tr>

  <!-- ============================================================ -->
  <!-- 05 — QUESTIONS WORTH ASKING                                   -->
  <!-- ============================================================ -->
  <tr><td style="padding:36px 40px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td width="36" valign="top" style="font-family:Georgia,serif;font-size:22px;color:#C9A84C;font-weight:400;line-height:1;padding-top:4px;">05</td>
      <td valign="top">
        <h2 style="margin:0 0 4px;font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:1.2;color:#051C2C;font-weight:400;">Questions worth asking out loud.</h2>
        <p style="margin:0;font-size:14px;line-height:1.6;color:#6B7785;font-family:Arial,sans-serif;font-style:italic;">Ask while you're standing in the space. Half the answers save you a meeting; the rest sharpen the proposal that lands next week.</p>
      </td>
    </tr></table>
  </td></tr>

  <tr><td style="padding:18px 40px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td width="48%" valign="top" style="background:#F8F9FB;padding:18px 18px 14px;border-top:3px solid #2251FF;">
          <p style="margin:0 0 12px;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#2251FF;font-family:Arial,sans-serif;font-weight:700;">Of the space</p>
          <p style="margin:0;font-size:13px;line-height:1.75;color:#051C2C;font-family:Arial,sans-serif;">
            1. What's included as-is &mdash; furniture, cabling, equipment &mdash; and who owns it?<br><br>
            2. What will the landlord clean, repair or refresh before occupancy?<br><br>
            3. Which walls, doors or glass fronts can move &mdash; any structural or historic constraints?<br><br>
            4. What's the IT and carrier situation &mdash; MPOE, riser access, diversity?<br><br>
            5. Parking ratio, visitor process and after-hours access procedure?
          </p>
        </td>
        <td width="4%">&nbsp;</td>
        <td width="48%" valign="top" style="background:#F8F9FB;padding:18px 18px 14px;border-top:3px solid #C9A84C;">
          <p style="margin:0 0 12px;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#C9A84C;font-family:Arial,sans-serif;font-weight:700;">Of the building</p>
          <p style="margin:0;font-size:13px;line-height:1.75;color:#051C2C;font-family:Arial,sans-serif;">
            1. After-hours HVAC policy &mdash; and what does the surcharge actually run?<br><br>
            2. Security, access control, building hours and holiday coverage?<br><br>
            3. Other available suites today &mdash; expansion rights or right of first offer?<br><br>
            4. Possession timing, and any pending capital projects on the property?<br><br>
            5. Known building issues &mdash; HVAC, plumbing, elevators, roof, ADA, life safety?
          </p>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- ============================================================ -->
  <!-- SECTION DIVIDER — If the space is already built out           -->
  <!-- ============================================================ -->
  <tr><td style="padding:44px 40px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td style="border-top:1px solid #E5E8EC;height:1px;font-size:1px;line-height:1px;">&nbsp;</td></tr>
    </table>
  </td></tr>

  <tr><td style="padding:28px 40px 0;">
    <p style="margin:0 0 6px;font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:#C9A84C;font-family:Arial,sans-serif;font-weight:700;">If the space is already built out</p>
    <h2 style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.2;color:#051C2C;font-weight:400;">Read what's there. See what's hiding.</h2>
    <p style="margin:0;font-size:14px;line-height:1.65;color:#4A5568;font-family:Arial,sans-serif;">When a suite is delivered with finishes, furniture and systems in place, the temptation is to grade it on what you see. The work is to see what's behind it &mdash; and what it costs to bring up to a baseline you're proud to occupy.</p>
  </td></tr>

  <tr><td style="padding:20px 40px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      ${[
        { lbl: "01 · Furniture &amp; workstations", h: "The condition, the count, the owner.", frame: "&ldquo;Included&rdquo; can mean inherited, leased, or someone else's salvage.", items: [
          ["Density", "matches your headcount and growth plan, or oversubscribed?"],
          ["Power &amp; data", "at every workstation &mdash; in-floor boxes, poles, or daisy-chained?"],
          ["Height-adjust", "bases, monitor arms, task seating &mdash; included or BYO?"],
          ["Ownership", "landlord, prior tenant, leasing inventory, or to-be-decided?"],
          ["Condition", "clean, repairable, or quietly headed to the curb?"],
        ]},
        { lbl: "02 · IT, AV &amp; cabling", h: "Cat-6 in the walls means little if it's not terminated.", frame: "The IT closet is the first place a competent ops lead heads.", items: [
          ["MPOE / MDF", "location, riser access, ventilation, generator backup?"],
          ["Structured cabling", "Cat-5e or 6/6A, labeled, tested, certified?"],
          ["Conference rooms", "AV racks, displays, ceiling mics, table boxes &mdash; live?"],
          ["Wireless", "AP density and ceiling coverage matching open plan?"],
          ["Carriers", "how many active, what speeds, true diversity?"],
        ]},
        { lbl: "03 · HVAC &amp; controls", h: "Tonnage on paper, comfort in practice.", frame: "Older zoning rarely matches a new layout.", items: [
          ["System type", "VAV, VRF, packaged &mdash; age and last service date?"],
          ["Zoning", "vs. your future plan &mdash; how many offices on one thermostat?"],
          ["VAV boxes", "count, locations, condition; any failed or sticky?"],
          ["BMS / controls", "do you get access, or is it landlord-managed?"],
          ["After-hours", "run schedule, surcharge rate, override capability?"],
        ]},
        { lbl: "04 · Lighting", h: "LED is a question, not an assumption.", frame: "Old fluorescent eats energy and ages a space ten years.", items: [
          ["LED throughout", "or T8 / T5 fluorescent still in place?"],
          ["Color temperature", "consistent across the floor (3500K vs 4000K mix)?"],
          ["Controls", "dimming, occupancy sensing, daylight harvesting?"],
          ["Emergency &amp; egress", "fixtures inventoried, tested, working?"],
          ["Specialty zones", "conference, focus rooms on separate control?"],
        ]},
        { lbl: "05 · Window treatments &amp; glare", h: "The sun moves; the building doesn't.", frame: "The simplest comfort upgrade tenants forget to ask for.", items: [
          ["Solar shades / mecho blinds", "at every exposure?"],
          ["Motorized vs. manual", "&mdash; and are the motors operable?"],
          ["West &amp; south elevations", "treated, or squinting by 3 PM?"],
          ["Solar film / low-e", "glass, or just shades doing all the work?"],
          ["Untreated rooms", "any office or conference with bare glass?"],
        ]},
        { lbl: "06 · Finishes, acoustics &amp; wet areas", h: "The things people complain about quietly.", frame: "Hard to see on a tour, loud once you're moved in.", items: [
          ["Carpet &amp; paint", "age, wear pattern, replace today or wait?"],
          ["Demising walls", "to deck, or only to ceiling tile?"],
          ["Sound masking", "installed &amp; tuned; phone booths sized for your team?"],
          ["Kitchen / pantry", "appliances, sink line, refrigeration, seating?"],
          ["Restrooms", "building common or suite-exclusive; ADA-current?"],
        ]},
      ].map(t => `
      <tr><td style="padding-bottom:12px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #E5E8EC;border-left:3px solid #C9A84C;">
          <tr><td style="padding:16px 18px;">
            <p style="margin:0 0 4px;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#8A9BB0;font-family:Arial,sans-serif;font-weight:700;">${t.lbl}</p>
            <p style="margin:0 0 4px;font-family:Georgia,serif;font-size:16px;color:#051C2C;font-weight:400;line-height:1.3;">${t.h}</p>
            <p style="margin:0 0 10px;font-size:12px;line-height:1.5;color:#6B7785;font-family:Arial,sans-serif;font-style:italic;">${t.frame}</p>
            <p style="margin:0;font-size:13px;line-height:1.75;color:#051C2C;font-family:Arial,sans-serif;">
              ${t.items.map(([k, v]) => `&middot; <b style="color:#051C2C;">${k}</b> &mdash; ${v}`).join("<br>")}
            </p>
          </td></tr>
        </table>
      </td></tr>`).join("")}
    </table>
  </td></tr>

  <!-- PM lens — built-out -->
  <tr><td style="padding:8px 40px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#051C2C;">
      <tr><td style="padding:22px 24px;">
        <p style="margin:0 0 6px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#C9A84C;font-family:Arial,sans-serif;font-weight:700;">The PM lens</p>
        <p style="margin:0 0 6px;font-family:Georgia,serif;font-size:18px;color:#fff;font-weight:400;line-height:1.3;">What a project manager is looking at.</p>
        <p style="margin:0 0 16px;font-size:13px;line-height:1.55;color:rgba(255,255,255,.65);font-family:Arial,sans-serif;font-style:italic;">Granular due-diligence &mdash; early answers save change orders.</p>
        <p style="margin:0;font-size:13px;line-height:1.85;color:rgba(255,255,255,.85);font-family:Arial,sans-serif;">
          &middot; <b style="color:#fff;">As-builts</b> current and stamped? Permits closed out and inspections passed?<br>
          &middot; <b style="color:#fff;">Water intrusion</b> &mdash; slab staining, ceiling-tile rings, sealed exterior penetrations?<br>
          &middot; <b style="color:#fff;">Cabling pathway</b> &mdash; J-hooks vs. conduit; fire-rated penetrations sealed?<br>
          &middot; <b style="color:#fff;">VAV count, age and last balance report</b> &mdash; any failed or noisy?<br>
          &middot; <b style="color:#fff;">Sprinkler heads</b> rotated to ceiling layout, or stuck in legacy locations?<br>
          &middot; <b style="color:#fff;">ADA path of travel</b>, restroom compliance, elevator timing &mdash; current code or grandfathered?<br>
          &middot; <b style="color:#fff;">Demising wall integrity</b> &mdash; deck-to-deck rated assembly or just to ACT?<br>
          &middot; <b style="color:#fff;">Electrical panels</b> &mdash; spare capacity, code-current, AFCI / GFCI as required?
        </p>
      </td></tr>
    </table>
  </td></tr>

  <!-- ============================================================ -->
  <!-- SECTION DIVIDER — If it's shell or you'd start over           -->
  <!-- ============================================================ -->
  <tr><td style="padding:44px 40px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td style="border-top:1px solid #E5E8EC;height:1px;font-size:1px;line-height:1px;">&nbsp;</td></tr>
    </table>
  </td></tr>

  <tr><td style="padding:28px 40px 0;">
    <p style="margin:0 0 6px;font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:#C9A84C;font-family:Arial,sans-serif;font-weight:700;">If it's shell &mdash; or you'd start over</p>
    <h2 style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.2;color:#051C2C;font-weight:400;">Stop grading the space. Grade the building.</h2>
    <p style="margin:0;font-size:14px;line-height:1.65;color:#4A5568;font-family:Arial,sans-serif;">Raw shell forces the right conversation up front. The bones tell you what's possible, the delivery condition tells you what it costs, and the schedule tells you when you actually move in.</p>
  </td></tr>

  <tr><td style="padding:20px 40px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      ${[
        { lbl: "01 · Base building delivery", h: "Cold dark shell, warm lit shell, or spec suite?", frame: "The line item that changes everything that follows.", items: [
          ["Delivery spec", "floor flat &amp; sealed? Walls primed? Ceilings open?"],
          ["HVAC", "ducted to the space, or stubbed at the riser?"],
          ["Lighting", "installed or open to design?"],
          ["Sprinklers", "turned upright, or fully distributed at code coverage?"],
          ["Restrooms", "building common, suite-exclusive, or yet to be built?"],
        ]},
        { lbl: "02 · Floor plate &amp; structure", h: "What you can plan for vs. against.", frame: "The geometry decides the plan before any decision is made.", items: [
          ["Column grid", "spacing, depth-to-glass, core location."],
          ["Slab", "condition &mdash; flatness, cracking, ability to score / saw-cut?"],
          ["Live load", "rating &mdash; sufficient for dense filing, AV, wellness rooms?"],
          ["Slab-to-deck", "clearance &mdash; finished ceiling and plenum routing."],
          ["Post-tension", "constraints on demo or new penetrations?"],
        ]},
        { lbl: "03 · HVAC infrastructure", h: "The line item nobody talks about until bid day.", frame: "Capacity, controls and zoning sit upstream of every layout choice.", items: [
          ["System type", "chilled water, DX, VRF, packaged &mdash; and tonnage per SF?"],
          ["VAV boxes", "how many new units required for your layout?"],
          ["Outside air", "capacity for high-occupancy zones (conferencing, training)?"],
          ["DDC / BMS", "integration &mdash; landlord scope, tenant scope, or hybrid?"],
          ["Future capacity", "can the system flex with density growth?"],
        ]},
        { lbl: "04 · Electrical, data &amp; risers", h: "Power is rarely the problem &mdash; distribution often is.", frame: "Capacity sits at the panel; the cost sits in the pathway.", items: [
          ["Service size", "at the panel &mdash; capacity for future tech load growth?"],
          ["Riser tap", "availability and conduit pathways to your floor?"],
          ["Generator backup / UPS", "required for IT, AV, lab, life-safety?"],
          ["IDF rooms", "how many, sized for your headcount and AP density?"],
          ["EV charging", "in the deck &mdash; current count, expansion path?"],
        ]},
        { lbl: "05 · Glazing, blinds &amp; lighting", h: "The biggest comfort lever per dollar.", frame: "Spec these in the TI scope or carve them out &mdash; not both.", items: [
          ["Glass", "low-e, thermal, operable? Film or upgrade required?"],
          ["Solar shades / mecho blinds", "included in TI, or tenant scope?"],
          ["LED throughout", "color temp, CRI, fixture family decided?"],
          ["Lighting controls", "DALI, 0&ndash;10V, occupancy, daylight harvesting?"],
          ["Daylight modeling", "done at the perimeter, or designed by intuition?"],
        ]},
        { lbl: "06 · Plumbing, life safety &amp; code", h: "The triggers that move TI dollars and weeks.", frame: "A new use class can rewrite the project the day you sign.", items: [
          ["Plumbing", "sanitary &amp; vent stack reach to kitchen, wellness, lab?"],
          ["Fire / life safety", "sprinkler density, alarm tie-in, smoke evac required?"],
          ["Occupancy classification", "any change that triggers code upgrades?"],
          ["ADA path of travel", "restrooms, corridors, elevators current?"],
          ["Hazmat survey", "asbestos, lead, mold &mdash; complete and clean?"],
        ]},
      ].map(t => `
      <tr><td style="padding-bottom:12px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border:1px solid #E5E8EC;border-left:3px solid #2251FF;">
          <tr><td style="padding:16px 18px;">
            <p style="margin:0 0 4px;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#8A9BB0;font-family:Arial,sans-serif;font-weight:700;">${t.lbl}</p>
            <p style="margin:0 0 4px;font-family:Georgia,serif;font-size:16px;color:#051C2C;font-weight:400;line-height:1.3;">${t.h}</p>
            <p style="margin:0 0 10px;font-size:12px;line-height:1.5;color:#6B7785;font-family:Arial,sans-serif;font-style:italic;">${t.frame}</p>
            <p style="margin:0;font-size:13px;line-height:1.75;color:#051C2C;font-family:Arial,sans-serif;">
              ${t.items.map(([k, v]) => `&middot; <b style="color:#051C2C;">${k}</b> &mdash; ${v}`).join("<br>")}
            </p>
          </td></tr>
        </table>
      </td></tr>`).join("")}
    </table>
  </td></tr>

  <!-- PM lens — shell -->
  <tr><td style="padding:8px 40px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#051C2C;">
      <tr><td style="padding:22px 24px;">
        <p style="margin:0 0 6px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#C9A84C;font-family:Arial,sans-serif;font-weight:700;">The PM lens</p>
        <p style="margin:0 0 6px;font-family:Georgia,serif;font-size:18px;color:#fff;font-weight:400;line-height:1.3;">What a project manager asks before pricing.</p>
        <p style="margin:0 0 16px;font-size:13px;line-height:1.55;color:rgba(255,255,255,.65);font-family:Arial,sans-serif;font-style:italic;">The questions that move TI dollars and weeks of schedule.</p>
        <p style="margin:0;font-size:13px;line-height:1.85;color:rgba(255,255,255,.85);font-family:Arial,sans-serif;">
          &middot; <b style="color:#fff;">Demo scope</b> &mdash; full down-to-deck or selective? What stays, what goes?<br>
          &middot; <b style="color:#fff;">Long-lead items</b> &mdash; switchgear, custom millwork, glass fronts, AV racks?<br>
          &middot; <b style="color:#fff;">Permitting</b> &mdash; jurisdiction quirks, separate fire / MEP / structural permits?<br>
          &middot; <b style="color:#fff;">Sustainability target</b> &mdash; LEED, WELL, Energy Star baseline today?<br>
          &middot; <b style="color:#fff;">Landlord vendors</b> &mdash; required for life-safety, riser, roof work?<br>
          &middot; <b style="color:#fff;">Schedule contingency</b> built into landlord delivery vs your move target?<br>
          &middot; <b style="color:#fff;">Construction logistics</b> &mdash; freight elevator hours, loading dock, after-hours noise?<br>
          &middot; <b style="color:#fff;">Insurance / COIs</b> required from contractors and landlord vendors?
        </p>
      </td></tr>
    </table>
  </td></tr>

  <!-- ============================================================ -->
  <!-- CLOSER QUOTE                                                  -->
  <!-- ============================================================ -->
  <tr><td style="padding:40px 40px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F8F9FB;border-top:3px solid #C9A84C;">
      <tr><td style="padding:28px 30px;text-align:center;">
        <p style="margin:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:20px;line-height:1.45;color:#051C2C;font-weight:400;font-style:italic;">&ldquo;The best space is rarely the most finished one. It's the one that delivers the strongest combination of <span style="color:#C9A84C;font-style:normal;font-weight:700;">experience, economics, speed and strategic fit.</span>&rdquo;</p>
        <p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8A9BB0;font-family:Arial,sans-serif;font-weight:700;">Chase Bourdelaise</p>
      </td></tr>
    </table>
  </td></tr>

  <!-- ============================================================ -->
  <!-- READ THE FULL FIELD GUIDE CTA                                 -->
  <!-- ============================================================ -->
  <tr><td style="padding:40px 40px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#051C2C;">
      <tr><td style="padding:28px 30px;text-align:center;">
        <p style="margin:0 0 6px;font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:#C9A84C;font-family:Arial,sans-serif;font-weight:700;">Want the full playbook?</p>
        <p style="margin:0 0 16px;font-family:Georgia,serif;font-size:22px;line-height:1.25;color:#fff;font-weight:400;">Read &lsquo;How to Tour Space: A Tenant's Field Guide&rsquo;</p>
        <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:rgba(255,255,255,.7);font-family:Arial,sans-serif;">A long-form companion to this guide &mdash; itinerary cadence, what brokers actually see, reading buildings and people, the post-tour debrief, and the questions that move the deal.</p>
        <a href="https://chasebourdelaise.com/insights/touring-space-tenant-guide.html" style="display:inline-block;background:#C9A84C;color:#051C2C;text-decoration:none;font-family:Arial,sans-serif;font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:13px 26px;">Read the field guide &rarr;</a>
      </td></tr>
    </table>
  </td></tr>

  <!-- ============================================================ -->
  <!-- SIGNATURE                                                     -->
  <!-- ============================================================ -->
  <tr><td style="padding:36px 40px 0;background:#fff;">
    <p style="margin:0 0 3px;font-size:14px;color:#4A5568;font-family:Arial,sans-serif;">When the deal matters,</p>
    <p style="margin:0 0 14px;font-size:16px;font-weight:700;color:#051C2C;font-family:Arial,sans-serif;">Chase Bourdelaise</p>
    <p style="margin:0;font-size:13px;color:#4A5568;line-height:2;font-family:Arial,sans-serif;">
      Managing Director, Tenant Advisory &amp; Corporate Real Estate Consulting<br>
      Transwestern<br>
      <a href="tel:2025911926" style="color:#051C2C;text-decoration:none;">202-591-1926</a> &nbsp;&middot;&nbsp; <a href="mailto:chase.bourdelaise@transwestern.com" style="color:#051C2C;text-decoration:none;">chase.bourdelaise@transwestern.com</a><br>
      <a href="https://chasebourdelaise.com" style="color:#2251FF;text-decoration:none;">chasebourdelaise.com</a> &nbsp;&middot;&nbsp; <a href="https://linkedin.com/in/tenantadvisor" style="color:#2251FF;text-decoration:none;">LinkedIn</a>
    </p>
  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#ECEEF1;padding:20px 40px;text-align:center;">
    <p style="margin:0 0 6px;font-size:11px;color:#8A9BB0;font-family:Arial,sans-serif;">You're now subscribed to <b style="color:#4A5568;">The Occupier Brief</b> &mdash; a periodic dispatch on tenant strategy, lease economics, and market signal for occupiers.</p>
    <p style="margin:0;font-size:11px;color:#8A9BB0;font-family:Arial,sans-serif;">Sent from <a href="https://chasebourdelaise.com" style="color:#4A5568;text-decoration:none;">chasebourdelaise.com</a>. Your information is never sold or shared.</p>
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
        subject: "Your Pre-Tour Calibration Guide — Chase Bourdelaise",
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
          utm_source: "pre-tour-calibration",
          utm_medium: "website",
          utm_campaign: "lead-magnet",
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
    return res.status(500).json({ error: "Failed to send guide.", details: errors });
  }
  return res.status(200).json({
    success: true,
    message: "Guide sent successfully.",
    warnings: errors.length ? errors : undefined,
  });
};
