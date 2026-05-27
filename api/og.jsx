// api/og.jsx
// Vercel Edge Function — generates 1200×630 OG images on-demand.
// All content is passed as query params so any article can use one endpoint.
//
// PARAMS
//   eyebrow   Category label  e.g. "Tenant Advisory · Field Guide"
//   tl        (repeatable) White headline line(s)
//   tlg       Optional final headline line in gold
//   title     Fallback single-string headline (auto-wraps) if no `tl` provided
//   s         (repeatable, max 3) Stat tiles — "value|label text"
//   c         (repeatable, max 8) Right-panel checklist — "Title|Subtitle"
//   a         (repeatable, max 6) "Also covers" list items
//
// EXAMPLE
//   /api/og?eyebrow=Tenant+Advisory&tl=How+to+Tour+Space%3A&s=6%E2%80%937%7Cbuildings%2Fday&c=Before+the+tour%7CPre-calibration+framework

import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

// ── Brand tokens ──────────────────────────────────────────────────────────────
const NAVY  = '#051C2C';
const DARK2 = '#08141E';
const GOLD  = '#C9A84C';
const WHITE = '#FFFFFF';
const MUTED = '#8A9BB0';
const RULE  = '#1E3A50';
const LITXT = '#A5B9C8';
const LINK  = '#466074';
const DIM   = '#0E2030';

// ── Font loader (Google Fonts → ArrayBuffer) ──────────────────────────────────
async function loadFont(family, weight) {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&display=swap`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
            '(KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
        },
      }
    ).then((r) => r.text());
    const url = css.match(/src: url\(([^)]+)\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

// ── Handler ───────────────────────────────────────────────────────────────────
export default async function handler(req) {
  const { searchParams } = new URL(req.url);

  // Headline
  const titleLines = searchParams.getAll('tl');
  const titleGold  = searchParams.get('tlg') || '';
  const fallback   = searchParams.get('title') || 'Chase Bourdelaise · Insights';
  const eyebrow    = searchParams.get('eyebrow') || 'Chase Bourdelaise';

  // Stats
  const stats = searchParams.getAll('s').slice(0, 3).map((s) => {
    const [val, ...rest] = s.split('|');
    return { val, label: rest.join('|') };
  });

  // Right-panel checklist
  const checklist = searchParams.getAll('c').slice(0, 8).map((c) => {
    const [title, ...rest] = c.split('|');
    return { title, sub: rest.join('|') };
  });

  // Also-covers pills
  const also = searchParams.getAll('a').slice(0, 6);

  // Load fonts in parallel — failures fall back to system fonts silently
  const [cgBold, cgReg, dmBold, dmReg] = await Promise.allSettled([
    loadFont('Cormorant+Garamond', 700),
    loadFont('Cormorant+Garamond', 400),
    loadFont('DM+Sans', 500),
    loadFont('DM+Sans', 400),
  ]).then((r) => r.map((x) => (x.status === 'fulfilled' ? x.value : null)));

  const fonts = [
    cgBold && { name: 'Cormorant Garamond', data: cgBold, weight: 700, style: 'normal' },
    cgReg  && { name: 'Cormorant Garamond', data: cgReg,  weight: 400, style: 'normal' },
    dmBold && { name: 'DM Sans',            data: dmBold, weight: 500, style: 'normal' },
    dmReg  && { name: 'DM Sans',            data: dmReg,  weight: 400, style: 'normal' },
  ].filter(Boolean);

  const serif = fonts.some((f) => f.name === 'Cormorant Garamond') ? '"Cormorant Garamond"' : 'Georgia, serif';
  const sans  = fonts.some((f) => f.name === 'DM Sans')            ? '"DM Sans"'            : 'Arial, sans-serif';

  const RP = 730; // right panel x-start

  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: 1200, height: 630, background: NAVY, fontFamily: sans }}>

        {/* ── LEFT PANEL ───────────────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: RP,
            height: 630,
            padding: '50px 52px 44px',
          }}
        >
          {/* Top block */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>

            {/* Eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ width: 28, height: 1, background: GOLD, marginRight: '14px' }} />
              <span style={{ color: GOLD, fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase' }}>
                {eyebrow}
              </span>
            </div>

            {/* Headline */}
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '18px' }}>
              {titleLines.length > 0 ? (
                <>
                  {titleLines.map((line, i) => (
                    <span
                      key={String(i)}
                      style={{
                        fontFamily: serif,
                        fontWeight: 700,
                        fontSize: 54,
                        lineHeight: 1.05,
                        color: WHITE,
                        letterSpacing: '-1px',
                        display: 'block',
                      }}
                    >
                      {line}
                    </span>
                  ))}
                  {titleGold && (
                    <span
                      style={{
                        fontFamily: serif,
                        fontWeight: 700,
                        fontSize: 48,
                        lineHeight: 1.05,
                        color: GOLD,
                        letterSpacing: '-1px',
                        display: 'block',
                      }}
                    >
                      {titleGold}
                    </span>
                  )}
                </>
              ) : (
                <span
                  style={{
                    fontFamily: serif,
                    fontWeight: 700,
                    fontSize: 52,
                    lineHeight: 1.1,
                    color: WHITE,
                    letterSpacing: '-1px',
                    maxWidth: 620,
                  }}
                >
                  {fallback}
                </span>
              )}
            </div>

            {/* Rule */}
            <div style={{ width: '100%', height: 1, background: RULE, marginBottom: '16px' }} />

            {/* Stat tiles */}
            {stats.length > 0 && (
              <div style={{ display: 'flex', marginBottom: '20px' }}>
                {stats.map((stat, i) => (
                  <div
                    key={String(i)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                      background: RULE,
                      borderLeft: `3px solid ${GOLD}`,
                      padding: '10px 14px',
                      marginRight: i < stats.length - 1 ? '6px' : '0',
                    }}
                  >
                    <span style={{ fontFamily: serif, fontWeight: 700, fontSize: 28, color: WHITE, lineHeight: '1' }}>
                      {stat.val}
                    </span>
                    <span style={{ fontSize: 11, color: MUTED, marginTop: '8px', lineHeight: '1.5' }}>
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Also covers */}
            {also.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: 10,
                    color: MUTED,
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    fontWeight: 500,
                    marginBottom: '10px',
                  }}
                >
                  ALSO COVERS:
                </span>
                <div style={{ display: 'flex' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    {also.slice(0, Math.ceil(also.length / 2)).map((t, i) => (
                      <span key={String(i)} style={{ color: LITXT, fontSize: 12, marginBottom: '8px' }}>
                        →  {t}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    {also.slice(Math.ceil(also.length / 2)).map((t, i) => (
                      <span key={String(i)} style={{ color: LITXT, fontSize: 12, marginBottom: '8px' }}>
                        →  {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: '100%', height: 1, background: RULE, marginBottom: '12px' }} />
            <span style={{ color: LINK, fontSize: 12 }}>chasebourdelaise.com</span>
          </div>
        </div>

        {/* ── RIGHT PANEL ──────────────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: 1200 - RP,
            height: 630,
            background: DARK2,
            borderLeft: `1px solid ${RULE}`,
            padding: '44px 28px 28px',
          }}
        >
          <span
            style={{
              color: GOLD,
              fontSize: 10,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              fontWeight: 500,
              marginBottom: '14px',
            }}
          >
            INSIDE THIS GUIDE
          </span>
          <div style={{ width: '100%', height: 1, background: RULE, marginBottom: '12px' }} />

          {/* Checklist */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            {checklist.map((item, i) => (
              <div
                key={String(i)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  paddingBottom: '10px',
                  marginBottom: '10px',
                  borderBottom: i < checklist.length - 1 ? `1px solid ${DIM}` : 'none',
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    background: GOLD,
                    marginTop: 4,
                    marginRight: '14px',
                    flexShrink: 0,
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: WHITE, fontSize: 13, fontWeight: 500 }}>{item.title}</span>
                  <span style={{ color: MUTED, fontSize: 11, marginTop: '2px' }}>{item.sub}</span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA bar */}
          <div
            style={{
              display: 'flex',
              background: GOLD,
              padding: '12px 20px',
              justifyContent: 'center',
              marginTop: '8px',
            }}
          >
            <span style={{ color: NAVY, fontSize: 14, fontWeight: 700 }}>
              Read the full guide  →
            </span>
          </div>
        </div>

      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts,
    }
  );
}
