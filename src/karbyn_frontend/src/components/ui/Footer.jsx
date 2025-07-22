import React from 'react';
import Link from 'next/link';
import Icon from '../AppIcon';

const Footer = () => {
  const navigationLinks = [
    { label: 'Home', path: '/landing-page' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'Projects', path: '/projects-listing' },
    { label: 'Dashboard', path: '/impact-dashboard' },
    { label: 'Submit Project', path: '/submit-project' }
  ];

  const socialLinks = [
    { name: 'Twitter', icon: 'Twitter', url: 'https://twitter.com/karbyn' },
    { name: 'GitHub', icon: 'Github', url: 'https://github.com/karbyn' },
    { name: 'Discord', icon: 'MessageCircle', url: 'https://discord.gg/karbyn' },
    { name: 'LinkedIn', icon: 'Linkedin', url: 'https://linkedin.com/company/karbyn' }
  ];

  const Logo = () => (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
        <Icon name="Leaf" size={20} color="white" />
      </div>
      <span className="text-xl font-semibold text-foreground">Karbyn</span>
    </div>
  );

  return (
    <footer className="bg-surface border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Logo />
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              Empowering decentralized climate action through transparent verification 
              and community-driven environmental impact projects.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 organic-transition"
                  aria-label={`Follow us on ${social.name}`}
                >
                  <Icon name={social.icon} size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Platform
            </h3>
            <nav className="space-y-2">
              {navigationLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className="block text-sm text-muted-foreground hover:text-primary organic-transition"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Community & Support */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Community
            </h3>
            <div className="space-y-2">
              <a
                href="mailto:support@karbyn.io"
                className="block text-sm text-muted-foreground hover:text-primary organic-transition"
              >
                Support
              </a>
              <a
                href="/docs"
                className="block text-sm text-muted-foreground hover:text-primary organic-transition"
              >
                Documentation
              </a>
              <a
                href="/governance"
                className="block text-sm text-muted-foreground hover:text-primary organic-transition"
              >
                Governance
              </a>
              <a
                href="/blog"
                className="block text-sm text-muted-foreground hover:text-primary organic-transition"
              >
                Blog
              </a>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-border pt-8 mb-8">
          <div className="max-w-md">
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Stay Updated
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get the latest updates on climate projects and platform developments.
            </p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 text-sm bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
              <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 organic-transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>© 2025 Karbyn Climate Platform</span>
            <span className="hidden sm:inline">•</span>
            <Link href="/privacy" className="hover:text-primary organic-transition">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-primary organic-transition">
              Terms of Service
            </Link>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Zap" size={16} className="text-accent" />
            <span>Powered by Web3 & Community</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;