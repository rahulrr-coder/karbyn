import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ProjectHero from './components/ProjectHero';
import ProjectTabs from './components/ProjectTabs';
import ProjectMap from './components/ProjectMap';
import ProjectActions from './components/ProjectActions';
import ProjectComments from './components/ProjectComments';

const ProjectDetailsPage = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('id') || '1';

  // Mock project data
  const project = {
    id: projectId,
    title: "Amazon Rainforest Restoration Initiative",
    location: "Acre State, Brazil",
    shortDescription: "Community-driven reforestation project focused on restoring 500 hectares of degraded Amazon rainforest through native species planting and sustainable land management practices.",
    fullDescription: `The Amazon Rainforest Restoration Initiative represents a groundbreaking approach to combating deforestation through community-led conservation efforts. Located in Acre State, Brazil, this project spans 500 hectares of previously degraded land that will be restored to its natural rainforest state over a five-year period.\n\nOur methodology combines traditional indigenous knowledge with modern conservation science to ensure the highest success rates for tree survival and ecosystem restoration. The project directly involves 12 local communities, providing sustainable livelihoods while protecting one of the world's most critical carbon sinks.\n\nThe initiative focuses on planting native species that are crucial for biodiversity conservation, including Brazil nut trees, mahogany, and various fruit-bearing species that support local wildlife populations. Through careful monitoring and community stewardship, we aim to sequester over 2,500 tons of CO₂ annually once the forest reaches maturity.`,
    heroImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200",
    type: "Reforestation",
    verificationStatus: "verified",
    startDate: "March 2024",
    communitySize: 127,
    carbonOffset: "2,847",
    tokensEarned: "15,420",
    verificationScore: 96,
    validators: 43,
    coordinates: {
      lat: -9.0238,
      lng: -70.8120
    },
    areaCoverage: "500 hectares",
    elevation: "200-350m above sea level",
    methodology: [
      {
        icon: "Seedling",
        title: "Native Species Selection",
        description: "Carefully selected indigenous tree species based on soil analysis and local ecosystem requirements."
      },
      {
        icon: "Users",
        title: "Community Engagement",
        description: "Local communities trained in sustainable forestry practices and employed as forest guardians."
      },
      {
        icon: "BarChart3",
        title: "Scientific Monitoring",
        description: "Regular measurement of tree growth, soil carbon content, and biodiversity indicators."
      },
      {
        icon: "Shield",
        title: "Long-term Protection",
        description: "Legal frameworks and community agreements ensure permanent forest protection."
      }
    ],
    timeline: [
      {
        title: "Project Planning & Community Consultation",
        date: "January 2024",
        description: "Initial site assessment and community engagement sessions",
        completed: true,
        current: false
      },
      {
        title: "Soil Preparation & Seedling Cultivation",
        date: "February 2024",
        description: "Land preparation and establishment of local nurseries",
        completed: true,
        current: false
      },
      {
        title: "Phase 1 Planting (200 hectares)",
        date: "March 2024",
        description: "First major planting phase with 50,000 native seedlings",
        completed: true,
        current: false
      },
      {
        title: "Phase 2 Planting (200 hectares)",
        date: "September 2024",
        description: "Second planting phase during optimal growing season",
        completed: false,
        current: true
      },
      {
        title: "Phase 3 Planting (100 hectares)",
        date: "March 2025",
        description: "Final planting phase completing the 500-hectare restoration",
        completed: false,
        current: false
      },
      {
        title: "First Carbon Credit Verification",
        date: "December 2025",
        description: "Independent verification of carbon sequestration achievements",
        completed: false,
        current: false
      }
    ],
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
        caption: "Project site overview"
      },
      {
        url: "https://images.unsplash.com/photo-1574263867128-a3d5c1b1dedc?w=400",
        caption: "Native seedlings in nursery"
      },
      {
        url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400",
        caption: "Community planting day"
      },
      {
        url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400",
        caption: "Young trees after 6 months"
      },
      {
        url: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=400",
        caption: "Wildlife returning to area"
      },
      {
        url: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=400",
        caption: "Soil preparation work"
      }
    ],
    impactMetrics: [
      {
        icon: "TreePine",
        label: "Trees Planted",
        value: "127,500",
        change: "+12% this month",
        trend: "up"
      },
      {
        icon: "Leaf",
        label: "CO₂ Sequestered",
        value: "2,847 tons",
        change: "+8% this month",
        trend: "up"
      },
      {
        icon: "Users",
        label: "Community Members",
        value: "127",
        change: "+5 new members",
        trend: "up"
      },
      {
        icon: "Award",
        label: "Biodiversity Index",
        value: "8.4/10",
        change: "+0.3 this quarter",
        trend: "up"
      }
    ],
    verificationBadges: [
      {
        name: "VCS Verified",
        description: "Verified Carbon Standard certified",
        icon: "Award",
        earned: true
      },
      {
        name: "Community Approved",
        description: "95%+ community verification score",
        icon: "Users",
        earned: true
      },
      {
        name: "Gold Standard",
        description: "Gold Standard for Global Goals",
        icon: "Star",
        earned: false
      },
      {
        name: "Biodiversity Certified",
        description: "Biodiversity conservation verified",
        icon: "Leaf",
        earned: true
      },
      {
        name: "Long-term Commitment",
        description: "25-year protection guarantee",
        icon: "Shield",
        earned: false
      },
      {
        name: "Transparency Leader",
        description: "Full documentation available",
        icon: "Eye",
        earned: true
      }
    ],
    certificationBodies: [
      {
        name: "Verified Carbon Standard",
        standard: "VCS v4.0"
      },
      {
        name: "Climate Action Reserve",
        standard: "Forest Protocol v5.0"
      },
      {
        name: "Gold Standard Foundation",
        standard: "GS4GG Land Use & Forests"
      }
    ],
    documentRequirements: [
      "Environmental Impact Assessment",
      "Community Consent Documentation",
      "Baseline Carbon Stock Analysis",
      "Species Selection Justification",
      "Monitoring & Verification Plan",
      "Risk Assessment & Mitigation",
      "Stakeholder Engagement Records"
    ]
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/landing-page', icon: 'Home' },
    { label: 'Projects', path: '/projects-listing', icon: 'TreePine' },
    { label: project.title, path: '/project-details', icon: 'FileText', isActive: true }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        <Breadcrumb customItems={breadcrumbItems} />
        
        {/* Hero Section */}
        <div className="mb-8">
          <ProjectHero project={project} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Tabs */}
            <ProjectTabs project={project} />
            
            {/* Project Map */}
            <ProjectMap project={project} />
            
            {/* Comments Section */}
            <ProjectComments project={project} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <ProjectActions project={project} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProjectDetailsPage;