import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Eye, X, ArrowRight } from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { resourcesData } from '../data/resourcesData';
import { ResourceItem, PageId } from '../types';

interface ResourcesPageProps {
  onNavigate: (page: PageId) => void;
  onOpenRegister: () => void;
}

export const ResourcesPage: React.FC<ResourcesPageProps> = ({ onNavigate, onOpenRegister }) => {
  const [selectedAsset, setSelectedAsset] = useState<ResourceItem | null>(null);

  return (
    <div className="space-y-12 pb-16 pt-8 max-w-6xl mx-auto">
      {/* Section Heading */}
      <SectionHeading
        number="05"
        badge="OFFICIAL MEDIA & PUBLICITY KIT"
        title="Downloadable Event"
        gradientTitle="Brochures & Assets"
        description="Access and download authentic event brochures, rule sheets, celebration posters, and digital banners for Innovation Fest 2026 & HACKORA 2026 at LAEC Bidar."
      />

      {/* Asset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resourcesData.map((res, index) => (
          <motion.div
            key={res.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.35 }}
            className="rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/95 to-obsidian-950 border border-slate-800 hover:border-cyan-500/50 p-5 backdrop-blur-xl transition-all duration-300 hover:shadow-xl flex flex-col justify-between group"
          >
            <div>
              {/* Asset Preview Frame */}
              <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 mb-4 flex items-center justify-center">
                <img
                  src={res.link}
                  alt={res.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    onClick={() => setSelectedAsset(res)}
                    className="p-2.5 rounded-xl bg-slate-900/90 text-white border border-slate-700 hover:border-cyan-400 text-xs font-mono flex items-center gap-1.5 shadow-lg"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Preview</span>
                  </button>
                  <a
                    href={res.link}
                    download={res.filename}
                    className="p-2.5 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>

                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-[10px] font-mono font-semibold text-cyan-400">
                  {res.badge}
                </span>
              </div>

              {/* Title & Desc */}
              <h3 className="text-base font-bold font-display text-white group-hover:text-cyan-300 transition-colors leading-snug">
                {res.title}
              </h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed mt-2 line-clamp-3">
                {res.desc}
              </p>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setSelectedAsset(res)}
                className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span>Full View</span>
              </button>

              <a
                href={res.link}
                download={res.filename}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 hover:underline"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Asset Preview Lightbox Modal */}
      <AnimatePresence>
        {selectedAsset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono uppercase text-cyan-400 tracking-wider">
                    {selectedAsset.badge}
                  </span>
                  <h3 className="text-lg font-bold text-white font-display">
                    {selectedAsset.title}
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={selectedAsset.link}
                    download={selectedAsset.filename}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download File</span>
                  </a>
                  <button
                    onClick={() => setSelectedAsset(null)}
                    className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="my-4 flex items-center justify-center rounded-xl bg-slate-950 p-2 border border-slate-800">
                <img
                  src={selectedAsset.link}
                  alt={selectedAsset.title}
                  className="max-h-[65vh] w-auto object-contain rounded-lg"
                />
              </div>

              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                {selectedAsset.desc}
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Action Footer */}
      <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('faq')}
          className="inline-flex items-center gap-2 text-sm font-mono text-cyan-400 hover:underline"
        >
          <span>Next: Review Event FAQ & Guidelines</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenRegister}
          className="px-6 py-3 rounded-xl font-mono text-xs font-bold text-slate-950 bg-brand-gradient hover:opacity-95 shadow-md shadow-cyan-500/20 transition-all"
        >
          Register for HACKORA 2026
        </button>
      </div>
    </div>
  );
};
