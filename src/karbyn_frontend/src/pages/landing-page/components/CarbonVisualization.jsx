import React, { useEffect, useRef, useState } from 'react';
import Icon from '../../../components/AppIcon';

const CarbonVisualization = () => {
  const containerRef = useRef(null);
  const [counters, setCounters] = useState({
    carbon: 0,
    trees: 0,
    projects: 0
  });
  
  // Target values for animated counters
  const targetValues = {
    carbon: 1247,
    trees: 28465,
    projects: 142
  };
  
  useEffect(() => {
    // Animate counters
    const duration = 2000; // 2 seconds for the animation
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setCounters({
        carbon: Math.floor(targetValues.carbon * progress),
        trees: Math.floor(targetValues.trees * progress),
        projects: Math.floor(targetValues.projects * progress)
      });
      
      if (progress === 1) {
        clearInterval(interval);
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    // Create carbon particles
    const container = containerRef.current;
    if (!container) return;
    
    // Create carbon particles
    const createCarbonParticle = (startX, startY, targetX, targetY, delay) => {
      const particle = document.createElement('div');
      particle.className = 'absolute w-2 h-2 rounded-full bg-slate-600 z-10';
      particle.style.left = `${startX}%`;
      particle.style.top = `${startY}%`;
      particle.style.opacity = '0';
      particle.style.transform = 'scale(0)';
      
      // Add CO2 label to some particles
      if (Math.random() > 0.7) {
        const label = document.createElement('div');
        label.className = 'absolute -top-4 -left-2 text-xs font-mono text-slate-600 opacity-70';
        label.textContent = 'CO₂';
        particle.appendChild(label);
      }
      
      // Animation timing
      setTimeout(() => {
        particle.style.transition = 'all 3s cubic-bezier(0.4, 0, 0.2, 1)';
        particle.style.opacity = '0.7';
        particle.style.transform = 'scale(1)';
        
        // Move to tree
        setTimeout(() => {
          particle.style.left = `${targetX}%`;
          particle.style.top = `${targetY}%`;
          particle.style.backgroundColor = '#7FB069'; // Change to accent color when absorbed
          
          if (particle.firstChild) {
            particle.firstChild.textContent = 'O₂';
            particle.firstChild.className = 'absolute -top-4 -left-2 text-xs font-mono text-accent opacity-70';
          }
          
          // Fade out after reaching tree
          setTimeout(() => {
            particle.style.opacity = '0';
            particle.style.transform = 'scale(0)';
            
            // Remove particle after animation completes
            setTimeout(() => {
              particle.remove();
            }, 1000);
          }, 1000);
        }, 1500);
      }, delay);
      
      container.appendChild(particle);
    };
    
    // Generate particles at intervals
    const generateParticles = () => {
      // Factory/city positions (sources of carbon)
      const sources = [
        { x: 20, y: 60 },
        { x: 75, y: 70 },
        { x: 85, y: 40 }
      ];
      
      // Tree positions (carbon sinks)
      const sinks = [
        { x: 30, y: 30 },
        { x: 50, y: 25 },
        { x: 70, y: 20 },
        { x: 40, y: 50 }
      ];
      
      // Create a new particle every 200ms
      let particleCount = 0;
      const interval = setInterval(() => {
        if (particleCount >= 50) {
          clearInterval(interval);
          
          // Restart after a pause
          setTimeout(() => {
            particleCount = 0;
            generateParticles();
          }, 3000);
          return;
        }
        
        const source = sources[Math.floor(Math.random() * sources.length)];
        const sink = sinks[Math.floor(Math.random() * sinks.length)];
        
        createCarbonParticle(
          source.x, 
          source.y, 
          sink.x, 
          sink.y, 
          Math.random() * 1000
        );
        
        particleCount++;
      }, 200);
      
      return () => clearInterval(interval);
    };
    
    const cleanup = generateParticles();
    return cleanup;
  }, []);
  
  return (
    <div className="relative w-full h-full">
      <div className="relative w-full max-w-lg mx-auto">
        {/* Main visualization area */}
        <div 
          ref={containerRef}
          className="relative aspect-square rounded-2xl overflow-hidden organic-shadow-prominent bg-gradient-to-b from-background via-surface to-background border border-border"
        >
          {/* Sky gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"></div>
          
          {/* Sun */}
          <div className="absolute top-5 right-8 w-16 h-16 rounded-full bg-amber-300 blur-sm opacity-80"></div>
          <div className="absolute top-6 right-10 w-12 h-12 rounded-full bg-amber-100"></div>
          
          {/* Ground */}
          <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-primary to-secondary/70"></div>
          
          {/* Factory - carbon source */}
          <div className="absolute left-[20%] bottom-[40%] w-12 h-20">
            <div className="absolute bottom-0 w-full h-12 bg-slate-700 rounded-t-sm"></div>
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-4 h-8 bg-slate-600 rounded-t-sm">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-3 bg-slate-500 rounded-t-sm"></div>
            </div>
            {/* Smoke animation */}
            <div className="absolute bottom-[100%] left-1/2 -translate-x-1/2">
              <div className="w-2 h-2 bg-slate-400 rounded-full opacity-70 animate-smoke-1"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full opacity-70 animate-smoke-2"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full opacity-70 animate-smoke-3"></div>
            </div>
          </div>
          
          {/* City - carbon source */}
          <div className="absolute right-[15%] bottom-[30%] flex items-end space-x-1">
            <div className="w-5 h-16 bg-slate-700"></div>
            <div className="w-4 h-12 bg-slate-600"></div>
            <div className="w-6 h-20 bg-slate-800"></div>
            <div className="w-5 h-14 bg-slate-700"></div>
            {/* Smoke animation */}
            <div className="absolute bottom-[100%] left-1/2 -translate-x-1/2">
              <div className="w-2 h-2 bg-slate-400 rounded-full opacity-70 animate-smoke-2"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full opacity-70 animate-smoke-3"></div>
            </div>
          </div>
          
          {/* Trees - carbon sinks */}
          <div className="absolute left-[30%] bottom-[70%] flex flex-col items-center">
            <div className="w-10 h-10 bg-primary rounded-full"></div>
            <div className="w-8 h-8 bg-accent rounded-full -mt-4 ml-2"></div>
            <div className="w-2 h-8 bg-secondary -mt-2"></div>
          </div>
          
          <div className="absolute left-[50%] bottom-[75%] flex flex-col items-center">
            <div className="w-12 h-12 bg-primary rounded-full"></div>
            <div className="w-10 h-10 bg-accent rounded-full -mt-6 ml-2"></div>
            <div className="w-2 h-10 bg-secondary -mt-2"></div>
          </div>
          
          <div className="absolute left-[70%] bottom-[80%] flex flex-col items-center">
            <div className="w-8 h-8 bg-primary rounded-full"></div>
            <div className="w-6 h-6 bg-accent rounded-full -mt-3 ml-1"></div>
            <div className="w-1.5 h-6 bg-secondary -mt-1"></div>
          </div>
          
          <div className="absolute left-[40%] bottom-[50%] flex flex-col items-center">
            <div className="w-14 h-14 bg-primary rounded-full"></div>
            <div className="w-12 h-12 bg-accent rounded-full -mt-7 ml-3"></div>
            <div className="w-3 h-12 bg-secondary -mt-3"></div>
          </div>
          
          {/* Carbon cycle arrows */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#4A7C59" />
              </marker>
            </defs>
            <path 
              d="M 80,70 C 100,50 90,30 70,20" 
              stroke="#4A7C59" 
              strokeWidth="1" 
              strokeDasharray="4" 
              fill="none" 
              markerEnd="url(#arrowhead)" 
            />
            <path 
              d="M 20,60 C 10,40 20,30 30,30" 
              stroke="#4A7C59" 
              strokeWidth="1" 
              strokeDasharray="4" 
              fill="none" 
              markerEnd="url(#arrowhead)" 
            />
          </svg>
          
          {/* Blockchain representation */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
            <div className="w-8 h-8 bg-primary/20 backdrop-blur-sm rounded-md border border-primary/30 flex items-center justify-center text-xs font-mono text-primary">01</div>
            <div className="w-8 h-8 bg-primary/20 backdrop-blur-sm rounded-md border border-primary/30 flex items-center justify-center text-xs font-mono text-primary">02</div>
            <div className="w-8 h-8 bg-primary/20 backdrop-blur-sm rounded-md border border-primary/30 flex items-center justify-center text-xs font-mono text-primary">03</div>
            <div className="w-8 h-8 bg-primary/20 backdrop-blur-sm rounded-md border border-primary/30 animate-pulse-slow flex items-center justify-center text-xs font-mono text-primary">+</div>
          </div>
        </div>
        
        {/* Floating Cards */}
        <div className="absolute -top-4 -left-4 bg-card rounded-lg organic-shadow-moderate p-4 border border-border animate-float-slow z-20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Leaf" size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Carbon Offset</p>
              <p className="text-xs text-muted-foreground">{counters.carbon.toLocaleString()} tons CO₂</p>
            </div>
          </div>
        </div>
        
        <div className="absolute -bottom-4 -right-4 bg-card rounded-lg organic-shadow-moderate p-4 border border-border animate-float z-20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name="Coins" size={20} className="text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Tokens Minted</p>
              <p className="text-xs text-muted-foreground">24,891 KRB</p>
            </div>
          </div>
        </div>
        
        {/* Additional Floating Cards */}
        <div className="absolute top-1/2 -right-8 transform -translate-y-1/2 bg-card rounded-lg organic-shadow-moderate p-4 border border-border animate-float-medium z-20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="TreePine" size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Trees Planted</p>
              <p className="text-xs text-muted-foreground">{counters.trees.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="absolute -top-4 right-1/4 bg-card rounded-lg organic-shadow-moderate p-4 border border-border animate-float-medium z-20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Icon name="Globe" size={20} className="text-secondary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Active Projects</p>
              <p className="text-xs text-muted-foreground">{counters.projects}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarbonVisualization;
