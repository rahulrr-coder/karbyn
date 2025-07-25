import React, { useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';

const GlobeVisualization = () => {
  const globeRef = useRef(null);
  
  useEffect(() => {
    // Initialize animation only once when component mounts
    const globe = globeRef.current;
    if (!globe) return;
    
    // Create project markers dynamically
    const createProjectMarker = (x, y, delay, type) => {
      const marker = document.createElement('div');
      marker.className = 'absolute w-3 h-3 rounded-full';
      
      // Different colors for different project types
      const colors = {
        forest: 'bg-emerald-500',
        solar: 'bg-amber-400',
        water: 'bg-blue-400',
        wind: 'bg-sky-300'
      };
      
      marker.classList.add(colors[type] || 'bg-primary');
      marker.style.left = `${x}%`;
      marker.style.top = `${y}%`;
      marker.style.opacity = '0';
      marker.style.transform = 'scale(0)';
      marker.style.animation = `pulse 3s infinite ${delay}s, fadeIn 0.5s ${delay}s forwards`;
      
      globe.appendChild(marker);
      
      // Create project info tooltip that appears on hover
      const tooltip = document.createElement('div');
      tooltip.className = 'absolute opacity-0 pointer-events-none bg-card p-2 rounded-md text-xs border border-border shadow-lg z-10 w-32 transition-opacity';
      tooltip.style.left = `calc(${x}% + 10px)`;
      tooltip.style.top = `calc(${y}% - 15px)`;
      
      const projectTypes = {
        forest: 'Reforestation',
        solar: 'Solar Farm',
        water: 'Water Conservation',
        wind: 'Wind Energy'
      };
      
      tooltip.innerHTML = `
        <div class="font-medium">${projectTypes[type]}</div>
        <div class="text-muted-foreground mt-1">Impact: ${Math.floor(Math.random() * 1000)} tons CO₂</div>
      `;
      
      globe.appendChild(tooltip);
      
      // Show tooltip on hover
      marker.addEventListener('mouseenter', () => {
        tooltip.style.opacity = '1';
      });
      
      marker.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
      });
      
      return marker;
    };
    
    // Create project markers at different positions
    const projects = [
      { x: 30, y: 30, delay: 0.2, type: 'forest' },
      { x: 70, y: 25, delay: 0.5, type: 'solar' },
      { x: 45, y: 60, delay: 0.8, type: 'water' },
      { x: 75, y: 55, delay: 1.1, type: 'forest' },
      { x: 20, y: 50, delay: 1.4, type: 'wind' },
      { x: 60, y: 40, delay: 1.7, type: 'solar' },
      { x: 35, y: 75, delay: 2.0, type: 'water' }
    ];
    
    const markers = projects.map(p => createProjectMarker(p.x, p.y, p.delay, p.type));
    
    // Cleanup function
    return () => {
      markers.forEach(marker => marker.remove());
    };
  }, []);
  
  return (
    <div className="relative w-full h-full">
      {/* Globe container */}
      <div className="relative w-full max-w-lg mx-auto">
        {/* Animated Globe */}
        <div 
          ref={globeRef}
          className="relative w-full aspect-square rounded-full overflow-hidden organic-shadow-prominent"
        >
          {/* Globe background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-600/60 to-blue-400/70 animate-slow-spin">
            {/* Continents */}
            <svg className="absolute inset-0 w-full h-full opacity-70" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              {/* Simplified continent shapes */}
              <path d="M30,20 Q40,15 45,25 Q55,30 50,40 Q45,50 30,45 Q25,35 30,20" fill="rgba(255,255,255,0.3)" />
              <path d="M60,30 Q70,25 75,35 Q80,45 70,50 Q65,40 60,30" fill="rgba(255,255,255,0.3)" />
              <path d="M20,50 Q30,55 35,65 Q30,75 20,70 Q15,60 20,50" fill="rgba(255,255,255,0.3)" />
              <path d="M50,60 Q60,65 55,75 Q45,80 40,70 Q45,65 50,60" fill="rgba(255,255,255,0.3)" />
              <path d="M65,55 Q75,60 70,70 Q60,75 55,65 Q60,60 65,55" fill="rgba(255,255,255,0.3)" />
            </svg>
            
            {/* Grid lines */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="49" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
              <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
            </svg>
          </div>
          
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl opacity-50"></div>
          
          {/* Reflective highlight */}
          <div className="absolute top-0 left-1/4 w-1/2 h-1/4 bg-white/20 rounded-full blur-md"></div>
        </div>
        
        {/* Floating Cards */}
        <div className="absolute -top-4 -left-4 bg-card rounded-lg organic-shadow-moderate p-4 border border-border animate-float-slow">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Leaf" size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Carbon Offset</p>
              <p className="text-xs text-muted-foreground">1,247 tons CO₂</p>
            </div>
          </div>
        </div>
        
        <div className="absolute -bottom-4 -right-4 bg-card rounded-lg organic-shadow-moderate p-4 border border-border animate-float">
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
        
        {/* Additional Floating Card */}
        <div className="absolute top-1/2 -right-8 transform -translate-y-1/2 bg-card rounded-lg organic-shadow-moderate p-4 border border-border animate-float-medium">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Icon name="Users" size={20} className="text-secondary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Communities</p>
              <p className="text-xs text-muted-foreground">142 Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobeVisualization;
