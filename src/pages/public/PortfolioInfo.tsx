import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ClickSpark from '../../components/ClickSpark';
import { 
  ShieldCheck, 
  Award, 
  ThumbsUp, 
  Share2, 
  ChevronRight, 
  Sparkles, 
  UserCheck 
} from 'lucide-react';

export default function PortfolioInfo() {
  const highlights = [
    {
      icon: ShieldCheck,
      title: 'Verified Proof of Work',
      desc: 'No more embellishing resumes. Your profile automatically logs your actual task completions, coding test results, and verified pull request counts.',
      color: '#FFFFFF'
    },
    {
      icon: Award,
      title: 'Official Track Certificates',
      desc: 'Earn verifiable certificates for each specialization track you complete. Each certificate is cryptographically backed by your codebase activity.',
      color: '#E5E5E5'
    },
    {
      icon: ThumbsUp,
      title: 'Mentor Endorsements',
      desc: 'Receive direct testimonials and qualitative skill marks from senior engineering leads who review your pull requests and codebase designs.',
      color: '#A3A3A3'
    },
    {
      icon: Share2,
      title: 'Secure Recruiter Sharing',
      desc: 'Generate a public, tamper-proof link to share with external hiring managers, allowing them to inspect your code, certificates, and metrics.',
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
            Build a Portfolio That Stands Out
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-[#A8A8A8] font-light leading-relaxed tracking-wide"
          >
            Showcase your projects, verified achievements, and certifications to create a professional profile that impresses recruiters. Let your real proof-of-work do the talking.
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
            <UserCheck className="w-96 h-96" />
          </div>

          <div className="max-w-2xl">
            <h2 className="text-2xl font-light text-white mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              How Your Portfolio Builds
            </h2>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#10B981]/10 text-[#10B981] flex items-center justify-center text-sm font-semibold shrink-0">1</div>
                <div>
                  <h4 className="font-semibold text-white text-sm mb-1">Track Progress & Milestones</h4>
                  <p className="text-xs text-[#A8A8A8] leading-relaxed font-light">As you complete structured modules and pass unit tests, your core technical skillset scores rise and update automatically in real-time.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center text-sm font-semibold shrink-0">2</div>
                <div>
                  <h4 className="font-semibold text-white text-sm mb-1">Production Code Verification</h4>
                  <p className="text-xs text-[#A8A8A8] leading-relaxed font-light">Every approved pull request is cataloged under your profile, showcasing the exact code you wrote and the complexity of the feature delivered.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center text-sm font-semibold shrink-0">3</div>
                <div>
                  <h4 className="font-semibold text-white text-sm mb-1">Earn Verifiable Credentials</h4>
                  <p className="text-xs text-[#A8A8A8] leading-relaxed font-light">Upon track completion, a cryptographic certificate is issued. Recruiter links show complete validation, leaving no doubt about your achievements.</p>
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
            Ready to Build a Standout Profile?
          </h2>
          <p className="text-sm text-[#A8A8A8] max-w-md mx-auto mb-8 relative z-10 leading-relaxed font-light">
            Skip standard text resumes. Get verified for your actual coding output. Apply for our Frontend Developer Internship program today.
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
