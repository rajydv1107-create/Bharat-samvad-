import React, { useState } from 'react';
import { AlertTriangle, X, HeartPulse, Hospital, Phone } from 'lucide-react';
import { TranslationDictionary } from '../services/i18n';
import { EmergencyData } from '../types';

interface Props {
  t: TranslationDictionary;
  onSubmit: (data: EmergencyData, note: string) => void;
  onClose: () => void;
}

export const CreateEmergencyModal: React.FC<Props> = ({ t, onSubmit, onClose }) => {
  const [bloodGroup, setBloodGroup] = useState('B Positive (B+)');
  const [patientName, setPatientName] = useState('');
  const [hospital, setHospital] = useState('');
  const [contactPhone, setContactPhone] = useState('+91 98450 ');
  const [unitsNeeded, setUnitsNeeded] = useState(2);
  const [additionalNote, setAdditionalNote] = useState('');

  const bloodGroups = [
    'A Positive (A+)',
    'A Negative (A-)',
    'B Positive (B+)',
    'B Negative (B-)',
    'O Positive (O+)',
    'O Negative (O-)',
    'AB Positive (AB+)',
    'AB Negative (AB-)',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospital.trim() || !contactPhone.trim()) return;

    onSubmit(
      {
        bloodGroup,
        patientName: patientName.trim() || 'Resident Family Member',
        hospital: hospital.trim(),
        contactPhone: contactPhone.trim(),
        urgency: 'CRITICAL',
        unitsNeeded,
        unitsPledged: 0,
      },
      additionalNote.trim() || `Urgent requirement for ${bloodGroup} blood at ${hospital}.`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#111b21] border border-red-500/40 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-red-950/40 border-b border-red-500/30">
          <div className="flex items-center gap-2 text-red-400 font-semibold text-sm">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span>{t.emergencyAlert}</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-red-400" />
              <span>Blood Group Required</span>
            </label>
            <select
              value={bloodGroup}
              onChange={e => setBloodGroup(e.target.value)}
              className="w-full bg-[#202c33] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
            >
              {bloodGroups.map(bg => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Patient Name</label>
              <input
                type="text"
                value={patientName}
                onChange={e => setPatientName(e.target.value)}
                placeholder="e.g. Ramesh Joshi (Flat C-201)"
                className="w-full bg-[#202c33] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">{t.unitsNeeded}</label>
              <input
                type="number"
                min="1"
                max="10"
                value={unitsNeeded}
                onChange={e => setUnitsNeeded(Number(e.target.value))}
                className="w-full bg-[#202c33] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Hospital className="w-4 h-4 text-red-400" />
              <span>Hospital & Ward</span>
            </label>
            <input
              type="text"
              required
              value={hospital}
              onChange={e => setHospital(e.target.value)}
              placeholder="e.g. Kokilaben Dhirubhai Ambani Hospital, ICU-3"
              className="w-full bg-[#202c33] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-red-400" />
              <span>Attendant Contact Phone</span>
            </label>
            <input
              type="text"
              required
              value={contactPhone}
              onChange={e => setContactPhone(e.target.value)}
              placeholder="+91 98450 11223"
              className="w-full bg-[#202c33] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Brief Medical Summary</label>
            <textarea
              rows={2}
              value={additionalNote}
              onChange={e => setAdditionalNote(e.target.value)}
              placeholder="e.g. Critical surgery scheduled in 2 hours, donors please coordinate directly."
              className="w-full bg-[#202c33] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-colors"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Broadcast Encrypted Community SOS</span>
          </button>
        </form>
      </div>
    </div>
  );
};
