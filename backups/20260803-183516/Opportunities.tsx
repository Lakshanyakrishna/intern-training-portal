// @ts-nocheck
import { useState, useRef, useEffect } from 'react';
import ScrollTrigger from 'gsap/ScrollTrigger';
import FaqScrollReveal from '../../components/react-bits/ScrollReveal/ScrollReveal';
import ScrollRevealGroup from '../../components/ScrollRevealGroup';
import { Link } from 'react-router-dom';
import Ferrofluid from '../../components/Ferrofluid';
import Header from '../../components/Header';
import IntroLogo from '../../components/IntroLogo';
import SplitText from '../../components/SplitText';

import Magnet from '../../components/Magnet';
import SpotlightCard from '../../components/SpotlightCard';
import ClickSpark from '../../components/ClickSpark';
import { ParticleCard, GlobalSpotlight } from '../../components/react-bits/ParticleCard/ParticleCard';
import StarBorder from '../../components/StarBorder';

import TiltedCard from '../../components/TiltedCard';
import ElectricBorder from '../../components/react-bits/ElectricBorder/ElectricBorder';
import BorderGlow from '../../components/react-bits/BorderGlow/BorderGlow';
import GradientText from '../../components/react-bits/GradientText/GradientText';
import GlitchText from '../../components/react-bits/GlitchText/GlitchText';
import HoverSplashCard from '../../components/react-bits/HoverSplashCard/HoverSplashCard';
import CursorGrid from '../../components/react-bits/CursorGrid/CursorGrid';
import PixelTransition from '../../components/react-bits/PixelTransition/PixelTransition';
import ShapeGrid from '../../components/react-bits/ShapeGrid/ShapeGrid';
import Orb from '../../components/react-bits/Orb/Orb';
import CurvedInput from '../../components/react-bits/CurvedInput/CurvedInput';
import Ribbons from '../../components/react-bits/Ribbons/Ribbons';
import TextType from '../../components/TextType';
import BlurText from '../../components/react-bits/BlurText/BlurText';
import Dock from '../../components/Dock';
import VariableProximity from '../../components/react-bits/VariableProximity/VariableProximity';
import TrueFocus from '../../components/react-bits/TrueFocus/TrueFocus';
import ScrollReveal from '../../components/ScrollReveal';

import ScrollVelocity from '../../components/react-bits/ScrollVelocity/ScrollVelocity';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import Galaxy from '../../components/react-bits/Galaxy/Galaxy';
import Shuffle from '../../components/react-bits/Shuffle/ShuffleText';
import CountUp from '../../components/CountUp';
import AnimatedContent from '../../components/AnimatedContent';
import GlareHover from '../../components/GlareHover';
import AnimatedList from '../../components/AnimatedList';

import MultiSelectGooeyNav from '../../components/react-bits/GooeyNav/MultiSelectGooeyNav';
import FadeContent from '../../components/FadeContent';
import {
  ChevronDown, Bookmark, GitCompare, Share, MapPin, DollarSign,
  Clock, Zap, ChevronUp, ChevronRight, Terminal,
  Layout, Database, Smartphone, PenTool, Brain, Search, Briefcase,
  Code, Heart, MessageSquare, ShieldCheck, Users,
  Mail, Star, ArrowRight, X, User
} from 'lucide-react';

import DecryptedText from '../../components/DecryptedText';

const BROWSE_BY_FORTE = [
  {
    title: 'Frontend Development',
    color: '#6D777C',
    desc: 'Build fast, responsive, and beautiful web experiences.',
    chips: ['React', 'JavaScript', 'Git'],
    remote: 'Remote',
    duration: '3 Months',
    paid: 'Paid',
    level: 'Beginner',
    applicants: 58,
    icon: Code
  },
  {
    title: 'Backend Development',
    color: '#858D91',
    desc: 'Design scalable APIs, systems, and server-side logic.',
    chips: ['Node.js', 'Express', 'PostgreSQL'],
    remote: 'Remote',
    duration: '3 Months',
    paid: 'Paid',
    level: 'Intermediate',
    applicants: 42,
    icon: Database
  },
  {
    title: 'UI/UX Design',
    color: '#9AA1A3',
    desc: 'Create intuitive, delightful, human-centered designs.',
    chips: ['Figma', 'UI Design', 'Prototyping'],
    remote: 'Remote',
    duration: '2 Months',
    paid: 'Paid',
    level: 'Beginner',
    applicants: 31,
    icon: PenTool
  },
  {
    title: 'Agentic AI',
    color: '#C6CAC9',
    desc: 'Build intelligent agents that act and adapt.',
    chips: ['Python', 'LangChain', 'LLMs'],
    remote: 'Remote',
    duration: '3 Months',
    paid: 'Paid',
    level: 'Advanced',
    applicants: 26,
    icon: Brain
  },
  {
    title: 'Mobile Development',
    color: '#F1F2EE',
    desc: 'Craft smooth, reliable mobile apps users love.',
    chips: ['Flutter', 'Dart', 'Firebase'],
    remote: 'Hybrid',
    duration: '3 Months',
    paid: 'Paid',
    level: 'Intermediate',
    applicants: 29,
    icon: Smartphone
  },
  {
    title: 'Data & Analytics',
    color: '#6D777C',
    desc: 'Turn data into insights and drive decisions.',
    chips: ['Python', 'SQL', 'Power BI'],
    remote: 'Remote',
    duration: '3 Months',
    paid: 'Paid',
    level: 'Intermediate',
    applicants: 34,
    icon: Layout
  }
];

const FAQS = [
  { q: 'Is this internship paid?', a: 'Yes, all our internships are paid positions.' },
  { q: 'Is it remote or in-office?', a: 'Most roles are fully remote, though some may be hybrid depending on the track.' },
  { q: 'Can I apply to multiple domains?', a: 'We recommend focusing on your strongest domain, but you can apply to up to two.' },
  { q: 'Will I receive a certificate?', a: 'Yes, upon successful completion of the cohort you will receive a verified certificate.' },
  { q: 'Do I need previous experience?', a: 'Not necessarily. We look for strong fundamentals and a willingness to learn.' },
  { q: 'Can final year students apply?', a: 'Absolutely, final year students are welcome to apply.' }
];

const hexToRgbString = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
};

const getDifficultyColor = (level: string) => {
  switch (level) {
    case 'Beginner': return { bg: '#C6CAC9', text: '#111114' };
    case 'Intermediate': return { bg: '#9AA1A3', text: '#111114' };
    case 'Advanced': return { bg: '#6D777C', text: '#F1F2EE' };
    default: return { bg: '#9AA1A3', text: '#111114' };
  }
};

const ComingSoonWrapper = ({ children }: { children: React.ReactNode }) => {
  const [show, setShow] = useState(false);
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShow(true);
    setTimeout(() => setShow(false), 2000);
  };
  return (
    <div className="relative inline-flex w-full justify-center" onClickCapture={handleClick}>
      {children}
      {show && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#111114] border border-white/20 text-[#F1F2EE] text-xs px-3 py-1.5 rounded-md shadow-xl whitespace-nowrap z-[9999] pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-200">
          Coming soon
        </div>
      )}
    </div>
  );
};

export default function Opportunities() {
  const particleGridRef = useRef<HTMLDivElement>(null);
  const stepsContainerRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeFilters, setActiveFilters] = useState<number[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  useAutoScroll(scrollRef, { speed: 0.5, resumeDelay: 1500 });

  const handleNotifySignup = (email: string) => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    console.log('User signed up for notifications with:', email);
    alert(`Thanks! We'll notify ${email} when we post new opportunities.`);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 350);
    return () => clearTimeout(timeoutId);
  }, [openFaq]);

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -340, behavior: 'smooth' });
  };
  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 340, behavior: 'smooth' });
  };

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
        
        {/* HERO SECTION */}
        <AnimatedContent distance={30} direction="vertical" animateOpacity duration={0.6} threshold={0.2}>
        <section className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
          <div className="max-w-2xl">
            <AnimatedContent distance={20} direction="vertical" delay={0.2} reverse={false} >
              <p className="text-[#9AA1A3] font-semibold tracking-wider text-sm mb-4 uppercase">Careers at Lumora</p>
            </AnimatedContent>
            <h1 className="text-6xl sm:text-8xl font-bold leading-[0.9] tracking-tight mb-6">
              <SplitText text="OPEN ROLES" delay={100} from={{ opacity: 0, transform: 'translate3d(0,50px,0)' }} to={{ opacity: 1, transform: 'translate3d(0,0,0)' }} easing="easeOutCubic" threshold={0.2} rootMargin="-50px" />
            </h1>
            <div className="text-[#9AA1A3] text-lg mb-8 leading-relaxed max-w-xl">
              <BlurText text="Great journeys begin before the first step is even visible. This page goes live the moment an admin posts the first one — screened, structured, ready to apply to." delay={50} />
            </div>
            {/*
            <div className="flex flex-wrap items-center gap-6 text-sm text-[#C6CAC9]">
              <AnimatedContent distance={20} direction="vertical" reverse={false}  delay={0.5}>
                <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Open to students & recent grads</span>
              </AnimatedContent>
              <AnimatedContent distance={20} direction="vertical" reverse={false}  delay={0.7}>
                <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Remote-friendly</span>
              </AnimatedContent>
              <AnimatedContent distance={20} direction="vertical" reverse={false}  delay={0.9}>
                <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Transparent process</span>
              </AnimatedContent>
            </div>
            */}
            
            <div className="mt-2 mb-8">
              <Dock 
                items={[
                  { 
                    icon: <Users size={18} />, 
                    label: 'Open to students & recent grads', 
                    onClick: () => {} 
                  },
                  { 
                    icon: <MapPin size={18} />, 
                    label: 'Remote-friendly', 
                    onClick: () => {} 
                  },
                  { 
                    icon: <ShieldCheck size={18} />, 
                    label: 'Transparent process', 
                    onClick: () => {} 
                  }
                ]}
                panelHeight={56}
                baseItemSize={40}
                magnification={56}
                distance={150}
              />
            </div>
          </div>
          <div className="flex flex-col items-start lg:items-end gap-3">
            <p className="text-sm text-[#9AA1A3]">Be the first to know when a role opens</p>
            <Magnet padding={15} disabled={false} magnetStrength={3}>
              <Link to="/signup" className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform">
                Get notified <ChevronRight className="w-4 h-4" />
              </Link>
            </Magnet>
          </div>
        </section>
        </AnimatedContent>

        {/* STATS BAR */}
        <ScrollReveal delay={0.1}>
        <AnimatedContent distance={30} direction="vertical" animateOpacity duration={0.6} threshold={0.2}>
        <section style={{ position: 'relative' }}>
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            zIndex: 0,
            pointerEvents: 'none'
          }}>
            <Ribbons
              colors={['#C6CAC9']}
              baseThickness={20}
              speedMultiplier={0.5}
              maxAge={400}
              pointCount={40}
              enableFade={true}
              enableShaderEffect={false}
              backgroundColor={[0, 0, 0, 0]}
            />
          </div>
          <div style={{ position: 'relative', zIndex: 1 }} className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { icon: Briefcase, to: 6, suffix: '', title: '6', sub: 'Domains open for hiring' },
            { icon: Clock, title: 'Cohort 01', sub: 'Launching soon' },
            { icon: MapPin, to: 100, suffix: '%', title: '100%', sub: 'Remote-friendly' },
            { icon: Users, to: 10, suffix: '+', title: '10+', sub: 'Mentors & Experts' },
            { icon: Heart, title: 'Transparent', sub: 'No ghosting. Ever.' }
          ].map((stat, i) => (
            <AnimatedContent
              key={i}
              delay={i * 0.1}
              distance={30}
              direction="vertical"
              animateOpacity
              className="w-full h-full"
            >
              <BorderGlow
                className="w-full h-full"
                backgroundColor="#111114"
                borderRadius={16}
                glowColor="0 0% 78%"
                glowRadius={20}
                glowIntensity={1.0}
                edgeSensitivity={30}
                coneSpread={25}
                animated={false}
                colors={['#6D777C', '#9AA1A3', '#C6CAC9']}
              >
                <HoverSplashCard className="w-full h-full">
                  <div className="w-full h-full" style={{ position: 'relative', overflow: 'hidden', borderRadius: 'inherit' }}>
                    <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.4 }}>
                      <ShapeGrid
                        direction="diagonal"
                        speed={0.3}
                        squareSize={16}
                        shape="square"
                        borderColor="rgba(255,255,255,0.06)"
                        hoverFillColor="rgba(255,255,255,0.03)"
                        hoverTrailAmount={0}
                      />
                    </div>
                    <div className="flex flex-col gap-2 p-5 h-full relative z-10 pointer-events-none">
                      <stat.icon className="w-5 h-5 text-[#9AA1A3]" />
                      <div>
                        <h3 className="text-lg font-semibold flex items-center pointer-events-auto">
                      <GlitchText
                        text={stat.to !== undefined ? `${stat.to}${stat.suffix}` : stat.title}
                        speed={0.6}
                        enableShadows={true}
                        enableOnHover={true}
                        className="inline-flex"
                      >
                        <GradientText
                          colors={['#9AA1A3', '#F1F2EE']}
                          animationSpeed={4}
                          showBorder={false}
                          direction="horizontal"
                          pauseOnHover={false}
                          yoyo={true}
                        >
                          {stat.to !== undefined ? (
                            <>
                              <CountUp
                                from={0}
                                to={stat.to}
                                duration={1.5}
                                direction="up"
                                separator=","
                              />
                              {stat.suffix}
                            </>
                          ) : (
                            stat.title
                          )}
                        </GradientText>
                      </GlitchText>
                    </h3>
                    <p className="text-xs text-[#858D91]">{stat.sub}</p>
                    </div>
                  </div>
                  </div>
                </HoverSplashCard>
              </BorderGlow>
            </AnimatedContent>
          ))}
          </div>
        </section>
        </AnimatedContent>
        </ScrollReveal>

        {/* SEARCH & FILTERS */}
        <ScrollReveal delay={0.1}>
        <AnimatedContent distance={30} direction="vertical" animateOpacity duration={0.6} threshold={0.2}>
        <section className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
            <div className="flex-1 flex flex-wrap items-center gap-3 w-full">
              <div className="w-full md:w-64">
                <GlareHover width="100%" height="auto" background="transparent" borderColor="#C6CAC9" className="w-full rounded-full overflow-hidden">
                  <div className="relative w-full h-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#858D91] pointer-events-none" />
                    <input type="text" placeholder="Search opportunities..." className="w-full h-full bg-[#111114] border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-white/30 relative z-10" />
                  </div>
                </GlareHover>
              </div>
              <div className="flex flex-wrap gap-2 flex-1 w-full">
                {['All', 'Frontend', 'Backend', 'UI/UX', 'Agentic AI', 'Mobile', 'Data & Analytics'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      activeCategory === cat
                        ? 'bg-[#9AA1A3]/20 text-[#F1F2EE] border border-[#9AA1A3]/30'
                        : 'bg-white/5 text-[#9AA1A3] border border-white/10 hover:bg-white/10 hover:text-[#F1F2EE]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div className="flex items-center gap-2 text-sm text-[#9AA1A3] cursor-pointer">
                Sort by: <span className="text-white flex items-center">Newest <ChevronDown className="w-4 h-4 ml-1" /></span>
              </div>
              <div className="flex items-center gap-3 border-l border-white/10 pl-4">
                <ClickSpark sparkColor="#fff" sparkSize={4} sparkRadius={12} sparkCount={6} duration={300}>
                  <Bookmark className="w-4 h-4 text-[#9AA1A3] hover:text-white cursor-pointer" />
                </ClickSpark>
                <ClickSpark sparkColor="#fff" sparkSize={4} sparkRadius={12} sparkCount={6} duration={300}>
                  <GitCompare className="w-4 h-4 text-[#9AA1A3] hover:text-white cursor-pointer" />
                </ClickSpark>
                <ClickSpark sparkColor="#fff" sparkSize={4} sparkRadius={12} sparkCount={6} duration={300}>
                  <Share className="w-4 h-4 text-[#9AA1A3] hover:text-white cursor-pointer" />
                </ClickSpark>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5 items-center">
            <style>{`
              .opp-gooey-nav-overrides .gooey-nav-container {
                --color-1: #C6CAC9;
                --color-2: #9AA1A3;
                --color-3: #F1F2EE;
                --color-4: #6D777C;
              }
              .opp-gooey-nav-overrides .gooey-nav-container nav ul li.active {
                color: #F1F2EE;
              }
              .opp-gooey-nav-overrides .gooey-nav-container nav ul li.active::after {
                background: rgba(241, 242, 238, 0.15);
                border-color: rgba(241, 242, 238, 0.4);
              }
              .opp-gooey-nav-overrides .gooey-nav-container .effect.text.active {
                color: #F1F2EE;
              }
              .opp-gooey-nav-overrides .gooey-nav-container .effect.filter::after {
                background: rgba(241, 242, 238, 0.4);
              }
            `}</style>
            <div className="flex-1 overflow-hidden opp-gooey-nav-overrides">
              <MultiSelectGooeyNav
                items={[
                  { label: 'Remote', icon: <MapPin className="w-3 h-3" /> },
                  { label: 'Hybrid', icon: <MapPin className="w-3 h-3" /> },
                  { label: 'Paid', icon: <DollarSign className="w-3 h-3" /> },
                  { label: 'Unpaid', icon: <DollarSign className="w-3 h-3" /> },
                  { label: 'Internship', icon: <Briefcase className="w-3 h-3" /> },
                  { label: 'Full-Time', icon: <Briefcase className="w-3 h-3" /> }
                ]}
                activeIndices={activeFilters}
                onChange={(indices) => setActiveFilters(indices)}
                animationTime={450}
                particleCount={10}
                particleDistances={[50, 8]}
                particleR={60}
                timeVariance={200}
                colors={[1, 2, 3, 1, 2, 3, 1]}
              />
            </div>
            <button className="px-4 py-1.5 rounded-full text-xs bg-transparent border border-white/10 text-[#9AA1A3] flex items-center hover:border-white/30 shrink-0">
              More <ChevronDown className="w-3 h-3 ml-1" />
            </button>
          </div>
        </section>
        </AnimatedContent>
        </ScrollReveal>

        {/* FEATURED OPPORTUNITY */}
        <ScrollReveal delay={0.1}>
        <AnimatedContent distance={30} direction="vertical" animateOpacity duration={0.6} threshold={0.2}>
        <section className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-64 shrink-0">
            <style>{`
              .opportunities-heading {
                font-size: 1.25rem !important; /* text-xl */
                font-weight: 600 !important;
                text-transform: none !important;
                font-family: inherit !important;
                line-height: 1.75rem !important;
                color: #ffffff !important;
                margin-bottom: 0.5rem !important;
                display: block !important;
              }
              
              /* Ensure the TrueFocus component inherits the heading's typography */
              .truefocus-heading-wrapper {
                 margin-bottom: 0.5rem;
              }
              .truefocus-heading-wrapper .focus-container {
                 justify-content: flex-start; /* Align left to match static text */
                 gap: 0.25em; /* Tighter gap for this heading style */
              }
            `}</style>
            
            {/* 
            <Shuffle
              text="0 Opportunities Available"
              tag="h2"
              shuffleDirection="right"
              duration={0.35}
              animationMode="evenodd"
              shuffleTimes={1}
              ease="power3.out"
              stagger={0.03}
              triggerOnce={true}
              triggerOnHover={false}
              respectReducedMotion={true}
              textAlign="left"
              className="opportunities-heading"
            />
            */}
            
            <div className="opportunities-heading truefocus-heading-wrapper">
              <TrueFocus 
                sentence="0 Opportunities Available"
                manualMode={false}
                blurAmount={4}
                borderColor="#9AA1A3"
                glowColor="rgba(154, 161, 163, 0.4)"
                animationDuration={0.6}
                pauseBetweenAnimations={1.2}
              />
            </div>
            
            <p className="text-[#9AA1A3] text-sm">We'll notify you when new opportunities are posted.</p>
          </div>
          <ElectricBorder
            color="#C6CAC9"
            speed={1}
            chaos={0.08}
            borderRadius={16}
            className="flex-1"
          >
            <SpotlightCard className="w-full h-full rounded-2xl bg-[#111114] p-6 lg:p-8 relative overflow-hidden flex flex-col lg:flex-row justify-between items-start gap-6 group" spotlightColor="rgba(198, 202, 201, 0.2)">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#6D777C]/20 to-transparent pointer-events-none" />
            <div className="relative z-10 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#858D91]/20 text-[#C6CAC9] text-xs font-semibold border border-[#858D91]/30">
                <Star className="w-3 h-3 fill-current" /> Featured Opportunity
              </span>
              <h3 className="text-2xl font-bold">Frontend Developer Intern</h3>
              <div className="flex flex-wrap gap-3 text-xs text-[#9AA1A3]">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Remote</span>
                <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> Paid</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 3 Months</span>
                <span className="flex items-center gap-1 text-[#C6CAC9]"><Zap className="w-3 h-3" /> Hiring Immediately</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {['React', 'Next.js', 'TypeScript', 'Tailwind CSS'].map(tech => (
                  <span key={tech} className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-xs text-[#C6CAC9]">{tech}</span>
                ))}
              </div>
            </div>
            <div className="relative z-10 flex flex-col items-end gap-3 shrink-0">
              <p className="text-xs text-[#9AA1A3]">Apply before</p>
              <p className="text-sm flex items-center gap-2"><Clock className="w-4 h-4 text-[#858D91]" /> Aug 20, 2026</p>
              <p className="text-sm flex items-center gap-2"><Users className="w-4 h-4 text-[#858D91]" /> 58 Applicants</p>
              <ClickSpark sparkColor="#fff" sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
                <ComingSoonWrapper>
                  <button className="mt-2 w-full bg-[#F1F2EE] hover:bg-[#C6CAC9] text-[#6D777C] px-6 py-2.5 rounded-lg text-sm font-semibold flex justify-center items-center gap-2 transition-colors">
                    Apply Now <ChevronRight className="w-4 h-4" />
                  </button>
                </ComingSoonWrapper>
              </ClickSpark>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
              <Code className="w-32 h-32 text-[#9AA1A3]" />
            </div>
          </SpotlightCard>
          </ElectricBorder>
        </section>
        </AnimatedContent>
        </ScrollReveal>

        {/* RECOMMENDED */}
        <ScrollReveal delay={0.1}>
        <AnimatedContent distance={30} direction="vertical" animateOpacity duration={0.6} threshold={0.2}>
        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2"><Zap className="w-5 h-5 text-[#F1F2EE]" /> Recommended For You</h2>
              <p className="text-sm text-[#858D91] mt-1">Based on your interests and profile.</p>
            </div>
            <button className="text-sm text-[#F1F2EE] hover:text-[#C6CAC9] flex items-center gap-1 transition-colors">
              View all recommendations <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { t: 'Frontend Developer', sub: 'React • Remote • Paid', match: 'React' },
              { t: 'Backend Developer', sub: 'Node.js • API • Remote', match: 'backend' },
              { t: 'Agentic AI Intern', sub: 'Python • LLMs • Remote', match: 'AI' }
            ].map((r, i) => (
              <AnimatedContent
                key={i}
                delay={i * 0.15}
                distance={40}
                direction="vertical"
                animateOpacity
                className="w-full h-full"
              >
                <div className="relative h-full rounded-xl bg-[#111114] border border-white/10 group hover:border-white/20 transition-colors overflow-hidden">
                  <CursorGrid
                    className="absolute inset-0 z-0 pointer-events-none"
                    cellSize={40}
                    color="#9AA1A3"
                    radius={100}
                    falloff="smooth"
                    holdTime={300}
                    fadeDuration={600}
                    lineWidth={1}
                    maxOpacity={0.6}
                    fillOpacity={0}
                    gridOpacity={0}
                    cellRadius={2}
                    clickPulse={true}
                    pulseSpeed={500}
                  />
                  <div className="relative z-10 flex flex-col justify-between h-full p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div className="relative w-10 h-10 flex items-center justify-center rounded-lg bg-[#111114] overflow-hidden">
                        <div style={{ position: 'absolute', width: '40px', height: '40px', inset: 0, zIndex: 0, filter: 'grayscale(100%) brightness(1.5)' }}>
                          <Orb
                            hue={r.t === 'Frontend Developer' ? 260 : r.t === 'Backend Developer' ? 200 : 320}
                            hoverIntensity={0.15}
                            rotateOnHover={true}
                            forceHoverState={false}
                            backgroundColor="#111114"
                          />
                        </div>
                        <Terminal className="w-5 h-5 text-[#9AA1A3] relative z-10" />
                      </div>
                      <span className="text-[10px] uppercase bg-white/10 px-2 py-0.5 rounded-full text-[#9AA1A3]">Coming Soon</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">{r.t}</h4>
                      <p className="text-xs text-[#858D91] mb-4">{r.sub}</p>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#9AA1A3]">Matches your {r.match} interest</span>
                      <ChevronRight className="w-4 h-4 text-[#6D777C] group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
              </AnimatedContent>
            ))}
          </div>
        </section>
        </AnimatedContent>
        </ScrollReveal>

        {/* BROWSE BY FORTE */}
        <ScrollReveal delay={0.1}>
        <AnimatedContent distance={30} direction="vertical" animateOpacity duration={0.6} threshold={0.2}>
        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              {/* <h2 className="text-xl font-semibold">Browse by forte</h2> */}
              <div role="heading" aria-level={2}>
                <BlurText
                  text="Browse by forte"
                  delay={120}
                  animateBy="words"
                  direction="top"
                  stepDuration={0.35}
                  className="text-xl font-semibold"
                />
              </div>
              <p className="text-sm text-[#858D91] mt-1">The tracks Lumora is hiring for first.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button onClick={scrollLeft} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <ChevronRight className="w-4 h-4 rotate-180" />
                </button>
                <button onClick={scrollRight} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <button className="text-sm text-[#F1F2EE] hover:text-[#C6CAC9] flex items-center gap-1 transition-colors">
                View all tracks <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="relative group">
            <div ref={scrollRef} className="w-full overflow-x-auto overflow-y-hidden pb-6 pt-2 px-2 -mx-2 no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
              <div ref={particleGridRef}>
                <GlobalSpotlight gridRef={particleGridRef} enabled={true} spotlightRadius={250} />
                <ScrollRevealGroup className="flex flex-nowrap gap-6 w-max" staggerDelay={0.1}>
                  {BROWSE_BY_FORTE.map((f, i) => (
                    <ParticleCard
                      key={i}
                      className="flex flex-col z-10 relative shrink-0 w-[340px] snap-start magic-bento-card--border-glow bg-[#111114] border border-white/10 rounded-2xl p-6 min-h-[500px]"
                      style={{ '--glow-color-rgb': hexToRgbString(f.color) } as React.CSSProperties}
                      glowColor={hexToRgbString(f.color)}
                      enableTilt={false}
                      enableMagnetism={true}
                      clickEffect={false}
                      particleCount={8}
                    >

                        <div className="flex justify-between items-start mb-6">
                          <GlareHover width="48px" height="48px" background="transparent" borderColor="#C6CAC9" className="rounded-xl overflow-hidden">
                            <div className="p-3 rounded-xl w-full h-full flex items-center justify-center" style={{ backgroundColor: `${f.color}15`, color: f.color }}>
                              <f.icon className="w-6 h-6" />
                            </div>
                          </GlareHover>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] uppercase bg-white/5 px-2 py-0.5 rounded-full text-[#9AA1A3] border border-white/10">Coming Soon</span>
                            <Heart className="w-4 h-4 text-[#6D777C] hover:text-[#C6CAC9] cursor-pointer" />
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                        <p className="text-xs text-[#9AA1A3] mb-6 h-8">{f.desc}</p>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {f.chips.map(chip => (
                            <span key={chip} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[11px] text-[#C6CAC9]">{chip}</span>
                          ))}
                        </div>
                        <div className="flex gap-4 text-xs text-[#858D91] mb-6 border-b border-white/5 pb-6">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {f.remote}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {f.duration}</span>
                          <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {f.paid}</span>
                        </div>
                        <div className="flex justify-between items-center mb-6 mt-auto">
                          <span className="text-xs font-semibold px-2 py-1 rounded" style={{ backgroundColor: getDifficultyColor(f.level).bg, color: getDifficultyColor(f.level).text }}>{f.level}</span>
                          <span className="text-xs flex items-center gap-1 text-[#858D91]"><Users className="w-3 h-3" /> {f.applicants} Applicants</span>
                        </div>
                        <StarBorder as="div" color={f.color} speed="5s" className="w-full p-0" innerClassName="!border-[#1a1a1a] !to-[#111114]">
                          <ComingSoonWrapper>
                            <button className="w-full py-2.5 rounded-lg border text-sm font-semibold flex justify-center items-center gap-2 hover:bg-white/5 transition-colors" style={{ borderColor: `${f.color}50`, color: f.color }}>
                              View Details <ChevronRight className="w-4 h-4" />
                            </button>
                          </ComingSoonWrapper>
                        </StarBorder>
                    </ParticleCard>
                  ))}
                  {BROWSE_BY_FORTE.map((f, i) => (
                    <ParticleCard
                      key={`dup-${i}`}
                      className="flex flex-col z-10 relative shrink-0 w-[340px] snap-start magic-bento-card--border-glow bg-[#111114] border border-white/10 rounded-2xl p-6 min-h-[500px]"
                      style={{ '--glow-color-rgb': hexToRgbString(f.color) } as React.CSSProperties}
                      glowColor={hexToRgbString(f.color)}
                      enableTilt={false}
                      enableMagnetism={true}
                      clickEffect={false}
                      particleCount={8}
                      aria-hidden="true"
                    >

                        <div className="flex justify-between items-start mb-6">
                          <GlareHover width="48px" height="48px" background="transparent" borderColor="#C6CAC9" className="rounded-xl overflow-hidden">
                            <div className="p-3 rounded-xl w-full h-full flex items-center justify-center" style={{ backgroundColor: `${f.color}15`, color: f.color }}>
                              <f.icon className="w-6 h-6" />
                            </div>
                          </GlareHover>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] uppercase bg-white/5 px-2 py-0.5 rounded-full text-[#9AA1A3] border border-white/10">Coming Soon</span>
                            <Heart className="w-4 h-4 text-[#6D777C] hover:text-[#C6CAC9] cursor-pointer" tabIndex={-1} />
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                        <p className="text-xs text-[#9AA1A3] mb-6 h-8">{f.desc}</p>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {f.chips.map(chip => (
                            <span key={chip} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[11px] text-[#C6CAC9]">{chip}</span>
                          ))}
                        </div>
                        <div className="flex gap-4 text-xs text-[#858D91] mb-6 border-b border-white/5 pb-6">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {f.remote}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {f.duration}</span>
                          <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {f.paid}</span>
                        </div>
                        <div className="flex justify-between items-center mb-6 mt-auto">
                          <span className="text-xs font-semibold px-2 py-1 rounded" style={{ backgroundColor: getDifficultyColor(f.level).bg, color: getDifficultyColor(f.level).text }}>{f.level}</span>
                          <span className="text-xs flex items-center gap-1 text-[#858D91]"><Users className="w-3 h-3" /> {f.applicants} Applicants</span>
                        </div>
                        <StarBorder as="div" color={f.color} speed="5s" className="w-full p-0" innerClassName="!border-[#1a1a1a] !to-[#111114]">
                          <button tabIndex={-1} className="w-full py-2.5 rounded-lg border text-sm font-semibold flex justify-center items-center gap-2 hover:bg-white/5 transition-colors" style={{ borderColor: `${f.color}50`, color: f.color }}>
                            View Details <ChevronRight className="w-4 h-4" />
                          </button>
                        </StarBorder>
                    </ParticleCard>
                  ))}
                </ScrollRevealGroup>
              </div>
            </div>
          </div>
        </section>
        </AnimatedContent>
        </ScrollReveal>



        {/* MENTORS */}
        <ScrollReveal delay={0.1}>
        <section className="flex flex-col lg:flex-row gap-4">
          <AnimatedContent distance={30} direction="vertical" animateOpacity duration={0.6} threshold={0.2} className="flex-1 h-full">
          <ScrollRevealGroup className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4" staggerDelay={0.08}>
            {[
              { init: 'RA', name: 'Rahul Arora', role: 'Frontend Mentor', c: 'bg-[#6D777C] text-[#F1F2EE]', hex: '#6D777C' },
              { init: 'AK', name: 'Akhil Varma', role: 'Backend Mentor', c: 'bg-[#6D777C] text-[#F1F2EE]', hex: '#6D777C' },
              { init: 'SN', name: 'Sneha Nair', role: 'AI Mentor', c: 'bg-[#6D777C] text-[#F1F2EE]', hex: '#6D777C' },
              { init: 'PD', name: 'Priya Desai', role: 'Design Mentor', c: 'bg-[#6D777C] text-[#F1F2EE]', hex: '#6D777C' },
              { init: 'YG', name: 'Yash Gupta', role: 'Data Mentor', c: 'bg-[#6D777C] text-[#F1F2EE]', hex: '#6D777C' }
            ].map((m, i) => (
              <PixelTransition
                key={i}
                gridSize={5}
                pixelColor={m.hex}
                animationStepDuration={0.3}
                once={false}
                aspectRatio="0"
                firstContent={
                  <div className="bg-[#111114] p-5 rounded-2xl flex flex-col items-center justify-center text-center w-full h-full">
                    <div className={`w-12 h-12 rounded-full ${m.c} flex items-center justify-center font-bold mb-4 shadow-lg shrink-0`}>{m.init}</div>
                    <h4 className="font-semibold text-sm">{m.name}</h4>
                    <p className="text-[11px] text-[#9AA1A3] mt-1">{m.role}</p>
                  </div>
                }
                secondContent={
                  <div className="bg-[#111114] p-5 rounded-2xl flex flex-col items-center justify-center text-center w-full h-full">
                    <h4 className="font-semibold text-sm mb-2">{m.role}</h4>
                    <button className={`px-4 py-2 mt-2 rounded-full text-xs font-semibold ${m.c} hover:opacity-90 transition-opacity`}>Book a 1:1 session</button>
                  </div>
                }
              />
            ))}
          </ScrollRevealGroup>
          </AnimatedContent>
          <AnimatedContent distance={30} direction="vertical" animateOpacity duration={0.6} threshold={0.2} delay={0.1} className="w-full lg:w-72 shrink-0 h-full">
          <div className="w-full lg:w-72 bg-[#111114] p-6 rounded-2xl border border-white/10 flex flex-col justify-between shrink-0 relative overflow-hidden">

            <div style={{ position: 'relative', zIndex: 1 }} className="flex flex-col justify-between h-full">
              <div>
                <style>{`
                  .parallax .scroller .testimonial-ticker-text {
                    font-size: 12px !important;
                    line-height: 24px !important;
                    font-weight: 600 !important;
                    letter-spacing: 0.05em !important;
                    text-transform: uppercase !important;
                    color: #858D91 !important;
                    display: inline-block;
                  }
                `}</style>
                <div style={{ height: '24px', overflow: 'hidden' }} className="mb-4">
                  <ScrollVelocity
                    texts={['WHAT OUR INTERNS SAY']}
                    velocity={15}
                    numCopies={4}
                    className="testimonial-ticker-text"
                  />
                </div>
                <DecryptedText
                  text='"Lumora gave me real projects, amazing mentors, and the confidence to build for the real world."'
                  speed={80}
                  maxIterations={15}
                  className="text-sm italic text-[#C6CAC9] leading-relaxed"
                  animateOn="view"
                />
                <AnimatedContent distance={0} delay={1} animateOpacity>
                  <p className="text-xs text-[#9AA1A3] mt-4">— Priya Sharma<br/>Frontend Intern, Cohort 0</p>
                </AnimatedContent>
              </div>
              <AnimatedContent distance={0} delay={1.2} animateOpacity>
                <div className="flex gap-1.5 mt-6">
                  <div className="w-2 h-2 rounded-full bg-[#F1F2EE]" />
                  <div className="w-2 h-2 rounded-full bg-[#6D777C] transition-colors" />
                  <div className="w-2 h-2 rounded-full bg-[#6D777C] transition-colors" />
                  <div className="w-2 h-2 rounded-full bg-[#6D777C] transition-colors" />
                </div>
              </AnimatedContent>
            </div>
          </div>
          </AnimatedContent>
        </section>
        </ScrollReveal>

        {/* FAQ */}
        <ScrollReveal delay={0.1}>
        <AnimatedContent distance={30} direction="vertical" animateOpacity duration={0.6} threshold={0.2}>
        <section>
          <TextType
            text={["Frequently Asked Questions"]}
            as="h2"
            typingSpeed={40}
            initialDelay={0}
            loop={false}
            showCursor={true}
            hideCursorWhileTyping={false}
            cursorCharacter="|"
            startOnVisible={true}
            className="faq-heading text-2xl font-semibold mb-8"
          />
          <div className="grid md:grid-cols-2 gap-4 lg:gap-8">
            <ScrollRevealGroup className="space-y-4" staggerDelay={0.1}>
              {FAQS.slice(0,3).map((faq, i) => (
                <div key={i} className="border-b border-white/10 pb-4">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex justify-between items-center text-left text-sm font-medium hover:text-[#F1F2EE] transition-colors">
                    {faq.q}
                    {openFaq === i ? <ChevronUp className="w-4 h-4 text-[#858D91]" /> : <ChevronDown className="w-4 h-4 text-[#858D91]" />}
                  </button>
                  <div className={`grid transition-all duration-300 ease-in-out ${openFaq === i ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <div className="text-xs text-[#9AA1A3] leading-relaxed">
                        <FaqScrollReveal
                          baseOpacity={0}
                          enableBlur={true}
                          baseRotation={0}
                          blurStrength={4}
                          textClassName="faq-answer-text"
                        >
                          {faq.a}
                        </FaqScrollReveal>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollRevealGroup>
            <ScrollRevealGroup className="space-y-4" staggerDelay={0.1}>
              {FAQS.slice(3,6).map((faq, i) => (
                <div key={i+3} className="border-b border-white/10 pb-4">
                  <button onClick={() => setOpenFaq(openFaq === i+3 ? null : i+3)} className="w-full flex justify-between items-center text-left text-sm font-medium hover:text-[#F1F2EE] transition-colors">
                    {faq.q}
                    {openFaq === i+3 ? <ChevronUp className="w-4 h-4 text-[#858D91]" /> : <ChevronDown className="w-4 h-4 text-[#858D91]" />}
                  </button>
                  <div className={`grid transition-all duration-300 ease-in-out ${openFaq === i+3 ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <div className="text-xs text-[#9AA1A3] leading-relaxed">
                        <FaqScrollReveal
                          baseOpacity={0}
                          enableBlur={true}
                          baseRotation={0}
                          blurStrength={4}
                          textClassName="faq-answer-text"
                        >
                          {faq.a}
                        </FaqScrollReveal>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollRevealGroup>
          </div>
        </section>
        </AnimatedContent>
        </ScrollReveal>

        {/* HOW IT WORKS */}
        <ScrollReveal delay={0.1}>
        <AnimatedContent distance={30} direction="vertical" animateOpacity duration={0.6} threshold={0.2}>
        <section className="relative overflow-hidden flex flex-col lg:flex-row justify-between items-center gap-12 border-t border-white/10 pt-16 pb-16 mt-20">
          <div style={{ position: 'absolute', inset: 0, zIndex: 0, width: '100%', height: '100%', maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)' }}>
            <Galaxy 
              density={1.2}
              glowIntensity={0.4}
              twinkleIntensity={0.3}
              starSpeed={0.5}
              saturation={0}
            />
          </div>
          <div className="relative z-10 flex-1 flex flex-col gap-6 w-full px-6 lg:px-0">
            <h3 className="font-semibold text-2xl">How it works</h3>
            <div ref={stepsContainerRef}>
              <style>{`
                .step-title-proximity {
                  font-size: inherit;
                  color: #ffffff;
                }
              `}</style>
              <ScrollRevealGroup className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full" staggerDelay={0.12}>
                {[
                  { num: '01', t: 'Apply', sub: 'Submit your application in minutes.', color: 'text-[#F1F2EE]' },
                { num: '02', t: 'Screen', sub: 'We review and shortlist the best matches.', color: 'text-[#9AA1A3]' },
                { num: '03', t: 'Interview', sub: 'Connect with the team and showcase your skills.', color: 'text-[#858D91]' },
                { num: '04', t: 'Onboard', sub: 'Complete the process and start building.', color: 'text-[#C6CAC9]' }
              ].map((step) => (
                <div key={step.num}>
                  <div className={`text-2xl font-light mb-2 ${step.color}`}>
                    {step.num}
                  </div>
                  <h4 className="font-medium text-sm mb-1">
                    <VariableProximity
                      label={step.t}
                      fromFontVariationSettings="'wght' 600"
                      toFontVariationSettings="'wght' 900"
                      containerRef={stepsContainerRef}
                      radius={80}
                      falloff="gaussian"
                      className="step-title-proximity"
                    />
                  </h4>
                  <p className="text-[11px] text-[#858D91]">{step.sub}</p>
                </div>
                ))}
              </ScrollRevealGroup>
            </div>
          </div>
          <div className="relative z-10 shrink-0 bg-[#111114] p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center gap-4 w-full lg:w-[420px] mx-6 lg:mx-0">
            <p className="text-sm text-[#9AA1A3]">Not ready to apply?<br/>Get notified when we post.</p>
            <div style={{ width: '100%' }}>
              <CurvedInput
                placeholder="Enter your email"
                buttonText="Notify Me"
                theme="dark"
                type="email"
                bend={0}
                height={52}
                width="100%"
                cornerRadius={26}
                fontSize={13}
                shadowSize="none"
                backgroundColor="#1a1a1a"
                borderColor="#6D777C"
                buttonColor="#ffffff"
                buttonTextColor="#000000"
                iconColor="#C6CAC9"
                textColor="#ffffff"
                placeholderColor="#9AA1A3"
                onSubmit={handleNotifySignup}
              />
            </div>
          </div>
        </section>
        </AnimatedContent>
        </ScrollReveal>
      </main>

      {/* FOOTER */}
      <ScrollReveal delay={0.1}>
      <AnimatedContent distance={30} direction="vertical" animateOpacity duration={0.6} threshold={0.2}>
      <FadeContent blur={true} duration={1} easing="ease-out" initialOpacity={0}>
        <footer className="relative z-10 border-t border-white/10 bg-black py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 text-white"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div>
            <span className="font-bold text-lg tracking-tight">Lumora</span>
          </div>
          <div className="text-xs text-[#858D91]">
            © 2026 Lumora. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-xs text-[#9AA1A3]">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-white transition-colors">Careers</Link>
            <div className="flex gap-4 ml-4">
              <a href="#" className="hover:text-white transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
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

