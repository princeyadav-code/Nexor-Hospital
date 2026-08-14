import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  CheckCircle2,
  Calendar,
  Clock,
  User,
  Stethoscope,
  MapPin,
  Printer,
  Copy,
  Check,
  X,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AppointmentConfirmationModal: React.FC = () => {
  const { bookingSuccessTicket, setBookingSuccessTicket, settings } = useHospital();
  const [copied, setCopied] = useState(false);

  if (!bookingSuccessTicket) return null;

  const apt = bookingSuccessTicket;

  const handleCopyTicket = () => {
    navigator.clipboard.writeText(apt.ticketNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/75 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-8"
        >
          {/* Top Success Banner */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 text-center relative">
            <button
              onClick={() => setBookingSuccessTicket(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-3 border border-white/30">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>

            <h3 className="text-2xl font-bold font-serif tracking-tight">
              Appointment Scheduled Successfully!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1">
              Your consultation request has been registered in the Nexora Hospital system.
            </p>

            {/* Ticket Pill */}
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white text-slate-900 shadow-md font-mono">
              <span className="text-xs text-slate-500 font-sans font-semibold">TICKET ID:</span>
              <strong className="text-base font-bold text-emerald-800">{apt.ticketNumber}</strong>
              <button
                onClick={handleCopyTicket}
                title="Copy Ticket ID"
                className="p-1 text-slate-400 hover:text-slate-800 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Ticket Body Slip */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Appointment Highlights Grid */}
            <div className="grid grid-cols-2 gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Doctor & Specialty</span>
                <span className="font-bold text-slate-900 block text-sm">{apt.doctorName}</span>
                <span className="text-[11px] text-cyan-700 font-medium">{apt.departmentName}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Date & Time Slot</span>
                <span className="font-bold text-slate-900 block text-sm">{apt.preferredDate}</span>
                <span className="text-[11px] text-teal-700 font-semibold">{apt.preferredTime}</span>
              </div>

              <div className="pt-2 border-t border-slate-200/60">
                <span className="text-slate-400 block mb-0.5">Patient Name</span>
                <span className="font-semibold text-slate-800">
                  {apt.patientName} ({apt.age}y / {apt.gender})
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200/60">
                <span className="text-slate-400 block mb-0.5">Phone Number</span>
                <span className="font-semibold text-slate-800">{apt.phone}</span>
              </div>
            </div>

            {/* Hospital OPD Check-in Instructions */}
            <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/70 text-xs space-y-2 text-teal-950">
              <div className="flex items-center gap-2 font-bold text-teal-900">
                <ShieldCheck className="w-4 h-4 text-teal-700" />
                <span>Next Steps & Arrival Protocol:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-teal-900/80 font-normal pl-1">
                <li>Present Ticket ID <strong>{apt.ticketNumber}</strong> at the OPD Reception Counter.</li>
                <li>Please arrive at least 15 minutes prior for preliminary vital statistics check.</li>
                <li>An SMS confirmation alert has been generated for your record.</li>
              </ul>
            </div>

            {/* Hospital Address Info */}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <MapPin className="w-4 h-4 text-cyan-600 shrink-0" />
              <span>
                {settings?.address || '450 Health Sciences Parkway, Metro Medical District, NY 10016'}
              </span>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>

            <button
              onClick={() => setBookingSuccessTicket(null)}
              className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-colors"
            >
              Done & Return
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
