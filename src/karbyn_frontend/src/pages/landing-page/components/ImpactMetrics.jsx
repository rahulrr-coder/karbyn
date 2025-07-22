import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const ImpactMetrics = () => {
  const [counters, setCounters] = useState({
    carbonOffset: 0,
    activeProjects: 0,
    tokensMinted: 0,
    communityMembers: 0
  });

  const targetValues = {
    carbonOffset: 12470,
    activeProjects: 156,
    tokensMinted: 248910,
    communityMembers: 3420
  };

  const metrics = [
    {
      id: 'carbonOffset',
      icon: 'Leaf',
      label: 'Carbon Offset',
      value: counters.carbonOffset,
      unit: 'tons CO₂',
      color: 'primary',
      description: 'Total carbon dioxide offset through verified projects'
    },
    {
      id: 'activeProjects',
      icon: 'TreePine',
      label: 'Active Projects',
      value: counters.activeProjects,
      unit: 'projects',
      color: 'secondary',
      description: 'Currently running climate action initiatives'
    },
    {
      id: 'tokensMinted',
      icon: 'Coins',
      label: 'Tokens Minted',
      value: counters.tokensMinted,
      unit: 'KRB',
      color: 'accent',
      description: 'Tokenized carbon credits in circulation'
    },
    {
      id: 'communityMembers',
      icon: 'Users',
      label: 'Community Members',
      value: counters.communityMembers,
      unit: 'members',
      color: 'primary',
      description: 'Active participants in climate verification'
    }
  ];

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    const intervals = Object.keys(targetValues).map(key => {
      const target = targetValues[key];
      const increment = target / steps;
      let current = 0;
      let step = 0;

      return setInterval(() => {
        step++;
        current = Math.min(Math.floor(increment * step), target);
        
        setCounters(prev => ({
          ...prev,
          [key]: current
        }));

        if (step >= steps) {
          clearInterval(intervals.find(interval => interval === this));
        }
      }, stepDuration);
    });

    return () => {
      intervals.forEach(interval => clearInterval(interval));
    };
  }, []);

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  const getColorClasses = (color) => {
    switch (color) {
      case 'primary':
        return {
          bg: 'bg-primary/10',
          icon: 'text-primary',
          border: 'border-primary/20'
        };
      case 'secondary':
        return {
          bg: 'bg-secondary/10',
          icon: 'text-secondary',
          border: 'border-secondary/20'
        };
      case 'accent':
        return {
          bg: 'bg-accent/10',
          icon: 'text-accent',
          border: 'border-accent/20'
        };
      default:
        return {
          bg: 'bg-muted',
          icon: 'text-muted-foreground',
          border: 'border-border'
        };
    }
  };

  return (
    <section className="py-16 bg-surface">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Global Impact Metrics
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time data showcasing the collective environmental impact achieved through our decentralized climate action platform.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric) => {
            const colors = getColorClasses(metric.color);
            
            return (
              <div
                key={metric.id}
                className={`bg-card rounded-2xl p-6 organic-shadow-subtle hover:organic-shadow-moderate organic-transition border ${colors.border} group`}
              >
                {/* Icon */}
                <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 organic-transition`}>
                  <Icon name={metric.icon} size={24} className={colors.icon} />
                </div>

                {/* Value */}
                <div className="mb-2">
                  <div className="text-2xl md:text-3xl font-bold text-foreground">
                    {formatNumber(metric.value)}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {metric.unit}
                  </div>
                </div>

                {/* Label */}
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  {metric.label}
                </h3>

                {/* Description */}
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {metric.description}
                </p>

                {/* Progress Indicator */}
                <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${colors.bg.replace('/10', '')} organic-transition`}
                    style={{
                      width: `${(metric.value / targetValues[metric.id]) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 bg-card rounded-full px-6 py-3 organic-shadow-subtle border border-border">
            <Icon name="TrendingUp" size={16} className="text-primary" />
            <span className="text-sm text-muted-foreground">
              Updated in real-time • Last sync: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactMetrics;