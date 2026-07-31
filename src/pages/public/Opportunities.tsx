import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Ferrofluid from '../../components/Ferrofluid';
import Header from '../../components/Header';
import IntroLogo from '../../components/IntroLogo';
import OptionWheel from '../../components/OptionWheel';
import CircularGallery from '../../components/CircularGallery';
import { getOpportunities, OPPORTUNITY_FORTES } from '../../lib/db';
import type { DbOpportunity } from '../../lib/db';
import feImg from '../../assets/forte-placeholders/fe.png';
import beImg from '../../assets/forte-placeholders/be.png';
import aiImg from '../../assets/forte-placeholders/ai.png';
import mdImg from '../../assets/forte-placeholders/md.png';
import uxImg from '../../assets/forte-placeholders/ux.png';

const STEEL = '#9AA1A3';
const SILVER = '#C6CAC9';
const SMOKE = '#F1F2EE';

const FORTES = [...OPPORTUNITY_FORTES];

const GALLERY_ITEMS = [
  { image: feImg, text: 'Frontend' },
  { image: beImg, text: 'Backend' },
  { image: aiImg, text: 'Agentic AI' },
  { image: mdImg, text: 'Mobile Development' },
  { image: uxImg, text: 'UI / UX Design' },
];

function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max) + '...' : text;
}

const CATEGORY_LABEL: Record<DbOpportunity['category'], string> = {
  internship: 'Internship',
  training: 'Training',
  fellowship: 'Fellowship',
  project: 'Project',
};

export default function Opportunities() {
  const [selectedForte, setSelectedForte] = useState<string>(FORTES[0]);
  const [forteChosen, setForteChosen] = useState(false);
  const [opportunities, setOpportunities] = useState<DbOpportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOpportunities('active')
      .then(setOpportunities)
      .finally(() => setLoading(false));
  }, []);

  const hasLive = opportunities.length > 0;

  const forteCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const f of FORTES) counts[f] = 0;
    for (const o of opportunities) {
      if (o.forte) counts[o.forte] = (counts[o.forte] ?? 0) + 1;
    }
    return counts;
  }, [opportunities]);

  return (
    <div className="relative min-h-screen bg-black text-white">
      <div className="fixed inset-0 pointer-events-none">
        <Ferrofluid
          colors={['#9AA1A3', '#C6CAC9', '#F1F2EE']}
          speed={0.5}
          scale={1.6}
          turbulence={1}
          fluidity={0.15}
          rimWidth={0.22}
          sharpness={2.5}
          shimmer={1.2}
          glow={1.0}
          flowDirection="down"
          opacity={0.7}
          mouseInteraction
          mouseStrength={0.8}
          mouseRadius={0.35}
        />
      </div>

      <IntroLogo animate={false} />
      <Header />

      <main className="relative px-8 pt-40 pb-28">
        <div className="mx-auto max-w-5xl">
          {/* Hero */}
          <h1
            className="text-[11vw] leading-[0.85] font-semibold tracking-tighter sm:text-[6vw]"
            style={{ color: SMOKE }}
          >
            OPEN ROLES
          </h1>

          {/* Wait for the first fetch before deciding which state to show — otherwise a real,
              already-live opportunity flashes the "no live opportunities yet" copy for a beat. */}
          {!loading && (
          <>
          {/* Immediate, honest status — this is the one fact that matters, so it comes first */}
          <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
            {hasLive ? (
              <p className="max-w-lg text-[17px] leading-relaxed" style={{ color: STEEL }}>
                <span className="font-semibold" style={{ color: SMOKE }}>
                  {opportunities.length} open role{opportunities.length !== 1 ? 's' : ''} right now.
                </span>{' '}
                Screened, structured, ready to apply to.
              </p>
            ) : (
              <>
                <p className="max-w-lg text-[17px] leading-relaxed" style={{ color: STEEL }}>
                  <span className="font-semibold" style={{ color: SMOKE }}>
                    No live opportunities yet.
                  </span>{' '}
                  This page goes live the moment an admin posts the first one — screened, structured, ready to apply
                  to.
                </p>
                <Link
                  to="/signup"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-5 py-2.5 text-[13px] font-semibold text-black transition-transform hover:scale-[1.03]"
                  style={{ backgroundColor: SMOKE }}
                >
                  Get notified
                  <span aria-hidden="true">→</span>
                </Link>
              </>
            )}
          </div>

          {hasLive ? (
            /* Real, live opportunities — replaces the forte preview once an admin has posted at least one */
            <div className="mt-20 grid gap-6 sm:grid-cols-2">
              {opportunities.map(opp => (
                <Link
                  key={opp.id}
                  to={`/apply/${opp.id}`}
                  className="group flex flex-col justify-between border p-6 transition-colors hover:border-white/40"
                  style={{ borderColor: 'rgba(198,202,201,0.25)' }}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-lg font-semibold tracking-tight" style={{ color: SMOKE }}>
                        {opp.title}
                      </h2>
                      <span
                        className="shrink-0 text-[11px] uppercase tracking-[0.15em]"
                        style={{ color: STEEL }}
                      >
                        {CATEGORY_LABEL[opp.category]}
                      </span>
                    </div>
                    <p className="mt-3 text-[14px] leading-relaxed" style={{ color: STEEL }}>
                      {truncate(opp.description, 140)}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-between text-[13px]" style={{ color: SILVER }}>
                    <span>{opp.slots ? `${opp.slots} slot${opp.slots !== 1 ? 's' : ''} available` : ' '}</span>
                    <span className="inline-flex items-center gap-1 transition-transform group-hover:translate-x-0.5">
                      Apply <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <>
              {/* Forte wheel */}
              <div className="mt-24 grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight" style={{ color: SMOKE }}>
                    Browse by forte
                  </h2>
                  <p className="mt-3 max-w-xs text-[14px] leading-relaxed" style={{ color: STEEL }}>
                    A preview of the tracks Lumora will open roles for first.
                  </p>
                  <p className="mt-8 text-[13px]" style={{ color: SILVER }}>
                    {selectedForte}{' '}
                    <span style={{ color: STEEL }}>
                      · {forteCounts[selectedForte] ?? 0} open role{(forteCounts[selectedForte] ?? 0) !== 1 ? 's' : ''}
                    </span>
                  </p>
                </div>
                <div>
                  <div style={{ height: '260px', position: 'relative' }}>
                    <OptionWheel
                      items={FORTES}
                      defaultSelected={0}
                      side="left"
                      textColor={STEEL}
                      activeColor={SMOKE}
                      fontSize={2}
                      spacing={1.3}
                      curve={1}
                      tilt={7}
                      blur={2}
                      fade={0.3}
                      inset={0}
                      onChange={(_, item) => {
                        setSelectedForte(item);
                        setForteChosen(true);
                      }}
                    />
                  </div>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.2em]" style={{ color: STEEL }}>
                    ↕ scroll, drag, or use arrow keys
                  </p>
                </div>
              </div>

              {/* Circular gallery — only appears once a forte has actually been picked, and
                  highlights the selection without scrolling or rebuilding itself */}
              {forteChosen && (
                <div className="mt-24">
                  <div style={{ height: '360px', position: 'relative' }}>
                    <CircularGallery
                      items={GALLERY_ITEMS}
                      bend={0}
                      textColor={SILVER}
                      borderRadius={0.03}
                      scrollEase={0.03}
                      font="500 22px -apple-system, Helvetica, Arial, sans-serif"
                      highlightText={selectedForte}
                    />
                  </div>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.2em]" style={{ color: STEEL }}>
                    ↔ drag to explore
                  </p>
                </div>
              )}
            </>
          )}
          </>
          )}
        </div>
      </main>
    </div>
  );
}
