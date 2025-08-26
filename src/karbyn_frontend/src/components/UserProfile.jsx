import { useEffect, useState } from "react";
import { useWeb3Auth } from "@web3auth/modal/react";

export default function UserProfile() {
  const { web3Auth, isConnected } = useWeb3Auth();
  const [info, setInfo] = useState(null);
  
  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!web3Auth || !isConnected) return;
      try {
        const user = await web3Auth.getUserInfo();
        if (active) setInfo(user || null);
        console.log("[Web3Auth] userInfo", user);
      } catch (e) { 
        console.error("[Web3Auth] getUserInfo error", e); 
      }
    };
    load();
    return () => { active = false; };
  }, [web3Auth, isConnected]);
  
  if (!isConnected) return null;
  
  const onLogout = async () => {
    try { 
      await web3Auth.logout(); 
      console.log("[Web3Auth] logout: success"); 
    }
    catch (e) { 
      console.error("[Web3Auth] logout: error", e); 
    }
  };
  
  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-50 rounded-lg">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-xs text-green-700 font-medium">Google Connected</span>
      </div>
      <div className="relative group">
        <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
            {info?.profileImage ? (
              <img 
                src={info.profileImage} 
                alt="Profile" 
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <span className="text-white text-xs font-bold">
                {info?.name?.slice(0, 2).toUpperCase() || 'GU'}
              </span>
            )}
          </div>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {/* Dropdown Menu */}
        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="p-3 border-b border-gray-100">
            <p className="text-xs text-gray-500">Google Account</p>
            <p className="text-sm text-gray-700 truncate">
              {info?.email || info?.name || 'Google User'}
            </p>
          </div>
          <div className="p-1">
            <button
              onClick={onLogout}
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
