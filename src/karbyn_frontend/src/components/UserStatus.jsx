import { useWeb3Auth } from "@web3auth/modal/react";
import { useAuth } from "../contexts/SimpleAuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserStatus() {
  const { web3Auth, isConnected: isWeb3Connected } = useWeb3Auth();
  const { isAuthenticated, logout: simpleAuthLogout, principal } = useAuth();
  const [web3User, setWeb3User] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserInfo = async () => {
      if (web3Auth && isWeb3Connected) {
        try {
          const userInfo = await web3Auth.getUserInfo();
          setWeb3User(userInfo);
        } catch (error) {
          console.error("Error getting user info:", error);
        }
      }
    };
    getUserInfo();
  }, [web3Auth, isWeb3Connected]);

  const handleLogout = async () => {
    try {
      if (isWeb3Connected && web3Auth) {
        await web3Auth.logout();
      }
      if (isAuthenticated) {
        await simpleAuthLogout();
      }
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!isWeb3Connected && !isAuthenticated) {
    return null;
  }

  return (
    <div className="flex items-center space-x-3">
      {/* Connection Status Indicator */}
      <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-xs text-green-700 font-medium">
          {isWeb3Connected ? "Google" : "Internet Identity"}
        </span>
      </div>

      {/* User Profile Dropdown */}
      <div className="relative group">
        <button className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-500 to-blue-500">
            {isWeb3Connected && web3User?.profileImage ? (
              <img 
                src={web3User.profileImage} 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <span className="text-white text-xs font-bold">
                {isWeb3Connected 
                  ? (web3User?.name?.slice(0, 2).toUpperCase() || 'GU')
                  : 'II'
                }
              </span>
            )}
          </div>

          {/* User Name/Principal */}
          <div className="hidden sm:block text-left">
            <div className="text-sm font-medium text-gray-900">
              {isWeb3Connected 
                ? (web3User?.name || 'Google User')
                : 'Internet Identity'
              }
            </div>
            <div className="text-xs text-gray-500">
              {isWeb3Connected 
                ? web3User?.email 
                : `${principal?.slice(0, 8)}...${principal?.slice(-6)}`
              }
            </div>
          </div>

          {/* Dropdown Icon */}
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {/* Dropdown Menu */}
        <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          {/* User Info Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
                {isWeb3Connected && web3User?.profileImage ? (
                  <img 
                    src={web3User.profileImage} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="text-white text-sm font-bold">
                    {isWeb3Connected 
                      ? (web3User?.name?.slice(0, 2).toUpperCase() || 'GU')
                      : 'II'
                    }
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {isWeb3Connected 
                    ? (web3User?.name || 'Google User')
                    : 'Internet Identity'
                  }
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {isWeb3Connected 
                    ? web3User?.email 
                    : principal
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-1">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5v4M16 5v4" />
              </svg>
              <span>Dashboard</span>
            </button>
            
            <button
              onClick={() => navigate("/profile")}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Profile</span>
            </button>

            <hr className="my-1" />
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
