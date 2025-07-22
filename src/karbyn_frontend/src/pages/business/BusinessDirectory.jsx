import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';

const BusinessDirectory = () => {
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  
  // Mock business data
  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockBusinesses = [
        {
          id: 1,
          name: 'EcoTech Solutions',
          logo: '🏢',
          industry: 'Technology',
          description: 'Providing sustainable technology solutions for businesses worldwide. Specializing in energy-efficient hardware and carbon-neutral cloud services.',
          verified: true,
          partnershipType: 'Offset Provider',
          impactMetric: '12,450 kg CO₂ offset',
          location: 'San Francisco, CA',
          website: 'ecotechsolutions.com',
          joinedDate: '2024-03-15'
        },
        {
          id: 2,
          name: 'Green Transport Co.',
          logo: '🚌',
          industry: 'Transportation',
          description: 'Electric vehicle fleet offering sustainable transportation options. Committed to zero-emission mobility solutions for urban environments.',
          verified: true,
          partnershipType: 'Service Provider',
          impactMetric: '8,320 kg CO₂ offset',
          location: 'Portland, OR',
          website: 'greentransport.co',
          joinedDate: '2024-04-22'
        },
        {
          id: 3,
          name: 'Sustainable Apparel',
          logo: '👕',
          industry: 'Fashion',
          description: 'Eco-friendly clothing made from recycled materials and sustainable practices. Transparent supply chain with fair labor standards.',
          verified: true,
          partnershipType: 'Product Partner',
          impactMetric: '5,780 kg CO₂ offset',
          location: 'Austin, TX',
          website: 'sustainableapparel.com',
          joinedDate: '2024-02-08'
        },
        {
          id: 4,
          name: 'Clean Energy Partners',
          logo: '⚡',
          industry: 'Energy',
          description: 'Renewable energy solutions for residential and commercial applications. Specializing in solar, wind, and geothermal installations.',
          verified: false,
          partnershipType: 'Offset Provider',
          impactMetric: 'Verification in progress',
          location: 'Denver, CO',
          website: 'cleanenergypartners.org',
          joinedDate: '2024-06-30'
        },
        {
          id: 5,
          name: 'Organic Harvest Co-op',
          logo: '🌱',
          industry: 'Agriculture',
          description: 'Community-supported agriculture with regenerative farming practices. Providing local, organic produce with minimal carbon footprint.',
          verified: true,
          partnershipType: 'Product Partner',
          impactMetric: '4,120 kg CO₂ offset',
          location: 'Burlington, VT',
          website: 'organicharvest.coop',
          joinedDate: '2024-01-15'
        },
        {
          id: 6,
          name: 'EcoStay Hospitality',
          logo: '🏨',
          industry: 'Hospitality',
          description: 'Eco-friendly accommodations with sustainable practices. Zero-waste policies and energy-efficient facilities.',
          verified: true,
          partnershipType: 'Service Provider',
          impactMetric: '7,650 kg CO₂ offset',
          location: 'Asheville, NC',
          website: 'ecostay.com',
          joinedDate: '2024-05-12'
        },
        {
          id: 7,
          name: 'Circular Packaging',
          logo: '📦',
          industry: 'Manufacturing',
          description: 'Innovative packaging solutions designed for reuse and recycling. Eliminating single-use plastics from supply chains.',
          verified: false,
          partnershipType: 'Product Partner',
          impactMetric: 'Verification in progress',
          location: 'Seattle, WA',
          website: 'circularpackaging.co',
          joinedDate: '2024-07-05'
        },
        {
          id: 8,
          name: 'Green Finance Group',
          logo: '💰',
          industry: 'Finance',
          description: 'Financial services focused on sustainable investments and ESG principles. Funding climate-positive projects and initiatives.',
          verified: true,
          partnershipType: 'Offset Provider',
          impactMetric: '15,780 kg CO₂ offset',
          location: 'New York, NY',
          website: 'greenfinancegroup.com',
          joinedDate: '2023-11-20'
        }
      ];
      
      setBusinesses(mockBusinesses);
      setFilteredBusinesses(mockBusinesses);
      setLoading(false);
    };
    
    fetchBusinesses();
  }, []);
  
  // Filter businesses based on search term and filters
  useEffect(() => {
    let results = businesses;
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(business => 
        business.name.toLowerCase().includes(term) || 
        business.description.toLowerCase().includes(term) ||
        business.industry.toLowerCase().includes(term)
      );
    }
    
    // Apply industry filter
    if (industryFilter !== 'all') {
      results = results.filter(business => business.industry === industryFilter);
    }
    
    // Apply verification filter
    if (verificationFilter !== 'all') {
      const isVerified = verificationFilter === 'verified';
      results = results.filter(business => business.verified === isVerified);
    }
    
    setFilteredBusinesses(results);
  }, [searchTerm, industryFilter, verificationFilter, businesses]);
  
  // Get unique industries for filter
  const industries = [...new Set(businesses.map(business => business.industry))];
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Business Directory</h1>
              <p className="text-muted-foreground mt-1">
                Explore our network of eco-conscious business partners
              </p>
            </div>
            <Link
              to="/business/partnership"
              className="text-muted-foreground hover:text-foreground organic-transition"
            >
              ← Back to Partnerships
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-card rounded-lg organic-shadow-subtle border border-border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search businesses..."
                  className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  <Icon name="Search" size={16} />
                </div>
              </div>
            </div>
            
            {/* Industry Filter */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Industry
              </label>
              <select
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
                className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="all">All Industries</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>
            
            {/* Verification Filter */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Verification Status
              </label>
              <select
                value={verificationFilter}
                onChange={(e) => setVerificationFilter(e.target.value)}
                className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="all">All Statuses</option>
                <option value="verified">Verified Only</option>
                <option value="pending">Pending Verification</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Business Listings */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredBusinesses.length === 0 ? (
          <div className="bg-card rounded-lg organic-shadow-subtle border border-border p-12 text-center">
            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Search" size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No businesses found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We couldn't find any businesses matching your search criteria. Try adjusting your filters or search term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBusinesses.map(business => (
              <div 
                key={business.id}
                className="bg-card rounded-lg organic-shadow-subtle border border-border overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center text-3xl mr-4">
                      {business.logo}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-foreground">{business.name}</h3>
                        {business.verified ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            <Icon name="BadgeCheck" size={12} className="mr-1" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                            <Icon name="Clock" size={12} className="mr-1" />
                            Pending
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground mt-1 space-x-2">
                        <span>{business.industry}</span>
                        <span>•</span>
                        <span>{business.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-4">
                    {business.description}
                  </p>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-xs font-medium">
                      <span className="text-primary">{business.impactMetric}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Joined {formatDate(business.joinedDate)}
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/30 px-6 py-3 border-t border-border flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    {business.partnershipType}
                  </div>
                  <div className="flex items-center space-x-3">
                    {business.website && (
                      <a 
                        href={`https://${business.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-accent hover:text-accent/80 flex items-center organic-transition"
                      >
                        <Icon name="ExternalLink" size={12} className="mr-1" />
                        Website
                      </a>
                    )}
                    <Link 
                      to={`/business/profile/${business.id}`}
                      className="text-xs text-primary hover:text-primary/80 flex items-center organic-transition"
                    >
                      View Profile
                      <Icon name="ChevronRight" size={12} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Join CTA */}
        <div className="mt-8 bg-card rounded-lg organic-shadow-subtle border border-border p-6 text-center">
          <h3 className="text-xl font-semibold text-foreground mb-2">Join Our Business Network</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Become a verified business partner and showcase your commitment to sustainability. 
            Connect with eco-conscious consumers and access our carbon marketplace.
          </p>
          <Link 
            to="/business/partnership?tab=apply"
            className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 organic-transition"
          >
            Apply for Partnership
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BusinessDirectory;
