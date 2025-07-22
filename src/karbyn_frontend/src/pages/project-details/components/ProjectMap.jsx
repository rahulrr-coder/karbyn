import React from 'react';
import Icon from '../../../components/AppIcon';

const ProjectMap = ({ project }) => {
  return (
    <div className="bg-card rounded-lg organic-shadow-subtle overflow-hidden">
      <div className="p-6 border-b border-border">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Project Location
        </h3>
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Icon name="MapPin" size={16} />
          <span className="text-sm">{project.location}</span>
        </div>
      </div>
      
      <div className="relative h-64 md:h-80">
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          title={project.title}
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${project.coordinates.lat},${project.coordinates.lng}&z=14&output=embed`}
          className="border-0"
        />
        
        {/* Map Overlay Info */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-card/95 backdrop-blur-sm rounded-lg p-4 organic-shadow-subtle">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground mb-1">Area Coverage</div>
                <div className="font-medium text-foreground">{project.areaCoverage}</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Elevation</div>
                <div className="font-medium text-foreground">{project.elevation}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectMap;