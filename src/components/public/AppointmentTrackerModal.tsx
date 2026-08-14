import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Appointment } from '../../types';
import {
  Search,
  X,
  Calendar,
  Clock,
  User,
  Stethoscope,
  CheckCircle2,
  AlertCircle,
  Clock3,
  XCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AppointmentTrackerModal: React.FC = () => {
  const { isTrackerModalOpen, setIsTrackerModalOpen } = useHospital();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Appointment[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isTrackerModalOpen) return null;

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    try {
      const res = await fetch(`/api/appointments/track/${encodeURIComponent(searchQuery.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      } else {
        setResults([]);
      }
    } catch (e) {
      console.error('Error tracking appointment:', e);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Confirmed
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock3 className="w-3.5 h-3.5 text-amber-600" />
            Pending Review
          </span>
        );
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-8"
        >
          {/* Header */}
          <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold font-serif">Track Your Appointment</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Enter your Ticket ID (e.g. NX-84920) or registered Phone Number
              </p>
            </div>
            <button
              onClick={() => setIsTrackerModalOpen(false)}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Form */}
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <form onSubmit={handleTrack} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. NX-84920 or +1 (555) 234-5678"
                  className="w-full pl-10 pr-3 py-2.5 bg-white text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-600 font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="px-5 py-2.5 bg-cyan-700 hover:bg-cyan-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors shrink-0"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </form>
          </div>

          {/* Search Results */}
          <div className="p-6 max-h-[50vh] overflow-y-auto space-y-4">
            {hasSearched && results && results.length === 0 && (
              <div className="text-center py-8 text-slate-500 text-xs">
                <AlertCircle className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <p className="font-semibold text-slate-700">No appointment records found</p>
                <p className="mt-1">Please double check your Ticket ID or phone number.</p>
              </div>
            )}

            {results &&
              results.map((apt) => (
                <div
                  key={apt.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800">
                        {apt.ticketNumber}
                      </span>
                      <span className="text-xs font-semibold text-slate-600">
                        {apt.patientName}
                      </span>
                    </div>
                    {getStatusBadge(apt.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Doctor</span>
                      <span className="font-semibold text-slate-800">{apt.doctorName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Date & Time</span>
                      <span className="font-semibold text-slate-800">
                        {apt.preferredDate} • {apt.preferredTime}
                      </span>
                    </div>
                  </div>

                  {apt.adminNotes && (
                    <div className="p-2.5 rounded-xl bg-cyan-50/80 text-[11px] text-cyan-900 border border-cyan-200">
                      <strong>Hospital Note:</strong> {apt.adminNotes}
                    </div>
                  )}
                </div>
              ))}
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
            <button
              onClick={() => setIsTrackerModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
