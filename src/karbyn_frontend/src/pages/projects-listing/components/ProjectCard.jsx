import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProjectCard = ({ project, viewMode = 'grid' }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate('/project-details', { state: { project } });
  };

  const handleVerifyProject = () => {
    // Mock verification action
    console.log('Verifying project:', project.id);
  };

  const handleShare = () => {
    // Mock share action
    navigator.clipboard.writeText(`Check out this climate project: ${project.title}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'text-success bg-success/10';
      case 'pending': return 'text-warning bg-warning/10';
      case 'in-review': return 'text-primary bg-primary/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getImpactColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-card rounded-lg organic-shadow-subtle border border-border p-4 hover:organic-shadow-moderate organic-transition">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Image */}
          <div className="w-full sm:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">{project.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Icon name="MapPin" size={14} />
                    <span>{project.region}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="TreePine" size={14} />
                    <span>{project.type}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
                <div className="flex items-center space-x-1">
                  <Icon name="TrendingUp" size={14} className={getImpactColor(project.impactScore)} />
                  <span className={`text-sm font-medium ${getImpactColor(project.impactScore)}`}>
                    {project.impactScore}%
                  </span>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>{project.carbonOffset} tons CO₂</span>
                <span>•</span>
                <span>{project.participants} participants</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Share2"
                  onClick={handleShare}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="CheckCircle"
                  onClick={handleVerifyProject}
                >
                  Verify
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleViewDetails}
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg organic-shadow-subtle border border-border overflow-hidden hover:organic-shadow-moderate organic-transition group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 organic-transition-slow"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </span>
        </div>
        <div className="absolute top-3 left-3">
          <div className="flex items-center space-x-1 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <Icon name="TrendingUp" size={12} className={getImpactColor(project.impactScore)} />
            <span className={`text-xs font-medium ${getImpactColor(project.impactScore)}`}>
              {project.impactScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-1">{project.title}</h3>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
            <div className="flex items-center space-x-1">
              <Icon name="MapPin" size={14} />
              <span>{project.region}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="TreePine" size={14} />
              <span>{project.type}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{project.carbonOffset} tons CO₂</span>
          <span>{project.participants} participants</span>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="Share2"
            onClick={handleShare}
            className="flex-1 text-muted-foreground hover:text-foreground"
          >
            Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="CheckCircle"
            onClick={handleVerifyProject}
            className="flex-1"
          >
            Verify
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleViewDetails}
            className="flex-1"
          >
            Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;