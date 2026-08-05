import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ClickSpark from '../../components/ClickSpark';
import { 
  Users, 
  Sparkles, 
  Compass, 
  MessagesSquare, 
  ChevronRight, 
  Briefcase 
} from 'lucide-react';

export default function CommunityInfo() {
  const highlights = [
    {
      icon: Users,
      title: 'Collaborative Hackathons',
      desc: 'Team up with peers to build production-grade features, solve complex bugs, and showcase your work in regular live demonstrations.',
      color: '#FFFFFF'
    },
    {
      icon: Sparkles,
      title: 'Peer Code Reviews',
      desc: 'Learn by reviewing other students\' code and getting your own work reviewed. Build high coding standards together as a community.',
      color: '#E5E5E5'
    },
    {
      icon: Compass,
      title: 'Shared Knowledge Base',
      desc: 'Access collective resources, tutorials, configuration guides, and tips built by fellow interns and mentors.',
      color: '#A3A3A3'
    },
    {
      icon: MessagesSquare,
      title: 'Active Slack & Forums',
      desc: 'Join dedicated discussion channels to debug errors, discuss architecture, organize study groups, or chat with mentors.',
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
            Global Developer Community
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-[#A8A8A8] font-light leading-relaxed tracking-wide"
          >
            Connect with ambitious students, collaborate on projects, join hackathons, and grow alongside like-minded builders. Learn together, build together.
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
          <div className="absolute right-0 bottom-0 opacity-[0.01] pointer-events-none">
            <Briefcase className="w-96 h-96" />
          </div>

          <div className="max-w-2xl">
            <h2 className="text-2xl font-light text-white mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              How to Get Involved
            </h2>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-white/5 text-[#F1F2EE] flex items-center justify-center text-sm font-semibold border border-white/10 shrink-0">1</div>
                <div>
                  <h4 className="font-semibold text-white text-sm mb-1">Join the Community Chat</h4>
                  <p className="text-xs text-[#A8A8A8] leading-relaxed font-light">Jump into our Slack channels and introduce yourself. Chat with other builders working on similar tracks and exchange feedback.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-white/5 text-[#F1F2EE] flex items-center justify-center text-sm font-semibold border border-white/10 shrink-0">2</div>
                <div>
                  <h4 className="font-semibold text-white text-sm mb-1">Form a Team</h4>
                  <p className="text-xs text-[#A8A8A8] leading-relaxed font-light">Collaborate on capstones or open-source issues. Form hackathon teams to design, prototype, and build challenging solutions together.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-white/5 text-[#F1F2EE] flex items-center justify-center text-sm font-semibold border border-white/10 shrink-0">3</div>
                <div>
                  <h4 className="font-semibold text-white text-sm mb-1">Build in Public</h4>
                  <p className="text-xs text-[#A8A8A8] leading-relaxed font-light">Share your daily progress, screenshots, code snippets, and milestones. Learn how to iterate quickly and get motivated by peers.</p>
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
            Ready to Build Alongside Peers?
          </h2>
          <p className="text-sm text-[#A8A8A8] max-w-md mx-auto mb-8 relative z-10 leading-relaxed font-light">
            Skip building alone. Connect with developers from all over the world. Apply for our Frontend Developer Internship program today.
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
