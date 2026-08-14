import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { ImageUploader } from '../common/ImageUploader';
import { Testimonial, MedicalService } from '../../types';
import {
  Globe,
  Layout,
  Star,
  Activity,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Sparkles,
  Quote,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminHomepageContent: React.FC = () => {
  const {
    settings,
    updateHospitalSettings,
    testimonials,
    createTestimonial,
    deleteTestimonial,
    services,
    createService,
    deleteService,
  } = useHospital();

  const [heroForm, setHeroForm] = useState({
    heroTitle: settings?.heroTitle || 'World-Class Healthcare, Centered on You',
    heroSubtitle:
      settings?.heroSubtitle ||
      'Delivering pioneering clinical care, advanced robotic surgery, and compassionate healing across 24 multidisciplinary specialties.',
    heroImageUrl:
      settings?.heroImageUrl ||
      'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=1600&auto=format&fit=crop&q=80',
    aboutTitle: settings?.aboutTitle || 'Leading the Future of Precision Healthcare',
    aboutDescription:
      settings?.aboutDescription ||
      'Founded on the bedrock of medical innovation and patient-centered empathy, Nexora Hospital has grown into a state-of-the-art tertiary care center.',
    aboutImageUrl:
      settings?.aboutImageUrl ||
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1000&auto=format&fit=crop&q=80',
    doctorsCount: settings?.stats?.doctorsCount || 150,
    departmentsCount: settings?.stats?.departmentsCount || 24,
    patientsServed: settings?.stats?.patientsServed || 85000,
    satisfactionRate: settings?.stats?.satisfactionRate || 99.4,
    emergencyResponseTime: settings?.stats?.emergencyResponseTime || '< 8 Min',
  });

  const [isSavingHero, setIsSavingHero] = useState(false);

  // New Testimonial State
  const [newTestimonial, setNewTestimonial] = useState({
    patientName: '',
    treatment: 'Cardiology',
    rating: 5,
    comment: '',
    doctorName: 'Dr. Arthur Pendelton',
  });
  const [isAddingTestimonial, setIsAddingTestimonial] = useState(false);

  // New Service State
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    badge: 'Specialty',
    icon: 'HeartPulse',
    details: 'Robotic Precision, 24/7 Monitoring, Dedicated Care',
  });
  const [isAddingService, setIsAddingService] = useState(false);

  const handleSaveHeroAndStats = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setIsSavingHero(true);

    await updateHospitalSettings({
      ...settings,
      heroTitle: heroForm.heroTitle,
      heroSubtitle: heroForm.heroSubtitle,
      heroImageUrl: heroForm.heroImageUrl,
      aboutTitle: heroForm.aboutTitle,
      aboutDescription: heroForm.aboutDescription,
      aboutImageUrl: heroForm.aboutImageUrl,
      stats: {
        doctorsCount: Number(heroForm.doctorsCount),
        departmentsCount: Number(heroForm.departmentsCount),
        patientsServed: Number(heroForm.patientsServed),
        satisfactionRate: Number(heroForm.satisfactionRate),
        emergencyResponseTime: heroForm.emergencyResponseTime,
      },
    });

    setIsSavingHero(false);
  };

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestimonial.patientName.trim() || !newTestimonial.comment.trim()) return;

    await createTestimonial({
      patientName: newTestimonial.patientName.trim(),
      treatment: newTestimonial.treatment,
      rating: Number(newTestimonial.rating) || 5,
      comment: newTestimonial.comment.trim(),
      doctorName: newTestimonial.doctorName,
    });

    setNewTestimonial({
      patientName: '',
      treatment: 'Cardiology',
      rating: 5,
      comment: '',
      doctorName: 'Dr. Arthur Pendelton',
    });
    setIsAddingTestimonial(false);
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.title.trim() || !newService.description.trim()) return;

    const detailsArray = newService.details
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    await createService({
      title: newService.title.trim(),
      description: newService.description.trim(),
      badge: newService.badge,
      icon: newService.icon,
      details: detailsArray,
    });

    setNewService({
      title: '',
      description: '',
      badge: 'Specialty',
      icon: 'HeartPulse',
      details: '',
    });
    setIsAddingService(false);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
          <Globe className="w-4 h-4" />
          <span>Public Website Content</span>
        </div>
        <h2 className="text-2xl font-bold font-serif text-white mt-1">
          Homepage Banner, Statistics, & Testimonials
        </h2>
        <p className="text-xs text-slate-400">
          Control landing page hero typography, key hospital metrics, patient recovery testimonials, and clinical programs.
        </p>
      </div>

      {/* Hero & About Section Form */}
      <form onSubmit={handleSaveHeroAndStats} className="space-y-8">
        {/* Hero Banner Controls */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-5">
          <h3 className="text-base font-bold font-serif text-white flex items-center gap-2">
            <Layout className="w-4 h-4 text-cyan-400" />
            <span>Hero Landing Banner Section</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Main Hero Headline *
              </label>
              <input
                type="text"
                required
                value={heroForm.heroTitle}
                onChange={(e) => setHeroForm({ ...heroForm, heroTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 text-slate-100 text-xs sm:text-sm rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 font-serif"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Hero Subtitle / Description *
              </label>
              <textarea
                rows={2}
                required
                value={heroForm.heroSubtitle}
                onChange={(e) => setHeroForm({ ...heroForm, heroSubtitle: e.target.value })}
                className="w-full p-3 bg-slate-950 text-slate-100 text-xs sm:text-sm rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <ImageUploader
              label="Hero Background Banner Image"
              value={heroForm.heroImageUrl}
              onChange={(url) => setHeroForm({ ...heroForm, heroImageUrl: url })}
              aspectRatio="landscape"
              presetImages={[
                'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=1600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1600&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1600&auto=format&fit=crop&q=80',
              ]}
            />
          </div>
        </div>

        {/* Hospital Performance Statistics */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-4">
          <h3 className="text-base font-bold font-serif text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-400" />
            <span>Hospital Statistics Strip</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Doctors Count
              </label>
              <input
                type="number"
                value={heroForm.doctorsCount}
                onChange={(e) => setHeroForm({ ...heroForm, doctorsCount: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-950 text-slate-100 text-xs rounded-xl border border-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Departments
              </label>
              <input
                type="number"
                value={heroForm.departmentsCount}
                onChange={(e) =>
                  setHeroForm({ ...heroForm, departmentsCount: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-slate-950 text-slate-100 text-xs rounded-xl border border-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Patients Served
              </label>
              <input
                type="number"
                value={heroForm.patientsServed}
                onChange={(e) =>
                  setHeroForm({ ...heroForm, patientsServed: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-slate-950 text-slate-100 text-xs rounded-xl border border-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Satisfaction Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={heroForm.satisfactionRate}
                onChange={(e) =>
                  setHeroForm({ ...heroForm, satisfactionRate: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-slate-950 text-slate-100 text-xs rounded-xl border border-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Emergency Response
              </label>
              <input
                type="text"
                value={heroForm.emergencyResponseTime}
                onChange={(e) =>
                  setHeroForm({ ...heroForm, emergencyResponseTime: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-950 text-slate-100 text-xs rounded-xl border border-slate-800 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Save Hero Changes */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSavingHero}
            className="px-6 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSavingHero ? 'Saving...' : 'Save Banner & Metrics'}</span>
          </button>
        </div>
      </form>

      {/* Testimonials Management Section */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold font-serif text-white flex items-center gap-2">
            <Quote className="w-4 h-4 text-amber-400" />
            <span>Patient Testimonials ({testimonials.length})</span>
          </h3>
          <button
            onClick={() => setIsAddingTestimonial(!isAddingTestimonial)}
            className="px-3 py-1.5 rounded-xl bg-amber-900/60 hover:bg-amber-800 text-amber-200 text-xs font-semibold border border-amber-700/60 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Review</span>
          </button>
        </div>

        {/* Add Testimonial Form */}
        <AnimatePresence>
          {isAddingTestimonial && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleAddTestimonial}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTestimonial.patientName}
                    onChange={(e) =>
                      setNewTestimonial({ ...newTestimonial, patientName: e.target.value })
                    }
                    placeholder="e.g. Maria Gonzalez"
                    className="w-full px-3 py-2 bg-slate-900 text-slate-100 text-xs rounded-xl border border-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Treatment / Procedure
                  </label>
                  <input
                    type="text"
                    value={newTestimonial.treatment}
                    onChange={(e) =>
                      setNewTestimonial({ ...newTestimonial, treatment: e.target.value })
                    }
                    placeholder="e.g. Coronary Angioplasty"
                    className="w-full px-3 py-2 bg-slate-900 text-slate-100 text-xs rounded-xl border border-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Attending Physician
                  </label>
                  <input
                    type="text"
                    value={newTestimonial.doctorName}
                    onChange={(e) =>
                      setNewTestimonial({ ...newTestimonial, doctorName: e.target.value })
                    }
                    placeholder="e.g. Dr. Arthur Pendelton"
                    className="w-full px-3 py-2 bg-slate-900 text-slate-100 text-xs rounded-xl border border-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Testimonial Quote *
                </label>
                <textarea
                  rows={2}
                  required
                  value={newTestimonial.comment}
                  onChange={(e) =>
                    setNewTestimonial({ ...newTestimonial, comment: e.target.value })
                  }
                  placeholder="The care and swift response of the cardiology team saved my life..."
                  className="w-full p-2.5 bg-slate-900 text-slate-100 text-xs rounded-xl border border-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingTestimonial(false)}
                  className="px-3 py-1.5 rounded-xl border border-slate-700 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold"
                >
                  Save Testimonial
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Testimonials List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-start justify-between gap-3 text-xs"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{test.patientName}</span>
                  <span className="text-[10px] text-teal-400 font-mono">({test.treatment})</span>
                </div>
                <p className="text-slate-300 italic line-clamp-2">"{test.comment}"</p>
                <div className="text-[10px] text-slate-500">Treated by: {test.doctorName}</div>
              </div>

              <button
                onClick={() => deleteTestimonial(test.id)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors shrink-0"
                title="Delete Testimonial"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
