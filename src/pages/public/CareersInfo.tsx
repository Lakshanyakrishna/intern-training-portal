import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ClickSpark from '../../components/ClickSpark';
import { 
  Compass, 
  Sparkles, 
  Award, 
  Users, 
  ChevronRight, 
  Briefcase 
} from 'lucide-react';

export default function CareersInfo() {
  const highlights = [
    {
      icon: Compass,
      title: 'Work from Anywhere',
      desc: 'We are a fully remote, globally distributed team. Work from wherever you are most productive, set your own schedules, and design a life that works for you.',
      color: '#FFFFFF'
    },
    {
      icon: Sparkles,
      title: 'True Ownership',
      desc: 'No micro-management. Every engineer, designer, and writer owns their features, roadmaps, and systems from design doc to production deployment.',
      color: '#E5E5E5'
    },
    {
      icon: Award,
      title: 'Continuous Learning',
      desc: 'We allocate dedicated budgets for courses, tech books, workspace tools, and conferences. We grow as you grow, with no ceilings.',
      color: '#A3A3A3'
    },
    {
      icon: Users,
      title: 'Mission-Driven Impact',
      desc: 'Directly impact how thousands of students train, build portfolios, and successfully land positions at top tier tech companies globally.',
      color: '#737373'
    }
  ];

  const positions = [
    {
      title: 'Senior Backend Engineer',
      dept: 'Engineering',
      type: 'Remote • Full-Time',
      desc: 'Lead the architecture and development of our core internship simulation engine, scalable event logs, and mentor evaluation APIs.'
    },
    {
      title: 'Product Designer',
      dept: 'Design',
      type: 'Remote • Full-Time',
      desc: 'Craft premium, high-interaction layouts, data dashboards, and interactive learning components that make complex workflows feel seamless.'
    },
    {
      title: 'Growth Marketing Lead',
      dept: 'Operations',
      type: 'Remote • Part-Time',
      desc: 'Drive organic acquisition through developer advocacy, university partnership channels, and structured community hackathons.'
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
          <Link to="/team" className="inline-flex items-center gap-2 text-sm text-[#A8A8A8] hover:text-[#F1F2EE] transition-colors group">
            <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> Back to Team
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
            <Sparkles className="w-3.5 h-3.5" /> Careers at Lumora
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-light tracking-tight mb-6 leading-[1.1]"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Help Us Build the Future of Learning
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-[#A8A8A8] font-light leading-relaxed tracking-wide"
          >
            We are building a platform that bridges the gap between academic theory and production software engineering. Join a team dedicated to elevating the next generation of builders.
          </motion.p>
        </div>

        {/* Highlights Section */}
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
                className="group relative rounded-2xl border border-white/5 bg-[#111114]/50 backdrop-blur-xl p-8 hover:border-white/10 transition-colors overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
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

        {/* Open Positions Detailed Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-2xl border border-white/5 bg-[#111114]/20 p-8 md:p-12 mb-20 relative overflow-hidden"
        >
          <div className="absolute right-0 bottom-0 opacity-[0.01] pointer-events-none">
            <Briefcase className="w-96 h-96" />
          </div>

          <div>
            <h2 className="text-2xl font-light text-white mb-8" style={{ fontFamily: 'Georgia, serif' }}>
              Open Positions (Skeleton Roles)
            </h2>
            <div className="space-y-6">
              {positions.map((pos, idx) => (
                <div key={idx} className="p-6 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-white/10 hover:bg-white/[0.03] transition-colors">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h4 className="text-lg font-semibold text-white">{pos.title}</h4>
                      <span className="px-2 py-0.5 rounded bg-white/5 text-[#F1F2EE] text-xs font-medium border border-white/10">{pos.dept}</span>
                      <span className="px-2 py-0.5 rounded bg-[#1E1E1E] text-[#A3A3A3] text-xs font-medium border border-[#2A2A2A]">{pos.type}</span>
                    </div>
                    <p className="text-sm text-[#A8A8A8] leading-relaxed font-light">{pos.desc}</p>
                  </div>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#F1F2EE] hover:text-white hover:translate-x-1 transition-all shrink-0 align-self-start md:align-self-center"
                  >
                    Apply Now <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
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
            Don't See a Matching Role?
          </h2>
          <p className="text-sm text-[#A8A8A8] max-w-md mx-auto mb-8 relative z-10 leading-relaxed font-light">
            We are always looking for exceptional engineers, product managers, design leaders, and mentors to join our mission. Send us a message!
          </p>
          <div className="relative z-10 flex justify-center">
            <ClickSpark sparkColor="#fff" sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
              <Link
                to="/contact"
                className="bg-[#F1F2EE] hover:bg-[#C6CAC9] text-[#050505] font-semibold px-8 py-3.5 rounded-full text-sm flex items-center gap-2 transition-transform hover:scale-[1.02]"
              >
                Get in Touch <ChevronRight className="w-4 h-4" />
              </Link>
            </ClickSpark>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
