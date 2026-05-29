// api/og.mjs
// Vercel Edge Function — dynamic OG image for any article.
// Uses React.createElement (no JSX, no build step needed).

import { ImageResponse } from '@vercel/og';
import React from 'react';

export const config = { runtime: 'nodejs' };

const NAVY  = '#051C2C';
const DARK2 = '#08141E';
const GOLD  = '#C9A84C';
const WHITE = '#FFFFFF';
const MUTED = '#8A9BB0';
const RULE  = '#1E3A50';
const LITXT = '#A5B9C8';
const LINK  = '#466074';
const DIM   = '#0E2030';

const h = React.createElement;

async function loadFont(family, weight) {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&display=swap`,
      { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36' } }
    ).then(r => r.text());
    const url = css.match(/src: url\(([^)]+)\)/)?.[1];
    if (!url) return null;
    return fetch(url).then(r => r.arrayBuffer());
  } catch { return null; }
}

export default async function handler(req) {
  const { searchParams } = new URL(req.url);

  const eyebrow    = searchParams.get('eyebrow') || 'Chase Bourdelaise';
  const titleLines = searchParams.getAll('tl');
  const titleGold  = searchParams.get('tlg') || '';
  const fallback   = searchParams.get('title') || 'Chase Bourdelaise · Insights';
  const stats      = searchParams.getAll('s').slice(0, 3).map(s => { const [val, ...r] = s.split('|'); return { val, label: r.join('|') }; });
  const checklist  = searchParams.getAll('c').slice(0, 8).map(c => { const [title, ...r] = c.split('|'); return { title, sub: r.join('|') }; });
  const also       = searchParams.getAll('a').slice(0, 6);

  const [cgBold, cgReg, dmBold, dmReg] = await Promise.allSettled([
    loadFont('Cormorant+Garamond', 700),
    loadFont('Cormorant+Garamond', 400),
    loadFont('DM+Sans', 500),
    loadFont('DM+Sans', 400),
  ]).then(r => r.map(x => x.status === 'fulfilled' ? x.value : null));

  const fonts = [
    cgBold && { name: 'Cormorant Garamond', data: cgBold, weight: 700, style: 'normal' },
    cgReg  && { name: 'Cormorant Garamond', data: cgReg,  weight: 400, style: 'normal' },
    dmBold && { name: 'DM Sans',            data: dmBold, weight: 500, style: 'normal' },
    dmReg  && { name: 'DM Sans',            data: dmReg,  weight: 400, style: 'normal' },
  ].filter(Boolean);

  const serif = fonts.some(f => f.name === 'Cormorant Garamond') ? '"Cormorant Garamond", Georgia, serif' : 'Georgia, serif';
  const sans  = fonts.some(f => f.name === 'DM Sans')            ? '"DM Sans", Arial, sans-serif'         : 'Arial, sans-serif';

  const RP = 730;

  const image = h('div', {
    style: { display: 'flex', width: 1200, height: 630, background: NAVY, fontFamily: sans }
  },

    // ── LEFT PANEL ──────────────────────────────────────────────────────────
    h('div', {
      style: { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: RP, height: 630, padding: '50px 52px 44px' }
    },

      // Top content block
      h('div', { style: { display: 'flex', flexDirection: 'column' } },

        // Eyebrow
        h('div', { style: { display: 'flex', alignItems: 'center', marginBottom: 24 } },
          h('div', { style: { width: 28, height: 1, background: GOLD, marginRight: 14 } }),
          h('div', { style: { color: GOLD, fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase' } }, eyebrow)
        ),

        // Headline
        h('div', { style: { display: 'flex', flexDirection: 'column', marginBottom: 18 } },
          ...(titleLines.length > 0
            ? [
                ...titleLines.map((line, i) =>
                  h('div', { key: i, style: { fontFamily: serif, fontWeight: 700, fontSize: 54, lineHeight: 1.05, color: WHITE, letterSpacing: '-1px' } }, line)
                ),
                titleGold && h('div', { style: { fontFamily: serif, fontWeight: 700, fontSize: 48, lineHeight: 1.05, color: GOLD, letterSpacing: '-1px' } }, titleGold),
              ].filter(Boolean)
            : [h('div', { style: { fontFamily: serif, fontWeight: 700, fontSize: 52, lineHeight: 1.1, color: WHITE, letterSpacing: '-1px', maxWidth: 620 } }, fallback)]
          )
        ),

        // Rule
        h('div', { style: { width: '100%', height: 1, background: RULE, marginBottom: 16 } }),

        // Stat tiles
        stats.length > 0 && h('div', { style: { display: 'flex', marginBottom: 20 } },
          ...stats.map((s, i) =>
            h('div', { key: i, style: { display: 'flex', flexDirection: 'column', flex: 1, background: RULE, borderLeft: `3px solid ${GOLD}`, padding: '10px 14px', marginRight: i < stats.length - 1 ? 6 : 0 } },
              h('div', { style: { fontFamily: serif, fontWeight: 700, fontSize: 28, color: WHITE, lineHeight: 1 } }, s.val),
              h('div', { style: { fontSize: 11, color: MUTED, marginTop: 8, lineHeight: 1.5 } }, s.label)
            )
          )
        ),

        // Also covers
        also.length > 0 && h('div', { style: { display: 'flex', flexDirection: 'column' } },
          h('div', { style: { fontSize: 10, color: MUTED, letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 500, marginBottom: 10 } }, 'ALSO COVERS:'),
          h('div', { style: { display: 'flex' } },
            h('div', { style: { display: 'flex', flexDirection: 'column', flex: 1 } },
              ...also.slice(0, Math.ceil(also.length / 2)).map((t, i) =>
                h('div', { key: i, style: { color: LITXT, fontSize: 12, marginBottom: 8 } }, `→  ${t}`)
              )
            ),
            h('div', { style: { display: 'flex', flexDirection: 'column', flex: 1 } },
              ...also.slice(Math.ceil(also.length / 2)).map((t, i) =>
                h('div', { key: i, style: { color: LITXT, fontSize: 12, marginBottom: 8 } }, `→  ${t}`)
              )
            )
          )
        ),

      ),

      // Footer
      h('div', { style: { display: 'flex', flexDirection: 'column' } },
        h('div', { style: { width: '100%', height: 1, background: RULE, marginBottom: 12 } }),
        h('div', { style: { color: LINK, fontSize: 12 } }, 'chasebourdelaise.com')
      )
    ),

    // ── RIGHT PANEL ──────────────────────────────────────────────────────────
    h('div', {
      style: { display: 'flex', flexDirection: 'column', width: 1200 - RP, height: 630, background: DARK2, borderLeft: `1px solid ${RULE}`, padding: '44px 28px 28px' }
    },
      h('div', { style: { color: GOLD, fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 500, marginBottom: 14 } }, 'INSIDE THIS GUIDE'),
      h('div', { style: { width: '100%', height: 1, background: RULE, marginBottom: 12 } }),

      // Checklist
      h('div', { style: { display: 'flex', flexDirection: 'column', flex: 1 } },
        ...checklist.map((item, i) =>
          h('div', { key: i, style: { display: 'flex', alignItems: 'flex-start', paddingBottom: 10, marginBottom: 10, borderBottom: i < checklist.length - 1 ? `1px solid ${DIM}` : 'none' } },
            h('div', { style: { width: 10, height: 10, background: GOLD, marginTop: 4, marginRight: 14, flexShrink: 0 } }),
            h('div', { style: { display: 'flex', flexDirection: 'column' } },
              h('div', { style: { color: WHITE, fontSize: 13, fontWeight: 500 } }, item.title),
              h('div', { style: { color: MUTED, fontSize: 11, marginTop: 2 } }, item.sub)
            )
          )
        )
      ),

      // CTA
      h('div', { style: { display: 'flex', background: GOLD, padding: '12px 20px', justifyContent: 'center', marginTop: 8 } },
        h('div', { style: { color: NAVY, fontSize: 14, fontWeight: 700 } }, 'Read the full guide  →')
      )
    )
  );

  return new ImageResponse(image, { width: 1200, height: 630, fonts });
}
