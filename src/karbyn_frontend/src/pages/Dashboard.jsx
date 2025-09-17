import React from 'react';
import { useAuth } from '../contexts/CleanAuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout, isAuthenticated, walletType } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold">K</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Karbyn Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Connected with: <span className="font-medium text-green-600">{walletType}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Welcome Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">👋</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Welcome!</h3>
                  <p className="text-sm text-gray-500">You're successfully logged in</p>
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Info Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">💼</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Wallet</h3>
                  <p className="text-sm text-gray-500">{walletType}</p>
                  {user?.principal && (
                    <p className="text-xs text-gray-400 mt-1 font-mono">
                      {user.principal.slice(0, 8)}...{user.principal.slice(-8)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Features Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">🚀</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Features</h3>
                  <p className="text-sm text-gray-500">Coming soon...</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Content */}
        <div className="mt-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Your Account</h3>
            </div>
            <div className="p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Wallet Type</dt>
                  <dd className="mt-1 text-sm text-gray-900">{walletType}</dd>
                </div>
                {user?.principal && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Principal ID</dt>
                    <dd className="mt-1 text-sm text-gray-900 font-mono break-all">{user.principal}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm font-medium text-gray-500">Connection Status</dt>
                  <dd className="mt-1 text-sm text-green-600 font-medium">Connected</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Session</dt>
                  <dd className="mt-1 text-sm text-gray-900">Active</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
