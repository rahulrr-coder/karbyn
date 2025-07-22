import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

/**
 * Animated counter component that counts up to a target value
 * 
 * @param {Object} props
 * @param {number} props.value - Target value to count up to
 * @param {number} props.duration - Animation duration in seconds
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.prefix - Prefix to display before the number
 * @param {string} props.suffix - Suffix to display after the number
 * @param {number} props.decimals - Number of decimal places to display
 * @param {boolean} props.separator - Whether to use thousand separators
 */
const AnimatedCounter = ({ 
  value = 0, 
  duration = 2, 
  className = '',
  prefix = '',
  suffix = '',
  decimals = 0,
  separator = true
}) => {
  const [count, setCount] = useState(0);
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    initialInView: true // Start animation immediately if already in view
  });
  
  // Format number with separators and decimals
  const formatNumber = (num) => {
    const fixed = Number(num).toFixed(decimals);
    
    if (separator) {
      const parts = fixed.toString().split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return parts.join('.');
    }
    
    return fixed;
  };
  
  // Animate counter when in view
  useEffect(() => {
    if (inView) {
      let startTime;
      let animationFrame;
      
      const updateCount = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        
        // Use easeOutExpo for a natural counting effect
        const easeOutExpo = 1 - Math.pow(2, -10 * progress);
        const currentCount = Math.floor(easeOutExpo * value);
        
        setCount(currentCount);
        
        if (progress < 1) {
          animationFrame = requestAnimationFrame(updateCount);
        } else {
          setCount(value);
        }
      };
      
      animationFrame = requestAnimationFrame(updateCount);
      
      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      };
    }
  }, [inView, value, duration]);
  
  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        type: 'spring',
        damping: 10, 
        stiffness: 100,
        duration: 0.5
      }}
    >
      {prefix}{formatNumber(count)}{suffix}
    </motion.span>
  );
};

export default AnimatedCounter;
