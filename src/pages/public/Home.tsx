import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import IntroLogo from '../../components/IntroLogo';
import Header from '../../components/Header';
import Ferrofluid from '../../components/Ferrofluid';
import Prism from '../../components/Prism';
import TrueFocus from '../../components/TrueFocus';
import TargetCursor from '../../components/TargetCursor';
import Footer from '../../components/Footer';
import DomainPathCard from '../../components/DomainPathCard';
import DomainBackground from '../../components/DomainBackground';
import PremiumFeatureCard from '../../components/PremiumFeatureCard';
import { getOpportunities } from '../../lib/db';
import type { DbOpportunity } from '../../lib/db';

// ─── Mock Opportunities ─────────────────────
const MOCK_INTERNSHIPS = [
  {
    id: 'mock-1',
    company: 'Meta',
    role: 'Frontend Developer Intern',
    location: 'Remote',
    duration: '3 Months',
    paid: 'Stipend',
    logoLetter: 'M'
  },
  {
    id: 'mock-2',
    company: 'GrowthX',
    role: 'Growth Marketing Intern',
    location: 'Bangalore',
    duration: '2 Months',
    paid: 'Paid',
    logoLetter: 'G'
  },
  {
    id: 'mock-3',
    company: 'Notion',
    role: 'Product Design Intern',
    location: 'Remote',
    duration: '6 Months',
    paid: 'Stipend',
    logoLetter: 'N'
  },
  {
    id: 'mock-4',
    company: 'Swiggy',
    role: 'Data Analyst Intern',
    location: 'Hyderabad',
    duration: '3 Months',
    paid: 'Paid',
    logoLetter: 'S'
  },
  {
    id: 'mock-5',
    company: 'Slice',
    role: 'Backend Developer Intern',
    location: 'Remote',
    duration: '6 Months',
    paid: 'Stipend',
    logoLetter: 'S'
  },
  {
    id: 'mock-6',
    company: 'Lumora',
    role: 'AI & ML Engineer Intern',
    location: 'Remote',
    duration: '6 Months',
    paid: 'Paid',
    logoLetter: 'L'
  }
];

// ─── Tech Domains ─────────────────────
const DOMAINS = [
  { name: 'Frontend', desc: 'Build stunning interactive web user interfaces using modern React, Tailwind, and WebGL.' },
  { name: 'Backend', desc: 'Design resilient distributed APIs, relational database schemas, caching layers, and server logic.' },
  { name: 'UI / UX Design', desc: 'Create minimal user flows, modern responsive design systems, high-fidelity mockups in Figma.' },
  { name: 'AI & ML', desc: 'Train deep neural networks, set up LLM pipelines, create embeddings, and orchestrate agent models.' },
  { name: 'Cloud', desc: 'Manage VPC networks, automate serverless deployments, Terraform scripts, and secure Kubernetes.' },
  { name: 'Cyber Security', desc: 'Conduct penetration tests, audit smart contracts, manage IAM structures, and secure server stacks.' },
  { name: 'Data Science', desc: 'Perform statistical models, write data warehouse pipeline maps, pandas dashboards, and analytics.' }
];

// ─── Why Lumora Features ─────────────────────
const WHY_LUMORA = [
  { 
    title: 'Real Industry Projects', 
    desc: 'Contribute to production-ready applications, solve real engineering problems, and build a portfolio that reflects practical experience.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    ),
    accent: '#10B981'
  },
  { 
    title: 'Verified Internship Opportunities', 
    desc: 'Apply to carefully curated internships from trusted companies with meaningful work, mentorship, and genuine hiring potential.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="6"/>
        <circle cx="12" cy="12" r="2"/>
      </svg>
    ),
    accent: '#F59E0B'
  },
  { 
    title: 'Expert Mentorship', 
    desc: 'Receive personalized guidance, technical feedback, and code reviews from experienced software engineers working in the industry.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="8" r="4"/>
        <circle cx="6" cy="16" r="3"/>
        <circle cx="18" cy="16" r="3"/>
        <path d="M9 16h6"/>
      </svg>
    ),
    accent: '#3B82F6'
  },
  { 
    title: 'Global Developer Community', 
    desc: 'Connect with ambitious students, collaborate on projects, join hackathons, and grow alongside like-minded builders.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="3"/>
        <circle cx="12" cy="12" r="8" strokeDasharray="4 4"/>
        <circle cx="12" cy="12" r="12" strokeDasharray="2 4"/>
      </svg>
    ),
    accent: '#8B5CF6'
  },
  { 
    title: 'Career-Focused Learning', 
    desc: 'Master technologies through structured roadmaps, hands-on challenges, and project-based learning designed for modern software careers.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
    accent: '#06B6D4'
  },
  { 
    title: 'Build a Portfolio That Stands Out', 
    desc: 'Showcase your projects, verified achievements, and certifications to create a professional profile that impresses recruiters.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18"/>
        <path d="M9 21V9"/>
      </svg>
    ),
    accent: '#EF4444'
  }
];

export default function Home() {
  const [dbOpportunities, setDbOpportunities] = useState<DbOpportunity[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrolled, setScrolled] = useState(false);
  const [showcasePhase, setShowcasePhase] = useState<'hero' | 'internship' | 'domains' | 'features' | 'stats' | 'complete'>('hero');
  const [stats, setStats] = useState({ internships: 0, companies: 0, mentors: 0 });

  // 7-second cinematic showcase sequence
  useEffect(() => {
    const timer1 = setTimeout(() => setShowcasePhase('internship'), 1200);
    const timer2 = setTimeout(() => setShowcasePhase('domains'), 2200);
    const timer3 = setTimeout(() => setShowcasePhase('features'), 3300);
    const timer4 = setTimeout(() => setShowcasePhase('stats'), 4500);
    const timer5 = setTimeout(() => setShowcasePhase('complete'), 5700);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, []);

  // Animate stats numbers
  useEffect(() => {
    if (showcasePhase === 'stats') {
      const duration = 1200;
      const steps = 60;
      const interval = duration / steps;
      let step = 0;
      
      const animate = () => {
        step++;
        const progress = step / steps;
        setStats({
          internships: Math.floor(1200 * progress),
          companies: Math.floor(250 * progress),
          mentors: Math.floor(500 * progress)
        });
        
        if (step < steps) {
          setTimeout(animate, interval);
        } else {
          setStats({ internships: 1200, companies: 250, mentors: 500 });
        }
      };
      
      animate();
    }
  }, [showcasePhase]);

  // Throttle function
  const throttle = <T extends (...args: any[]) => any>(func: T, limit: number): T => {
    let inThrottle: boolean;
    return ((...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }) as T;
  };

  // Mouse movement for parallax (throttled)
  useEffect(() => {
    const handleMouseMove = throttle((e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 8;
      const y = (e.clientY / window.innerHeight - 0.5) * 8;
      setMousePosition({ x, y });
    }, 16); // ~60fps
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll detection for navbar (throttled)
  useEffect(() => {
    const handleScroll = throttle(() => {
      setScrolled(window.scrollY > 50);
    }, 16); // ~60fps
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch opportunities from Supabase
  useEffect(() => {
    getOpportunities('active')
      .then(setDbOpportunities)
      .catch(err => console.error('Error fetching opportunities:', err));
  }, []);

  // Use mock data if DB returns fewer than 6
  const featuredOpportunities = dbOpportunities.length >= 6 
    ? dbOpportunities.slice(0, 6).map((opp, idx) => ({
        id: opp.id,
        company: MOCK_INTERNSHIPS[idx % MOCK_INTERNSHIPS.length].company,
        role: opp.title,
        location: opp.forte || 'Remote',
        duration: '3 Months',
        paid: 'Stipend',
        logoLetter: MOCK_INTERNSHIPS[idx % MOCK_INTERNSHIPS.length].logoLetter
      }))
    : MOCK_INTERNSHIPS;

  return (
    <div className="min-h-screen bg-[#000000] text-[#F5F5F5] relative">
      <div className="fixed inset-0 pointer-events-none z-0">
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
      <div className="relative z-10">
        <TargetCursor 
          targetSelector=".cursor-target"
          spinDuration={3}
          hideDefaultCursor={false}
          hoverDuration={0.3}
          parallaxOn={true}
          cursorColor="#ffffff"
          cursorColorOnTarget="#ffffff"
        />
      
      {/* ─── HERO SECTION ─── */}
      <section className="mx-auto max-w-7xl px-8 pt-32 pb-20 md:pt-40 md:pb-32 relative">
        <motion.div 
          className="flex flex-col items-center justify-center text-center relative z-10 transition-all duration-700"
          animate={{ 
            x: mousePosition.x * 0.5, 
            y: mousePosition.y * 0.5,
            opacity: showcasePhase === 'hero' || showcasePhase === 'complete' ? 1 : 0.4,
            filter: showcasePhase === 'hero' || showcasePhase === 'complete' ? 'blur(0px)' : 'blur(4px)',
            scale: showcasePhase === 'hero' || showcasePhase === 'complete' ? 1 : 0.95
          }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
        >
          {/* HERO LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center space-y-8 max-w-3xl"
          >
            {/* Badge */}
            <motion.div
              animate={{ 
                y: [-2, 2, -2],
                opacity: [1, 0.97, 1]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-[#3A3A3A]/50 bg-[#1A1A1A] px-4 py-1.5"
            >
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="h-2 w-2 rounded-full bg-white"
              />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">
                Internship Portal
              </span>
            </motion.div>

            {/* Headline */}
            <div className="max-w-2xl relative">
              {/* Hero glow effect */}
              <motion.div
                animate={{ 
                  opacity: [0, 0.3, 0],
                  x: ['-100%', '100%', '100%']
                }}
                transition={{ 
                  duration: 10, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-3xl -z-10"
              />
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="font-extrabold leading-[1.04] tracking-tight text-white"
                style={{ 
                  fontFamily: 'Inter, -apple-system, Segoe UI, sans-serif',
                  fontSize: 'clamp(32px, 5vw, 64px)',
                  letterSpacing: '-0.02em'
                }}
              >
                <TrueFocus 
                  sentence="Launch Your Career."
                  manualMode={false}
                  blurAmount={3}
                  borderColor="white"
                  glowColor="rgba(255, 255, 255, 0.4)"
                  animationDuration={0.5}
                  pauseBetweenAnimations={2}
                />
              </motion.h1>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-normal leading-[1.04]"
                style={{ 
                  fontFamily: 'Georgia, Times New Roman, serif',
                  fontSize: 'clamp(28px, 4.5vw, 56px)',
                  color: '#c9c9c6'
                }}
              >
                Build Real Experience
              </motion.h2>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-xl leading-[1.6]"
              style={{ 
                fontFamily: 'Inter, -apple-system, Segoe UI, sans-serif',
                fontSize: '17px',
                fontWeight: 400,
                color: 'rgba(245,244,240,0.62)'
              }}
            >
              Verified internships, mentorship, real-world projects, and structured
              learning designed to prepare students for industry.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className={`flex flex-wrap items-center justify-center gap-4 pt-2 transition-opacity duration-500 ${showcasePhase !== 'hero' && showcasePhase !== 'complete' ? 'opacity-30' : 'opacity-100'}`}
            >
              <Link
                to="/opportunities"
                className="group relative inline-flex items-center justify-center rounded-full bg-white px-8 py-4 transition-all duration-300 hover:scale-[1.03] hover:bg-[#F5F5F5] hover:shadow-lg hover:shadow-white/20 active:scale-[0.97]"
                style={{ 
                  fontFamily: 'Inter, -apple-system, Segoe UI, sans-serif',
                  fontSize: '14.5px',
                  fontWeight: 700,
                  color: 'black'
                }}
              >
                <span className="relative z-10">Explore Opportunities</span>
                <motion.span
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
              </Link>

              <Link
                to="/about"
                className="group relative inline-flex items-center justify-center rounded-full border border-[#3A3A3A] px-8 py-4 transition-all duration-300 hover:border-[#5A5A5A] hover:bg-[#1A1A1A] hover:shadow-lg active:scale-[0.97]"
                style={{ 
                  fontFamily: 'Inter, -apple-system, Segoe UI, sans-serif',
                  fontSize: '14.5px',
                  fontWeight: 700,
                  color: 'white'
                }}
              >
                Browse Programs
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showcasePhase === 'complete' ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-16 flex flex-col items-center gap-2"
          >
            <motion.span
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-[11px] uppercase tracking-[0.2em] text-[#A0A0A0]"
            >
              Scroll
            </motion.span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-px h-8 bg-gradient-to-b from-[#A0A0A0] to-transparent"
            />
          </motion.div>
        </motion.div>

        {/* ─── FLOATING GLASSMORPHISM CARDS ─── */}
        <AnimatePresence>
          {showcasePhase !== 'complete' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
            >
              {/* Featured Internship Card */}
              <AnimatePresence>
                {showcasePhase === 'internship' && (
                  <motion.div
                    initial={{ x: 400, y: 0, scale: 0.8, rotateY: 15, opacity: 0 }}
                    animate={{ x: 200, y: 0, scale: 1, rotateY: 3, opacity: 1 }}
                    exit={{ x: 100, y: -50, scale: 0.6, rotateY: -5, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="absolute top-1/2 right-0 -translate-y-1/2 w-80 p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl shadow-white/5"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider">Featured</div>
                        <div className="text-xl font-bold text-white mt-1">Frontend Intern</div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-xl">🚀</div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="text-sm text-white font-medium">Meta</div>
                      <div className="text-xs text-[#A0A0A0]">Remote • Full-time</div>
                      <div className="text-sm text-green-400 font-semibold">₹25K/month</div>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium">
                      Apply →
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tech Domains Card */}
              <AnimatePresence>
                {showcasePhase === 'domains' && (
                  <motion.div
                    initial={{ scale: 0.8, rotateY: -15, opacity: 0 }}
                    animate={{ scale: 1, rotateY: 3, opacity: 1 }}
                    exit={{ scale: 0.9, rotateY: 5, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="absolute top-1/2 right-0 -translate-y-1/2 w-80 p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl shadow-white/5"
                  >
                    <div className="text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider mb-4">Explore</div>
                    <div className="text-xl font-bold text-white mb-6">Tech Domains</div>
                    <div className="grid grid-cols-2 gap-3">
                      {['Frontend', 'Backend', 'AI/ML', 'Cloud'].map((domain, i) => (
                        <motion.div
                          key={domain}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="p-3 rounded-xl bg-white/5 border border-white/10 text-center"
                        >
                          <div className="text-sm text-white font-medium">{domain}</div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Why Lumora Features Card */}
              <AnimatePresence>
                {showcasePhase === 'features' && (
                  <motion.div
                    initial={{ scale: 0.8, rotateY: 15, opacity: 0 }}
                    animate={{ scale: 1, rotateY: -3, opacity: 1 }}
                    exit={{ scale: 0.9, rotateY: -5, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="absolute top-1/2 right-0 -translate-y-1/2 w-80 p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl shadow-white/5"
                  >
                    <div className="text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider mb-4">Why Lumora</div>
                    <div className="text-xl font-bold text-white mb-6">What We Offer</div>
                    <div className="space-y-3">
                      {WHY_LUMORA.slice(0, 4).map((feature, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs">✓</div>
                          <div className="text-sm text-white">{feature.title}</div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Statistics Card */}
              <AnimatePresence>
                {showcasePhase === 'stats' && (
                  <motion.div
                    initial={{ scale: 0.8, rotateY: -15, opacity: 0 }}
                    animate={{ scale: 1, rotateY: 3, opacity: 1 }}
                    exit={{ scale: 0.9, rotateY: 5, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="absolute top-1/2 right-0 -translate-y-1/2 w-80 p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl shadow-white/5"
                  >
                    <div className="text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider mb-6">Impact</div>
                    <div className="space-y-6">
                      <div>
                        <div className="text-3xl font-bold text-white">{stats.internships}+</div>
                        <div className="text-sm text-[#A0A0A0]">Internships</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-white">{stats.companies}+</div>
                        <div className="text-sm text-[#A0A0A0]">Companies</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-white">{stats.mentors}+</div>
                        <div className="text-sm text-[#A0A0A0]">Mentors</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ─── TECH DOMAINS ─── */}
      <section className="mx-auto max-w-7xl px-8 py-16 md:py-24 relative" style={{ background: '#050505' }}>
        <DomainBackground />
        <div className="max-w-3xl mb-12 relative z-10">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#A0A0A0] mb-2">
            Specialized Paths
          </h2>
          <h3 className="text-3xl font-semibold tracking-tight text-[#FFFFFF] md:text-4xl">
            Choose Your Internship Path
          </h3>
          <p className="text-[14px] text-[#A0A0A0] mt-2">
            Accelerated pathways matching industry demands.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center relative z-10">
          <DomainPathCard 
            index={0}
            domain={{
              id: 'ai',
              name: 'AI',
              title: 'AI Engineer',
              description: 'Learn to build AI products using LLMs, LangChain, vector databases, and real-world deployment workflows.',
              skills: ['Python', 'LangChain', 'OpenAI', 'Vector DBs'],
              icon: (
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 2v4m0 12v4m10-10h-4M6 12H2m15.07-7.07l-2.83 2.83M9.76 14.24l-2.83 2.83M17 17l-2.83-2.83M9.76 9.76l-2.83-2.83"/>
                </svg>
              ),
              accentColor: '#7C3AED',
              url: '/opportunities?domain=AI%20%26%20ML'
            }}
          />
          <DomainPathCard 
            index={1}
            domain={{
              id: 'frontend',
              name: 'Frontend',
              title: 'Frontend Developer',
              description: 'Build beautiful responsive interfaces using React, Next.js, TypeScript, animations, and modern UI systems.',
              skills: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
              icon: (
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <path d="M3 9h18M9 21V9"/>
                </svg>
              ),
              accentColor: '#3B82F6',
              url: '/opportunities?domain=Frontend'
            }}
          />
          <DomainPathCard 
            index={2}
            domain={{
              id: 'backend',
              name: 'Backend',
              title: 'Backend Engineer',
              description: 'Develop scalable APIs, authentication systems, databases, and production-ready backend architectures.',
              skills: ['Node.js', 'PostgreSQL', 'Redis', 'GraphQL'],
              icon: (
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/>
                  <line x1="8" y1="16" x2="8.01" y2="16"/>
                  <line x1="8" y1="20" x2="8.01" y2="20"/>
                  <line x1="12" y1="18" x2="12.01" y2="18"/>
                  <line x1="12" y1="22" x2="12.01" y2="22"/>
                  <line x1="16" y1="16" x2="16.01" y2="16"/>
                  <line x1="16" y1="20" x2="16.01" y2="20"/>
                </svg>
              ),
              accentColor: '#10B981',
              url: '/opportunities?domain=Backend'
            }}
          />
          <DomainPathCard 
            index={3}
            domain={{
              id: 'cloud',
              name: 'Cloud',
              title: 'Cloud Architect',
              description: 'Deploy applications with Docker, Kubernetes, CI/CD pipelines, AWS, and modern DevOps practices.',
              skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
              icon: (
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
                </svg>
              ),
              accentColor: '#06B6D4',
              url: '/opportunities?domain=Cloud'
            }}
          />
          <DomainPathCard 
            index={4}
            domain={{
              id: 'data',
              name: 'Data Science',
              title: 'Data Scientist',
              description: 'Analyze data, train machine learning models, visualize insights, and solve real business problems.',
              skills: ['Python', 'Pandas', 'Scikit-learn', 'TensorFlow'],
              icon: (
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
              ),
              accentColor: '#EC4899',
              url: '/opportunities?domain=Data%20Science'
            }}
          />
          <DomainPathCard 
            index={5}
            domain={{
              id: 'cyber',
              name: 'Cyber Security',
              title: 'Security Engineer',
              description: 'Explore ethical hacking, penetration testing, cloud security, and secure application development.',
              skills: ['Penetration Testing', 'OWASP', 'Cloud Security', 'Cryptography'],
              icon: (
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              ),
              accentColor: '#EF4444',
              url: '/opportunities?domain=Cyber%20Security'
            }}
          />
          <DomainPathCard 
            index={6}
            domain={{
              id: 'uiux',
              name: 'UI/UX',
              title: 'UI/UX Designer',
              description: 'Create intuitive user experiences, design systems, prototypes, and conduct user research.',
              skills: ['Figma', 'Design Systems', 'Prototyping', 'User Research'],
              icon: (
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 19l7-7 3 3-7 7-3-3z"/>
                  <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
                  <path d="M2 2l7.586 7.586"/>
                  <circle cx="11" cy="11" r="2"/>
                </svg>
              ),
              accentColor: '#F59E0B',
              url: '/opportunities?domain=UI%2FUX%20Design'
            }}
          />
        </div>
      </section>

      {/* ─── WHY LUMORA ─── */}
      <section className="mx-auto max-w-7xl px-8 py-16 md:py-16 pb-8 relative" style={{ background: '#050505' }}>
        {/* Linear-style background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Radial gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(241,242,238,0.03)_0%,_transparent_70%)]" />
          
          {/* Noise texture overlay */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
          }} />
          
          {/* Tiny dots pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `radial-gradient(circle, #F1F2EE 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }} />
        </div>

        <div className="max-w-3xl mb-12 relative z-10">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#A0A0A0] mb-2">
            WHY LUMORA
          </h2>
          <h3 className="text-3xl font-semibold tracking-tight text-[#FFFFFF] md:text-4xl">
            More Than Just an Internship Platform
          </h3>
          <p className="text-[14px] text-[#A0A0A0] mt-2 leading-7">
            Lumora helps you build real-world experience through industry projects, expert mentorship, verified opportunities, and a collaborative developer community—so you're ready for your first tech career.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {WHY_LUMORA.map((feature, idx) => (
            <PremiumFeatureCard 
              key={feature.title}
              feature={feature}
              index={idx}
            />
          ))}
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="mx-auto max-w-7xl px-8 py-12 pt-8 relative">
        <div className="absolute inset-0 pointer-events-none">
          <Prism
            animationType="rotate"
            timeScale={0.5}
            height={3.5}
            baseWidth={5.5}
            scale={3.6}
            hueShift={0}
            colorFrequency={0.1}
            noise={0}
            glow={2}
            bloom={1.5}
            transparent={true}
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="rounded-2xl border border-[#252525] bg-[#111111]/50 backdrop-blur-xl p-8 md:p-20 text-center relative overflow-hidden"
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(241,242,238,0.02)]" />
          
          <div className="relative z-10">
            <h3 className="text-4xl md:text-6xl font-light text-[#F1F2EE] mb-6 tracking-tight leading-[1.1]" style={{ fontFamily: 'Georgia, serif' }}>
              Ready to Launch Your Career?
            </h3>
            <p className="mx-auto max-w-xl text-[15px] leading-8 text-[#A8A8A8] mb-10 tracking-wide">
              Join thousands of students currently training and building real projects on Lumora.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-[#F1F2EE] px-10 py-4 text-[14px] font-medium text-[#050505] transition-all hover:bg-[#F1F2EE]/90 hover:scale-[1.02] tracking-wide"
              >
                Get Started
              </Link>
              <Link
                to="/opportunities"
                className="inline-flex items-center gap-2 rounded-full border border-[#2A2A2A] px-10 py-4 text-[14px] font-medium text-[#F1F2EE] transition-all hover:bg-[#1A1A1A]/50 hover:border-[#3A3A3A] hover:scale-[1.02] tracking-wide"
              >
                Browse Opportunities
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── FOOTER ─── */}
      <Footer />
      </div>
    </div>
  );
}
