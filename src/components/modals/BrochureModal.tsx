import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileText } from 'lucide-react';

interface BrochureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrochureModal: React.FC<BrochureModalProps> = ({ isOpen, onClose }) => {
  const [activePage, setActivePage] = useState<'p1' | 'p2'>('p1');

  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      const prevTouchAction = document.body.style.touchAction;
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      return () => {
        document.body.style.overflow = prevOverflow;
        document.body.style.touchAction = prevTouchAction;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentAsset =
    activePage === 'p1'
      ? {
          title: 'Official Event Brochure — Page 1',
          desc: 'Complete overview of Innovation Fest 2026, Hackora 2026, Ideathon, Project Expo, eligibility guidelines, and LAEC Bidar campus credentials.',
          src: '/assets/Brochure1.jpeg',
          filename: 'Innovation_Fest_2026_Brochure_P1.jpeg',
        }
      : {
          title: 'Official Event Schedule & Guidelines — Page 2',
          desc: 'Comprehensive rules, in-person physical exhibition protocols, offline demonstration criteria, jury rubrics, and organizing secretariat details.',
          src: '/assets/Brochure2.jpeg',
          filename: 'Innovation_Fest_2026_Brochure_P2.jpeg',
        };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto overflow-x-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto overflow-x-hidden rounded-2xl bg-slate-900 border border-slate-700 p-4 sm:p-6 md:p-8 shadow-2xl text-slate-100 flex flex-col"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400">
                <FileText className="w-6 h-6" />
              </span>
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                  Official Publication Desk
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                  Innovation Fest 2026 Brochure
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
                <button
                  onClick={() => setActivePage('p1')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                    activePage === 'p1'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Page 1 (Overview)
                </button>
                <button
                  onClick={() => setActivePage('p2')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                    activePage === 'p2'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Page 2 (Rules & Schedule)
                </button>
              </div>

              <a
                href={currentAsset.src}
                download={currentAsset.filename}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </a>
            </div>
          </div>

          {/* Brochure Image Preview Box */}
          <div className="my-4 rounded-xl bg-slate-950 p-2 sm:p-4 border border-slate-800 flex items-center justify-center">
            <img
              src={currentAsset.src}
              alt={currentAsset.title}
              className="max-h-[62vh] w-auto object-contain rounded-lg shadow-2xl"
            />
          </div>

          {/* Footer Info */}
          <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-mono">
            <p className="font-sans leading-relaxed text-slate-300">
              {currentAsset.desc}
            </p>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-cyan-400 font-bold">21–22 September 2026</span>
              <span>•</span>
              <span>LAEC Bidar Campus</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
