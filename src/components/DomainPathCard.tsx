import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'motion/react';
import { Link } from 'react-router-dom';
import './DomainPathCard.css';

export interface DomainPath {
  id: string;
  name: string;
  title: string;
  description: string;
  skills: string[];
  icon: React.ReactNode;
  accentColor: string;
  url: string;
}

interface DomainPathCardProps {
  domain: DomainPath;
  index: number;
}

const DomainPathCard = ({ domain, index }: DomainPathCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-8, 8]);
  
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
    
    // Update CSS variables for spotlight
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
    <motion.div
      ref={cardRef}
      className="domain-path-card"
      style={{
        '--accent-color': domain.accentColor,
        rotateX: springRotateX,
        rotateY: springRotateY
      } as React.CSSProperties}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ 
        opacity: 0, 
        scale: 0.85, 
        rotateX: 20, 
        y: 80,
        filter: 'blur(12px)'
      }}
      whileInView={{ 
        opacity: 1, 
        scale: 1, 
        rotateX: 0, 
        y: 0,
        filter: 'blur(0px)'
      }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1]
      }}
      whileHover={{ 
        y: -12, 
        scale: 1.02 
      }}
    >
      {/* Left Accent Border */}
      <motion.div 
        className="accent-border"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ 
          duration: 0.5, 
          delay: index * 0.08 + 0.3,
          ease: [0.22, 1, 0.36, 1]
        }}
      />

      {/* Icon */}
      <motion.div 
        className="domain-icon"
        initial={{ scale: 0, rotate: -180 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        animate={isHovered ? { rotate: 8, scale: 1.15 } : { rotate: 0, scale: 1 }}
        transition={isHovered ? { duration: 0.3 } : {
          duration: 0.5, 
          delay: index * 0.08 + 0.4,
          type: "spring",
          stiffness: 200
        }}
      >
        {domain.icon}
      </motion.div>

      {/* Title */}
      <motion.h3 
        className="domain-title"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ 
          duration: 0.5, 
          delay: index * 0.08 + 0.5,
          ease: [0.22, 1, 0.36, 1]
        }}
      >
        {domain.title}
      </motion.h3>

      {/* Description */}
      <motion.p 
        className="domain-description"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ 
          duration: 0.5, 
          delay: index * 0.08 + 0.6,
          ease: [0.22, 1, 0.36, 1]
        }}
      >
        {domain.description}
      </motion.p>

      {/* Skills */}
      <motion.div 
        className="domain-skills"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ 
          duration: 0.5, 
          delay: index * 0.08 + 0.7,
          ease: [0.22, 1, 0.36, 1]
        }}
      >
        {domain.skills.map((skill, i) => (
          <span key={i} className="skill-tag">{skill}</span>
        ))}
      </motion.div>

      {/* Explore Button */}
      <motion.div 
        className="explore-button-wrapper"
        initial={{ opacity: 0, y: 20 }}
        animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <Link to={domain.url} className="explore-button">
          Explore Path →
        </Link>
      </motion.div>

      {/* Mouse Spotlight */}
      <div className="card-spotlight" />
    </motion.div>
  );
};

export default DomainPathCard;
