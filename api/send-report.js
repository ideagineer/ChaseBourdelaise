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

  // ── Facilities Move Checklist branch ──────────────────────────────────────
  const resourceType = (req.body || {}).resourceType;
  if (resourceType === "facilities-move-checklist") {
    const to        = (req.body || {}).to || (req.body || {}).email;
    const firstName = (req.body || {}).firstName || "there";
    const co        = (req.body || {}).company || "";
    if (!to) return res.status(400).json({ error: "Missing email" });

    const phases = [
      { num:"01", title:"Needs Assessment & Authorization", weeks:"Weeks 1–3", color:"#2251FF", items:[
        ["Receive Formal Space Request","Written request from BU head — headcount (current + 18-mo projection), function type, target market, hard open date"],
        ["Headcount & Density Analysis","Confirm seats-per-person ratio (150–250 USF/person); determine hybrid vs. full-time occupancy model before sizing"],
        ["Special Use Requirements","Identify non-standard needs: server/MDF room, training room, lab, warehouse, showroom, loading dock, generator"],
        ["Parking Requirement","Confirm ratio needed; check if fleet vehicles require covered or secured parking"],
        ["Hard Date vs. Target Date","Establish lease commencement deadline and move-in deadline separately; work backward to confirm feasibility"],
        ["Preliminary Budget","TI allowance target, base rent ceiling ($/RSF), capex budget for FF&E/IT — get CFO buy-in before broker engagement"],
        ["Lease vs. Own Analysis","Quick NPV comparison if ownership is on the table; typically lease wins for non-HQ locations"],
        ["Executive Authorization","Signed approval memo from CFO/COO; defines budget authority and approval thresholds"],
        ["Engage Tenant Rep Broker","Execute broker representation agreement; confirm exclusivity, market, and commission structure"],
      ]},
      { num:"02", title:"Site Search & Selection", weeks:"Weeks 3–8", color:"#1a8a5e", items:[
        ["Market Survey Issued","Broker pulls all availabilities matching program; target 8–15 options first pass"],
        ["Preliminary Tour","Tour top 6–8 with internal stakeholder (ops lead, IT rep); score each"],
        ["Scoring Matrix","Rate each option: location, building class, floor plate efficiency, parking, HVAC, TI allowance, rent, LL financial strength"],
        ["Confirm Building Infrastructure","For each shortlist: fiber in building, generator/UPS capacity, HVAC after-hours cost, security, dock doors"],
        ["Check LL Financial Health","Confirm owner is not in loan default or special servicing; pull CMBS data; avoid distressed LL"],
        ["Zoning Confirmation","Confirm proposed use is permitted as-of-right; identify if variance or CUP needed (adds 2–6 months)"],
        ["Preferred Site Selection","Internal review meeting; select top 1–2 for LOI; keep #2 alive as leverage"],
        ["Engage Legal","Outside RE counsel retained now; brief on deal structure and timeline"],
      ]},
      { num:"03", title:"LOI & Lease Negotiation", weeks:"Weeks 6–14", color:"#7c3aed", items:[
        ["LOI Drafted","Confirm all key business terms: base rent, escalations, free rent, TI, term, commencement, renewal options, termination right, ROFO/ROFR, permitted use, parking"],
        ["Submit Competing LOIs","Submit to top 2 simultaneously — creates leverage and pricing discipline"],
        ["Test Fit / Preliminary Space Plan","Architect confirms headcount fits floor plate with your program; ~2 weeks; critical before lease execution"],
        ["Lease Redline Rounds 1–3","Key issues: assignment/sublease rights, CAM audit rights and cap (3–5%), SNDA, default cure periods, personal property exclusion from LL lien"],
        ["SNDA Negotiation","Non-disturbance agreement from LL's lender — require before execution on any long-term lease"],
        ["Internal Lease Abstract","Legal produces 2-page deal summary; routed for exec approval"],
        ["Lease Execution","Authorized officer executes; confirm notarization if required"],
        ["Commission Agreement Executed","Broker commission letter countersigned by LL"],
      ]},
      { num:"04", title:"Pre-Construction Planning", weeks:"Weeks 10–18", color:"#b45309", items:[
        ["Hire Architect of Record","RFP to 2–3 firms; award on experience, fee, schedule; execute AIA B101 contract"],
        ["Programming Session","AOR meets with BU lead, IT, HR, facilities; confirms adjacencies, headcount, room types, storage"],
        ["Schematic Design through CDs","SD block plan, DD full layout, CDs including MEP/fire suppression/structural; ~8–10 weeks total"],
        ["Landlord Plan Review & Approval","Submit CDs to LL before permit; most leases give LL 10–15 business days — do not permit without this"],
        ["ISP Order — Day of Lease Execution","Enterprise fiber circuits take 60–120 days. Order immediately. Do not wait for permits."],
        ["Redundant Circuit Order","Order backup circuit (different carrier) simultaneously with primary"],
        ["MDF/IDF Room Design","Confirm location with AOR; dedicated HVAC, 20A circuits, proper grounding, ladder rack"],
        ["Structured Cabling & Low-Voltage RFP","Cat6A standard; specify drops per workstation (2 data + 1 voice minimum)"],
        ["AV Design","AOR/AV integrator designs conference rooms, huddle rooms, lobby; order AV equipment early (8–14 wk lead times)"],
        ["Permit Submission","AHJ timeline: suburban 2–4 wks; mid-size city 4–8 wks; major metro 8–16 wks — build into schedule"],
        ["GC RFP & Award","Issue to 3 GCs with 5-day site walk; level bids line by line; AIA A101 contract; include liquidated damages"],
        ["Furniture Award","Lead times 10–16 weeks on major manufacturers — order at permit submittal, not at CO"],
        ["TI Draw Process Confirmed","Understand LL draw process: frequency, documentation (AIA G702/703 + lien waivers), LL funding timeline"],
      ]},
      { num:"05", title:"Construction", weeks:"Weeks 18–34", color:"#059669", items:[
        ["Pre-Construction Meeting","GC, AOR, PM, IT, AV, security on-site; confirm schedule, submittal log, RFI process, safety plan"],
        ["MEP Rough-In Inspection","AHJ inspects before drywall — do not allow drywall until rough-in passes"],
        ["Low-Voltage Rough-In Walk","IT rep walks before drywall to confirm cabling coverage at every workstation"],
        ["Weekly OAC Meetings","Owner, Architect, Contractor; minutes same day; track open items, RFIs, submittals, schedule"],
        ["RFI Log — Escalate at 7 Days","Any RFI open >7 days gets escalated; unanswered RFIs are the #1 cause of schedule slippage"],
        ["HVAC Balancing","Required for CO in most jurisdictions; schedule 1–2 weeks before target CO"],
        ["Fire Alarm Acceptance Test Scheduled","Schedule 2–3 weeks before target CO date — any device failure means a re-test and another wait"],
        ["Cabling Termination & Certification","Low-voltage sub terminates and certifies all runs; produce certification report for IT; 1–2 weeks"],
        ["AV & Security Installation","AV integrator and security vendor; requires network to be live; allow 1–2 weeks for commissioning"],
        ["Punch List Walk #1","VP Facilities + AOR walk 2 weeks before target completion; GC has 1 week to close"],
        ["Substantial Completion / Punch List #2","AOR certifies SC; LL walks; issue AIA G704"],
        ["Monthly TI Draw Submissions","AIA G702/703 with conditional lien waivers; track LL funding against lease-required timeframe"],
      ]},
      { num:"06", title:"Certificate of Occupancy", weeks:"Weeks 32–35", color:"#dc2626", items:[
        ["All Life Safety Systems Operational","Fire alarm fully installed and tested; sprinkler pressure-tested; emergency lighting operational; extinguishers mounted"],
        ["Fire Alarm Acceptance Test","Fire marshal witnesses test of every device — schedule 2–3 weeks out; failures require re-test"],
        ["Egress Confirmed","All exit doors operational with proper hardware; corridors clear; exit signage posted"],
        ["Electrical Final","Panel schedules accurate; GFCI where required; no open junction boxes; arc-fault protection"],
        ["Mechanical & Plumbing Finals","HVAC operational; exhaust fans functional; fixtures operational; backflow preventer inspected"],
        ["Building Department Final Inspection","AHJ walks entire space against approved plans — field deviations = red tag"],
        ["ADA Compliance Final","Accessible route, restroom compliance, door hardware, signage, parking"],
        ["CO Issued","Original filed with lease record; if TCO, track expiration date and complete remaining items immediately"],
      ]},
      { num:"07", title:"Insurance", weeks:"Weeks 10–34", color:"#6b7280", items:[
        ["Review Lease Insurance Exhibit","CGL: $1M/$2M (some LLs require $3M); property at replacement cost; umbrella $5M–$10M; workers comp statutory"],
        ["Additional Insured Endorsement","LL and LL's lender named as additional insured — CG 20 10 or CG 20 26 form; wrong form = no keys"],
        ["Certificate of Insurance Issued","ACORD 25 certificate naming LL, LL's lender, and LL's management company as additional insureds"],
        ["GC Builder's Risk Confirmed","If TI > $500K, confirm either LL or GC carries builder's risk covering materials and work in place"],
        ["Property Policy Updated","Add new location: address, SF, TI value, FF&E value to broker; update company property policy"],
        ["Annual Renewal Calendar","Add new location to insurance renewal calendar; LL will require updated COI annually"],
      ]},
      { num:"08", title:"Pre-Occupancy Activation", weeks:"Weeks 32–36", color:"#0891b2", items:[
        ["Electric & Gas Account Setup","2–3 weeks lead time; confirm rate class and demand charge structure; budget for deposit"],
        ["Telecom/Internet Activation","Confirm ISP circuit live and handed off; IT tests throughput; VPN and firewall configured; Wi-Fi tested"],
        ["Phone Numbers Activated","DIDs assigned and routed; auto-attendant programmed; main number updated in company directory"],
        ["Janitorial Contract Executed","Spec frequency, key/access, supplies included vs. billed separately, green cleaning if required"],
        ["HVAC PM Contract Executed","Quarterly PM minimum; confirm after-hours call protocol and cost"],
        ["Emergency Action Plan","Written EAP required under OSHA 29 CFR 1910.38 — evacuation routes, assembly points, floor warden assignments"],
        ["Evacuation Maps Posted","Required at each exit; produce from as-built drawings; laminated and framed"],
        ["AED Placement & Registration","AED mounted, registered with local EMS, staff trained, inspection log started"],
        ["Building Access / Key Control","Master key system documented; access cards programmed with levels by role; lobby directory updated"],
        ["Parking Assignments","Reserved vs. unreserved confirmed; hang tags or access cards issued; validated with building manager"],
        ["Employee Communication Package","New address, parking, badge process, IT setup, building amenities, emergency procedures — distribute 2 weeks before move"],
        ["IRS & Vendor Address Update","Form 8822-B, state tax agencies, bank, insurance, all vendor accounts updated"],
      ]},
      { num:"09", title:"Move Execution", weeks:"Weeks 34–36", color:"#374151", items:[
        ["Move Plan Finalized","Phased by department; furniture layouts distributed; color-coded box label system"],
        ["Server Room Move Scheduled Separately","Night before or weekend before employee move; confirm network is live at new location before servers decommissioned at old"],
        ["Electronics Chain-of-Custody","IT disconnects and labels all computers, phones, monitors; sensitive equipment documented"],
        ["Move Executed — Weekend/After Hours","Confirm elevator reservations and freight access at both buildings"],
        ["Day-1 IT Readiness Check","All workstations online, printers mapped, phones active, VPN functional before employees arrive"],
        ["Day-1 Facilities Walk","VP Facilities on-site opening morning before employees arrive; walk entire space"],
        ["Welcome Kit at Each Workstation","Building guide, Wi-Fi credentials, parking info, emergency contacts, facilities contacts"],
      ]},
      { num:"10", title:"Project Close-Out", weeks:"Weeks 36–42", color:"#16a34a", items:[
        ["Final TI Draw Submitted","AIA G702/703 with unconditional lien waivers; confirm full TI reimbursement received"],
        ["Lien Releases — All Subs","GC provides unconditional final lien waivers from all subcontractors and suppliers; file with project record"],
        ["As-Built Drawings Received","AOR and GC produce as-builts reflecting field changes; file in lease record and facilities database"],
        ["O&M Manuals & Warranties","GC delivers manuals for all installed systems; log all warranty start dates, durations, service contacts"],
        ["Critical Date Calendar","Rent commencement, free rent expiration, CPI dates, option exercise windows (12–18 months before expiry), lease expiration"],
        ["Lease Abstract Filed","In IWMS or lease management system with all key dates and option deadlines"],
        ["Final Budget Reconciliation","Actual vs. authorized; document all change orders; file for finance/audit"],
        ["30-Day Post-Move Survey","Collect punch items; submit to GC under warranty in writing within warranty period"],
        ["Lessons Learned Document","1-page debrief: what went well, what didn't, timeline variances, vendor performance"],
      ]},
    ];

    const criticalPath = [
      ["Internet / Fiber Circuit","60–120 days","Day of lease execution"],
      ["Redundant Circuit","60–120 days","Simultaneously with primary"],
      ["Furniture (major manufacturers)","10–16 weeks","At permit submittal"],
      ["AV Equipment","8–14 weeks","At permit submittal"],
      ["GC Permit (major metro)","8–16 weeks","At CD completion"],
      ["Fire Alarm Acceptance Test","Schedule 2–3 weeks out","At substantial completion"],
      ["Certificate of Insurance","1–2 weeks","30 days before occupancy"],
      ["Utility Account Setup","2–3 weeks","At substantial completion"],
    ];

    const phasesHtml = phases.map(p => `
  <tr><td style="background:#fff;padding:20px 40px 6px;border-top:1px solid #D8DDE5;">
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="border-left:3px solid ${p.color};padding-left:10px;">
        <p style="margin:0 0 2px;font-size:9px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:${p.color};font-family:Arial,sans-serif;">Phase ${p.num} &nbsp;·&nbsp; ${p.weeks}</p>
        <p style="margin:0;font-size:15px;font-weight:700;color:#051C2C;font-family:Arial,sans-serif;">${p.title}</p>
      </td>
    </tr></table>
  </td></tr>
  <tr><td style="background:#fff;padding:0 40px 18px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      ${p.items.map(([label, detail], i) => `
      <tr style="background:${i % 2 === 0 ? "#fff" : "#F8F9FB"};">
        <td style="padding:9px 10px;border-bottom:1px solid #EEF0F3;vertical-align:top;width:18px;">
          <div style="width:13px;height:13px;border:1.5px solid #D8DDE5;border-radius:2px;"></div>
        </td>
        <td style="padding:9px 12px;border-bottom:1px solid #EEF0F3;vertical-align:top;">
          <p style="margin:0 0 2px;font-size:13px;font-weight:600;color:#051C2C;font-family:Arial,sans-serif;">${label}</p>
          <p style="margin:0;font-size:12px;color:#4A5568;line-height:1.6;font-family:Arial,sans-serif;">${detail}</p>
        </td>
      </tr>`).join("")}
    </table>
  </td></tr>`).join("");

    const checklistHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>VP of Facilities Master Checklist</title></head>
<body style="margin:0;padding:0;background:#ECEEF1;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#ECEEF1;padding:32px 16px;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <tr><td style="background:#051C2C;padding:28px 40px 20px;">
    <p style="margin:0 0 5px;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#C9A84C;font-family:Arial,sans-serif;">Chase Bourdelaise &nbsp;·&nbsp; Transwestern</p>
    <p style="margin:0;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.3);font-family:Arial,sans-serif;">VP of Facilities Master Checklist</p>
  </td></tr>

  <tr><td style="background:#051C2C;padding:4px 40px 32px;">
    <p style="margin:0 0 4px;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,.3);font-family:Arial,sans-serif;">Companion Resource</p>
    <p style="margin:0;font-size:42px;font-weight:700;color:#fff;letter-spacing:-2px;line-height:1;font-family:Arial,sans-serif;">Site to Move-In</p>
    <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,.4);font-family:Arial,sans-serif;">10 phases &nbsp;·&nbsp; 100+ items &nbsp;·&nbsp; every workstream</p>
  </td></tr>

  <tr><td style="background:#fff;padding:32px 40px 20px;">
    <p style="margin:0 0 14px;font-size:17px;color:#051C2C;">Hi ${firstName},</p>
    <p style="margin:0;font-size:15px;line-height:1.8;color:#4A5568;font-family:Arial,sans-serif;">Here is your VP of Facilities Master Checklist — the 10-phase, 100+ item framework I distribute to every facilities team before a relocation. Use it as a live working document throughout the project, not as a reference you file away.</p>
  </td></tr>

  ${phasesHtml}

  <tr><td style="background:#051C2C;padding:24px 40px;">
    <p style="margin:0 0 4px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#C9A84C;font-family:Arial,sans-serif;">Critical Path — Longest Lead Items</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
      ${criticalPath.map(([item, lead, when], i) => `
      <tr style="background:${i % 2 === 0 ? "rgba(255,255,255,.06)" : "rgba(255,255,255,.02)"};">
        <td style="padding:8px 10px;font-size:12px;color:#fff;font-family:Arial,sans-serif;">${item}</td>
        <td style="padding:8px 10px;font-size:11px;color:#C9A84C;font-family:Arial,sans-serif;text-align:center;white-space:nowrap;">${lead}</td>
        <td style="padding:8px 10px;font-size:11px;color:rgba(255,255,255,.45);font-family:Arial,sans-serif;text-align:right;white-space:nowrap;">${when}</td>
      </tr>`).join("")}
    </table>
  </td></tr>

  <tr><td style="background:#fff;padding:32px 40px;">
    <p style="margin:0 0 3px;font-size:14px;color:#4A5568;font-family:Arial,sans-serif;">Best,</p>
    <p style="margin:0 0 14px;font-size:16px;font-weight:700;color:#051C2C;">Chase Bourdelaise</p>
    <p style="margin:0;font-size:13px;color:#4A5568;line-height:2;font-family:Arial,sans-serif;">
      Managing Director, Tenant Advisory &amp; Corporate Real Estate Consulting<br>
      Transwestern<br>
      <a href="tel:2025911926" style="color:#051C2C;text-decoration:none;">202-591-1926</a> &nbsp;·&nbsp;
      <a href="mailto:chase.bourdelaise@transwestern.com" style="color:#051C2C;text-decoration:none;">chase.bourdelaise@transwestern.com</a><br>
      <a href="https://chasebourdelaise.com" style="color:#2251FF;text-decoration:none;">chasebourdelaise.com</a> &nbsp;·&nbsp;
      <a href="https://linkedin.com/in/tenantadvisor" style="color:#2251FF;text-decoration:none;">LinkedIn</a>
    </p>
  </td></tr>

  <tr><td style="background:#ECEEF1;padding:20px 40px;text-align:center;">
    <p style="margin:0;font-size:11px;color:#8A9BB0;font-family:Arial,sans-serif;">Delivered from <a href="https://chasebourdelaise.com" style="color:#4A5568;text-decoration:none;">chasebourdelaise.com</a>. Your information is never sold or shared.</p>
  </td></tr>

</table></td></tr></table>
</body></html>`;

    const errors2 = [];
    try {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.RESEND_API_KEY}` },
        body: JSON.stringify({
          from: "Chase Bourdelaise <hi@chasebourdelaise.com>",
          reply_to: "chase.bourdelaise@transwestern.com",
          to: [to],
          bcc: ["chase.bourdelaise@transwestern.com"],
          subject: "Your VP of Facilities Master Checklist — Chase Bourdelaise",
          html: checklistHtml,
        }),
      });
      if (!r.ok) { const t = await r.text(); console.error("Resend checklist error:", r.status, t); errors2.push(`Resend: ${r.status}`); }
    } catch (err) { console.error("Resend checklist exception:", err); errors2.push("Resend: network error"); }

    try {
      const b = await fetch(`https://api.beehiiv.com/v2/publications/${BEEHIIV_PUB_ID}/subscriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${BEEHIIV_API_KEY}` },
        body: JSON.stringify({
          email: to,
          reactivate_existing: false,
          send_welcome_email: true,
          utm_source: "facilities-move-checklist",
          utm_medium: "website",
          custom_fields: [
            { name: "First Name", value: firstName },
            { name: "Company",    value: co },
          ],
        }),
      });
      if (!b.ok) { const t = await b.text(); console.error("Beehiiv checklist error:", b.status, t); errors2.push(`Beehiiv: ${b.status}`); }
    } catch (err) { console.error("Beehiiv checklist exception:", err); errors2.push("Beehiiv: network error"); }

    if (errors2.some(e => e.startsWith("Resend"))) {
      return res.status(500).json({ error: "Failed to send checklist email.", details: errors2 });
    }
    return res.status(200).json({ success: true, message: "Checklist sent." });
  }
  // ── End facilities checklist branch ───────────────────────────────────────

  const {
    name, email, company, title, phone, questions,
    rsf, rsfPerSeat, industryLabel, industryBenchmark, officeType,
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

  // ── Contextual strategic questions (program-aware) ────────────────────────
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

  if (officeType === "satellite") {
    stratQuestions.push(`You have identified this as a satellite, branch, or regional office — not a primary HQ. The program reflects that distinction with reduced amenity investment and no town hall capability. The strategic question: how is this satellite expected to relate to your HQ? Is it a destination for client meetings, a pure operations hub, or a flexible touchdown space for a regional sales team? Each case implies a different program — and different lease terms. Operational satellites benefit from shorter lease terms (5-7 years) and aggressive expansion/contraction rights, since regional needs change faster than corporate ones.`);
  } else if (officeType === "hq" && Number(hcYr3) >= 200) {
    stratQuestions.push(`As your primary HQ, this office is a brand statement, a recruiting tool, and the cultural anchor for your distributed workforce. At your scale (${hcYr3}+ people Year 3), the question isn't whether to invest in visitor experience and amenity — it's whether you're investing in the right things. Modern HQs are increasingly judged on the quality of their public-facing space (lobby, client-facing conference floor) and their wellness program (gym, mothers room, quiet rooms), not the size of executive offices. Where will your investment dollars create the most leverage with employees and clients?`);
  }

  const indLower = (industryLabel || "").toLowerCase();
  if (indLower.includes("telecom")) {
    stratQuestions.push(`Telecom HQs blend three distinct work types under one roof — corporate, engineering, and operations. Each has a different programmatic logic: corporate floors lean toward private offices and traditional meeting rooms; engineering wants open neighborhoods with heavy phone-booth density; operations needs high-density bench seating with adjacent training and break space. Has your floor stack been planned to keep these populations together where they need to be (engineering + product) and separated where they need to be (NOC + corporate)? The vertical stacking decision drives both employee experience and floor plate efficiency.`);
    stratQuestions.push(`The customer briefing center or demo space is the single highest-leverage square footage in a modern telecom HQ — it's where 5G, fiber, and edge computing capabilities get sold to enterprise clients. Has this space been programmed against actual client visit volume and the partnerships team's pipeline? Under-investment here forfeits B2B revenue; over-investment ties up rent on space that sits empty between major customer visits.`);
  } else if (indLower.includes("law")) {
    stratQuestions.push(`Law firm programs are uniquely office-intensive, and that's reflected in your benchmark RSF/seat. The strategic question is whether your firm should pursue a "universal office" model (partners and associates same-sized, around 150 SF) — which has been adopted by Cleary, Allen & Overy, and others — or maintain the traditional partner/associate hierarchy. The universal model adds 15-20% efficiency and signals a flatter culture, but creates real change-management friction with senior partners. Which direction does your firm's culture point?`);
  } else if (indLower.includes("technology")) {
    stratQuestions.push(`Tech companies systematically under-program phone booths and focus rooms. The benchmark is one phone booth per 15-20 open-plan workstations — engineers are constantly on calls, and a shortage creates the kind of low-grade daily friction that drives people back to working from home. Have you walked your existing floor at 10am on a Wednesday and counted how many people are on calls without a private space? That observation usually settles the debate about whether you have enough.`);
  }

  stratQuestions.push(`Your Year 3 headcount is ${hcYr3} and Year 5 is ${hcYr5}. Are these conservative or aggressive? Over-building for growth you don't achieve is expensive. Under-building creates operational friction and a premature lease renewal from a position of weakness. Does your lease structure include expansion options or rights of first refusal on adjacent space? This is one of the most valuable — and most frequently negotiated — provisions in any lease.`);

  stratQuestions.push(`At what headcount threshold would you need to expand? At what headcount would you start subleasing? Know these numbers before you sign. They should be embedded in the lease as option triggers, not discovered in year three when you're locked in.`);

  // ── Rooms table ───────────────────────────────────────────────────────────
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

  // ── Amenities ─────────────────────────────────────────────────────────────
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

  // ── Strategic questions HTML ──────────────────────────────────────────────
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

  // ── Discovery questions HTML ──────────────────────────────────────────────
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

  // ── Team metrics rows ─────────────────────────────────────────────────────
  const teamRows = [
    ["People Today",           hcNow],
    ["Year 3 Headcount",       hcYr3],
    ["Year 5 Headcount",       hcYr5],
    ["Days In-Office / Week",  daysInOffice + " days"],
    ["Shared Seating",         sharedPct + "% of staff"],
    ["Total Desks (Yr 3)",     fmt(totalDesks)],
    ["Desk : Person Ratio",    deskRatio + " : 1"],
    ["Private Offices",        fmt(numOffices)],
    ["Open Workstations",      fmt(numWS)],
    ["Layout Type",            layoutLabel],
    ["SF Per Desk",            layoutSF + " SF"],
  ].map(([label, val], i) => `
    <tr style="background:${i % 2 === 0 ? "#F8F9FB" : "#fff"};">
      <td style="padding:9px 12px;font-size:13px;color:#4A5568;border-bottom:1px solid #D8DDE5;font-family:Arial,sans-serif;">${label}</td>
      <td style="padding:9px 12px;font-size:13px;color:#051C2C;font-weight:600;text-align:right;border-bottom:1px solid #D8DDE5;font-family:Arial,sans-serif;">${val}</td>
    </tr>`).join("");

  // ── Full email ────────────────────────────────────────────────────────────
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

  <!-- Strategic Questions -->
  <tr><td style="background:#F8F9FB;padding:32px 40px;border-top:3px solid #051C2C;">
    <p style="margin:0 0 5px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#2251FF;font-weight:700;font-family:Arial,sans-serif;">Strategic Planning Guide</p>
    <p style="margin:0 0 20px;font-size:16px;font-weight:700;color:#051C2C;">Questions specific to your program</p>
    <p style="margin:0 0 18px;font-size:13px;color:#4A5568;line-height:1.7;font-family:Arial,sans-serif;">The following observations are generated directly from your inputs — headcount, days in office, desk ratio, and benchmark comparison. They are not generic; they reflect your specific program.</p>
    <table width="100%" cellpadding="0" cellspacing="0">${stratQuestionsHTML}</table>
  </td></tr>

  <!-- Discovery Questions -->
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
      Managing Director, Tenant Advisory &amp; Corporate Real Estate Consulting<br>
      Transwestern<br>
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

  // ── 1. Send via Resend ────────────────────────────────────────────────────
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

  // ── 2. Subscribe to Beehiiv ───────────────────────────────────────────────
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
