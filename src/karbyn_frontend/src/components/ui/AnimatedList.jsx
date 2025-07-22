import React from 'react';
import { motion } from 'framer-motion';

/**
 * Animated list component that staggers animations for children
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - List items to be animated
 * @param {number} props.delay - Initial delay before animation starts (in seconds)
 * @param {number} props.staggerDelay - Delay between each item animation (in seconds)
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.animation - Animation type: 'fadeIn', 'slideUp', 'slideLeft', 'slideRight', 'scale'
 */
const AnimatedList = ({ 
  children, 
  delay = 0.2, 
  staggerDelay = 0.1,
  className = '',
  animation = 'fadeIn'
}) => {
  // Define container variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: staggerDelay
      }
    }
  };
  
  // Define item variants based on animation type
  const getItemVariants = () => {
    switch (animation) {
      case 'slideUp':
        return {
          hidden: { opacity: 0, y: 20 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
              type: 'spring',
              damping: 25, 
              stiffness: 100
            }
          }
        };
      case 'slideLeft':
        return {
          hidden: { opacity: 0, x: 20 },
          visible: { 
            opacity: 1, 
            x: 0,
            transition: { 
              type: 'spring',
              damping: 25, 
              stiffness: 100
            }
          }
        };
      case 'slideRight':
        return {
          hidden: { opacity: 0, x: -20 },
          visible: { 
            opacity: 1, 
            x: 0,
            transition: { 
              type: 'spring',
              damping: 25, 
              stiffness: 100
            }
          }
        };
      case 'scale':
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { 
            opacity: 1, 
            scale: 1,
            transition: { 
              type: 'spring',
              damping: 25, 
              stiffness: 100
            }
          }
        };
      case 'fadeIn':
      default:
        return {
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1,
            transition: { duration: 0.5 }
          }
        };
    }
  };
  
  // Wrap children with motion.div
  const animatedChildren = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return (
        <motion.div variants={getItemVariants()}>
          {child}
        </motion.div>
      );
    }
    return child;
  });
  
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      {animatedChildren}
    </motion.div>
  );
};

export default AnimatedList;
