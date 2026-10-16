import { motion, useReducedMotion } from 'framer-motion';

export default function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  id,
  as: Tag = 'div',
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[Tag] || motion.div;

  return (
    <MotionTag
      className={className}
      id={id}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1], delay }}
    >
      {children}
    </MotionTag>
  );
}
