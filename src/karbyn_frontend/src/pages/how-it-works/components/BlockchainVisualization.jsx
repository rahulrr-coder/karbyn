import React from 'react';
import Icon from '../../../components/AppIcon';

const BlockchainVisualization = () => {
  const blockchainSteps = [
    {
      id: 1,
      title: "Project Submission",
      description: "Data recorded on blockchain",
      icon: "FileText",
      status: "completed"
    },
    {
      id: 2,
      title: "Community Voting",
      description: "Decentralized verification",
      icon: "Vote",
      status: "completed"
    },
    {
      id: 3,
      title: "Smart Contract",
      description: "Automated validation",
      icon: "Zap",
      status: "active"
    },
    {
      id: 4,
      title: "Token Minting",
      description: "Rewards distribution",
      icon: "Coins",
      status: "pending"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'active':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending':
        return 'bg-gray-100 text-gray-500 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-500 border-gray-200';
    }
  };

  return (
    <div className="bg-card rounded-lg organic-shadow-subtle p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Blockchain Verification Process
        </h3>
        <p className="text-muted-foreground">
          Transparent and immutable climate action tracking
        </p>
      </div>

      {/* Blockchain Flow */}
      <div className="space-y-4">
        {blockchainSteps.map((step, index) => (
          <div key={step.id} className="relative">
            <div className={`flex items-center space-x-4 p-4 rounded-lg border organic-transition ${getStatusColor(step.status)}`}>
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <Icon name={step.icon} size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{step.title}</h4>
                <p className="text-sm opacity-80">{step.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                {step.status === 'completed' && (
                  <Icon name="CheckCircle" size={20} className="text-green-600" />
                )}
                {step.status === 'active' && (
                  <Icon name="Clock" size={20} className="text-blue-600" />
                )}
                {step.status === 'pending' && (
                  <Icon name="Circle" size={20} className="text-gray-400" />
                )}
              </div>
            </div>

            {/* Connecting Line */}
            {index < blockchainSteps.length - 1 && (
              <div className="flex justify-center py-2">
                <div className="w-0.5 h-6 bg-border" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Blockchain Stats */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">99.9%</div>
            <div className="text-xs text-muted-foreground">Uptime</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">1,247</div>
            <div className="text-xs text-muted-foreground">Verified Projects</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">24/7</div>
            <div className="text-xs text-muted-foreground">Monitoring</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainVisualization;