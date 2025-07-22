import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import ProjectOverview from './ProjectOverview';
import ProjectImpactData from './ProjectImpactData';
import ProjectVerification from './ProjectVerification';
import ProjectDocumentation from './ProjectDocumentation';

const ProjectTabs = ({ project }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: 'FileText',
      component: ProjectOverview
    },
    {
      id: 'impact',
      label: 'Impact Data',
      icon: 'BarChart3',
      component: ProjectImpactData
    },
    {
      id: 'verification',
      label: 'Verification',
      icon: 'Shield',
      component: ProjectVerification
    },
    {
      id: 'documentation',
      label: 'Documentation',
      icon: 'FolderOpen',
      component: ProjectDocumentation
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="bg-card rounded-lg organic-shadow-subtle">
      {/* Tab Navigation */}
      <div className="border-b border-border">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-4 text-sm font-medium whitespace-nowrap border-b-2 organic-transition ${
                activeTab === tab.id
                  ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              <Icon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6 md:p-8">
        {ActiveComponent && <ActiveComponent project={project} />}
      </div>
    </div>
  );
};

export default ProjectTabs;