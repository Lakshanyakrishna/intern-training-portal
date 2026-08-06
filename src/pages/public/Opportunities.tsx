// @ts-nocheck
import { useState, useRef, useEffect, Children, useMemo } from 'react';
import { motion } from 'motion/react';
import ScrollTrigger from 'gsap/ScrollTrigger';
import FaqScrollReveal from '../../components/react-bits/ScrollReveal/ScrollReveal';
import { Link } from 'react-router-dom';
import Ferrofluid from '../../components/Ferrofluid';
import Header from '../../components/Header';
import IntroLogo from '../../components/IntroLogo';
import MinimalFooter from '../../components/MinimalFooter';
import SplitText from '../../components/SplitText';
import ComingSoonLink from '../../components/ComingSoonLink';

import SpotlightCard from '../../components/SpotlightCard';
import ClickSpark from '../../components/ClickSpark';
import { ParticleCard, GlobalSpotlight } from '../../components/react-bits/ParticleCard/ParticleCard';
import StarBorder from '../../components/StarBorder';

import ElectricBorder from '../../components/react-bits/ElectricBorder/ElectricBorder';
import CursorGrid from '../../components/react-bits/CursorGrid/CursorGrid';
import PixelTransition from '../../components/react-bits/PixelTransition/PixelTransition';
import Orb from '../../components/react-bits/Orb/Orb';
import CurvedInput from '../../components/react-bits/CurvedInput/CurvedInput';
import TextType from '../../components/TextType';
import BlurText from '../../components/react-bits/BlurText/BlurText';
import Dock from '../../components/Dock';
import VariableProximity from '../../components/react-bits/VariableProximity/VariableProximity';

import { useAutoScroll } from '../../hooks/useAutoScroll';
import Galaxy from '../../components/react-bits/Galaxy/Galaxy';
import GlareHover from '../../components/GlareHover';
// @ts-ignore
import Beams from '../../components/Beams';
// @ts-ignore
import LiquidChrome from '../../components/LiquidChrome/LiquidChrome';

import MultiSelectGooeyNav from '../../components/react-bits/GooeyNav/MultiSelectGooeyNav';
import {
  ChevronDown, MapPin, DollarSign,
  Clock, Zap, ChevronUp, ChevronRight, Terminal,
  Layout, Database, Smartphone, PenTool, Brain, Search, Briefcase,
  Code, Heart, ShieldCheck, Users,
  Mail, Star
} from 'lucide-react';

import DecryptedText from '../../components/DecryptedText';
import { useAuth } from '../../contexts/AuthContext';

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

const fadeUpVariant: any = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }
  }
};

const Reveal = ({ children, delay = 0, className = '', ...rest }: any) => {
  const variants = useMemo(() => {
    if (delay <= 0) return fadeUpVariant;
    return {
      ...fadeUpVariant,
      visible: {
        ...fadeUpVariant.visible,
        transition: { ...fadeUpVariant.visible.transition, delay }
      }
    };
  }, [delay]);

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

const RevealGroup = ({ children, className = '', staggerDelay = 0.1, childClassName = '', ...rest }: any) => {
  const containerVariants = useMemo(
    () => ({ hidden: {}, visible: { transition: { staggerChildren: staggerDelay } } }),
    [staggerDelay]
  );

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      {...rest}
    >
      {Children.map(children, child => (
        <motion.div className={childClassName} variants={fadeUpVariant}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
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
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#111114] border border-white/20 text-[#F1F2EE] text-xs px-3 py-1.5 rounded-md shadow-xl whitespace-nowrap z-[9999] pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-200">
          Coming soon
        </div>
      )}
    </div>
  );
};

export default function Opportunities() {
  const { user, loading } = useAuth();
  const particleGridRef = useRef<HTMLDivElement>(null);
  const stepsContainerRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeFilters, setActiveFilters] = useState<number[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(false);
  const moreDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target as Node)) {
        setIsMoreFiltersOpen(false);
      }
    };
    if (isMoreFiltersOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMoreFiltersOpen]);

  const filteredOpportunities = useMemo(() => {
    return BROWSE_BY_FORTE.filter((f) => {
      const matchesCategory = activeCategory === 'All' || f.title.includes(activeCategory) || f.title.includes(activeCategory.split(' ')[0]);
      
      let matchesFilters = true;
      if (activeFilters.length > 0) {
        const filterLabels = ['Remote', 'Hybrid', 'Paid', 'Unpaid', 'Internship', 'Full-Time'];
        const selectedLabels = activeFilters.map(idx => filterLabels[idx]);
        
        const hasRemoteFilter = selectedLabels.includes('Remote');
        const hasHybridFilter = selectedLabels.includes('Hybrid');
        const hasPaidFilter = selectedLabels.includes('Paid');
        const hasUnpaidFilter = selectedLabels.includes('Unpaid');
        const hasInternFilter = selectedLabels.includes('Internship');
        const hasFulltimeFilter = selectedLabels.includes('Full-Time');

        const matchLocation = (!hasRemoteFilter && !hasHybridFilter) || 
                              (hasRemoteFilter && f.remote === 'Remote') || 
                              (hasHybridFilter && f.remote === 'Hybrid');
                              
        const matchPaid = (!hasPaidFilter && !hasUnpaidFilter) || 
                          (hasPaidFilter && f.paid === 'Paid') || 
                          (hasUnpaidFilter && f.paid === 'Unpaid');
                          
        const isIntern = f.title.toLowerCase().includes('intern');
        const matchType = (!hasInternFilter && !hasFulltimeFilter) ||
                          (hasInternFilter && isIntern) ||
                          (hasFulltimeFilter && !isIntern);

        matchesFilters = matchLocation && matchPaid && matchType;
      }

      return matchesCategory && matchesFilters;
    });
  }, [activeCategory, activeFilters]);

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



  return (
    <>
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
        
        {/* HERO SECTION */}
        <section className="flex flex-col items-start gap-12">
          <div className="max-w-2xl text-left">
            <Reveal delay={0.2}>
              <p className="text-[#9AA1A3] font-bold tracking-[0.2em] text-lg mb-4 uppercase">Careers at Lumora</p>
            </Reveal>
            <h1 className="text-6xl sm:text-8xl font-bold leading-[0.9] tracking-tight mb-6">
              <SplitText text="OPEN ROLES" delay={100} from={{ opacity: 0, transform: 'translate3d(0,50px,0)' }} to={{ opacity: 1, transform: 'translate3d(0,0,0)' }} ease="easeOutCubic" threshold={0.2} rootMargin="-50px" />
            </h1>
            <div className="text-[#9AA1A3] text-lg mb-8 leading-relaxed max-w-xl">
              <BlurText text="Every great career starts with the right opportunity. New roles land here first, screened, structured, and ready for you to take the leap." delay={50} />
            </div>
          </div>
        </section>

        {/* SEARCH & FILTERS */}
        <section className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
            <div className="flex-1 flex flex-wrap items-center gap-2 w-full relative" ref={moreDropdownRef}>
              <RevealGroup className="flex flex-wrap gap-2 flex-1 w-full items-center" staggerDelay={0.05}>
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
                
                <Reveal delay={0.2} className="shrink-0">
                  <button 
                    onClick={() => setIsMoreFiltersOpen(!isMoreFiltersOpen)}
                    className="px-4 py-1.5 rounded-full text-sm font-medium bg-transparent border border-white/10 text-[#9AA1A3] flex items-center hover:border-white/30 transition-colors"
                    aria-expanded={isMoreFiltersOpen}
                  >
                    More <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${isMoreFiltersOpen ? 'rotate-180' : ''}`} />
                  </button>
                </Reveal>
              </RevealGroup>

              {isMoreFiltersOpen && (
                <div className="absolute left-0 lg:left-auto lg:right-0 top-full mt-2 w-max max-w-[calc(100vw-2rem)] bg-[#111114] border border-white/10 rounded-2xl p-5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {activeFilters.length > 0 && (
                    <div className="flex items-center justify-end mb-4 sticky left-0">
                      <button 
                        onClick={() => setActiveFilters([])}
                        className="text-xs text-[#858D91] hover:text-white transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                  )}
                  <div className="overflow-x-auto pb-1 -mb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <style>{`.overflow-x-auto::-webkit-scrollbar { display: none; }`}</style>
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
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* BROWSE BY FORTE */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <RevealGroup staggerDelay={0.08}>
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
            </RevealGroup>
            <Reveal delay={0.15} className="flex items-center gap-4">
              <ComingSoonLink label="View all tracks" />
            </Reveal>
          </div>
          <div className="relative group">
            <div ref={scrollRef} className="w-full overflow-x-auto overflow-y-hidden pb-6 pt-2 px-2 -mx-2 no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
              <div ref={particleGridRef}>
                <GlobalSpotlight gridRef={particleGridRef} enabled={true} spotlightRadius={250} />
                <RevealGroup className="flex flex-nowrap gap-6 w-max" staggerDelay={0.1}>
                  {filteredOpportunities.length > 0 ? filteredOpportunities.map((f, i) => (
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
                        <ComingSoonWrapper>
                          <StarBorder as="div" color={f.color} speed="5s" className="w-full p-0" innerClassName="!border-[#1a1a1a] !to-[#111114]">
                            <button className="w-full py-2.5 rounded-lg border text-sm font-semibold flex justify-center items-center gap-2 hover:bg-white/5 transition-colors" style={{ borderColor: `${f.color}50`, color: f.color }}>
                              View Details <ChevronRight className="w-4 h-4" />
                            </button>
                          </StarBorder>
                        </ComingSoonWrapper>
                    </ParticleCard>
                  )) : (
                    <div className="text-sm text-[#9AA1A3] py-8 w-full min-w-[340px] text-center">No opportunities found matching your criteria.</div>
                  )}
                  {filteredOpportunities.map((f, i) => (
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
                        <ComingSoonWrapper>
                          <StarBorder as="div" color={f.color} speed="5s" className="w-full p-0" innerClassName="!border-[#1a1a1a] !to-[#111114]">
                            <button tabIndex={-1} className="w-full py-2.5 rounded-lg border text-sm font-semibold flex justify-center items-center gap-2 hover:bg-white/5 transition-colors" style={{ borderColor: `${f.color}50`, color: f.color }}>
                              View Details <ChevronRight className="w-4 h-4" />
                            </button>
                          </StarBorder>
                        </ComingSoonWrapper>
                    </ParticleCard>
                  ))}
                </RevealGroup>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED OPPORTUNITY */}
        <section className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-64 shrink-0">
            <style>{`
              /* bracket-frame stat styles are inline */
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
            
            <RevealGroup className="w-full lg:w-64 shrink-0" staggerDelay={0.15}>
              <TextType
                as="h2"
                text={["50 Opportunities available"]}
                typingSpeed={60}
                initialDelay={200}
                showCursor={true}
                cursorCharacter="|"
                loop={false}
                startOnVisible={true}
                className="opportunities-heading text-white text-[28px] font-bold leading-tight tracking-tight m-0"
                style={{ minHeight: '4rem' }}
              />
              <p className="text-[#9AA1A3] text-sm mt-3">We'll notify you when new opportunities are posted.</p>
            </RevealGroup>
          </div>
          <Reveal delay={0.1} className="flex-1">
          <ElectricBorder
            color="#C6CAC9"
            speed={1}
            chaos={0.08}
            borderRadius={16}
            className="flex-1"
          >
            <SpotlightCard className="w-full h-full rounded-2xl bg-[#111114] p-6 lg:p-8 relative overflow-hidden flex flex-col lg:flex-row justify-between items-start gap-6 group" spotlightColor="rgba(198, 202, 201, 0.2)">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#6D777C]/20 to-transparent pointer-events-none" />
            <RevealGroup className="relative z-10 space-y-4" staggerDelay={0.08}>
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
            </RevealGroup>
            <Reveal delay={0.25} className="relative z-10 flex flex-col items-end gap-3 shrink-0">
              <p className="text-xs text-[#9AA1A3]">Apply before</p>
              <p className="text-sm flex items-center gap-2"><Clock className="w-4 h-4 text-[#858D91]" /> Aug 20, 2026</p>
              <p className="text-sm flex items-center gap-2"><Users className="w-4 h-4 text-[#858D91]" /> 58 Applicants</p>
              <ClickSpark sparkColor="#fff" sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
                <Link
                  to={!loading && !user ? '/apply/frontend-developer-intern/create-account' : '/apply/frontend-developer-intern'}
                  className="mt-2 w-full bg-[#F1F2EE] hover:bg-[#C6CAC9] text-[#111114] px-6 py-2.5 rounded-lg text-sm font-semibold flex justify-center items-center gap-2 transition-colors"
                >
                  Apply Now <ChevronRight className="w-4 h-4" />
                </Link>
              </ClickSpark>
            </Reveal>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
              <Code className="w-32 h-32 text-[#9AA1A3]" />
            </div>
          </SpotlightCard>
          </ElectricBorder>
          </Reveal>
        </section>

        {/* RECOMMENDED */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <RevealGroup staggerDelay={0.08}>
              <h2 className="text-xl font-semibold flex items-center gap-2"><Zap className="w-5 h-5 text-[#F1F2EE]" /> Recommended For You</h2>
              <p className="text-sm text-[#858D91] mt-1">Based on your interests and profile.</p>
            </RevealGroup>
            <Reveal delay={0.15} className="shrink-0">
              <ComingSoonLink label="View all recommendations" />
            </Reveal>
          </div>
          <RevealGroup className="grid md:grid-cols-3 gap-4" staggerDelay={0.12} childClassName="h-full">
            {[
              { t: 'Frontend Developer', sub: 'React • Remote • Paid', match: 'React' },
              { t: 'Backend Developer', sub: 'Node.js • API • Remote', match: 'backend' },
              { t: 'Agentic AI Intern', sub: 'Python • LLMs • Remote', match: 'AI' }
            ].map((r, i) => (
                <div key={i} className="relative h-full rounded-xl bg-[#111114] border border-white/10 group hover:border-white/20 transition-colors overflow-hidden">
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
            ))}
          </RevealGroup>
        </section>


        {/* STATS BAR */}
        <style>{`
          .stat-card-grid-bg {
            background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
            background-size: 16px 16px;
          }
          .stat-card {
            border: 1px solid rgba(255,255,255,0.08);
            transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
          }
          .stat-card:hover {
            border-color: rgba(255,255,255,0.15);
            box-shadow: 0 4px 20px rgba(0,0,0,0.4);
            transform: translateY(-2px);
          }
          .stat-card:focus-visible {
            outline: none;
            box-shadow: 0 0 0 2px #71717a;
          }
          .stat-card:active {
            box-shadow: 0 0 0 2px #a1a1aa;
          }
        `}</style>
        <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4" staggerDelay={0.08} childClassName="h-full">
          {[
            { icon: Briefcase, title: '6', sub: 'Domains open for hiring' },
            { icon: Clock, title: 'Cohort 01', sub: 'Launching soon' },
            { icon: MapPin, title: '100%', sub: 'Remote-friendly' },
            { icon: Users, title: '10+', sub: 'Mentors & Experts' },
            { icon: Heart, title: 'Transparent', sub: 'No ghosting. Ever.' }
          ].map((stat, i) => (
              <div
                key={i}
                className="stat-card relative rounded-xl bg-[#141414] p-5 flex flex-col gap-3 cursor-default overflow-hidden h-full"
                tabIndex={0}
              >
                <div style={{ position: 'absolute', inset: 0, zIndex: 0, borderRadius: 'inherit' }}>
                  <Beams
                    beamWidth={2}
                    beamHeight={14}
                    beamNumber={14}
                    lightColor="#B8BCC0"
                    speed={0.8}
                    noiseIntensity={1.0}
                    scale={0.4}
                    rotation={0}
                  />
                </div>
                <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'rgba(10,10,11,0.75)', borderRadius: 'inherit', pointerEvents: 'none' }} />
                <stat.icon className="w-5 h-5 text-[#8a8a8a] relative z-10" strokeWidth={1.5} />
                <div className="relative z-10">
                  <h3 className="text-[17px] font-semibold text-white" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>{stat.title}</h3>
                  <p className="text-[12px] text-white/90 mt-0.5" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>{stat.sub}</p>
                </div>
              </div>
          ))}
        </RevealGroup>

        {/* MENTORS */}
        <style>{`
          .mentors-row:hover .mentor-card {
            opacity: 0.5;
            transition: opacity 0.25s ease;
          }
          .mentors-row .mentor-card:hover {
            opacity: 1;
            border-color: rgba(255,255,255,0.15) !important;
            transform: translateY(-2px);
            transition: opacity 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
          }
        `}        </style>
        <section className="flex flex-col lg:flex-row gap-4">
          <RevealGroup className="mentors-row flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4" staggerDelay={0.1} childClassName="h-full">
            {[
              { init: 'RA', name: 'Rahul Arora', role: 'Frontend Mentor', hex: '#6D777C' },
              { init: 'AK', name: 'Akhil Varma', role: 'Backend Mentor', hex: '#6D777C' },
              { init: 'SN', name: 'Sneha Nair', role: 'AI Mentor', hex: '#6D777C' },
              { init: 'PD', name: 'Priya Desai', role: 'Design Mentor', hex: '#6D777C' },
              { init: 'YG', name: 'Yash Gupta', role: 'Data Mentor', hex: '#6D777C' }
            ].map((m, i) => (
              <PixelTransition
                key={i}
                className="mentor-card"
                gridSize={5}
                pixelColor={m.hex}
                animationStepDuration={0.3}
                once={false}
                aspectRatio="0"
                firstContent={
                  <div className="bg-[#111114] p-5 rounded-2xl flex flex-col items-center justify-center text-center w-full h-full">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold mb-4 shadow-lg shrink-0 text-[#F1F2EE]" style={{ backgroundColor: '#5a5c63' }}>{m.init}</div>
                    <h4 className="font-semibold text-sm text-white">{m.name}</h4>
                    <p className="text-[11px] mt-1" style={{ color: '#8a8a8a' }}>{m.role}</p>
                  </div>
                }
                secondContent={
                  <div className="bg-[#111114] p-5 rounded-2xl flex flex-col items-center justify-center text-center w-full h-full">
                    <h4 className="font-semibold text-sm mb-2 text-white">{m.role}</h4>
                    <button className="px-4 py-2 mt-2 rounded-full text-xs font-semibold text-[#F1F2EE] hover:opacity-90 transition-opacity" style={{ backgroundColor: '#5a5c63' }}>Book a 1:1 session</button>
                  </div>
                }
              />
            ))}
          </RevealGroup>
          <Reveal delay={0.15} className="w-full lg:w-72 shrink-0 h-full">
          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px' }} className="w-full lg:w-72 shrink-0 h-full border border-white/10">
            <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
              <LiquidChrome
                baseColor={[0.05, 0.05, 0.06]}
                speed={0.3}
                amplitude={0.25}
                frequencyX={2}
                frequencyY={2}
                interactive={true}
              />
            </div>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1 }} />
            <div style={{ position: 'relative', zIndex: 2, padding: '1.75rem 2rem' }} className="flex flex-col justify-between h-full">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white mb-4">What our interns say</p>
                <DecryptedText
                  text='"Lumora gave me real projects, amazing mentors, and the confidence to build for the real world."'
                  speed={80}
                  maxIterations={15}
                  className="text-sm italic text-[#C6CAC9] leading-relaxed"
                  animateOn="view"
                />
                <Reveal delay={0.3}>
                  <p className="text-xs text-[#9AA1A3] mt-4">— Priya Sharma<br/>Frontend Intern, Cohort 0</p>
                </Reveal>
              </div>
            </div>
          </div>
          </Reveal>
        </section>

        {/* FAQ */}
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
            <RevealGroup className="space-y-4" staggerDelay={0.1}>
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
            </RevealGroup>
            <RevealGroup className="space-y-4" staggerDelay={0.1}>
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
            </RevealGroup>
          </div>
        </section>

        {/* HOW IT WORKS */}
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
            <Reveal>
              <h3 className="font-semibold text-2xl">How it works</h3>
            </Reveal>
            <div ref={stepsContainerRef}>
              <style>{`
                .step-title-proximity {
                  font-size: inherit;
                  color: #ffffff;
                }
              `}</style>
              <RevealGroup className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full" staggerDelay={0.12}>
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
              </RevealGroup>
            </div>
          </div>
          <Reveal delay={0.15} className="relative z-10 shrink-0 bg-[#111114] p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center gap-4 w-full lg:w-[420px] mx-6 lg:mx-0">
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
          </Reveal>
        </section>
      </main>

      {/* FOOTER */}
      <Reveal>
        <MinimalFooter />
      </Reveal>
    </div>

    {/* Fixed floating dock — bottom-right, outside overflow-hidden */}
    <div className="fixed bottom-6 right-6 z-50">
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
        baseItemSize={40}
      />
    </div>
    </>
  );
}

