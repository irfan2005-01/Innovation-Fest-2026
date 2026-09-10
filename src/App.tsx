import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CyberBackground } from './components/CyberBackground';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { EventsPage } from './pages/EventsPage';
import { ThemesPage } from './pages/ThemesPage';
import { SchedulePage } from './pages/SchedulePage';
import { HospitalityPage } from './pages/HospitalityPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { SponsorsPage } from './pages/SponsorsPage';
import { FAQPage } from './pages/FAQPage';
import { AdminPage } from './pages/AdminPage';
import { RegistrationModal } from './components/modals/RegistrationModal';
import { BrochureModal } from './components/modals/BrochureModal';
import { SponsorModal } from './components/modals/SponsorModal';
import { PageId } from './types';

export function App() {
  // Theme state: dark / light
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('hackora-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark'; // default to obsidian dark
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    localStorage.setItem('hackora-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const validPages: PageId[] = [
    'home',
    'events',
    'about',
    'themes',
    'tracks',
    'schedule',
    'hospitality',
    'resources',
    'sponsors',
    'faq',
    'admin',
  ];

  // Read initial page from URL hash if present
  const getInitialPage = (): PageId => {
    const hash = window.location.hash.replace('#', '') as PageId;
    return validPages.includes(hash) ? hash : 'home';
  };

  const [currentPage, setCurrentPage] = useState<PageId>(getInitialPage);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [brochureModalOpen, setBrochureModalOpen] = useState(false);
  const [sponsorModalOpen, setSponsorModalOpen] = useState(false);

  // Sync page changes with hash
  const navigateTo = (page: PageId) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as PageId;
      if (validPages.includes(hash)) {
        setCurrentPage(hash);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        navigateTo('admin');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-transparent text-slate-100 flex flex-col justify-between selection:bg-cyan-500/20 selection:text-cyan-300 transition-colors duration-300">
      {/* Dynamic Cyber / Blueprint Background Canvas (Both Dark & Light) */}
      <CyberBackground theme={theme} />

      {/* Top Floating/Sticky Navigation with Theme Toggle */}
      <div className="relative z-30">
        <Navbar
          currentPage={currentPage}
          onNavigate={navigateTo}
          onOpenRegister={() => setRegisterModalOpen(true)}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      </div>

      {/* Main Page Content with Page Transitions */}
      <main className="relative z-10 flex-grow px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {currentPage === 'home' && (
              <HomePage
                onNavigate={navigateTo}
                onOpenRegister={() => setRegisterModalOpen(true)}
                onOpenBrochure={() => setBrochureModalOpen(true)}
              />
            )}
            {currentPage === 'about' && (
              <AboutPage
                onNavigate={navigateTo}
                onOpenRegister={() => setRegisterModalOpen(true)}
              />
            )}
            {currentPage === 'events' && (
              <EventsPage
                onNavigate={navigateTo}
                onOpenRegister={() => setRegisterModalOpen(true)}
              />
            )}
            {(currentPage === 'themes' || currentPage === 'tracks') && (
              <ThemesPage
                onNavigate={navigateTo}
                onOpenRegister={() => setRegisterModalOpen(true)}
              />
            )}
            {currentPage === 'schedule' && (
              <SchedulePage
                onNavigate={navigateTo}
                onOpenRegister={() => setRegisterModalOpen(true)}
              />
            )}
            {currentPage === 'hospitality' && (
              <HospitalityPage
                onNavigate={navigateTo}
                onOpenRegister={() => setRegisterModalOpen(true)}
              />
            )}
            {currentPage === 'resources' && (
              <ResourcesPage
                onNavigate={navigateTo}
                onOpenRegister={() => setRegisterModalOpen(true)}
              />
            )}
            {currentPage === 'sponsors' && (
              <SponsorsPage
                onNavigate={navigateTo}
                onOpenSponsorModal={() => setSponsorModalOpen(true)}
                onOpenRegister={() => setRegisterModalOpen(true)}
              />
            )}
            {currentPage === 'faq' && (
              <FAQPage
                onNavigate={navigateTo}
                onOpenRegister={() => setRegisterModalOpen(true)}
              />
            )}
            {currentPage === 'admin' && (
              <AdminPage
                onNavigate={navigateTo}
                onOpenRegister={() => setRegisterModalOpen(true)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Institutional Multi-Page Footer */}
      <div className="relative z-20">
        <Footer
          onNavigate={navigateTo}
          onOpenRegister={() => setRegisterModalOpen(true)}
          onOpenBrochure={() => setBrochureModalOpen(true)}
        />
      </div>

      {/* Interactive Modals */}
      <RegistrationModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
      />
      <BrochureModal
        isOpen={brochureModalOpen}
        onClose={() => setBrochureModalOpen(false)}
      />
      <SponsorModal
        isOpen={sponsorModalOpen}
        onClose={() => setSponsorModalOpen(false)}
      />
    </div>
  );
}

export default App;
