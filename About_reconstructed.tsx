// @ts-nocheck
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Ferrofluid from '../../components/Ferrofluid';
import Header from '../../components/Header';
import IntroLogo from '../../components/IntroLogo';
import SplitText from '../../components/SplitText';
import BlurText from '../../components/react-bits/BlurText/BlurText';
import AnimatedContent from '../../components/AnimatedContent';
import ScrollReveal from '../../components/ScrollReveal';
import ScrollRevealGroup from '../../components/ScrollRevealGroup';
import PixelTransition from '../../components/react-bits/PixelTransition/PixelTransition';
import ClickSpark from '../../components/ClickSpark';
import FadeContent from '../../components/FadeContent';
import {
  Code, Laptop, Users, Rocket, Box, Target, Quote,
  Check, X, ArrowRight, ChevronDown, ChevronUp, ChevronRight,
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
  { value: '500+', label: 'Interns Trained' },
  { value: '12+', label: 'Domain Tracks' },
  { value: '150+', label: 'Mentor Experts' },
  { value: '200+', label: 'Mentor-Reviewed Capstones' },
];

// TODO: replace with real placement companies before launch
const PARTNER_COMPANIES = ['Meta', 'GrowthX', 'Notion', 'Swiggy', 'Razorpay'];

// TODO: replace with real mentors before launch (mirrors Opportunities.tsx mentor data)
const MENTORS = [
  { init: 'AD', name: 'Arjun Dev', role: 'Full Stack Architect · 10+ yrs' },
  { init: 'MI', name: 'Meera Iyer', role: 'AI/ML Engineer · 8+ yrs' },
  { init: 'RS', name: 'Rohit Sharma', role: 'DevOps Lead · 9+ yrs' },
  { init: 'SG', name: 'Sneha Gupta', role: 'Product Designer · 7+ yrs' },
];

// TODO: replace with a real intern story before launch
const TESTIMONIAL = {
  quote: "I applied with zero backend experience. Six weeks later, I shipped a feature a real client's team uses today.",
  name: 'Priya S.',
  role: 'Now a Backend Intern, GrowthX',
};

const FAQS = [
  { q: 'Do I need prior experience?', a: 'Not necessarily. We look for strong fundamentals and a willingness to learn.' },
  { q: 'Is the program free?', a: 'TODO: confirm pricing before launch.' },
  { q: 'What happens after the capstone?', a: 'Mentors review your capstone and, once you meet the readiness bar, you can be assigned to a real client project.' },
];

// TODO: confirm founder attribution before launch
const FOUNDER_NOTE = '— Built by people who once stood exactly where you are. Yuvaraj Dudukuru, Founder';

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
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
                <p className="text-[#9AA1A3] font-semibold tracking-wider text-sm mb-4 uppercase">Our Mission</p>
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
                <div className="bg-[#111114] border border-[#C6CAC9]/20 rounded-2xl p-6">
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
                    <div key={step.num} className="relative bg-[#111114] border border-white/10 rounded-2xl p-6 flex flex-col">
                      <div className="flex justify-between items-center mb-4">
                        <div className="w-9 h-9 rounded-full bg-[#6D777C] flex items-center justify-center text-sm font-bold text-[#F1F2EE] shrink-0">
                          {step.num}
                        </div>
                        <step.icon className="w-5 h-5 text-gray-500" />
                      </div>
                      <h3 className="font-semibold mb-2">{step.title}</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
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
            <section>
              <p className="text-[#9AA1A3] font-semibold tracking-wider text-sm mb-6 uppercase">What You'll Gain</p>
              <div className="bg-[#111114] border border-white/10 rounded-2xl p-6 grid md:grid-cols-2 gap-x-8 gap-y-4">
                {WHAT_YOULL_GAIN.map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-gray-300 border-b border-white/5 pb-3 last:border-0 last:pb-0">
                    <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[#C6CAC9]" />
                    </span>
                    {item}
                  </div>
                ))}
              </div>
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
                  <p className="text-3xl font-bold mb-1">{s.value}</p>
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
              <p className="text-[#9AA1A3] font-semibold tracking-wider text-sm mb-6 uppercase">Where Our Interns Get Placed</p>
              {/* TODO: replace with real logo assets */}
              <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4 opacity-50">
                {PARTNER_COMPANIES.map((name) => (
                  <span key={name} className="text-lg font-semibold text-gray-400">{name}</span>
                ))}
              </div>
            </section>
          </AnimatedContent>
        </ScrollReveal>

        {/* MEET THE MENTORS */}
        <ScrollReveal delay={0.1}>
          <AnimatedContent distance={30} direction="vertical" animateOpacity duration={0.6} threshold={0.2}>
            <section>
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-[#9AA1A3] font-semibold tracking-wider text-sm mb-1 uppercase">Meet the Mentors</p>
                  <p className="text-sm text-gray-500">People who've done the work, guiding you through yours.</p>
                </div>
              </div>
              <ScrollRevealGroup className="grid grid-cols-2 md:grid-cols-4 gap-4" staggerDelay={0.08}>
                {MENTORS.map((m, i) => (
                  <PixelTransition
                    key={i}
                    gridSize={5}
                    pixelColor="#6D777C"
                    animationStepDuration={0.3}
                    once={false}
                    aspectRatio="0"
                    firstContent={
                      <div className="bg-[#111114] p-5 rounded-2xl flex flex-col items-center justify-center text-center w-full h-full">
                        <div className="w-12 h-12 rounded-full bg-[#6D777C] text-[#F1F2EE] flex items-center justify-center font-bold mb-4 shrink-0">
                          {m.init}
                        </div>
                        <h4 className="font-semibold text-sm">{m.name}</h4>
                        <p className="text-[11px] text-gray-400 mt-1">{m.role}</p>
                      </div>
                    }
                    secondContent={
                      <div className="bg-[#111114] p-5 rounded-2xl flex flex-col items-center justify-center text-center w-full h-full">
                        <h4 className="font-semibold text-sm mb-2">{m.role}</h4>
                        <button
                          onClick={() => alert('Booking — coming soon.')}
                          className="px-4 py-2 mt-2 rounded-full text-xs font-semibold bg-[#6D777C] text-[#F1F2EE] hover:opacity-90 transition-opacity"
                        >
                          Book a 1:1 session
                        </button>
                      </div>
                    }
                  />
                ))}
              </ScrollRevealGroup>
              <div className="flex justify-end mt-4">
                <ComingSoonLink label="View full team" />
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
              <div className="bg-[#111114] border border-white/10 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6">
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
              <div className="flex justify-end mt-4">
                <ComingSoonLink label="Read more stories" />
              </div>
            </section>
          </AnimatedContent>
        </ScrollReveal>

        {/* FAQ TEASER */}
        <ScrollReveal delay={0.1}>
          <AnimatedContent distance={30} direction="vertical" animateOpacity duration={0.6} threshold={0.2}>
            <section>
              <p className="text-[#9AA1A3] font-semibold tracking-wider text-sm mb-6 uppercase">Questions?</p>
              <div className="space-y-4">
                {FAQS.map((faq, i) => (
                  <div key={i} className="border-b border-white/10 pb-4">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex justify-between items-center text-left text-sm font-medium hover:text-[#F1F2EE] transition-colors"
                    >
                      {faq.q}
                      {openFaq === i ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                    </button>
                    <div className={`grid transition-all duration-300 ease-in-out ${openFaq === i ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="overflow-hidden">
                        <p className="text-xs text-gray-400 leading-relaxed">{faq.a}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <ComingSoonLink label="See all FAQs" />
              </div>
            </section>
          </AnimatedContent>
        </ScrollReveal>

        {/* FOUNDER NOTE */}
        <ScrollReveal delay={0.1}>
          <p className="text-center text-xs italic text-gray-500">{FOUNDER_NOTE}</p>
        </ScrollReveal>

        {/* CTA BANNER */}
        <ScrollReveal delay={0.1}>
          <AnimatedContent distance={30} direction="vertical" animateOpacity duration={0.6} threshold={0.2}>
            <section className="relative overflow-hidden bg-[#111114] border border-white/10 rounded-2xl p-12 text-center">
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
</USER_REQUEST>
<ADDITIONAL_METADATA>
The current local time is: 2026-08-02T20:05:58+05:30.
</ADDITIONAL_METADATA>