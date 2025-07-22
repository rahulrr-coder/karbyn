import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ProjectOverview = ({ project }) => {
  return (
    <div className="space-y-8">
      {/* Project Description */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-4">
          Project Description
        </h3>
        <div className="prose prose-sm max-w-none text-muted-foreground">
          <p className="leading-relaxed mb-4">
            {project.fullDescription}
          </p>
          <p className="leading-relaxed">
            This initiative represents a significant step forward in community-driven environmental action, 
            combining traditional conservation methods with modern blockchain verification to ensure 
            transparency and accountability in our climate impact efforts.
          </p>
        </div>
      </div>

      {/* Methodology */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-4">
          Methodology
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {project.methodology.map((method, index) => (
            <div key={index} className="bg-surface rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name={method.icon} size={16} color="white" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">
                    {method.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {method.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Timeline */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-4">
          Project Timeline
        </h3>
        <div className="space-y-4">
          {project.timeline.map((milestone, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className={`w-4 h-4 rounded-full flex-shrink-0 mt-1 ${
                milestone.completed 
                  ? 'bg-success' 
                  : milestone.current 
                  ? 'bg-primary' :'bg-muted'
              }`} />
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h4 className={`font-medium ${
                    milestone.completed || milestone.current 
                      ? 'text-foreground' 
                      : 'text-muted-foreground'
                  }`}>
                    {milestone.title}
                  </h4>
                  <span className="text-sm text-muted-foreground">
                    {milestone.date}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {milestone.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Gallery */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-4">
          Project Gallery
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {project.gallery.map((image, index) => (
            <div key={index} className="aspect-square rounded-lg overflow-hidden organic-shadow-subtle">
              <Image
                src={image.url}
                alt={image.caption}
                className="w-full h-full object-cover hover:scale-105 organic-transition"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectOverview;