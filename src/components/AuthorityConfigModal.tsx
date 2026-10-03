import React, { useState } from 'react';
import { TargetAuthorityConfig } from '../types';
import { X, Building2, Check, Shield } from 'lucide-react';

interface AuthorityConfigModalProps {
  currentConfig: TargetAuthorityConfig;
  onClose: () => void;
  onSave: (config: TargetAuthorityConfig) => void;
}

export const AuthorityConfigModal: React.FC<AuthorityConfigModalProps> = ({
  currentConfig,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(currentConfig.name);
  const [acronym, setAcronym] = useState(currentConfig.acronym);
  const [department, setDepartment] = useState(currentConfig.department);
  const [jurisdiction, setJurisdiction] = useState(currentConfig.jurisdiction);
  const [officialEmail, setOfficialEmail] = useState(currentConfig.officialEmail);
  const [legalFramework, setLegalFramework] = useState(currentConfig.legalFramework);
  const [leadOfficer, setLeadOfficer] = useState(currentConfig.leadOfficer);

  const presets = [
    {
      label: 'CPCB (India / Delhi NCR)',
      data: {
        name: 'Central Pollution Control Board & Directorate of Air Quality Enforcement',
        acronym: 'CPCB-DAQE',
        department: 'Commission for Air Quality Management (CAQM)',
        jurisdiction: 'National Capital Region & Adjoining Areas',
        officialEmail: 'enforcement.air@cpcb.gov.in',
        legalFramework: 'Air (Prevention and Control of Pollution) Act, 1981 & GRAP-4 Rules',
        leadOfficer: 'Director General of Urban Air Quality Inspection',
      },
    },
    {
      label: 'US EPA / State AQMD (USA)',
      data: {
        name: 'United States Environmental Protection Agency - Region Air Enforcement',
        acronym: 'US-EPA-AIR',
        department: 'Air and Radiation Division, Enforcement Directorate',
        jurisdiction: 'Metropolitan Air Quality Management District',
        officialEmail: 'air.enforcement@epa.gov',
        legalFramework: 'Clean Air Act Title I & National Ambient Air Quality Standards',
        leadOfficer: 'Regional Air Quality Enforcement Officer',
      },
    },
    {
      label: 'London / EEA (Europe)',
      data: {
        name: 'Metropolitan Air Quality Regulatory & Environmental Authority',
        acronym: 'MAQ-ENV',
        department: 'Ultra-Low Emission Zone (ULEZ) Enforcement Command',
        jurisdiction: 'Greater Metropolitan Clean Air Zone',
        officialEmail: 'air-compliance@environment-agency.gov.uk',
        legalFramework: 'Ambient Air Quality Directive 2008/50/EC & Clean Air Act',
        leadOfficer: 'Chief Environmental Health Inspector',
      },
    },
  ];

  const handleApplyPreset = (p: typeof presets[0]['data']) => {
    setName(p.name);
    setAcronym(p.acronym);
    setDepartment(p.department);
    setJurisdiction(p.jurisdiction);
    setOfficialEmail(p.officialEmail);
    setLegalFramework(p.legalFramework);
    setLeadOfficer(p.leadOfficer);
  };

  const handleSave = () => {
    onSave({
      name,
      acronym,
      department,
      jurisdiction,
      officialEmail,
      legalFramework,
      leadOfficer,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-slate-100 my-auto">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-base font-bold text-white">
                Configure Municipal Pollution Control Body
              </h2>
              <p className="text-xs text-slate-400">
                Target agency receiving automated formal enforcement notices & citation orders
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets */}
        <div className="mb-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Select Jurisdiction Preset
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {presets.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleApplyPreset(p.data)}
                className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500 text-left transition cursor-pointer text-xs font-semibold text-slate-200"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form Inputs */}
        <div className="space-y-3 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Authority / Board Full Title:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Acronym / Code:</label>
              <input
                type="text"
                value={acronym}
                onChange={(e) => setAcronym(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Official Dispatch Email:</label>
              <input
                type="email"
                value={officialEmail}
                onChange={(e) => setOfficialEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Statutory Legal Acts & Rules:
            </label>
            <input
              type="text"
              value={legalFramework}
              onChange={(e) => setLegalFramework(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Territorial Jurisdiction:
            </label>
            <input
              type="text"
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-950/40 transition cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>
    </div>
  );
};
