import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

/**
 * Animated section component that animates children when they come into view
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to be animated
 * @param {string} props.animation - Animation type: 'fadeIn', 'slideUp', 'slideLeft', 'slideRight', 'scale', 'staggered'
 * @param {number} props.delay - Delay before animation starts (in seconds)
 * @param {number} props.duration - Animation duration (in seconds)
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.customVariants - Custom animation variants
 */
const AnimatedSection = ({ 
  children, 
  animation = 'fadeIn', 
  delay = 0, 
  duration = 0.5, 
  className = '',
  customVariants = null
}) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    initialInView: true // Start animation immediately if already in view
  });
  
  // Define animation variants
  const variants = customVariants || {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { 
          duration,
          delay 
        }
      }
    },
    slideUp: {
      hidden: { opacity: 0, y: 50 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { 
          type: 'spring',
          damping: 25, 
          stiffness: 100,
          duration,
          delay 
        }
      }
    },
    slideLeft: {
      hidden: { opacity: 0, x: 50 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: { 
          type: 'spring',
          damping: 25, 
          stiffness: 100,
          duration,
          delay 
        }
      }
    },
    slideRight: {
      hidden: { opacity: 0, x: -50 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: { 
          type: 'spring',
          damping: 25, 
          stiffness: 100,
          duration,
          delay 
        }
      }
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { 
        opacity: 1, 
        scale: 1,
        transition: { 
          type: 'spring',
          damping: 25, 
          stiffness: 100,
          duration,
          delay 
        }
      }
    },
    staggered: {
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { 
          duration,
          delay,
          staggerChildren: 0.1
        }
      }
    }
  };
  
  // Trigger animation when section comes into view
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants[animation]}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
