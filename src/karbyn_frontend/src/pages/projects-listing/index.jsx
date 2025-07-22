import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ProjectCard from './components/ProjectCard';
import FilterPanel from './components/FilterPanel';
import SearchAndSort from './components/SearchAndSort';
import ActiveFilters from './components/ActiveFilters';
import EmptyState from './components/EmptyState';
import LoadingState from './components/LoadingState';

import Button from '../../components/ui/Button';

const ProjectsListing = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    location: '',
    projectType: '',
    status: '',
    impactRange: '',
    dateRange: '',
    minCarbonOffset: '',
    maxCarbonOffset: ''
  });

  const itemsPerPage = 12;

  // Mock projects data
  const mockProjects = [
    {
      id: 1,
      title: "Amazon Rainforest Restoration Initiative",
      description: `Large-scale reforestation project aimed at restoring 50,000 hectares of degraded Amazon rainforest.\nFocusing on native species restoration and community involvement to create sustainable carbon sequestration.`,
      region: "Brazil, South America",
      type: "reforestation",
      impactScore: 92,
      status: "verified",
      carbonOffset: 125000,
      participants: 1247,
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=300&fit=crop",
      createdAt: new Date('2024-01-15'),
      verificationProgress: 100
    },
    {
      id: 2,
      title: "Solar Energy Cooperative - Rural Kenya",
      description: `Community-driven solar energy project providing clean electricity to 25 rural villages in Kenya.\nReducing reliance on fossil fuels while creating local employment opportunities.`,
      region: "Kenya, Africa",
      type: "renewable-energy",
      impactScore: 87,
      status: "verified",
      carbonOffset: 45000,
      participants: 892,
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=500&h=300&fit=crop",
      createdAt: new Date('2024-02-20'),
      verificationProgress: 100
    },
    {
      id: 3,
      title: "Ocean Plastic Cleanup & Recycling",
      description: `Innovative ocean cleanup project removing plastic waste from Pacific Ocean gyres.\nConverting collected plastic into sustainable building materials for coastal communities.`,
      region: "Pacific Ocean, International",
      type: "ocean-conservation",
      impactScore: 78,
      status: "in-review",
      carbonOffset: 32000,
      participants: 567,
      image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=500&h=300&fit=crop",
      createdAt: new Date('2024-03-10'),
      verificationProgress: 65
    },
    {
      id: 4,
      title: "Regenerative Agriculture Program",
      description: `Supporting 500 farmers in transitioning to regenerative agriculture practices.\nImproving soil health, biodiversity, and carbon sequestration across 10,000 acres.`,
      region: "Iowa, North America",
      type: "sustainable-agriculture",
      impactScore: 84,
      status: "verified",
      carbonOffset: 67000,
      participants: 423,
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&h=300&fit=crop",
      createdAt: new Date('2024-01-28'),
      verificationProgress: 100
    },
    {
      id: 5,
      title: "Wind Farm Development - Scotland",
      description: `Offshore wind farm project generating clean energy for 150,000 homes.\nReducing carbon emissions by 200,000 tons annually while creating green jobs.`,
      region: "Scotland, Europe",
      type: "renewable-energy",
      impactScore: 91,
      status: "verified",
      carbonOffset: 200000,
      participants: 1156,
      image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=500&h=300&fit=crop",
      createdAt: new Date('2024-02-05'),
      verificationProgress: 100
    },
    {
      id: 6,
      title: "Urban Waste-to-Energy Facility",
      description: `Converting municipal waste into clean energy for urban communities.\nDiverting 50,000 tons of waste from landfills annually while generating renewable electricity.`,
      region: "Singapore, Asia",
      type: "waste-management",
      impactScore: 76,
      status: "pending",
      carbonOffset: 89000,
      participants: 334,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop",
      createdAt: new Date('2024-03-15'),
      verificationProgress: 45
    },
    {
      id: 7,
      title: "Mangrove Restoration - Philippines",
      description: `Restoring 5,000 hectares of mangrove ecosystems along Philippine coastlines.\nProtecting communities from storm surge while sequestering carbon and supporting marine biodiversity.`,
      region: "Philippines, Asia",
      type: "reforestation",
      impactScore: 88,
      status: "verified",
      carbonOffset: 78000,
      participants: 678,
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=300&fit=crop",
      createdAt: new Date('2024-01-12'),
      verificationProgress: 100
    },
    {
      id: 8,
      title: "Carbon Capture Technology Pilot",
      description: `Testing innovative direct air capture technology in industrial settings.\nCapturing and storing 10,000 tons of CO2 annually while developing scalable solutions.`,
      region: "California, North America",
      type: "carbon-capture",
      impactScore: 82,
      status: "in-review",
      carbonOffset: 10000,
      participants: 156,
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500&h=300&fit=crop",
      createdAt: new Date('2024-03-01'),
      verificationProgress: 70
    },
    {
      id: 9,
      title: "Community Solar Gardens - India",
      description: `Establishing community-owned solar installations across rural Indian villages.\nProviding clean energy access while creating local ownership and maintenance jobs.`,
      region: "Rajasthan, Asia",
      type: "renewable-energy",
      impactScore: 85,
      status: "verified",
      carbonOffset: 56000,
      participants: 789,
      image: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=500&h=300&fit=crop",
      createdAt: new Date('2024-02-14'),
      verificationProgress: 100
    },
    {
      id: 10,
      title: "Peatland Restoration - Indonesia",
      description: `Restoring degraded tropical peatlands to prevent carbon emissions and fires.\nProtecting critical ecosystems while supporting local community livelihoods.`,
      region: "Sumatra, Asia",
      type: "reforestation",
      impactScore: 79,
      status: "pending",
      carbonOffset: 145000,
      participants: 445,
      image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=500&h=300&fit=crop",
      createdAt: new Date('2024-03-08'),
      verificationProgress: 30
    },
    {
      id: 11,
      title: "Biogas from Agricultural Waste",
      description: `Converting agricultural waste into clean biogas for rural energy needs.\nReducing methane emissions while providing sustainable energy solutions for farming communities.`,
      region: "Punjab, Asia",
      type: "waste-management",
      impactScore: 73,
      status: "in-review",
      carbonOffset: 34000,
      participants: 267,
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500&h=300&fit=crop",
      createdAt: new Date('2024-02-28'),
      verificationProgress: 55
    },
    {
      id: 12,
      title: "Coral Reef Restoration Project",
      description: `Restoring damaged coral reefs using innovative coral gardening techniques.\nProtecting marine ecosystems while supporting coastal protection and fisheries.`,
      region: "Great Barrier Reef, Oceania",
      type: "ocean-conservation",
      impactScore: 81,
      status: "verified",
      carbonOffset: 23000,
      participants: 389,
      image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=500&h=300&fit=crop",
      createdAt: new Date('2024-01-22'),
      verificationProgress: 100
    }
  ];

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = mockProjects;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    if (filters.location) {
      const locationMap = {
        'north-america': ['North America'],
        'south-america': ['South America'],
        'europe': ['Europe'],
        'asia': ['Asia'],
        'africa': ['Africa'],
        'oceania': ['Oceania']
      };
      const targetRegions = locationMap[filters.location] || [];
      filtered = filtered.filter(project =>
        targetRegions.some(region => project.region.includes(region))
      );
    }

    if (filters.projectType) {
      filtered = filtered.filter(project => project.type === filters.projectType);
    }

    if (filters.status) {
      filtered = filtered.filter(project => project.status === filters.status);
    }

    if (filters.impactRange) {
      const ranges = {
        'high': [80, 100],
        'medium': [60, 79],
        'low': [0, 59]
      };
      const [min, max] = ranges[filters.impactRange] || [0, 100];
      filtered = filtered.filter(project => 
        project.impactScore >= min && project.impactScore <= max
      );
    }

    if (filters.minCarbonOffset) {
      filtered = filtered.filter(project => 
        project.carbonOffset >= parseInt(filters.minCarbonOffset)
      );
    }

    if (filters.maxCarbonOffset) {
      filtered = filtered.filter(project => 
        project.carbonOffset <= parseInt(filters.maxCarbonOffset)
      );
    }

    if (filters.dateRange) {
      const now = new Date();
      const ranges = {
        'last-week': 7,
        'last-month': 30,
        'last-3-months': 90,
        'last-year': 365
      };
      const days = ranges[filters.dateRange];
      if (days) {
        const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(project => project.createdAt >= cutoffDate);
      }
    }

    // Apply sorting
    switch (sortBy) {
      case 'impact-score':
        filtered.sort((a, b) => b.impactScore - a.impactScore);
        break;
      case 'newest':
        filtered.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case 'verification':
        filtered.sort((a, b) => b.verificationProgress - a.verificationProgress);
        break;
      case 'carbon-offset':
        filtered.sort((a, b) => b.carbonOffset - a.carbonOffset);
        break;
      case 'participants':
        filtered.sort((a, b) => b.participants - a.participants);
        break;
      default: // relevance
        // Keep original order for relevance
        break;
    }

    return filtered;
  }, [mockProjects, searchQuery, filters, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProjects.length / itemsPerPage);
  const paginatedProjects = filteredAndSortedProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleRemoveFilter = (filterKey) => {
    const newFilters = { ...filters, [filterKey]: '' };
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearAllFilters = () => {
    const clearedFilters = {
      location: '',
      projectType: '',
      status: '',
      impactRange: '',
      dateRange: '',
      minCarbonOffset: '',
      maxCarbonOffset: ''
    };
    setFilters(clearedFilters);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => value !== '').length;
  };

  const hasActiveFilters = getActiveFilterCount() > 0 || searchQuery !== '';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
          <Breadcrumb />
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Climate Projects</h1>
            <p className="text-muted-foreground">
              Discover and verify community-driven carbon offset projects
            </p>
          </div>
          <LoadingState viewMode={viewMode} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        <Breadcrumb />
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Climate Projects</h1>
          <p className="text-muted-foreground">
            Discover and verify community-driven carbon offset projects making a real impact
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <FilterPanel
              isOpen={true}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              isMobile={false}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Search and Sort Controls */}
            <SearchAndSort
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onFilterToggle={() => setIsFilterPanelOpen(true)}
              activeFiltersCount={getActiveFilterCount()}
              resultsCount={filteredAndSortedProjects.length}
            />

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="mt-6">
                <ActiveFilters
                  filters={filters}
                  onRemoveFilter={handleRemoveFilter}
                  onClearAll={handleClearAllFilters}
                />
              </div>
            )}

            {/* Projects Grid/List */}
            <div className="mt-8">
              {filteredAndSortedProjects.length === 0 ? (
                <EmptyState
                  hasFilters={hasActiveFilters}
                  onClearFilters={handleClearAllFilters}
                />
              ) : (
                <>
                  <div className={
                    viewMode === 'list' ?'space-y-6' :'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6'
                  }>
                    {paginatedProjects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center space-x-2 mt-12">
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="ChevronLeft"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                      >
                        Previous
                      </Button>
                      
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "ghost"}
                              size="sm"
                              onClick={() => setCurrentPage(pageNum)}
                              className="w-10 h-10"
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="ChevronRight"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filter Panel */}
        <FilterPanel
          isOpen={isFilterPanelOpen}
          onClose={() => setIsFilterPanelOpen(false)}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          isMobile={true}
        />
      </main>

      <Footer />
    </div>
  );
};

export default ProjectsListing;