import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = ({ customItems = null }) => {
  const location = useLocation();
  
  const routeMap = {
    '/': { label: 'Home', icon: 'Home' },
    '/landing-page': { label: 'Home', icon: 'Home' },
    '/how-it-works': { label: 'How It Works', icon: 'Info' },
    '/impact-dashboard': { label: 'Dashboard', icon: 'BarChart3' },
    '/projects-listing': { label: 'Projects', icon: 'TreePine' },
    '/project-details': { label: 'Project Details', icon: 'FileText' },
    '/submit-project': { label: 'Submit Project', icon: 'Plus' }
  };

  const generateBreadcrumbs = () => {
    if (customItems) return customItems;

    const currentPath = location.pathname;
    const breadcrumbs = [];

    // Always start with Home
    breadcrumbs.push({
      label: 'Home',
      path: '/landing-page',
      icon: 'Home'
    });

    // Add current page if not home
    if (currentPath !== '/landing-page' && currentPath !== '/' && routeMap[currentPath]) {
      // Add intermediate breadcrumb for project details
      if (currentPath === '/project-details') {
        breadcrumbs.push({
          label: 'Projects',
          path: '/projects-listing',
          icon: 'TreePine'
        });
      }

      breadcrumbs.push({
        label: routeMap[currentPath].label,
        path: currentPath,
        icon: routeMap[currentPath].icon,
        isActive: true
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on landing page unless custom items provided
  if ((location.pathname === '/landing-page' || location.pathname === '/') && !customItems) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((item, index) => (
          <li key={item.path || index} className="flex items-center">
            {index > 0 && (
              <Icon 
                name="ChevronRight" 
                size={16} 
                className="mx-2 text-muted-foreground/60" 
              />
            )}
            
            {item.isActive ? (
              <span className="flex items-center space-x-1 text-foreground font-medium">
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
              </span>
            ) : (
              <Link
                to={item.path}
                className="flex items-center space-x-1 hover:text-foreground organic-transition"
              >
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;