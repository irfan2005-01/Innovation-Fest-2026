import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight, Terminal, Sun, Moon } from 'lucide-react';
import { HackoraLogo } from './HackoraLogo';
import { PageId } from '../types';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onOpenRegister: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenRegister,
  theme,
  toggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navPages: { id: PageId; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'events', label: 'Events' },
    { id: 'themes', label: '6 Themes' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'resources', label: 'Resources' },
    { id: 'faq', label: 'FAQ & Rules' },
    { id: 'sponsors', label: 'Sponsors' },
  ];

  const handlePageClick = (pageId: PageId) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-40 bg-obsidian-950/85 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl py-3 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo Emblem */}
            <button
              onClick={() => handlePageClick('home')}
              className="text-left group focus:outline-none"
              aria-label="Return to INNOVATION FEST 2026 Home"
            >
              <HackoraLogo size="md" />
            </button>

            {/* Page Navigation Links (Desktop) */}
            <nav className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-900/70 border border-slate-800 backdrop-blur-md">
              {navPages.map((page) => {
                const isActive = currentPage === page.id;
                return (
                  <button
                    key={page.id}
                    onClick={() => handlePageClick(page.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-white bg-slate-800 border border-cyan-500/40 shadow-sm font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    {isActive && <span className="inline-block w-1.5 h-1.5 rounded-full bg-nexora-cyan mr-1.5" />}
                    {page.label}
                  </button>
                );
              })}
            </nav>

            {/* Right Action: Theme Toggle & Register CTA */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                className="p-2 rounded-full bg-slate-900 border border-slate-700/80 hover:border-cyan-400/60 text-slate-300 hover:text-white transition-all shadow-sm flex items-center justify-center"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400 animate-pulse" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700" />
                )}
              </button>

              <button
                onClick={onOpenRegister}
                className="relative group overflow-hidden rounded-full p-[1px] focus:outline-none"
              >
                <span className="absolute inset-0 bg-brand-gradient rounded-full group-hover:scale-105 transition-transform duration-300 blur-[2px] opacity-80 group-hover:opacity-100" />
                <span className="relative flex items-center gap-1.5 px-4 py-2 rounded-full bg-obsidian-950 group-hover:bg-opacity-90 text-white text-xs font-semibold font-mono tracking-wide transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-nexora-cyan animate-pulse" />
                  <span>Register & Pay</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-nexora-cyan group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </button>
            </div>

            {/* Mobile Hamburger & Mobile Theme Toggle */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={toggleTheme}
                aria-label="Toggle Theme"
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700" />
                )}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                aria-label="Toggle Page Navigation"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Page Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[65px] z-30 bg-obsidian-950/98 backdrop-blur-2xl border-b border-slate-800 p-6 lg:hidden shadow-2xl"
          >
            <div className="flex flex-col gap-2">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Terminal className="w-3 h-3 text-nexora-cyan" />
                <span>Select Page</span>
              </div>
              {navPages.map((page) => {
                const isActive = currentPage === page.id;
                return (
                  <button
                    key={page.id}
                    onClick={() => handlePageClick(page.id)}
                    className={`text-left px-3.5 py-2.5 rounded-lg text-sm font-mono font-medium transition-colors flex items-center justify-between ${
                      isActive
                        ? 'bg-slate-800 text-nexora-cyan font-bold border border-cyan-500/30'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <span>{page.label}</span>
                    {isActive && <span className="text-xs text-nexora-cyan font-mono">Current Page</span>}
                  </button>
                );
              })}

              <div className="pt-4 mt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenRegister();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-mono text-xs font-bold text-slate-950 bg-brand-gradient shadow-lg shadow-cyan-500/20"
                >
                  <span>Register & Pay Online (Deadline: 18 Sep)</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
