import React, { useState, useEffect } from 'react';
import { CustomCursor } from './components/ui/CustomCursor';
import { ScrollProgress } from './components/ui/ScrollProgress';
import { ParticleBackground } from './components/ui/ParticleBackground';
import { FloatingWhatsApp } from './components/ui/FloatingWhatsApp';
import { VideoModal } from './components/ui/VideoModal';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

import { Hero } from './components/sections/Hero';
import { Portfolio } from './components/sections/Portfolio';
import { About } from './components/sections/About';
import { Experience } from './components/sections/Experience';
import { Services } from './components/sections/Services';
import { Process } from './components/sections/Process';
import { SkillsTools } from './components/sections/SkillsTools';
import { Testimonials } from './components/sections/Testimonials';
import { PricingCalculator } from './components/sections/PricingCalculator';
import { Contact } from './components/sections/Contact';

import { FinancialDashboard } from './components/dashboard/FinancialDashboard';
import { AdminLoginModal } from './components/dashboard/AdminLoginModal';
import { ClientFeedbackPage } from './components/feedback/ClientFeedbackPage';
import { financialApi } from './services/financialApi';

import type { Project } from './types';
import { PROJECTS } from './data/projects';

const extractFeedbackToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  if (window.location.hash.startsWith('#feedback')) {
    const match = window.location.hash.match(/[?&]token=([^&]+)/);
    if (match) return decodeURIComponent(match[1]);
  }
  const params = new URLSearchParams(window.location.search);
  const qToken = params.get('token');
  if (qToken) return qToken;
  return null;
};

export const App: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [inquiryProjectType, setInquiryProjectType] = useState<string>('Instagram Reels');
  const [inquiryBudget, setInquiryBudget] = useState<string>('₹1,500 - ₹5,000');

  // Client Feedback State
  const [feedbackToken, setFeedbackToken] = useState<string | null>(extractFeedbackToken());

  // Admin Dashboard and Security States
  const [isAdminView, setIsAdminView] = useState<boolean>(
    typeof window !== 'undefined' ? window.location.hash === '#admin' : false
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Check auth session on mount
  useEffect(() => {
    const token = extractFeedbackToken();
    if (token) {
      setFeedbackToken(token);
    }

    const verifySession = async () => {
      const auth = await financialApi.checkAuth();
      setIsAuthenticated(auth.authenticated);
      if (window.location.hash === '#admin') {
        if (auth.authenticated) {
          setIsAdminView(true);
        } else {
          setIsLoginModalOpen(true);
        }
      }
    };
    verifySession();

    const handleHashChange = () => {
      const currentFeedbackToken = extractFeedbackToken();
      if (currentFeedbackToken) {
        setFeedbackToken(currentFeedbackToken);
        setIsAdminView(false);
        return;
      } else {
        setFeedbackToken(null);
      }

      if (window.location.hash === '#admin') {
        if (financialApi.isAuthenticated()) {
          setIsAdminView(true);
        } else {
          setIsLoginModalOpen(true);
        }
      } else {
        setIsAdminView(false);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleOpenAdmin = () => {
    if (isAuthenticated) {
      setIsAdminView(true);
      window.location.hash = '#admin';
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setIsLoginModalOpen(false);
    setIsAdminView(true);
    window.location.hash = '#admin';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await financialApi.logout();
    setIsAuthenticated(false);
    setIsAdminView(false);
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToPortfolio = () => {
    setIsAdminView(false);
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Triggered when user clicks "Watch Showreel"
  const handleOpenShowreel = () => {
    const showreelProject = PROJECTS[0];
    if (showreelProject) {
      setSelectedProject(showreelProject);
    }
  };

  const handleExploreWork = () => {
    const elem = document.getElementById('work');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectServiceForQuote = (serviceTitle: string) => {
    setInquiryProjectType(serviceTitle);
    const elem = document.getElementById('contact');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectTierForQuote = (tierTitle: string, estimatedPrice?: string) => {
    setInquiryProjectType(tierTitle);
    if (estimatedPrice) {
      setInquiryBudget(estimatedPrice);
    }
    const elem = document.getElementById('contact');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleProjectInquiry = (projectTitle: string, category: string) => {
    setInquiryProjectType(`${category} (Style: ${projectTitle})`);
  };

  // If viewing client feedback page via unique link
  if (feedbackToken) {
    return (
      <ClientFeedbackPage
        token={feedbackToken}
        onBackToPortfolio={() => {
          setFeedbackToken(null);
          window.location.hash = '';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  // If user is authenticated and viewing admin dashboard
  if (isAdminView && isAuthenticated) {
    return (
      <FinancialDashboard
        onBackToPortfolio={handleBackToPortfolio}
        onLogout={handleLogout}
      />
    );
  }

  // Public portfolio view (Default for all regular visitors)
  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-[#F8FAFC] selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden font-['Inter']">
      {/* Dynamic Cursor for desktop */}
      <CustomCursor />

      {/* Top Scroll Indicator */}
      <ScrollProgress />

      {/* Ambient Bokeh / Dust Particle Canvas */}
      <ParticleBackground />

      {/* Persistent Floating WhatsApp */}
      <FloatingWhatsApp />

      {/* Fixed Navigation Bar */}
      <Navbar onOpenShowreel={handleOpenShowreel} />

      {/* Main Content Sections */}
      <main className="relative z-10">
        {/* Section 1: Hero */}
        <Hero
          onOpenShowreel={handleOpenShowreel}
          onExploreWork={handleExploreWork}
        />

        {/* Section 2: Featured Work & Before/After Slider */}
        <Portfolio onSelectProject={(project) => setSelectedProject(project)} />

        {/* Section 3: About Me (Story Behind The Edit) */}
        <About />

        {/* Section 4: 2 Years of Creative Experience */}
        <Experience />

        {/* Section 5: Services */}
        <Services onSelectServiceForQuote={handleSelectServiceForQuote} />

        {/* Section 5: Process (4-Step Timeline) */}
        <Process />

        {/* Section 6: Tools & Skills */}
        <SkillsTools />

        {/* Section 7: Client Feedback Carousel */}
        <Testimonials />

        {/* Section 8: Pricing & Volume Estimator */}
        <PricingCalculator onSelectTierForQuote={handleSelectTierForQuote} />

        {/* Section 9: Contact */}
        <Contact
          initialProjectType={inquiryProjectType}
          initialBudget={inquiryBudget}
        />
      </main>

      {/* Section 10: Footer with discreet Admin Portal entry */}
      <Footer onOpenAdmin={handleOpenAdmin} />

      {/* Video Modal Display */}
      {selectedProject && (
        <VideoModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onSelectProjectForInquiry={handleProjectInquiry}
        />
      )}

      {/* Admin Login Modal (For Chandu's Financial Portal) */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => {
          setIsLoginModalOpen(false);
          if (window.location.hash === '#admin') {
            window.location.hash = '';
          }
        }}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default App;
