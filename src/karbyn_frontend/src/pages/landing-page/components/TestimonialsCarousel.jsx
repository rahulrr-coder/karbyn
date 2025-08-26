import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { motion, AnimatePresence } from 'framer-motion';

const TestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Environmental Scientist",
      organization: "Green Future Initiative",
      avatar: "/assets/avatars/avatar-1.svg",
      content: `Karbyn has revolutionized how we approach carbon offset verification. The community-driven validation process ensures transparency and builds trust in our environmental impact projects.`,
      rating: 5,
      project: "Reforestation Project - Amazon Basin",
      impact: "2,340 tons CO₂ offset"
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      role: "Project Developer",
      organization: "Sustainable Communities Corp",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      content: `The tokenization feature has opened up new funding opportunities for our renewable energy projects. We've been able to attract investors who want verified environmental impact.`,
      rating: 5,
      project: "Solar Farm Initiative - Kenya",
      impact: "1,890 tons CO₂ offset"
    },
    {
      id: 3,
      name: "Dr. Amelia Foster",
      role: "Climate Researcher",
      organization: "University of Environmental Sciences",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      content: `As a researcher, I appreciate the blockchain-based transparency. Every verification step is recorded immutably, making it easy to track and validate environmental claims.`,
      rating: 5,
      project: "Wetland Restoration - Florida",
      impact: "3,120 tons CO₂ offset"
    },
    {
      id: 4,
      name: "James Thompson",
      role: "Community Organizer",
      organization: "Local Climate Action Network",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      content: `Karbyn empowers local communities to take ownership of climate action. The verification process is democratic and ensures that real impact is being made on the ground.`,
      rating: 5,
      project: "Urban Tree Planting - Portland",
      impact: "890 tons CO₂ offset"
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="Star"
        size={16}
        className={index < rating ? "text-yellow-400 fill-current" : "text-gray-300"}
      />
    ));
  };

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Community Stories
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from project developers, researchers, and community members who are making a real difference through Karbyn's platform.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-4xl mx-auto">
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="bg-card rounded-2xl p-8 md:p-12 organic-shadow-moderate border border-border"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                  {/* Avatar and Info */}
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex-shrink-0 text-center md:text-left"
                  >
                    <div className="w-20 h-20 mx-auto md:mx-0 mb-4 rounded-full overflow-hidden organic-shadow-subtle">
                      <Image
                        src={testimonials[currentIndex].avatar}
                        alt={`${testimonials[currentIndex].name} avatar`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <motion.h3 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="text-lg font-semibold text-foreground"
                    >
                      {testimonials[currentIndex].name}
                    </motion.h3>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="text-sm text-primary font-medium"
                    >
                      {testimonials[currentIndex].role}
                    </motion.p>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="text-xs text-muted-foreground"
                    >
                      {testimonials[currentIndex].organization}
                    </motion.p>
                  </motion.div>

                  {/* Content */}
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="flex-1"
                  >
                    {/* Quote */}
                    <div className="mb-6">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                      >
                        <Icon name="Quote" size={32} className="text-primary/20 mb-4" />
                      </motion.div>
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="text-lg text-foreground leading-relaxed italic"
                      >
                        {testimonials[currentIndex].content}
                      </motion.p>
                    </div>

                    {/* Rating */}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="flex items-center space-x-1 mb-4"
                    >
                      {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + (i * 0.1), duration: 0.3 }}
                        >
                          <Icon name="Star" size={16} className="text-amber-400" />
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Project Info */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      className="bg-surface rounded-lg p-4 border border-border"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Project:</span>
                          <p className="font-medium text-foreground">{testimonials[currentIndex].project}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Impact:</span>
                          <p className="font-medium text-primary">{testimonials[currentIndex].impact}</p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-card rounded-full organic-shadow-subtle border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/20 organic-transition"
              aria-label="Previous testimonial"
            >
              <Icon name="ChevronLeft" size={20} />
            </motion.button>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-card rounded-full organic-shadow-subtle border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/20 organic-transition"
              aria-label="Next testimonial"
            >
              <Icon name="ChevronRight" size={20} />
            </motion.button>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full organic-transition ${
                  index === currentIndex
                    ? 'bg-primary' :'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Auto-play indicator */}
          <div className="flex items-center justify-center mt-4 text-xs text-muted-foreground">
            <Icon name={isAutoPlaying ? "Play" : "Pause"} size={12} className="mr-1" />
            <span>{isAutoPlaying ? "Auto-playing" : "Paused"}</span>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;