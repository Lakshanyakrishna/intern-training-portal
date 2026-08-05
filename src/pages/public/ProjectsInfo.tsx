import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ClickSpark from '../../components/ClickSpark';
import { 
  Terminal, 
  Cpu, 
  Layers, 
  GitBranch, 
  ChevronRight, 
  Sparkles, 
  Workflow 
} from 'lucide-react';

export default function ProjectsInfo() {
  const highlights = [
    {
      icon: Terminal,
      title: 'Production Codebases',
      desc: 'Work on actual repositories that are deployed to production. Learn real-world coding standards, branch management, and system design patterns.',
      color: '#FFFFFF'
    },
    {
      icon: Cpu,
      title: 'Modern AI-Assisted Workflows',
      desc: 'Utilize cursor-guided systems, LLMs, and agentic workflows to increase development efficiency, write tests, and document features at scale.',
      color: '#E5E5E5'
    },
    {
      icon: GitBranch,
      title: 'CI/CD & Advanced Testing',
      desc: 'Set up pipelines, handle automated testing suites, perform static code analysis, and learn how feature gating works in production.',
      color: '#A3A3A3'
    },
    {
      icon: Layers,
      title: 'Full-Stack Architecture',
      desc: 'Build features from database schema migrations to responsive frontend interfaces using PostgreSQL, Supabase, Node.js, and React.',
      color: '#737373'
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#F1F2EE] font-sans selection:bg-white/10 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_65%)]" />
        <div className="absolute top-[20%] -right-[30%] w-[90%] h-[90%] rounded-full bg-[radial-gradient(circle_at_center,rgba(154,161,163,0.02)_0%,transparent_60%)]" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle, #F1F2EE 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <Header />

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-24 md:pt-40">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-[#A8A8A8] hover:text-[#F1F2EE] transition-colors group">
            <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> Back to Home
          </Link>
        </motion.div>

        {/* Hero Section */}
        <div className="max-w-3xl mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-[#F1F2EE] text-xs font-semibold border border-white/10 mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" /> Feature Insight
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-light tracking-tight mb-6 leading-[1.1]"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Real Industry Projects
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-[#A8A8A8] font-light leading-relaxed tracking-wide"
          >
            Gain production-ready experience by contributing to real codebases, solving complex technical challenges, and building a high-impact developer profile.
          </motion.p>
        </div>

        {/* Interactive Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.1 }}
                whileHover={{ y: -8, borderColor: 'rgba(255, 255, 255, 0.15)' }}
                className="group relative rounded-2xl border border-white/5 bg-[#111114]/50 backdrop-blur-xl p-8 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300"
                  style={{ backgroundColor: `${item.color}15`, color: item.color }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium mb-3 text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-[#A8A8A8] font-light">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Informative Detailed Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-2xl border border-white/5 bg-[#111114]/20 p-8 md:p-12 mb-20 relative overflow-hidden"
        >
          <div className="absolute right-0 bottom-0 opacity-[0.02] pointer-events-none">
            <Workflow className="w-96 h-96" />
          </div>

          <div className="max-w-2xl">
            <h2 className="text-2xl font-light text-white mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              How You Collaborate
            </h2>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#10B981]/10 text-[#10B981] flex items-center justify-center text-sm font-semibold shrink-0">1</div>
                <div>
                  <h4 className="font-semibold text-white text-sm mb-1">Pick a Ticket</h4>
                  <p className="text-xs text-[#A8A8A8] leading-relaxed font-light">Select from open tasks on our tickets board matching your track. Tasks include UI creation, API developments, test suites, and schema optimizations.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center text-sm font-semibold shrink-0">2</div>
                <div>
                  <h4 className="font-semibold text-white text-sm mb-1">Development & Linting</h4>
                  <p className="text-xs text-[#A8A8A8] leading-relaxed font-light">Develop locally or inside online sandboxes. Your code is checked against strict ESLint rules, TypeScript compile standards, and security controls.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center text-sm font-semibold shrink-0">3</div>
                <div>
                  <h4 className="font-semibold text-white text-sm mb-1">Pull Request & Mentor Review</h4>
                  <p className="text-xs text-[#A8A8A8] leading-relaxed font-light">Submit your pull request. Real senior developers review your changes, giving code quality pointers and architecture advice before approving.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center bg-gradient-to-b from-[#111114] to-[#070709] border border-white/5 rounded-3xl p-12 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
          <h2 className="text-3xl font-light text-white mb-4 relative z-10" style={{ fontFamily: 'Georgia, serif' }}>
            Ready to Build Real Software?
          </h2>
          <p className="text-sm text-[#A8A8A8] max-w-md mx-auto mb-8 relative z-10 leading-relaxed font-light">
            Skip simple tutorials and build things that scale. Apply for our Frontend Developer Internship program today.
          </p>
          <div className="relative z-10 flex justify-center">
            <ClickSpark sparkColor="#fff" sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
              <Link
                to="/apply/frontend-developer-intern"
                className="bg-[#F1F2EE] hover:bg-[#C6CAC9] text-[#050505] font-semibold px-8 py-3.5 rounded-full text-sm flex items-center gap-2 transition-transform hover:scale-[1.02]"
              >
                Apply Now <ChevronRight className="w-4 h-4" />
              </Link>
            </ClickSpark>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
