// @ts-nocheck
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Dither from '../../components/Dither';
import Radar from '../../components/Radar';
import Lightfall from '../../components/Lightfall';
import CountUp from '../../components/CountUp';
import ElectricBorder from '../../components/react-bits/ElectricBorder/ElectricBorder';
import Ferrofluid from '../../components/Ferrofluid';
import Header from '../../components/Header';
import IntroLogo from '../../components/IntroLogo';
import SplitText from '../../components/SplitText';
import BlurText from '../../components/react-bits/BlurText/BlurText';
import AnimatedContent from '../../components/AnimatedContent';
import ScrollReveal from '../../components/ScrollReveal';
import ScrollRevealGroup from '../../components/ScrollRevealGroup';
import CurvedLoop from '../../components/react-bits/CurvedLoop/CurvedLoop';
import LogoLoop from '../../components/react-bits/LogoLoop/LogoLoop';
import OrbitImages from '../../components/react-bits/OrbitImages/OrbitImages';

import ClickSpark from '../../components/ClickSpark';
import FadeContent from '../../components/FadeContent';
import {
  Code, Laptop, Users, Rocket, Box, Target, Quote,
  Check, X, ArrowRight, ChevronRight,
  FileCheck, Sparkles, ShieldCheck, PenTool, Mail
} from 'lucide-react';

// TODO: replace with real data before launch
const HERO_BADGES = [
  { icon: FileCheck, label: 'Real Client Projects' },
  { icon: Sparkles, label: 'AI-Assisted Learning' },
  { icon: Users, label: 'Mentor Reviewed' },
  { icon: ShieldCheck, label: 'Industry Ready' },
];

const HOW_IT_WORKS = [
  { num: '1', icon: Code, title: 'Foundation Modules', desc: 'Build a strong base with Git & GitHub, deployment, and database essentials.' },
  { num: '2', icon: Laptop, title: 'Development Skills', desc: 'Master AI-assisted development, API integration, and real debugging instincts.' },
  { num: '3', icon: Users, title: 'Professional Skills', desc: 'Sharpen the communication and collaboration skills no course ever taught you.' },
  { num: '4', icon: Rocket, title: 'Capstone Project', desc: "Ship something real — proof, not just a promise, that you're ready." },
];

const VALUES = [
  { icon: Box, title: 'Practical Over Theoretical', desc: 'You learn by building, not by memorizing.' },
  { icon: Users, title: 'Mentorship-Driven', desc: 'Every intern gets real human feedback, not just a grade.' },
  { icon: Target, title: 'Real Accountability', desc: 'Readiness is earned and evaluated — never assumed.' },
];

const WHAT_YOULL_GAIN = [
  'Hands-on experience with industry tools',
  'Portfolio of real-world projects',
  'Personalized mentor feedback',
  'Readiness evaluation & skill assessment',
  'Professional communication skills',
  'Certificate of completion',
];

// TODO: replace with real, approved numbers before launch
const STATS = [
  { to: 500, suffix: '+', label: 'Interns Trained' },
  { to: 12, suffix: '+', label: 'Domain Tracks' },
  { to: 150, suffix: '+', label: 'Mentor Experts' },
  { to: 200, suffix: '+', label: 'Mentor-Reviewed Capstones' },
];

// TODO: replace with real placement companies before launch
const PARTNER_COMPANIES = ['Meta', 'GrowthX', 'Notion', 'Swiggy', 'Razorpay'];

// TODO: replace with a real intern story before launch
const TESTIMONIAL = {
  quote: "I applied with zero backend experience. Six weeks later, I shipped a feature a real client's team uses today.",
  name: 'Priya S.',
  role: 'Now a Backend Intern, GrowthX',
};


function ComingSoonLink({ label }: { label: string }) {
  const handleClick = () => alert(`${label} — coming soon.`);
  return (
    <button
      onClick={handleClick}
      className="text-sm text-[#F1F2EE] hover:text-[#C6CAC9] flex items-center gap-1 transition-colors"
    >
      {label} <ChevronRight className="w-4 h-4" />
    </button>
  );
}

export default function About() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [orbitPaused, setOrbitPaused] = useState(false);
  const [supportsOffsetPath, setSupportsOffsetPath] = useState(true);

  useEffect(() => {
    // Check if browser supports offset-path with path() - required for OrbitImages
    setSupportsOffsetPath(
      typeof CSS !== 'undefined' && 
      CSS.supports && 
      CSS.supports('offset-path', 'path("M 0 0 L 1 1")')
    );
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0A0A0B] text-white overflow-hidden font-sans">
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

      <main className="relative z-10 px-6 sm:px-8 pt-32 pb-28 max-w-7xl mx-auto space-y-24">

        {/* HERO */}
        <AnimatedContent distance={30} direction="vertical" animateOpacity duration={0.6} threshold={0.2}>
          <section className="text-center max-w-3xl mx-auto">
            <h1 className="text-6xl sm:text-7xl font-bold leading-[0.95] tracking-tight mb-6">
              <SplitText
                text="About Lumora"
                delay={100}
                from={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
                to={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
                easing="easeOutCubic"
                threshold={0.2}
                rootMargin="-50px"
              />
            </h1>
            <div className="text-gray-400 text-lg mb-8 leading-relaxed">
              <BlurText text="Every expert was once a beginner. We just make the path shorter." delay={50} />
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {HERO_BADGES.map((b, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300"
                >
                  <b.icon className="w-3.5 h-3.5 text-[#C6CAC9]" /> {b.label}
                </span>
              ))}
            </div>
          </section>
        </AnimatedContent>

        {/* OUR MISSION */}
        <ScrollReveal delay={0.1}>
          <AnimatedContent distance={30} direction="vertical" animateOpacity duration={0.6} threshold={0.2}>
            <section className="grid lg:grid-cols-2 gap-8 items-start">
              <div>
                <div className="[&>.curved-loop-jacket]:!min-h-[120px] [&>.curved-loop-jacket]:!h-[120px] flex items-center overflow-hidden" style={{ height: '120px' }}>
                  <CurvedLoop 
                    marqueeText="OUR MISSION ✦"
                    speed={1.5}
                    curveAmount={200}
                    direction="left"
                    interactive={true}
                  />
                </div>
                <h2 className="text-3xl font-bold leading-tight mb-4">
                  Your degree taught you the theory. We help you earn the confidence.
                </h2>
                <p className="text-gray-400 leading-relaxed">
                  Most students graduate knowing the concepts but not the craft. Lumora closes that gap —
                  through real projects, real mentors, and real feedback — so that on day one of your
                  first job, you don't just show up, you belong there.
                </p>
              </div>
              <div className="bg-[#111114] border border-white/10 rounded-2xl p-6">
                <Quote className="w-6 h-6 text-[#6D777C] mb-4" />
                <p className="text-lg text-gray-200 leading-relaxed mb-6">
                  We don't just teach code.<br />We build readiness.<br />We build professionals.
                </p>
                <div className="border-t border-white/10 pt-4 flex items-center gap-3">
                  <Users className="w-6 h-6 text-gray-500" />
                  <div>
                    {/* TODO: real stat */}
                    <p className="text-2xl font-bold">500+</p>
                    <p className="text-xs text-gray-500">Interns transformed since our inception</p>
                  </div>
                </div>
              </div>
            </section>
          </AnimatedContent>
        </ScrollReveal>

        {/* THE LUMORA SHIFT (before/after) */}
        <ScrollReveal delay={0.1}>
          <AnimatedContent distance={30} direction="vertical" animateOpacity duration={0.6} threshold={0.2}>
            <section>
              <p className="text-[#9AA1A3] font-semibold tracking-wider text-sm mb-6 uppercase">The Lumora Shift</p>
              <div className="grid md:grid-cols-2 gap-6 relative">
                <div className="bg-[#111114] border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-500 mb-4">Before Lumora</h3>
                  <ul className="space-y-3">
                    {['Knows the theory, untested in practice', 'Builds alone, second-guesses every decision', 'Applies to jobs, hopes for the best'].map((t) => (
                      <li key={t} className="flex items-start gap-2 text-sm text-gray-500">
                        <X className="w-4 h-4 mt-0.5 shrink-0" /> {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#0A0A0B] border border-white/20 items-center justify-center z-10">
                  <ArrowRight className="w-4 h-4 text-gray-300" />
                </div>
                <div className="bg-[#111114] border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-[#F1F2EE] mb-4">After Lumora</h3>
                  <ul className="space-y-3">
                    {['Has shipped real, mentor-reviewed work', 'Collaborates and communicates like a pro', "Walks into interviews with proof, not just promises"].map((t) => (
                      <li key={t} className="flex items-start gap-2 text-sm text-gray-300">
                        <Check className="w-4 h-4 mt-0.5 shrink-0 text-[#C6CAC9]" /> {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </AnimatedContent>
        </ScrollReveal>

        {/* HOW IT WORKS */}
        <ScrollReveal delay={0.1}>
          <AnimatedContent distance={30} direction="vertical" animateOpacity duration={0.6} threshold={0.2}>
            <section>
              <p className="text-[#9AA1A3] font-semibold tracking-wider text-sm mb-1 uppercase">How It Works</p>
              <p className="text-sm text-gray-500 mb-8">One deliberate step at a time — not a shortcut, a foundation.</p>
              <div className="relative">
                <div className="hidden md:block absolute top-5 left-[12.5%] right-[12.5%] h-px border-t border-dashed border-white/15" />
                <ScrollRevealGroup className="grid md:grid-cols-4 gap-6" staggerDelay={0.1}>
                  {HOW_IT_WORKS.map((step) => (
                    <div key={step.num} className="relative bg-[#111114] border border-white/10 rounded-2xl p-6 flex flex-col overflow-hidden h-full">
                      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                        <Radar
                          speed={0.6}
                          scale={0.6}
                          ringCount={8}
                          spokeCount={8}
                          ringThickness={0.04}
                          spokeThickness={0.008}
                          sweepSpeed={0.8}
                          sweepWidth={2.5}
                          sweepLobes={1}
                          color="#6b6f76"
                          backgroundColor="#000000"
                          falloff={2.2}
                          brightness={0.5}
                          enableMouseInteraction={true}
                          mouseInfluence={0.08}
                        />
                      </div>
                      <div style={{ position: 'relative', zIndex: 1 }} className="flex flex-col h-full">
                        <div className="flex justify-between items-center mb-4">
                          <div className="w-9 h-9 rounded-full bg-[#6D777C] flex items-center justify-center text-sm font-bold text-[#F1F2EE] shrink-0">
                            {step.num}
                          </div>
                          <step.icon className="w-5 h-5 text-gray-500" />
                        </div>
                        <h3 className="font-semibold mb-2">{step.title}</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </ScrollRevealGroup>
              </div>
            </section>
          </AnimatedContent>
        </ScrollReveal>

        {/* WHY LUMORA (values) */}
        <ScrollReveal delay={0.1}>
          <AnimatedContent distance={30} direction="vertical" animateOpacity duration={0.6} threshold={0.2}>
            <section>
              <p className="text-[#9AA1A3] font-semibold tracking-wider text-sm mb-8 uppercase">Why Lumora</p>
              <div className="grid md:grid-cols-3 gap-8">
                {VALUES.map((v) => (
                  <div key={v.title} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <v.icon className="w-5 h-5 text-[#C6CAC9]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm mb-1">{v.title}</h3>
                      <p className="text-xs text-gray-400">{v.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </AnimatedContent>
        </ScrollReveal>

        {/* WHAT YOU'LL GAIN */}
        <ScrollReveal delay={0.1}>
          <AnimatedContent distance={30} direction="vertical" animateOpacity duration={0.6} threshold={0.2}>
            <section className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-4">
              {supportsOffsetPath ? (
                <OrbitImages
                  items={WHAT_YOULL_GAIN.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 bg-[#111114] border border-white/10 rounded-full px-4 py-2 text-sm text-[#C6CAC9] shadow-lg whitespace-nowrap">
                      <Check className="w-4 h-4 text-[#C6CAC9] shrink-0" /> {item}
                    </div>
                  ))}
                  shape="ellipse"
                  radiusX={340}
                  radiusY={140}
                  rotation={0}
                  duration={30}
                  itemSize={180}
                  responsive={true}
                  centerContent={
                    <div className="text-center">
                      <p className="text-[#9AA1A3] font-semibold tracking-wider text-xs uppercase mb-2">What You'll Gain</p>
                      <h3 className="text-2xl font-bold text-[#F1F2EE]">Everything you walk away with</h3>
                    </div>
                  }
                />
              ) : (
                <>
                  <div className="mb-10">
                    <p className="text-[#9AA1A3] font-semibold tracking-wider text-xs uppercase mb-2">What You'll Gain</p>
                    <h3 className="text-2xl font-bold">Everything you walk away with</h3>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    {WHAT_YOULL_GAIN.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 bg-[#111114] border border-white/10 rounded-full px-4 py-2 text-sm text-gray-300 shadow-lg"
                      >
                        <Check className="w-4 h-4 text-[#C6CAC9] shrink-0" /> {item}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </section>
          </AnimatedContent>
        </ScrollReveal>

        {/* STATS STRIP */}
        <ScrollReveal delay={0.1}>
          <AnimatedContent distance={30} direction="vertical" animateOpacity duration={0.6} threshold={0.2}>
            <section className="bg-[#111114] border border-white/10 rounded-2xl grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
              {STATS.map((s) => (
                <div key={s.label} className="p-6 text-center">
                  {/* TODO: real numbers */}
                  <p className="text-3xl font-bold mb-1">
                    <CountUp
                      from={0}
                      to={s.to}
                      separator=","
                      direction="up"
                      duration={1.5}
                      className="count-up-text"
                    />
                    {s.suffix}
                  </p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              ))}
            </section>
          </AnimatedContent>
        </ScrollReveal>

        {/* WHERE OUR INTERNS GET PLACED */}
        <ScrollReveal delay={0.1}>
          <AnimatedContent distance={30} direction="vertical" animateOpacity duration={0.6} threshold={0.2}>
            <section className="text-center">
              <p className="text-[#F1F2EE] font-bold tracking-wider text-sm mb-6 uppercase">Where Our Interns Get Placed</p>
              <div style={{ height: '40px', position: 'relative' }} className="opacity-50 mt-4">
                <LogoLoop
                  logos={PARTNER_COMPANIES.map(name => ({
                    node: <span className="text-lg font-semibold text-gray-400">{name}</span>
                  }))}
                  speed={40}
                  direction="left"
                  logoHeight={20}
                  gap={64}
                  hoverSpeed={0}
                  fadeOut
                  fadeOutColor="#0A0A0B"
                  ariaLabel="Companies where our interns get placed"
                />
              </div>
            </section>
          </AnimatedContent>
        </ScrollReveal>

        {/* INTERN STORY */}
        <ScrollReveal delay={0.1}>
          <AnimatedContent distance={30} direction="vertical" animateOpacity duration={0.6} threshold={0.2}>
            <section>
              <p className="text-[#9AA1A3] font-semibold tracking-wider text-sm mb-6 uppercase">Real Results</p>
              {/* TODO: replace with a real intern photo + story */}
              <div className="bg-[#111114] border border-white/10 rounded-2xl p-8 relative overflow-hidden">
                <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                  <Lightfall
                    className="grayscale"
                    colors={['#9AA1A3', '#C6CAC9', '#F1F2EE']}
                    backgroundColor="#111114"
                    speed={0.6}
                    streakCount={4}
                    streakWidth={0.8}
                    streakLength={1.2}
                    glow={0.8}
                    density={0.5}
                    twinkle={0.6}
                    zoom={3}
                    backgroundGlow={0.6}
                    opacity={0.9}
                    mouseInteraction={true}
                    mouseStrength={0.4}
                    mouseRadius={0.8}
                  />
                </div>
                <div className="flex flex-col md:flex-row items-center gap-6" style={{ position: 'relative', zIndex: 1 }}>
                  <div className="w-20 h-20 rounded-full bg-[#6D777C] flex items-center justify-center text-xl font-bold text-[#F1F2EE] shrink-0">
                    {TESTIMONIAL.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <Quote className="w-6 h-6 text-[#6D777C] mb-3" />
                    <p className="text-lg text-gray-200 leading-relaxed mb-4">"{TESTIMONIAL.quote}"</p>
                    <p className="text-sm text-gray-400">
                      <span className="font-semibold text-gray-200">{TESTIMONIAL.name}</span><br />{TESTIMONIAL.role}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <ComingSoonLink label="Read more stories" />
              </div>
            </section>
          </AnimatedContent>
        </ScrollReveal>


        {/* CTA BANNER */}
        <ScrollReveal delay={0.1}>
          <AnimatedContent distance={30} direction="vertical" animateOpacity duration={0.6} threshold={0.2}>
            <section className="relative overflow-hidden bg-[#111114] border border-white/10 rounded-2xl p-12 text-center">
              <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                <Dither
                  waveColor={[0.776, 0.792, 0.788]}
                  disableAnimation={false}
                  enableMouseInteraction={true}
                  mouseRadius={0.3}
                  colorNum={4}
                  waveAmplitude={0.25}
                  waveFrequency={3}
                  waveSpeed={0.04}
                />
              </div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h2 className="text-3xl sm:text-4xl font-bold mb-3">Your future self is already proud of you for starting.</h2>
                <p className="text-gray-400 mb-8">Join Lumora and turn your potential into professional impact.</p>
                <ClickSpark sparkColor="#fff" sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
                  <Link
                    to="/signup"
                    className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
                  >
                    Get Started <ArrowRight className="w-4 h-4" />
                  </Link>
                </ClickSpark>
              </div>
            </section>
          </AnimatedContent>
        </ScrollReveal>
      </main>

      {/* FOOTER — kept identical to Opportunities.tsx for consistency */}
      <ScrollReveal delay={0.1}>
        <AnimatedContent distance={30} direction="vertical" animateOpacity duration={0.6} threshold={0.2}>
          <FadeContent blur={true} duration={1} easing="ease-out" initialOpacity={0}>
            <footer className="relative z-10 border-t border-white/10 bg-black py-8 mt-12">
              <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 text-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <span className="font-bold text-lg tracking-tight">Lumora</span>
                </div>
                <div className="text-xs text-gray-500">© 2026 Lumora. All rights reserved.</div>
                <div className="flex items-center gap-6 text-xs text-gray-400">
                  <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                  <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
                  <Link to="#" className="hover:text-white transition-colors">Careers</Link>
                  <div className="flex gap-4 ml-4">
                    <a href="#" className="hover:text-white transition-colors">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </a>
                    <a href="#" className="hover:text-white transition-colors">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                      </svg>
                    </a>
                    <a href="#" className="hover:text-white transition-colors"><Mail className="w-4 h-4" /></a>
                  </div>
                </div>
              </div>
            </footer>
          </FadeContent>
        </AnimatedContent>
      </ScrollReveal>
    </div>
  );
}
