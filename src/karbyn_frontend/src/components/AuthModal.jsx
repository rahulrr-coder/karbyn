import { useState } from "react";
import { useWeb3Auth } from "@web3auth/modal/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/SimpleAuthContext";

export default function AuthModal({ isOpen, onClose }) {
  const { web3Auth, connect: web3Connect, isConnected: isWeb3Connected } = useWeb3Auth();
  const { login, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("web3auth");
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleWeb3AuthConnect = async () => {
    setIsLoading(true);
    try {
      console.log("[Web3Auth] connect: start");
      await web3Connect();
      console.log("[Web3Auth] connect: success");
      navigate("/dashboard");
      onClose();
    } catch (error) {
      console.error("[Web3Auth] connect: error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInternetIdentityConnect = () => {
    setIsLoading(true);
    try {
      login();
      navigate("/dashboard");
      onClose();
    } catch (error) {
      console.error("[Internet Identity] connect: error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Karbyn</h2>
          <p className="text-gray-600">Choose your preferred authentication method</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("web3auth")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === "web3auth"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Social Login
          </button>
          <button
            onClick={() => setActiveTab("ii")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === "ii"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Internet Identity
          </button>
        </div>

        {/* Content */}
        {activeTab === "web3auth" ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 text-center mb-6">
              Sign in with your existing social accounts for quick access
            </p>
            
            <button
              onClick={handleWeb3AuthConnect}
              disabled={isLoading || isWeb3Connected}
              className="w-full flex items-center justify-center space-x-3 py-3 px-4 bg-white border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <img 
                    src="https://developers.google.com/identity/images/g-logo.png" 
                    alt="Google" 
                    className="w-5 h-5"
                  />
                  <span className="font-medium text-gray-700">
                    {isWeb3Connected ? "Connected with Google" : "Continue with Google"}
                  </span>
                </>
              )}
            </button>

            {isWeb3Connected && (
              <div className="flex items-center justify-center space-x-2 text-sm text-green-600 bg-green-50 py-2 px-4 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Successfully connected with Google</span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 text-center mb-6">
              Use Internet Computer's secure authentication system
            </p>
            
            <button
              onClick={handleInternetIdentityConnect}
              disabled={isLoading || isAuthenticated}
              className="w-full flex items-center justify-center space-x-3 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
                    <path d="M12 6c-3.309 0-6 2.691-6 6s2.691 6 6 6 6-2.691 6-6-2.691-6-6-6zm0 10c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4z"/>
                  </svg>
                  <span className="font-medium">
                    {isAuthenticated ? "Connected with Internet Identity" : "Connect with Internet Identity"}
                  </span>
                </>
              )}
            </button>

            {isAuthenticated && (
              <div className="flex items-center justify-center space-x-2 text-sm text-green-600 bg-green-50 py-2 px-4 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Successfully connected with Internet Identity</span>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to Karbyn's{" "}
            <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
