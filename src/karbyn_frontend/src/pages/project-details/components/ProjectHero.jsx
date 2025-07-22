import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const ProjectHero = ({ project }) => {
  return (
    <div className="relative bg-card rounded-lg overflow-hidden organic-shadow-moderate">
      {/* Hero Image */}
      <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
        <Image
          src={project.heroImage}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            project.verificationStatus === 'verified' 
              ? 'bg-success text-success-foreground'
              : project.verificationStatus === 'pending' ?'bg-warning text-warning-foreground' :'bg-muted text-muted-foreground'
          }`}>
            <div className="flex items-center space-x-1">
              <Icon 
                name={project.verificationStatus === 'verified' ? 'CheckCircle' : 'Clock'} 
                size={14} 
              />
              <span className="capitalize">{project.verificationStatus}</span>
            </div>
          </div>
        </div>

        {/* Project Type Badge */}
        <div className="absolute top-4 right-4">
          <div className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium">
            {project.type}
          </div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="p-6 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* Left Content */}
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {project.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-6 text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Icon name="MapPin" size={16} />
                <span className="text-sm">{project.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Calendar" size={16} />
                <span className="text-sm">Started {project.startDate}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Users" size={16} />
                <span className="text-sm">{project.communitySize} community members</span>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-6">
              {project.shortDescription}
            </p>
          </div>

          {/* Right Content - Key Metrics */}
          <div className="lg:w-80">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {project.carbonOffset}
                </div>
                <div className="text-sm text-muted-foreground">
                  CO₂ Offset (tons)
                </div>
              </div>
              <div className="bg-surface rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-accent mb-1">
                  {project.tokensEarned}
                </div>
                <div className="text-sm text-muted-foreground">
                  Tokens Earned
                </div>
              </div>
              <div className="bg-surface rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-secondary mb-1">
                  {project.verificationScore}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Verification Score
                </div>
              </div>
              <div className="bg-surface rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-foreground mb-1">
                  {project.validators}
                </div>
                <div className="text-sm text-muted-foreground">
                  Validators
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectHero;