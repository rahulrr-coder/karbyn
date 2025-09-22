import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/CleanAuthContext';
import { useNavigate } from 'react-router-dom';
import ClaimSubmissionForm from '../components/ClaimSubmissionForm';
import PostLoginRegistrationModal from '../components/PostLoginRegistrationModal';

const ProfileDropdown = ({ isOpen, onToggle, onRegistrationClick, onLogout }) => {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg border hover:shadow-md transition-all duration-200"
        style={{ 
          backgroundColor: '#FFFFFF',
          borderColor: '#EAEAEA',
          color: '#333333'
        }}
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1E392A' }}>
          <span className="text-white text-sm font-medium">U</span>
        </div>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border shadow-lg z-50" style={{ borderColor: '#EAEAEA' }}>
          <div className="py-2">
            <button
              onClick={onRegistrationClick}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors duration-200"
              style={{ color: '#333333' }}
            >
              Register as NGO/Community
            </button>
            <button
              onClick={onLogout}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors duration-200"
              style={{ color: '#333333' }}
            >
              Disconnect Wallet
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const { isAuthenticated, principal, logout, walletType } = useAuth();
  const navigate = useNavigate();
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [userStats, setUserStats] = useState({
    totalClaims: 0,
    verifiedClaims: 0,
    tokensEarned: 0,
    nftsOwned: 0
  });
  const [submittedProjects, setSubmittedProjects] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    
    // Load submitted projects from localStorage
    const savedProjects = localStorage.getItem(`karbyn-submitted-projects-${principal?.toString()}`);
    if (savedProjects) {
      try {
        const projects = JSON.parse(savedProjects);
        setSubmittedProjects(projects);
        setUserStats(prev => ({
          ...prev,
          totalClaims: projects.length,
          verifiedClaims: projects.filter(p => p.status === 'verified').length
        }));
      } catch (error) {
        console.error('Error loading submitted projects:', error);
      }
    }
  }, [isAuthenticated, principal]);

  const handleClaimSubmit = async (claimData) => {
    try {
      console.log('Submitting claim:', claimData);
      // TODO: Integrate with backend
      alert('Claim submitted successfully! It will be reviewed by our verification team.');
      setShowClaimForm(false);
    } catch (error) {
      console.error('Error submitting claim:', error);
      alert('Error submitting claim. Please try again.');
    }
  };

  const handleRegistrationSubmit = async (registrationData) => {
    try {
      console.log('Submitting registration:', registrationData);
      // TODO: Integrate with backend
      alert('Registration submitted successfully!');
    } catch (error) {
      console.error('Error submitting registration:', error);
      alert('Error submitting registration. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
    setShowProfileDropdown(false);
  };

  const formatPrincipal = (principal) => {
    if (!principal) return '';
    const str = principal.toString();
    return str.length > 10 ? `${str.slice(0, 6)}...${str.slice(-4)}` : str;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F8F8F4' }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#1E392A' }}>Access Denied</h2>
          <p style={{ color: '#333333' }}>Please connect your wallet to access the dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F8F4' }}>
      {/* Header */}
      <header className="border-b px-6 py-4" style={{ 
        backgroundColor: '#FFFFFF',
        borderColor: '#EAEAEA'
      }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#1E392A' }}>Karbyn Dashboard</h1>
            <p className="text-sm" style={{ color: '#333333' }}>
              Connected: {formatPrincipal(principal)} ({walletType})
            </p>
          </div>
          
          <ProfileDropdown
            isOpen={showProfileDropdown}
            onToggle={() => setShowProfileDropdown(!showProfileDropdown)}
            onRegistrationClick={() => {
              setShowRegistrationModal(true);
              setShowProfileDropdown(false);
            }}
            onLogout={handleLogout}
          />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#EAEAEA' }}>
            <h3 className="text-sm font-medium mb-2" style={{ color: '#333333' }}>Total Claims</h3>
            <p className="text-3xl font-bold" style={{ color: '#1E392A' }}>{userStats.totalClaims}</p>
          </div>
          <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#EAEAEA' }}>
            <h3 className="text-sm font-medium mb-2" style={{ color: '#333333' }}>Verified Claims</h3>
            <p className="text-3xl font-bold" style={{ color: '#1E392A' }}>{userStats.verifiedClaims}</p>
          </div>
          <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#EAEAEA' }}>
            <h3 className="text-sm font-medium mb-2" style={{ color: '#333333' }}>Tokens Earned</h3>
            <p className="text-3xl font-bold" style={{ color: '#1E392A' }}>{userStats.tokensEarned}</p>
          </div>
          <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#EAEAEA' }}>
            <h3 className="text-sm font-medium mb-2" style={{ color: '#333333' }}>NFTs Owned</h3>
            <p className="text-3xl font-bold" style={{ color: '#1E392A' }}>{userStats.nftsOwned}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Submit New Project */}
          <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#EAEAEA' }}>
            <h2 className="text-lg font-bold mb-3" style={{ color: '#1E392A' }}>Submit New Project</h2>
            <p className="mb-4 text-sm" style={{ color: '#333333' }}>
              Add your carbon offset project to the platform for verification and funding.
            </p>
            <button
              onClick={() => navigate('/submit-project')}
              className="w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
              style={{ 
                backgroundColor: '#1E392A',
                color: '#FFFFFF'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#2d5a40'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#1E392A'}
            >
              Submit Project
            </button>
          </div>

          {/* Browse Marketplace */}
          <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#EAEAEA' }}>
            <h2 className="text-lg font-bold mb-3" style={{ color: '#1E392A' }}>Browse Marketplace</h2>
            <p className="mb-4 text-sm" style={{ color: '#333333' }}>
              Discover and purchase verified carbon credit NFTs from global projects.
            </p>
            <button
              onClick={() => navigate('/marketplace')}
              className="w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 border hover:shadow-md"
              style={{ 
                borderColor: '#1E392A',
                color: '#1E392A',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#1E392A';
                e.target.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#1E392A';
              }}
            >
              View Marketplace
            </button>
          </div>

          {/* View Projects */}
          <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#EAEAEA' }}>
            <h2 className="text-lg font-bold mb-3" style={{ color: '#1E392A' }}>Explore Projects</h2>
            <p className="mb-4 text-sm" style={{ color: '#333333' }}>
              Browse active carbon offset projects and their verification status.
            </p>
            <button
              onClick={() => navigate('/projects-listing')}
              className="w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 border hover:shadow-md"
              style={{ 
                borderColor: '#EAEAEA',
                color: '#333333',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              Browse Projects
            </button>
          </div>
        </div>

        {/* Legacy Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Submit Individual Carbon Credit */}
          <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#EAEAEA' }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: '#1E392A' }}>Individual Carbon Credits</h2>
            <p className="mb-6" style={{ color: '#333333' }}>
              Submit your personal eco-friendly activities to earn micro carbon credits.
            </p>
            <button
              onClick={() => navigate('/submit-activity')}
              className="w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 border hover:shadow-md"
              style={{ 
                borderColor: '#1E392A',
                color: '#1E392A',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#1E392A';
                e.target.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#1E392A';
              }}
            >
              Submit Activity
            </button>
          </div>

          {/* My Submitted Projects */}
          <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#EAEAEA' }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: '#1E392A' }}>My Projects</h2>
            {submittedProjects.length > 0 ? (
              <div className="space-y-3">
                {submittedProjects.slice(0, 3).map((project, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg" style={{ borderColor: '#EAEAEA' }}>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm" style={{ color: '#1E392A' }}>
                        {project.name || `Project ${project.id}`}
                      </h4>
                      <p className="text-xs" style={{ color: '#333333' }}>
                        {project.type} • {project.carbonImpact} tCO₂e/year
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'verified' 
                        ? 'bg-green-100 text-green-800'
                        : project.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.status === 'pending' ? 'Under Verification' : project.status}
                    </span>
                  </div>
                ))}
                <button
                  onClick={() => navigate('/projects-listing')}
                  className="w-full mt-3 py-2 px-4 text-sm border rounded-lg hover:bg-gray-50"
                  style={{ borderColor: '#EAEAEA', color: '#333333' }}
                >
                  View All Projects
                </button>
              </div>
            ) : (
              <div className="text-center py-8" style={{ color: '#333333' }}>
                <p>No projects submitted yet</p>
                <p className="text-sm mt-2">Submit your first project to get started!</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity Section - Removed the old claim form */}
      </div>

      {/* Registration Modal */}
      <PostLoginRegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        onSubmit={handleRegistrationSubmit}
      />
    </div>
  );
};

export default Dashboard;
