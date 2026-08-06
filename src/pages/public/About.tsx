// @ts-nocheck
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Dither from '../../components/Dither';
import Radar from '../../components/Radar';
import Lightfall from '../../components/Lightfall';
import CountUp from '../../components/CountUp';
import Ferrofluid from '../../components/Ferrofluid';
import Header from '../../components/Header';
import IntroLogo from '../../components/IntroLogo';
import SplitText from '../../components/SplitText';
import BlurText from '../../components/react-bits/BlurText/BlurText';
import AnimatedContent from '../../components/AnimatedContent';
import ScrollReveal from '../../components/ScrollReveal';
import ScrollRevealGroup from '../../components/ScrollRevealGroup';
import { motion } from 'motion/react';
import LogoLoop from '../../components/react-bits/LogoLoop/LogoLoop';
import OrbitImages from '../../components/react-bits/OrbitImages/OrbitImages';
import Logo from '../../components/Logo';

import ClickSpark from '../../components/ClickSpark';
import FadeContent from '../../components/FadeContent';
import ElectricBorder from '../../components/react-bits/ElectricBorder/ElectricBorder';
import MinimalFooter from '../../components/MinimalFooter';
import ComingSoonLink from '../../components/ComingSoonLink';
import {
  Code, Laptop, Users, Rocket, Box, Target, Quote,
  Check, X, ArrowRight, ChevronRight,
  FileCheck, Sparkles, ShieldCheck, Mail
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
  { to: 95, suffix: '%', label: 'Placement Rate' },
];

// TODO: replace with real placement companies before launch
const PARTNER_COMPANIES = ['Meta', 'GrowthX', 'Notion', 'Swiggy', 'Razorpay'];

// TODO: replace with a real intern story before launch
const TESTIMONIAL = {
  quote: "I applied with zero backend experience. Six weeks later, I shipped a feature a real client's team uses today.",
  name: 'Priya S.',
  role: 'Now a Backend Intern, GrowthX',
};




export default function About() {
  const [supportsOffsetPath, setSupportsOffsetPath] = useState(true);
  const location = useLocation();

  // Supports deep links like /about#stats (e.g. the applicant dashboard's
  // "Our promise" stat card) -- delayed so it fires after this page's
  // entrance animations have laid content out, not mid-mount.
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const timeout = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 400);
    return () => clearTimeout(timeout);
  }, [location.hash]);

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
          className="w-full h-full"
          dpr={window.devicePixelRatio || 1}
          colors={['#7d7b7b', '#ffffff', '#ffffff']}
          speed={0.7}
          scale={1}
          turbulence={1}
          fluidity={0.13}
          rimWidth={0.2}
          sharpness={3}
          shimmer={1.8}
          glow={2}
          flowDirection="down"
          opacity={0.15}
          mouseInteraction={true}
          mouseStrength={1}
          mouseRadius={0.3}
          mouseDampening={0.15}
          mixBlendMode="screen"
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
                ease="easeOutCubic"
                threshold={0.2}
                rootMargin="-50px"
              />
            </h1>
            <div className="text-gray-400 text-lg mb-8 leading-relaxed">
              <BlurText text="Every expert was once a beginner. We just make the path shorter." delay={50} className="justify-center" />
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
                <BlurText
                  text="✦ OUR MISSION ✦"
                  delay={150}
                  animateBy="words"
                  direction="top"
                  className="text-2xl mb-8"
                />
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
                <div className="flex md:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#0A0A0B] border border-white/20 items-center justify-center z-10">
                  <ArrowRight className="w-4 h-4 text-gray-300 rotate-90" />
                </div>
                <ElectricBorder
                  color="#C6CAC9"
                  speed={1}
                  chaos={0.08}
                  borderRadius={16}
                >
                  <div className="bg-[#111114] rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-[#F1F2EE] mb-4">After Lumora</h3>
                    <ul className="space-y-3">
                      {['Has shipped real, mentor-reviewed work', 'Collaborates and communicates like a pro', "Walks into interviews with proof, not just promises"].map((t) => (
                        <li key={t} className="flex items-start gap-2 text-sm text-gray-300">
                          <Check className="w-4 h-4 mt-0.5 shrink-0 text-[#C6CAC9]" /> {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </ElectricBorder>
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
                    <motion.div
                      key={step.num}
                      layout
                      whileHover={{ scale: 1.03 }}
                      transition={{
                        layout: { duration: 0.3, ease: 'easeOut' },
                        scale: { duration: 0.3, ease: 'easeOut' }
                      }}
                      className="relative bg-[#111114] border border-white/10 rounded-2xl p-6 flex flex-col overflow-hidden h-full"
                    >
                      <div layout style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
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
                          falloff={1.6}
                          brightness={1.2}
                          enableMouseInteraction={true}
                          mouseInfluence={0.08}
                        />
                      </div>
                      <div layout style={{ position: 'relative', zIndex: 1 }} className="flex flex-col h-full">
                        <div className="flex justify-between items-center mb-4">
                          <div className="w-9 h-9 rounded-full bg-[#6D777C] flex items-center justify-center text-sm font-bold text-[#F1F2EE] shrink-0">
                            {step.num}
                          </div>
                          <step.icon className="w-5 h-5 text-gray-500" />
                        </div>
                        <h3 className="font-semibold mb-2">{step.title}</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
                      </div>
                    </motion.div>
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
            <section className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-4 overflow-hidden">
              {supportsOffsetPath ? (
                <>
                  <div className="hidden md:block w-full">
                    <OrbitImages
                      items={WHAT_YOULL_GAIN.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 bg-[#111114] border border-white/10 rounded-full px-4 py-2 text-sm text-[#C6CAC9] shadow-lg max-w-[190px] whitespace-normal">
                          <Check className="w-4 h-4 text-[#C6CAC9] shrink-0" /> {item}
                        </div>
                      ))}
                      shape="circle"
                      radius={300}
                      rotation={0}
                      duration={30}
                      responsive={true}
                      centerContent={
                        <div className="text-center">
                          <p className="text-[#9AA1A3] font-semibold tracking-wider text-xs uppercase mb-2">What You'll Gain</p>
                          <h3 className="text-2xl font-bold text-[#F1F2EE]">Everything you walk away with</h3>
                        </div>
                      }
                    />
                  </div>
                  <div className="md:hidden">
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
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-10">
                    <p className="text-[#9AA1A3] font-semibold tracking-wider text-xs uppercase mb-2">What You'll Gain</p>
                    <h3 className="text-2xl font-bold">Everything you walk away with</h3>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    {WHAT_YOULL_GAIN.map((item, i) => (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.4 }}
                        key={i}
                        className="flex items-center gap-2 bg-[#111114] border border-white/10 rounded-full px-4 py-2 text-sm text-gray-300 shadow-lg"
                      >
                        <Check className="w-4 h-4 text-[#C6CAC9] shrink-0" /> {item}
                      </motion.div>
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
            <section id="stats" className="bg-[#111114] border border-white/10 rounded-2xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-x divide-white/10 scroll-mt-24">
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
                <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'rgba(10,10,11,0.75)', borderRadius: 'inherit', pointerEvents: 'none' }} />
                <div className="flex flex-col md:flex-row items-center gap-6" style={{ position: 'relative', zIndex: 2 }}>
                  <div className="w-20 h-20 rounded-full bg-[#6D777C] overflow-hidden shrink-0 shadow-lg border border-white/10">
                    <img src="/priya_portrait.jpg" alt={TESTIMONIAL.name} className="w-full h-full object-cover" />
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
                <p className="text-gray-200 mb-8">Join Lumora and turn your potential into professional impact.</p>
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

      {/* FOOTER */}
      <ScrollReveal delay={0.1}>
        <MinimalFooter />
      </ScrollReveal>
    </div>
  );
}
