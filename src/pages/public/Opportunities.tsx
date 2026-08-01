import { useState } from 'react';
import { Link } from 'react-router-dom';
import Ferrofluid from '../../components/Ferrofluid';
import Header from '../../components/Header';
import IntroLogo from '../../components/IntroLogo';
import {
  Bell, ChevronDown, Bookmark, GitCompare, Share, MapPin, DollarSign,
  Clock, Zap, CheckCircle2, ChevronUp, ChevronRight, Terminal,
  Layout, Database, Smartphone, PenTool, Brain, Search, Briefcase,
  Code, Heart, MessageSquare, Lightbulb, Puzzle, ShieldCheck, Users,
  Mail, Star
} from 'lucide-react';

const BROWSE_BY_FORTE = [
  {
    title: 'Frontend Development',
    color: '#3b82f6',
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
    color: '#a855f7',
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
    color: '#ec4899',
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
    color: '#22c55e',
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
    color: '#f97316',
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
    color: '#14b8a6',
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

export default function Opportunities() {
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
        
        {/* HERO SECTION */}
        <section className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
          <div className="max-w-2xl">
            <p className="text-blue-500 font-semibold tracking-wider text-sm mb-4 uppercase">Careers at Lumora</p>
            <h1 className="text-6xl sm:text-8xl font-bold leading-[0.9] tracking-tight mb-6">
              OPEN<br />ROLES
            </h1>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-xl">
              No live opportunities yet. This page goes live the moment an admin posts the first one — screened, structured, ready to apply to.
            </p>
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
              <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Open to students & recent grads</span>
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Remote-friendly</span>
              <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Transparent process</span>
            </div>
          </div>
          <div className="flex flex-col items-start lg:items-end gap-3">
            <p className="text-sm text-gray-400">Be the first to know when a role opens</p>
            <Link to="/signup" className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform">
              Get notified <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* STATS BAR */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { icon: Briefcase, title: '6', sub: 'Domains open for hiring' },
            { icon: Clock, title: 'Cohort 01', sub: 'Launching soon' },
            { icon: MapPin, title: '100%', sub: 'Remote-friendly' },
            { icon: Users, title: '10+', sub: 'Mentors & Experts' },
            { icon: Heart, title: 'Transparent', sub: 'No ghosting. Ever.' }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col gap-2 p-5 rounded-2xl border border-white/10 bg-[#111114]">
              <stat.icon className="w-5 h-5 text-gray-400" />
              <div>
                <h3 className="text-lg font-semibold">{stat.title}</h3>
                <p className="text-xs text-gray-500">{stat.sub}</p>
              </div>
            </div>
          ))}
        </section>

        {/* SEARCH & FILTERS */}
        <section className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
            <div className="flex-1 flex flex-wrap items-center gap-3 w-full">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="text" placeholder="Search opportunities..." className="w-full bg-[#111114] border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-white/30" />
              </div>
              <div className="flex flex-wrap gap-2">
                {['All', 'Frontend', 'Backend', 'UI/UX', 'Agentic AI', 'Mobile', 'Data & Analytics'].map((pill, i) => (
                  <button key={pill} className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${i === 0 ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-[#111114] border-white/10 text-gray-400 hover:border-white/30'}`}>
                    {pill}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                Sort by: <span className="text-white flex items-center">Newest <ChevronDown className="w-4 h-4 ml-1" /></span>
              </div>
              <div className="flex items-center gap-3 border-l border-white/10 pl-4">
                <Bookmark className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
                <GitCompare className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
                <Share className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
            {['Remote', 'Hybrid', 'Paid', 'Unpaid', 'Internship', 'Full-Time'].map((pill) => (
              <button key={pill} className="px-4 py-1.5 rounded-full text-xs bg-transparent border border-white/10 text-gray-400 flex items-center gap-1 hover:border-white/30">
                {pill === 'Remote' || pill === 'Hybrid' ? <MapPin className="w-3 h-3" /> : pill === 'Paid' || pill === 'Unpaid' ? <DollarSign className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
                {pill}
              </button>
            ))}
            <button className="px-4 py-1.5 rounded-full text-xs bg-transparent border border-white/10 text-gray-400 flex items-center hover:border-white/30">
              More <ChevronDown className="w-3 h-3 ml-1" />
            </button>
          </div>
        </section>

        {/* FEATURED OPPORTUNITY */}
        <section className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-64 shrink-0">
            <h2 className="text-xl font-semibold mb-2">0 Opportunities Available</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              We'll notify you when new opportunities are posted.
            </p>
          </div>
          <div className="flex-1 rounded-2xl border border-blue-500/30 bg-[#111114] p-6 lg:p-8 relative overflow-hidden flex flex-col lg:flex-row justify-between items-start gap-6 shadow-[0_0_40px_rgba(59,130,246,0.1)] group">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-600/10 to-transparent pointer-events-none" />
            <div className="relative z-10 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold border border-blue-500/30">
                <Star className="w-3 h-3 fill-current" /> Featured Opportunity
              </span>
              <h3 className="text-2xl font-bold">Frontend Developer Intern</h3>
              <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Remote</span>
                <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> Paid</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 3 Months</span>
                <span className="flex items-center gap-1 text-blue-400"><Zap className="w-3 h-3" /> Hiring Immediately</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {['React', 'Next.js', 'TypeScript', 'Tailwind CSS'].map(tech => (
                  <span key={tech} className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-xs text-gray-300">{tech}</span>
                ))}
              </div>
            </div>
            <div className="relative z-10 flex flex-col items-end gap-3 shrink-0">
              <p className="text-xs text-gray-400">Apply before</p>
              <p className="text-sm flex items-center gap-2"><Clock className="w-4 h-4 text-gray-500" /> Aug 20, 2026</p>
              <p className="text-sm flex items-center gap-2"><Users className="w-4 h-4 text-gray-500" /> 58 Applicants</p>
              <button className="mt-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
                Apply Now <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
              <Code className="w-32 h-32 text-blue-500" />
            </div>
          </div>
        </section>

        {/* RECOMMENDED */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-500" /> Recommended For You</h2>
              <p className="text-sm text-gray-500 mt-1">Based on your interests and profile.</p>
            </div>
            <button className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
              View all recommendations <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { t: 'Frontend Developer', sub: 'React • Remote • Paid', match: 'React' },
              { t: 'Backend Developer', sub: 'Node.js • API • Remote', match: 'backend' },
              { t: 'Agentic AI Intern', sub: 'Python • LLMs • Remote', match: 'AI' }
            ].map((r, i) => (
              <div key={i} className="p-5 rounded-xl bg-[#111114] border border-white/10 flex flex-col justify-between group hover:border-white/20 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-white/5 rounded-lg"><Terminal className="w-5 h-5 text-gray-400" /></div>
                  <span className="text-[10px] uppercase bg-white/10 px-2 py-0.5 rounded-full text-gray-400">Coming Soon</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">{r.t}</h4>
                  <p className="text-xs text-gray-500 mb-4">{r.sub}</p>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">Matches your {r.match} interest</span>
                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* BROWSE BY FORTE */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-xl font-semibold">Browse by forte</h2>
              <p className="text-sm text-gray-500 mt-1">The tracks Lumora is hiring for first.</p>
            </div>
            <button className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
              View all tracks <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {BROWSE_BY_FORTE.map((f, i) => (
              <div key={i} className="p-6 rounded-2xl bg-[#111114] border transition-colors hover:bg-[#151518]" style={{ borderColor: `${f.color}30` }}>
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 rounded-xl" style={{ backgroundColor: `${f.color}15`, color: f.color }}>
                    <f.icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase bg-white/5 px-2 py-0.5 rounded-full text-gray-400 border border-white/10">Coming Soon</span>
                    <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 cursor-pointer" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-xs text-gray-400 mb-6 h-8">{f.desc}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {f.chips.map(chip => (
                    <span key={chip} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[11px] text-gray-300">{chip}</span>
                  ))}
                </div>
                <div className="flex gap-4 text-xs text-gray-500 mb-6 border-b border-white/5 pb-6">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {f.remote}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {f.duration}</span>
                  <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {f.paid}</span>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-semibold px-2 py-1 rounded" style={{ backgroundColor: `${f.color}15`, color: f.color }}>{f.level}</span>
                  <span className="text-xs flex items-center gap-1 text-gray-500"><Users className="w-3 h-3" /> {f.applicants} Applicants</span>
                </div>
                <button className="w-full py-2.5 rounded-lg border text-sm font-semibold flex justify-center items-center gap-2 hover:bg-white/5 transition-colors" style={{ borderColor: `${f.color}50`, color: f.color }}>
                  View Details <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* PROGRESS & WHAT WE LOOK FOR */}
        <section className="grid lg:grid-cols-[1fr_2.5fr] gap-12 lg:gap-20 bg-[#111114] p-8 lg:p-12 rounded-3xl border border-white/10">
          <div>
            <h2 className="text-lg font-semibold mb-2">Portal Progress</h2>
            <p className="text-sm text-gray-400 mb-8">We're working hard to bring you the best opportunities.</p>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-green-500 before:via-blue-500 before:to-gray-800">
              <div className="relative flex items-center gap-4">
                <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center shrink-0 z-10 shadow-[0_0_10px_rgba(34,197,94,0.4)]"><CheckCircle2 className="w-4 h-4 text-white" /></div>
                <div><p className="text-sm font-medium">Domains Finalized</p><p className="text-xs text-green-500">Completed</p></div>
              </div>
              <div className="relative flex items-center gap-4">
                <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center shrink-0 z-10 shadow-[0_0_10px_rgba(34,197,94,0.4)]"><CheckCircle2 className="w-4 h-4 text-white" /></div>
                <div><p className="text-sm font-medium">Career Portal Ready</p><p className="text-xs text-green-500">Completed</p></div>
              </div>
              <div className="relative flex items-center gap-4">
                <div className="h-6 w-6 rounded-full bg-blue-500 border-4 border-[#111114] flex items-center justify-center shrink-0 z-10 shadow-[0_0_10px_rgba(59,130,246,0.4)]" />
                <div><p className="text-sm font-medium text-blue-400">Opportunities Publishing</p><p className="text-xs text-blue-500">In progress</p></div>
              </div>
              <div className="relative flex items-center gap-4">
                <div className="h-6 w-6 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center shrink-0 z-10" />
                <div><p className="text-sm font-medium text-gray-500">Applications Open</p><p className="text-xs text-gray-600">Upcoming</p></div>
              </div>
            </div>
            <div className="mt-12">
              <p className="text-xs text-gray-500 mb-1">Expected launch in</p>
              <p className="text-4xl font-bold text-blue-400">18 <span className="text-xl text-gray-400 font-normal">Days</span></p>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-8">What We Look For</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {[
                { icon: Lightbulb, title: 'Curiosity & willingness to learn', desc: 'You love exploring new things and ask questions.', color: 'text-yellow-500' },
                { icon: Puzzle, title: 'Strong problem-solving', desc: 'You break problems down and find smart solutions.', color: 'text-purple-500' },
                { icon: MessageSquare, title: 'Good communication', desc: 'You express ideas clearly and listen actively.', color: 'text-green-500' },
                { icon: ShieldCheck, title: 'Ownership & accountability', desc: 'You take initiative and own your work.', color: 'text-orange-500' },
                { icon: Users, title: 'Team collaboration', desc: 'You enjoy working together and lifting others up.', color: 'text-blue-500' }
              ].map((w, i) => (
                <div key={i}>
                  <w.icon className={`w-8 h-8 mb-4 ${w.color}`} />
                  <h3 className="font-semibold text-sm mb-2">{w.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{w.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MENTORS */}
        <section className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[
              { init: 'RA', name: 'Rahul Arora', role: 'Frontend Mentor', c: 'bg-blue-600' },
              { init: 'AK', name: 'Akhil Varma', role: 'Backend Mentor', c: 'bg-purple-600' },
              { init: 'SN', name: 'Sneha Nair', role: 'AI Mentor', c: 'bg-green-600' },
              { init: 'PD', name: 'Priya Desai', role: 'Design Mentor', c: 'bg-pink-600' },
              { init: 'YG', name: 'Yash Gupta', role: 'Data Mentor', c: 'bg-teal-600' }
            ].map((m, i) => (
              <div key={i} className="bg-[#111114] p-5 rounded-2xl border border-white/10 flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-full ${m.c} flex items-center justify-center font-bold mb-4 shadow-lg`}>{m.init}</div>
                <h4 className="font-semibold text-sm">{m.name}</h4>
                <p className="text-[11px] text-gray-400 mt-1">{m.role}</p>
              </div>
            ))}
          </div>
          <div className="w-full lg:w-72 bg-[#111114] p-6 rounded-2xl border border-white/10 flex flex-col justify-between shrink-0">
            <div>
              <h4 className="text-xs text-gray-400 uppercase tracking-wider mb-4">What Our Interns Say</h4>
              <p className="text-sm italic text-gray-300 leading-relaxed">"Lumora gave me real projects, amazing mentors, and the confidence to build for the real world."</p>
              <p className="text-xs text-gray-400 mt-4">— Priya Sharma<br/>Frontend Intern, Cohort 0</p>
            </div>
            <div className="flex gap-1.5 mt-6">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <div className="w-2 h-2 rounded-full bg-gray-600" />
              <div className="w-2 h-2 rounded-full bg-gray-600" />
              <div className="w-2 h-2 rounded-full bg-gray-600" />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-semibold mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-4 lg:gap-8">
            <div className="space-y-4">
              {FAQS.slice(0,3).map((faq, i) => (
                <div key={i} className="border-b border-white/10 pb-4">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex justify-between items-center text-left text-sm font-medium hover:text-blue-400 transition-colors">
                    {faq.q}
                    {openFaq === i ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                  </button>
                  {openFaq === i && <p className="mt-3 text-xs text-gray-400 leading-relaxed">{faq.a}</p>}
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {FAQS.slice(3,6).map((faq, i) => (
                <div key={i+3} className="border-b border-white/10 pb-4">
                  <button onClick={() => setOpenFaq(openFaq === i+3 ? null : i+3)} className="w-full flex justify-between items-center text-left text-sm font-medium hover:text-blue-400 transition-colors">
                    {faq.q}
                    {openFaq === i+3 ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                  </button>
                  {openFaq === i+3 && <p className="mt-3 text-xs text-gray-400 leading-relaxed">{faq.a}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BANNER */}
        <section className="bg-gradient-to-r from-purple-900/40 to-[#111114] border border-purple-500/20 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
          <div className="relative z-10 flex items-center gap-6">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
              <Bell className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-1">Didn't find a matching role?</h2>
              <p className="text-sm text-gray-400">Get notified when internships matching your skills become available.</p>
            </div>
          </div>
          <button className="relative z-10 bg-white text-black px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-2 hover:scale-105 transition-transform shrink-0">
            Notify Me <ChevronRight className="w-4 h-4" />
          </button>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/40 via-transparent to-transparent" />
        </section>

        {/* HOW IT WORKS */}
        <section className="flex flex-col lg:flex-row justify-between items-center gap-12 border-t border-white/10 pt-16">
          <div className="flex-1 flex flex-col md:flex-row items-center gap-8 md:gap-4 w-full">
            <h3 className="font-semibold text-lg whitespace-nowrap">How it works</h3>
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
              {[
                { num: '01', t: 'Apply', sub: 'Submit your application in minutes.' },
                { num: '02', t: 'Screen', sub: 'We review and shortlist the best matches.' },
                { num: '03', t: 'Interview', sub: 'Connect with the team and showcase your skills.' },
                { num: '04', t: 'Onboard', sub: 'Complete the process and start building.' }
              ].map(step => (
                <div key={step.num}>
                  <div className="text-2xl font-light text-blue-500 mb-2">{step.num}</div>
                  <h4 className="font-medium text-sm mb-1">{step.t}</h4>
                  <p className="text-[11px] text-gray-500">{step.sub}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="shrink-0 bg-[#111114] p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center gap-6">
            <p className="text-sm text-gray-400">Not ready to apply? Get notified when we post.</p>
            <button className="bg-white text-black px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1 hover:scale-105 transition-transform">
              Get notified <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 bg-black py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 text-white"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div>
            <span className="font-bold text-lg tracking-tight">Lumora</span>
          </div>
          <div className="text-xs text-gray-500">
            © 2026 Lumora. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-xs text-gray-400">
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
    </div>
  );
}
