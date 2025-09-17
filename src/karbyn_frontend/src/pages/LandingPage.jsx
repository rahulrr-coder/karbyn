import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useAuth } from '../contexts/CleanAuthContext';
import { useSafeNavigate } from '../utils/safeRouterHooks';
import LoginButton from '../components/LoginButton';

// Lazy load motion for animations
const motion = lazy(() => import('framer-motion').then(module => ({ default: module.motion })));

// Simple fallback component without animations
const StaticDiv = ({ children, className, ...props }) => (
  <div className={className} {...props}>{children}</div>
);

const StaticButton = ({ children, className, ...props }) => (
  <button className={className} {...props}>{children}</button>
);

const LandingPage = () => {
  const { isAuthenticated, principal } = useAuth();
  const navigate = useSafeNavigate();
  const [MotionComponent, setMotionComponent] = useState(null);

  useEffect(() => {
    // Load motion component asynchronously
    import('framer-motion').then(module => {
      setMotionComponent(() => module.motion);
    });
  }, []);

  useEffect(() => {
    if (isAuthenticated && principal) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, principal, navigate]);

  // Use motion component if loaded, otherwise use static components
  const MotionDiv = MotionComponent?.div || StaticDiv;
  const MotionButton = MotionComponent?.button || StaticButton;

  const features = [
    {
      icon: '🔍',
      title: 'Google Sign-In',
      description: 'Quick and familiar authentication with your Google account - no Web3 knowledge required.'
    },
    {
      icon: '🔐',
      title: 'Secure & Private',
      description: 'NFID integration ensures your identity is secure while maintaining privacy on the Internet Computer.'
    },
    {
      icon: '🌱',
      title: 'Multi-Role Support',
      description: 'Whether you\'re an individual, NGO, or corporation - we have tailored experiences for everyone.'
    },
    {
      icon: '⚡',
      title: 'Instant Access',
      description: 'Start tracking your carbon credits and trading NFTs immediately after signing in.'
    }
  ];

  const userTypes = [
    {
      icon: '👤',
      title: 'Individuals',
      description: 'Track your daily eco-activities, earn carbon credits, and make a personal impact on the environment.',
      features: ['Activity tracking', 'Carbon credit NFTs', 'Impact dashboard', 'Marketplace trading']
    },
    {
      icon: '🌱',
      title: 'NGOs',
      description: 'Scale your environmental projects, generate bulk credits, and showcase your community impact.',
      features: ['Project management', 'Bulk credit generation', 'Community verification', 'Impact reporting']
    },
    {
      icon: '🏢',
      title: 'Corporations',
      description: 'Purchase verified carbon credits, meet sustainability goals, and demonstrate environmental responsibility.',
      features: ['Credit purchasing', 'Sustainability reports', 'Compliance tracking', 'Corporate dashboard']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">K</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Karbyn</span>
          </div>
          
          <LoginButton className="text-lg" />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Carbon Credits Made
              <span className="text-green-600 block">Simple & Accessible</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              Track your environmental activities, earn verified NFT credits, and trade in our 
              decentralized marketplace. Multiple sign-in options available for maximum convenience.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <LoginButton>
                🌱 Get Started Now
              </LoginButton>
              
              <MotionButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold py-4 px-8 rounded-xl text-lg transition-colors"
              >
                📖 Learn More
              </MotionButton>
            </div>

            <div className="mt-8 flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>No downloads required</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Instant access</span>
              </div>
            </div>
          </MotionDiv>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Karbyn?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We've made carbon credits accessible to everyone, from beginners to blockchain experts
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <MotionDiv
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20 bg-green-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built for Everyone
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Whether you're starting your sustainability journey or scaling environmental impact
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {userTypes.map((type, index) => (
              <MotionDiv
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-4xl mb-6 text-center">{type.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">{type.title}</h3>
                <p className="text-gray-600 mb-6 text-center leading-relaxed">{type.description}</p>
                
                <div className="space-y-3">
                  {type.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6 text-center">
                  <div className="container mx-auto px-6 text-center">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Your Carbon Journey?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Join thousands of users already making a difference. Sign up in seconds and 
              start earning carbon credits today.
            </p>
            
            <MotionButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAuthModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-colors shadow-lg"
            >
              🔍 Get Started with Google
            </MotionButton>
          </MotionDiv>
        </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">K</span>
              </div>
              <span className="text-xl font-bold text-white">Karbyn</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2024 Karbyn. Built with ❤️ on the Internet Computer
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
