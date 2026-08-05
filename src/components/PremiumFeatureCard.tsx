import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'motion/react';
import { Link } from 'react-router-dom';
import './PremiumFeatureCard.css';

export interface FeatureData {
  title: string;
  desc: string;
  icon: React.ReactNode;
  accent: string;
  link: string;
}

interface PremiumFeatureCardProps {
  feature: FeatureData;
  index: number;
}

const PremiumFeatureCard = ({ feature, index }: PremiumFeatureCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-6, 6]);
  
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
    
    const percentX = ((e.clientX - rect.left) / rect.width) * 100;
    const percentY = ((e.clientY - rect.top) / rect.height) * 100;
    cardRef.current.style.setProperty('--mouse-x', `${percentX}%`);
    cardRef.current.style.setProperty('--mouse-y', `${percentY}%`);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <Link to={feature.link} style={{ display: 'block', width: '100%', textDecoration: 'none', color: 'inherit' }}>
      <motion.div
        ref={cardRef}
        className="premium-feature-card"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        initial={{ 
          opacity: 0, 
          y: 60, 
          scale: 0.92, 
          rotateX: 10,
          filter: 'blur(12px)'
        }}
        whileInView={{ 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          rotateX: 0,
          filter: 'blur(0px)'
        }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ 
          duration: 0.8, 
          delay: index * 0.1,
          ease: [0.22, 1, 0.36, 1],
          y: {
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        animate={{
          y: [0, -4, 0]
        }}
        whileHover={{ 
          y: -12, 
          scale: 1.02 
        }}
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY
        } as React.CSSProperties}
      >
        {/* Animated Icon */}
        <motion.div 
          className="premium-icon"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          whileHover={{ rotate: 0, scale: 1.15 }}
        >
          {feature.icon}
        </motion.div>

        {/* Title */}
        <motion.h4 
          className="premium-title"
          whileHover={{ x: 4 }}
          transition={{ duration: 0.3 }}
        >
          {feature.title}
        </motion.h4>

        {/* Description */}
        <p className="premium-description">
          {feature.desc}
        </p>

        {/* Bottom CTA */}
        <motion.div 
          className="premium-cta"
          initial={{ opacity: 0, y: 10 }}
          animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
        >
          Learn More →
        </motion.div>

        {/* Mouse Spotlight */}
        <div className="card-spotlight" />

        {/* Animated Border */}
        <motion.div 
          className="animated-border"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>
    </Link>
  );
};

export default PremiumFeatureCard;
