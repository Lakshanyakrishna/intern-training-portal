import { useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import Header from '../../components/Header';
import IntroLogo from '../../components/IntroLogo';
import Ferrofluid from '../../components/Ferrofluid';
import './Contact.css';

// ─── SVG Icons ─────────────────────────────────────
const MapPinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MessageCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const LinkedinIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GithubIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08 1.25-.27 2.48-1 3.5.28 1.15.28 2.35 0 3.5A8 8 0 0 0 3.2 20.1c-.46.7-.2 1.55.5 1.9.7.35 1.55.2 1.9-.5A6 6 0 0 1 8 21c1.6.2 3.2.2 4.8 0" />
    <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2s-1 2.5-3 3.4c1.3 2.4 4 4 7 4" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

// ─── Contact Data ─────────────────────────────────────
const CONTACT_INFO = [
  {
    icon: MapPinIcon,
    label: 'Office',
    value: 'Hyderabad, India'
  },
  {
    icon: MailIcon,
    label: 'Email',
    value: 'hello@lumora.tech'
  },
  {
    icon: PhoneIcon,
    label: 'Phone',
    value: '+91 XXXXX XXXXX'
  },
  {
    icon: MessageCircleIcon,
    label: 'WhatsApp',
    value: 'Chat With Our Team'
  },
  {
    icon: ClockIcon,
    label: 'Availability',
    value: 'Mon–Fri, 9:00 AM – 6:00 PM IST'
  }
];

const FAQ_CARDS = [
  {
    title: 'Student Support',
    email: 'students@lumora.tech',
    description: 'Get help with internships, applications, and career guidance'
  },
  {
    title: 'Partnerships',
    email: 'partners@lumora.tech',
    description: 'Connect with us for company partnerships and hiring opportunities'
  },
  {
    title: 'Technical Help',
    email: 'support@lumora.tech',
    description: 'Report bugs, request features, or get technical assistance'
  }
];

const SOCIAL_LINKS = [
  { icon: LinkedinIcon, href: '#', label: 'LinkedIn' },
  { icon: GithubIcon, href: '#', label: 'GitHub' },
  { icon: InstagramIcon, href: '#', label: 'Instagram' },
  { icon: TwitterIcon, href: '#', label: 'X (Twitter)' }
];

// ─── Components ─────────────────────────────────────
const ContactInfoCard = ({ item, index }: { item: typeof CONTACT_INFO[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="contact-info-card group relative rounded-2xl p-5 bg-[#0A0A0A]/60 backdrop-blur-xl border border-[#2A2A2A] hover:border-[#3A3A3A] transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <motion.div
          className="p-3 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] text-[#9AA1A3] group-hover:text-[#F1F2EE] group-hover:border-[#3A3A3A] transition-all duration-300"
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <item.icon />
        </motion.div>
        <div>
          <p className="text-[#6D777C] text-xs mb-1">{item.label}</p>
          <p className="text-[#F1F2EE] text-sm font-light">{item.value}</p>
        </div>
      </div>
    </motion.div>
  );
};

const SocialButton = ({ item, index }: { item: typeof SOCIAL_LINKS[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.a
      ref={ref}
      href={item.href}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="social-button relative p-4 rounded-2xl bg-[#0A0A0A]/60 backdrop-blur-xl border border-[#2A2A2A] hover:border-[#3A3A3A] transition-all duration-300"
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
    >
      <item.icon />
    </motion.a>
  );
};

const FAQCard = ({ item, index }: { item: typeof FAQ_CARDS[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.a
      ref={ref}
      href={`mailto:${item.email}`}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="faq-card group relative rounded-2xl p-6 bg-[#0A0A0A]/60 backdrop-blur-xl border border-[#2A2A2A] hover:border-[#3A3A3A] transition-all duration-300"
      whileHover={{ y: -5 }}
    >
      <h3 className="text-[#F1F2EE] font-light mb-2">{item.title}</h3>
      <p className="text-[#9AA1A3] text-sm mb-3">{item.description}</p>
      <div className="flex items-center gap-2 text-[#6D777C] text-xs group-hover:text-[#F1F2EE] transition-colors">
        <span>{item.email}</span>
        <ArrowRightIcon />
      </div>
    </motion.a>
  );
};

// ─── Main Component ─────────────────────────────────
export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 2000);
  };

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
        <section className="mx-auto max-w-7xl px-8 pt-32 pb-16 md:pt-40 md:pb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 rounded-full border border-[#2A2A2A] bg-[#0A0A0A]/50 backdrop-blur-xl text-[#9AA1A3] text-[11px] font-semibold uppercase tracking-[0.2em] mb-6">
              CONTACT
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
              Let's Build Something Amazing Together
            </h1>
            <p className="mx-auto max-w-2xl text-[15px] leading-8 text-[#9AA1A3]" style={{ fontFamily: 'Inter, -apple-system, Segoe UI, sans-serif' }}>
              Whether you're looking for internships, partnerships, mentorship, or have questions about Lumora, we'd love to hear from you.
            </p>
          </motion.div>
        </section>

        {/* ─── MAIN CONTACT SECTION ─── */}
        <section className="mx-auto max-w-7xl px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT SIDE - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="contact-form-container"
            >
              <div className="rounded-3xl border border-[#2A2A2A] bg-[#0A0A0A]/40 backdrop-blur-xl p-8 md:p-12">
                <h2 
                  className="text-[#F1F2EE] mb-2 tracking-tight"
                  style={{ 
                    fontFamily: 'Inter, -apple-system, Segoe UI, sans-serif',
                    fontSize: 'clamp(24px, 3vw, 32px)',
                    letterSpacing: '-0.02em',
                    fontWeight: 300
                  }}
                >
                  Send Us a Message
                </h2>
                <p className="text-[#9AA1A3] mb-8" style={{ fontFamily: 'Inter, -apple-system, Segoe UI, sans-serif' }}>
                  Tell us about your idea, question, or partnership. We'll get back within 24 hours.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="form-group">
                    <label className="block text-[#9AA1A3] text-sm mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0A0A0A]/60 border border-[#2A2A2A] text-[#F1F2EE] placeholder-[#6D777C] focus:outline-none focus:border-[#3A3A3A] focus:bg-[#1A1A1A]/60 transition-all duration-300"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="block text-[#9AA1A3] text-sm mb-2">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0A0A0A]/60 border border-[#2A2A2A] text-[#F1F2EE] placeholder-[#6D777C] focus:outline-none focus:border-[#3A3A3A] focus:bg-[#1A1A1A]/60 transition-all duration-300"
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="block text-[#9AA1A3] text-sm mb-2">Subject</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0A0A0A]/60 border border-[#2A2A2A] text-[#F1F2EE] placeholder-[#6D777C] focus:outline-none focus:border-[#3A3A3A] focus:bg-[#1A1A1A]/60 transition-all duration-300"
                      placeholder="How can we help?"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="block text-[#9AA1A3] text-sm mb-2">Message</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl bg-[#0A0A0A]/60 border border-[#2A2A2A] text-[#F1F2EE] placeholder-[#6D777C] focus:outline-none focus:border-[#3A3A3A] focus:bg-[#1A1A1A]/60 transition-all duration-300 resize-none"
                      placeholder="Tell us more about your inquiry..."
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-[#F1F2EE] text-[#050505] font-light hover:bg-[#F1F2EE]/90 transition-all duration-300 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ fontFamily: 'Inter, -apple-system, Segoe UI, sans-serif' }}
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-[#050505] border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        Send Message <ArrowRightIcon />
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>

            {/* RIGHT SIDE - Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="rounded-3xl border border-[#2A2A2A] bg-[#0A0A0A]/40 backdrop-blur-xl p-8 md:p-12 h-full">
                <h2 
                  className="text-[#F1F2EE] mb-2 tracking-tight"
                  style={{ 
                    fontFamily: 'Inter, -apple-system, Segoe UI, sans-serif',
                    fontSize: 'clamp(24px, 3vw, 32px)',
                    letterSpacing: '-0.02em',
                    fontWeight: 300
                  }}
                >
                  Get In Touch
                </h2>
                <p className="text-[#9AA1A3] mb-8" style={{ fontFamily: 'Inter, -apple-system, Segoe UI, sans-serif' }}>
                  We're always happy to connect with students, mentors, startups, and hiring partners.
                </p>

                <div className="space-y-4">
                  {CONTACT_INFO.map((item, index) => (
                    <ContactInfoCard key={item.label} item={item} index={index} />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── MAP SECTION ─── */}
        <section className="mx-auto max-w-7xl px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl border border-[#2A2A2A] h-96 overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-[#0A0A0A]">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#F1F2EE]/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#F1F2EE]/10 rounded-full blur-3xl" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto text-[#F1F2EE] mb-4 flex justify-center">
                    <MapPinIcon />
                  </div>
                  <p className="text-[#F1F2EE] text-lg font-medium">Hyderabad, India</p>
                  <p className="text-[#9AA1A3] text-sm mt-2">📍 Our Headquarters</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ─── SOCIAL LINKS ─── */}
        <section className="mx-auto max-w-7xl px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h3 className="text-[#F1F2EE] mb-8" style={{ fontFamily: 'Inter, -apple-system, Segoe UI, sans-serif', fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 300 }}>
              Connect With Us
            </h3>
            <div className="flex justify-center gap-4 flex-wrap">
              {SOCIAL_LINKS.map((item, index) => (
                <SocialButton key={item.label} item={item} index={index} />
              ))}
            </div>
          </motion.div>
        </section>

        {/* ─── FAQ STRIP ─── */}
        <section className="mx-auto max-w-7xl px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h3 className="text-[#F1F2EE] mb-2" style={{ fontFamily: 'Inter, -apple-system, Segoe UI, sans-serif', fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 300 }}>
              Still have questions?
            </h3>
            <p className="text-[#9AA1A3]" style={{ fontFamily: 'Inter, -apple-system, Segoe UI, sans-serif' }}>
              Reach out to our specialized teams
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FAQ_CARDS.map((item, index) => (
              <FAQCard key={item.title} item={item} index={index} />
            ))}
          </div>
        </section>

        {/* ─── FINAL CTA ─── */}
        <section className="mx-auto max-w-7xl px-8 py-16 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl border border-[#2A2A2A] bg-[#0A0A0A]/40 backdrop-blur-xl p-12 md:p-20 text-center relative overflow-hidden"
          >
            {/* Animated gradient border */}
            <div className="absolute inset-0 rounded-3xl">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F1F2EE]/5 to-transparent animate-gradient-border" />
            </div>

            {/* Background spotlight */}
            <div className="absolute inset-0">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#F1F2EE]/5 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <h2 
                className="text-[#F1F2EE] mb-4 tracking-tight"
                style={{ 
                  fontFamily: 'Inter, -apple-system, Segoe UI, sans-serif',
                  fontSize: 'clamp(32px, 5vw, 56px)',
                  letterSpacing: '-0.02em',
                  fontWeight: 300
                }}
              >
                Ready to Start Your Journey?
              </h2>
              <p className="mx-auto max-w-xl text-[15px] leading-8 text-[#9AA1A3] mb-8" style={{ fontFamily: 'Inter, -apple-system, Segoe UI, sans-serif' }}>
                Join thousands of students building real-world experience through Lumora.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 rounded-full bg-[#F1F2EE] text-[#050505] font-light hover:bg-[#F1F2EE]/90 transition-all hover:scale-[1.02]" style={{ fontFamily: 'Inter, -apple-system, Segoe UI, sans-serif' }}>
                  Explore Opportunities
                </button>
                <button className="px-8 py-4 rounded-full border border-[#2A2A2A] text-[#F1F2EE] font-light hover:bg-[#1A1A1A]/50 hover:border-[#3A3A3A] transition-all hover:scale-[1.02]" style={{ fontFamily: 'Inter, -apple-system, Segoe UI, sans-serif' }}>
                  Join Community
                </button>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}

