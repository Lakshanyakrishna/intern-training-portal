import { motion } from 'motion/react';

const ScrollReveal = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  distance = 40,
  className = ''
}) => {
  const offset =
    direction === 'up' ? { y: distance } :
    direction === 'down' ? { y: -distance } :
    direction === 'left' ? { x: distance } :
    { x: -distance };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
