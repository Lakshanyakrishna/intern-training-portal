import { useRef } from 'react';
import { motion, useInView, useMotionValue } from 'motion/react';
import Header from '../../components/Header';
import IntroLogo from '../../components/IntroLogo';
import Ferrofluid from '../../components/Ferrofluid';
import './Team.css';

// ─── SVG Icons ─────────────────────────────────────
const LinkedinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08 1.25-.27 2.48-1 3.5.28 1.15.28 2.35 0 3.5A8 8 0 0 0 3.2 20.1c-.46.7-.2 1.55.5 1.9.7.35 1.55.2 1.9-.5A6 6 0 0 1 8 21c1.6.2 3.2.2 4.8 0" />
    <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2s-1 2.5-3 3.4c1.3 2.4 4 4 7 4" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

// ─── Team Data ─────────────────────────────────────
const LEADERSHIP = [
  {
    name: 'Aarav Sharma',
    role: 'Founder & CEO',
    bio: 'Building an ecosystem where students gain real-world experience before graduation.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    social: { linkedin: '#', github: '#', twitter: '#' }
  },
  {
    name: 'Priya Patel',
    role: 'CTO',
    bio: 'Architecting scalable systems that power the next generation of career platforms.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    social: { linkedin: '#', github: '#', twitter: '#' }
  },
  {
    name: 'Rahul Mehta',
    role: 'Head of Design',
    bio: 'Crafting intuitive experiences that make complex systems feel effortless.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    social: { linkedin: '#', github: '#', twitter: '#' }
  },
  {
    name: 'Sneha Gupta',
    role: 'VP of Engineering',
    bio: 'Leading engineering teams to build products that scale to millions of users.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    social: { linkedin: '#', github: '#', twitter: '#' }
  }
];

const ENGINEERING = [
  {
    name: 'Arjun Singh',
    role: 'Senior Frontend Engineer',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    techStack: ['React', 'Next.js', 'TypeScript'],
    projects: ['Internship Portal', 'Dashboard']
  },
  {
    name: 'Kavya Reddy',
    role: 'Backend Engineer',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    techStack: ['Node.js', 'PostgreSQL', 'Redis'],
    projects: ['API Gateway', 'Auth System']
  },
  {
    name: 'Vikram Joshi',
    role: 'AI/ML Engineer',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    techStack: ['Python', 'TensorFlow', 'OpenAI'],
    projects: ['Recommendation Engine', 'Resume Parser']
  },
  {
    name: 'Ananya Desai',
    role: 'Full Stack Developer',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    techStack: ['React', 'Node.js', 'AWS'],
    projects: ['LMS Platform', 'Analytics']
  }
];

const MENTORS = [
  {
    name: 'Dr. Rajesh Kumar',
    position: 'Principal Engineer',
    company: 'Google',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    yearsExperience: 15,
    expertise: ['System Design', 'Cloud Architecture', 'Leadership'],
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop'
  },
  {
    name: 'Sarah Chen',
    position: 'Staff Engineer',
    company: 'Meta',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
    yearsExperience: 12,
    expertise: ['Frontend Architecture', 'Performance', 'React'],
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop'
  },
  {
    name: 'Michael Foster',
    position: 'Engineering Manager',
    company: 'Stripe',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg',
    yearsExperience: 10,
    expertise: ['Payments', 'API Design', 'Team Building'],
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop'
  }
];

const QUOTES = [
  '"We believe learning happens by building."',
  '"Every internship should create real impact."',
  '"The best way to learn is by doing."'
];

// ─── Components ─────────────────────────────────────

const LeadershipCard = ({ member, index }: { member: typeof LEADERSHIP[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      className="leadership-card group relative rounded-3xl overflow-hidden"
    >
      {/* Mouse spotlight */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(241, 242, 238, 0.06), transparent 40%)`
        }}
      />

      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <motion.img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative p-6 bg-[#0A0A0A]/80 backdrop-blur-xl border-t border-[#2A2A2A]">
        <h3 className="text-xl font-light text-[#F1F2EE] mb-1">{member.name}</h3>
        <p className="text-[#9AA1A3] text-sm mb-3">{member.role}</p>
        <p className="text-[#6D777C] text-sm leading-relaxed mb-4 line-clamp-2">{member.bio}</p>

        {/* Social Icons */}
        <div className="flex gap-3 mb-4">
          <motion.a
            href={member.social.linkedin}
            className="text-[#9AA1A3] hover:text-[#F1F2EE] transition-colors"
            whileHover={{ y: -3 }}
          >
            <LinkedinIcon />
          </motion.a>
          <motion.a
            href={member.social.github}
            className="text-[#9AA1A3] hover:text-[#F1F2EE] transition-colors"
            whileHover={{ y: -3 }}
          >
            <GithubIcon />
          </motion.a>
          <motion.a
            href={member.social.twitter}
            className="text-[#9AA1A3] hover:text-[#F1F2EE] transition-colors"
            whileHover={{ y: -3 }}
          >
            <TwitterIcon />
          </motion.a>
        </div>

        {/* View Profile Button */}
        <motion.button
          className="w-full py-2.5 rounded-xl border border-[#2A2A2A] text-[#F1F2EE] text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#1A1A1A] hover:border-[#3A3A3A]"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          View Profile →
        </motion.button>
      </div>

      {/* Border Glow */}
      <motion.div
        className="absolute inset-0 rounded-3xl border border-[#2A2A2A] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: '0 0 30px rgba(241, 242, 238, 0.1)'
        }}
      />
    </motion.div>
  );
};

const EngineeringCard = ({ member, index }: { member: typeof ENGINEERING[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="engineering-card group relative rounded-2xl p-6 bg-[#0A0A0A]/60 backdrop-blur-xl border border-[#2A2A2A] hover:border-[#3A3A3A] transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <motion.img
          src={member.image}
          alt={member.name}
          className="w-16 h-16 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          whileHover={{ scale: 1.05 }}
        />
        <div className="flex-1">
          <h3 className="text-[#F1F2EE] font-light mb-2">{member.name}</h3>
          <p className="text-[#9AA1A3] text-sm mb-3">{member.role}</p>
          <div className="flex flex-wrap gap-2">
            {member.techStack.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded-md bg-[#1A1A1A] border border-[#2A2A2A] text-[#9AA1A3] text-xs"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Currently Building - Reveal on Hover */}
      <motion.div
        className="mt-4 pt-4 border-t border-[#2A2A2A] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={{ height: 0 }}
        whileHover={{ height: 'auto' }}
      >
        <p className="text-[#6D777C] text-xs mb-2">Currently Building</p>
        <ul className="space-y-1">
          {member.projects.map((project) => (
            <li key={project} className="text-[#9AA1A3] text-sm flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#F1F2EE]" />
              {project}
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
};

const MentorCard = ({ mentor, index }: { mentor: typeof MENTORS[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="mentor-card group relative rounded-2xl p-6 bg-[#0A0A0A]/60 backdrop-blur-xl border border-[#2A2A2A] hover:border-[#3A3A3A] transition-all duration-300"
    >
      <div className="flex items-center gap-6">
        <motion.img
          src={mentor.image}
          alt={mentor.name}
          className="w-20 h-20 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          whileHover={{ scale: 1.05 }}
        />
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <img src={mentor.companyLogo} alt={mentor.company} className="h-6 opacity-70" />
          </div>
          <h3 className="text-[#F1F2EE] font-light mb-1">{mentor.name}</h3>
          <p className="text-[#9AA1A3] text-sm">{mentor.position}</p>
          <p className="text-[#6D777C] text-xs mt-1">{mentor.company} • {mentor.yearsExperience}+ years</p>
        </div>
      </div>

      {/* Expertise Pills */}
      <div className="flex flex-wrap gap-2 mt-4">
        {mentor.expertise.map((skill) => (
          <span
            key={skill}
            className="px-2.5 py-1 rounded-md bg-[#1A1A1A] border border-[#2A2A2A] text-[#9AA1A3] text-xs"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Book Mentor Button - Reveal on Hover */}
      <motion.button
        className="mt-4 w-full py-2.5 rounded-xl border border-[#2A2A2A] text-[#F1F2EE] text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#1A1A1A] hover:border-[#3A3A3A] flex items-center justify-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Book Mentor <ArrowRightIcon />
      </motion.button>
    </motion.div>
  );
};

const QuoteCard = ({ quote }: { quote: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="quote-card relative rounded-2xl p-8 bg-[#0A0A0A]/40 backdrop-blur-xl border border-[#2A2A2A]"
      style={{
        animation: `float 6s ease-in-out infinite`
      }}
    >
      <p className="text-[#F1F2EE] text-lg font-light leading-relaxed italic">{quote}</p>
    </motion.div>
  );
};

// ─── Main Component ─────────────────────────────────
export default function Team() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#F1F2EE] relative">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Ferrofluid
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
          className="w-full h-full"
        />
      </div>

      <div className="relative z-10">
        <IntroLogo animate={false} />
        <Header />

        {/* ─── HERO SECTION ─── */}
        <section className="mx-auto max-w-7xl px-8 pt-32 pb-20 md:pt-40 md:pb-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 rounded-full border border-[#2A2A2A] bg-[#0A0A0A]/50 backdrop-blur-xl text-[#9AA1A3] text-[11px] font-semibold uppercase tracking-[0.2em] mb-6">
              OUR TEAM
            </span>
            <h1 
              className="text-[#F1F2EE] mb-6 tracking-tight leading-[1.04]"
              style={{ 
                fontFamily: 'Inter, -apple-system, Segoe UI, sans-serif',
                fontSize: 'clamp(32px, 5vw, 64px)',
                letterSpacing: '-0.02em',
                fontWeight: 300
              }}
            >
              Meet the Builders Behind Lumora
            </h1>
            <p className="mx-auto max-w-2xl text-[15px] leading-8 text-[#9AA1A3]" style={{ fontFamily: 'Inter, -apple-system, Segoe UI, sans-serif' }}>
              A passionate team of engineers, designers, mentors, and innovators building the future of internship-based learning.
            </p>
          </motion.div>
        </section>

        {/* ─── LEADERSHIP GRID ─── */}
        <section className="mx-auto max-w-7xl px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 
              className="text-[#F1F2EE] mb-4 tracking-tight"
              style={{ 
                fontFamily: 'Inter, -apple-system, Segoe UI, sans-serif',
                fontSize: 'clamp(28px, 4vw, 48px)',
                letterSpacing: '-0.02em',
                fontWeight: 300
              }}
            >
              Leadership
            </h2>
            <p className="text-[#9AA1A3]" style={{ fontFamily: 'Inter, -apple-system, Segoe UI, sans-serif' }}>The visionaries driving our mission forward.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {LEADERSHIP.map((member, index) => (
              <LeadershipCard key={member.name} member={member} index={index} />
            ))}
          </div>
        </section>

        {/* ─── ENGINEERING TEAM ─── */}
        <section className="mx-auto max-w-7xl px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 
              className="text-[#F1F2EE] mb-4 tracking-tight"
              style={{ 
                fontFamily: 'Inter, -apple-system, Segoe UI, sans-serif',
                fontSize: 'clamp(28px, 4vw, 48px)',
                letterSpacing: '-0.02em',
                fontWeight: 300
              }}
            >
              Engineering Team
            </h2>
            <p className="text-[#9AA1A3]" style={{ fontFamily: 'Inter, -apple-system, Segoe UI, sans-serif' }}>The builders crafting our platform.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ENGINEERING.map((member, index) => (
              <EngineeringCard key={member.name} member={member} index={index} />
            ))}
          </div>
        </section>

        {/* ─── MENTORS SECTION ─── */}
        <section className="mx-auto max-w-7xl px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 
              className="text-[#F1F2EE] mb-4 tracking-tight"
              style={{ 
                fontFamily: 'Inter, -apple-system, Segoe UI, sans-serif',
                fontSize: 'clamp(28px, 4vw, 48px)',
                letterSpacing: '-0.02em',
                fontWeight: 300
              }}
            >
              Industry Mentors
            </h2>
            <p className="text-[#9AA1A3]" style={{ fontFamily: 'Inter, -apple-system, Segoe UI, sans-serif' }}>Experts guiding the next generation.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MENTORS.map((mentor, index) => (
              <MentorCard key={mentor.name} mentor={mentor} index={index} />
            ))}
          </div>
        </section>

        {/* ─── CULTURE SECTION ─── */}
        <section className="mx-auto max-w-7xl px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 
              className="text-[#F1F2EE] mb-4 tracking-tight"
              style={{ 
                fontFamily: 'Inter, -apple-system, Segoe UI, sans-serif',
                fontSize: 'clamp(28px, 4vw, 48px)',
                letterSpacing: '-0.02em',
                fontWeight: 300
              }}
            >
              Our Culture
            </h2>
            <p className="text-[#9AA1A3]" style={{ fontFamily: 'Inter, -apple-system, Segoe UI, sans-serif' }}>The values that drive us.</p>
          </motion.div>

          <div className="relative h-96 rounded-3xl overflow-hidden mb-8">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=400&fit=crop"
              alt="Team culture"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {QUOTES.map((quote) => (
              <QuoteCard key={quote} quote={quote} />
            ))}
          </div>
        </section>

        {/* ─── CTA SECTION ─── */}
        <section className="mx-auto max-w-7xl px-8 py-20 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-[#2A2A2A] bg-[#0A0A0A]/40 backdrop-blur-xl p-12 md:p-20 text-center"
          >
            <h2 
              className="text-[#F1F2EE] mb-4 tracking-tight"
              style={{ 
                fontFamily: 'Inter, -apple-system, Segoe UI, sans-serif',
                fontSize: 'clamp(32px, 5vw, 56px)',
                letterSpacing: '-0.02em',
                fontWeight: 300
              }}
            >
              Want to Build Lumora With Us?
            </h2>
            <p className="mx-auto max-w-xl text-[15px] leading-8 text-[#9AA1A3] mb-8" style={{ fontFamily: 'Inter, -apple-system, Segoe UI, sans-serif' }}>
              Join our mission to transform how students launch their careers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 rounded-full bg-[#F1F2EE] text-[#050505] font-light hover:bg-[#F1F2EE]/90 transition-all hover:scale-[1.02]" style={{ fontFamily: 'Inter, -apple-system, Segoe UI, sans-serif' }}>
                Join Our Team
              </button>
              <button className="px-8 py-4 rounded-full border border-[#2A2A2A] text-[#F1F2EE] font-light hover:bg-[#1A1A1A]/50 hover:border-[#3A3A3A] transition-all hover:scale-[1.02]" style={{ fontFamily: 'Inter, -apple-system, Segoe UI, sans-serif' }}>
                Contact Us
              </button>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}

