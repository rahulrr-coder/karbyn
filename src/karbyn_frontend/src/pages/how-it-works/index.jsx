import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ProcessFlow from './components/ProcessFlow';
import ProcessStep from './components/ProcessStep';
import VideoPlaceholder from './components/VideoPlaceholder';
import BlockchainVisualization from './components/BlockchainVisualization';
import CallToActionSection from './components/CallToActionSection';
import Icon from '../../components/AppIcon';

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(1);

  const processSteps = [
    {
      number: 1,
      title: "Onboard Project",
      subtitle: "Submit your climate initiative",
      description: `Start your climate action journey by submitting your environmental project through our streamlined onboarding process. Our platform supports various project types including reforestation, renewable energy, waste reduction, and carbon capture initiatives.\n\nThe submission process includes project documentation, impact projections, and verification requirements to ensure transparency and accountability from day one.`,
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop",
      features: [
        {
          title: "Project Documentation",
          description: "Upload detailed project plans and impact assessments"
        },
        {
          title: "Impact Projections",
          description: "Define measurable environmental outcomes"
        },
        {
          title: "Verification Requirements",
          description: "Set up transparent monitoring criteria"
        },
        {
          title: "Community Guidelines",
          description: "Follow platform standards for project quality"
        }
      ],
      faqs: [
        {
          question: "What types of projects can I submit?",
          answer: "We accept reforestation, renewable energy, waste reduction, carbon capture, biodiversity conservation, and sustainable agriculture projects. All projects must have measurable environmental impact."
        },
        {
          question: "How long does the submission process take?",
          answer: "Initial submission takes 15-30 minutes. Our team reviews submissions within 48 hours and may request additional documentation if needed."
        },
        {
          question: "Are there any fees for project submission?",
          answer: "Project submission is free. We only charge a small percentage when your project receives funding or generates carbon credits."
        }
      ],
      actionText: "Submit Your Project",
      actionIcon: "Upload"
    },
    {
      number: 2,
      title: "Community Verification",
      subtitle: "Decentralized validation process",
      description: `Our community-driven verification system ensures project authenticity through decentralized validation. Community members with expertise in environmental science, project management, and local knowledge participate in the verification process.\n\nThis democratic approach combines technical expertise with local insights to create a robust verification framework that builds trust and ensures project quality.`,
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=400&fit=crop",
      features: [
        {
          title: "Expert Validators",
          description: "Environmental scientists and project specialists"
        },
        {
          title: "Local Community Input",
          description: "On-ground verification from local stakeholders"
        },
        {
          title: "Transparent Voting",
          description: "Open verification process with clear criteria"
        },
        {
          title: "Reputation System",
          description: "Validator credibility based on past accuracy"
        }
      ],
      faqs: [
        {
          question: "Who can participate in community verification?",
          answer: "Anyone can join as a community verifier. We have different verification levels based on expertise, with environmental professionals having higher voting weights."
        },
        {
          question: "How does the voting process work?",
          answer: "Verifiers review project documentation, assess impact claims, and vote on project validity. Projects need 75% approval to pass verification."
        },
        {
          question: "What happens if a project fails verification?",
          answer: "Projects receive detailed feedback and can resubmit after addressing concerns. We provide guidance to help projects meet verification standards."
        }
      ],
      actionText: "Join Verification",
      actionIcon: "Users"
    },
    {
      number: 3,
      title: "Tokenization & Rewards",
      subtitle: "Blockchain-based incentives",
      description: `Successfully verified projects are tokenized on the blockchain, creating transparent and tradeable environmental impact certificates. Project creators, verifiers, and supporters all receive token rewards based on their contributions.\n\nOur tokenization system creates financial incentives for climate action while maintaining full transparency and traceability of environmental impact through blockchain technology.`,
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop",
      features: [
        {
          title: "Impact Tokens",
          description: "Blockchain certificates representing verified impact"
        },
        {
          title: "Reward Distribution",
          description: "Automatic rewards for all ecosystem participants"
        },
        {
          title: "Marketplace Trading",
          description: "Trade impact tokens in decentralized marketplace"
        },
        {
          title: "Transparent Tracking",
          description: "Full audit trail of all transactions and impacts"
        }
      ],
      faqs: [
        {
          question: "What are impact tokens and how do they work?",
          answer: "Impact tokens are blockchain-based certificates representing verified environmental impact. They can be traded, held as proof of climate action, or used within our ecosystem."
        },
        {
          question: "How are rewards calculated and distributed?",
          answer: "Rewards are based on project impact, verification quality, and community participation. Distribution is automatic through smart contracts within 24 hours of verification."
        },
        {
          question: "Can I trade my impact tokens?",
          answer: "Yes, impact tokens can be traded on our marketplace or external exchanges. This creates liquidity for environmental impact and enables carbon offset markets."
        }
      ],
      actionText: "Explore Rewards",
      actionIcon: "Coins"
    }
  ];

  const videos = [
    {
      title: "Getting Started with Karbyn",
      description: "Learn the basics of submitting and verifying climate projects",
      thumbnail: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&h=300&fit=crop",
      duration: "4:32"
    },
    {
      title: "Community Verification Process",
      description: "Deep dive into how our decentralized verification works",
      thumbnail: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
      duration: "6:18"
    },
    {
      title: "Blockchain & Tokenization",
      description: "Understanding impact tokens and reward mechanisms",
      thumbnail: "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=400&h=300&fit=crop",
      duration: "5:45"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        <Breadcrumb />
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            How Karbyn Works
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover how our three-step process transforms climate action through 
            decentralized verification and blockchain-based rewards.
          </p>
          <div className="flex items-center justify-center space-x-2 text-primary">
            <Icon name="Leaf" size={20} />
            <span className="font-medium">Transparent • Decentralized • Rewarding</span>
          </div>
        </div>

        {/* Process Flow Navigation */}
        <ProcessFlow 
          currentStep={activeStep} 
          onStepChange={setActiveStep} 
        />

        {/* Detailed Step Content */}
        <div className="mb-12">
          <ProcessStep
            step={processSteps[activeStep - 1]}
            isActive={true}
            onStepClick={() => {}}
          />
        </div>

        {/* Video Tutorials */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold text-foreground mb-3">
              Video Tutorials
            </h2>
            <p className="text-muted-foreground">
              Watch these guides to master the Karbyn platform
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videos.map((video, index) => (
              <VideoPlaceholder
                key={index}
                title={video.title}
                description={video.description}
                thumbnail={video.thumbnail}
                duration={video.duration}
              />
            ))}
          </div>
        </div>

        {/* Blockchain Visualization */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold text-foreground mb-3">
              Blockchain Technology
            </h2>
            <p className="text-muted-foreground">
              See how blockchain ensures transparency and trust in climate action
            </p>
          </div>
          <BlockchainVisualization />
        </div>

        {/* Call to Action */}
        <CallToActionSection />
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorks;