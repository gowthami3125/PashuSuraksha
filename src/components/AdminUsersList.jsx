import React, { useState } from 'react';
import { Users, User, Stethoscope, Search, ShieldCheck, Clock, XCircle, Phone, MapPin } from 'lucide-react';
import { getStoredFarmers, getStoredVets } from '../services/authService';

export default function AdminUsersList({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('farmers'); // 'farmers' | 'vets'
  const [searchQuery, setSearchQuery] = useState('');

  const farmers = getStoredFarmers();
  const vets = getStoredVets();

  const filteredFarmers = farmers.filter(f => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      f.name?.toLowerCase().includes(q) ||
      f.mobile?.includes(q) ||
      f.district?.toLowerCase().includes(q) ||
      f.village?.toLowerCase().includes(q)
    );
  });

  const filteredVets = vets.filter(v => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      v.name?.toLowerCase().includes(q) ||
      v.licenseNumber?.toLowerCase().includes(q) ||
      v.mobile?.includes(q) ||
      v.district?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-[#D1D5DB] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-[#0F2F5C] text-white flex items-center justify-center font-bold">
            <Users className="w-6 h-6 text-[#E07B00]" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#111827]">
              Registered System Users Registry
            </h2>
            <p className="text-xs text-[#4B5563]">
              All authenticated livestock keepers and registered veterinary officers
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-[#F3F4F6] p-1 rounded-xl border border-[#D1D5DB]">
          <button
            type="button"
            onClick={() => setActiveTab('farmers')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'farmers' ? 'bg-[#0F2F5C] text-white shadow-xs' : 'text-[#4B5563] hover:text-black'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Farmers ({farmers.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('vets')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'vets' ? 'bg-[#0F2F5C] text-white shadow-xs' : 'text-[#4B5563] hover:text-black'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Vet Officers ({vets.length})</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#6B7280] absolute left-3 top-2.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={activeTab === 'farmers' ? 'Search by name, mobile, village, or district...' : 'Search by vet name, license number, or mobile...'}
          className="w-full bg-white border border-[#D1D5DB] rounded-xl pl-9 pr-4 py-2 text-xs text-[#111827] focus:outline-none focus:border-[#0F2F5C]"
        />
      </div>

      {/* List Display */}
      {activeTab === 'farmers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFarmers.map((f, i) => (
            <div key={i} className="bg-white border border-[#D1D5DB] rounded-xl p-5 space-y-3 shadow-xs">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-base text-[#111827]">{f.name}</h4>
                  <p className="text-xs text-[#0F2F5C] font-semibold flex items-center space-x-1 mt-0.5">
                    <Phone className="w-3 h-3" />
                    <span>+91 {f.mobile}</span>
                  </p>
                </div>
                <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  PIN Active
                </span>
              </div>

              <div className="bg-[#F9FAFB] p-2.5 rounded-lg border border-[#E5E7EB] text-xs space-y-0.5">
                <p className="text-[#4B5563]">
                  <strong>Village:</strong> {f.village || 'N/A'}, {f.taluka ? `${f.taluka} Taluka, ` : ''}{f.district} District
                </p>
                <p className="text-[#4B5563]">
                  <strong>State:</strong> {f.state || 'Maharashtra'}
                </p>
                <p className="text-[10px] text-[#9CA3AF]">
                  Registered: {f.registeredAt ? new Date(f.registeredAt).toLocaleDateString() : 'Active Member'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'vets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredVets.map((v, i) => (
            <div key={i} className="bg-white border border-[#D1D5DB] rounded-xl p-5 space-y-3 shadow-xs">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-base text-[#111827]">{v.name}</h4>
                  <p className="text-xs font-mono text-[#0F2F5C] font-bold mt-0.5">
                    Licence: {v.licenseNumber}
                  </p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                  v.status === 'approved' ? 'bg-green-100 text-green-800' :
                  v.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {v.status}
                </span>
              </div>

              <div className="bg-[#F9FAFB] p-2.5 rounded-lg border border-[#E5E7EB] text-xs space-y-0.5">
                <p className="text-[#111827] font-semibold">{v.degree} &bull; {v.specialization}</p>
                <p className="text-[#4B5563]">
                  Mobile: <strong>+91 {v.mobile}</strong> &bull; {v.district}, {v.state}
                </p>
                {v.rejectionReason && (
                  <p className="text-red-700 text-[11px]">
                    <strong>Rejection Reason:</strong> {v.rejectionReason}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
