import React, { useState } from 'react';
import { ShieldCheck, CheckCircle, XCircle, AlertCircle, Search, UserCheck } from 'lucide-react';
import { approveVet, rejectVet, getStoredVets } from '../services/authService';

export default function AdminVetApprovals({ pendingVets, setPendingVets, approvedVets, setApprovedVets, dict, lang }) {
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [searchFilter, setSearchFilter] = useState('');

  const handleApprove = (vetId) => {
    approveVet(vetId);
    const all = getStoredVets();
    setApprovedVets(all.filter(v => v.status === 'approved'));
    setPendingVets(all.filter(v => v.status === 'pending'));
  };

  const handleConfirmReject = (vetId) => {
    if (!rejectReason.trim()) return;
    rejectVet(vetId, rejectReason);
    const all = getStoredVets();
    setApprovedVets(all.filter(v => v.status === 'approved'));
    setPendingVets(all.filter(v => v.status === 'pending'));
    setRejectingId(null);
    setRejectReason('');
  };

  const filteredPending = pendingVets.filter(v => 
    v.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    v.licenseNumber.toLowerCase().includes(searchFilter.toLowerCase()) ||
    v.district.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#0F2F5C] text-white p-6 rounded-2xl border border-[#0B2447] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-[#0B2447] flex items-center justify-center border border-white/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Department Admin — Veterinary Officer Registrations</h2>
            <p className="text-xs text-blue-100">Verify VCI credentials, certificates & approve official officer profiles.</p>
          </div>
        </div>

        <div className="bg-[#0B2447] px-4 py-2 rounded-xl border border-white/20 text-xs font-bold flex items-center space-x-2">
          <span>Pending Approvals:</span>
          <span className="bg-[#E07B00] text-white px-2.5 py-0.5 rounded-full text-xs font-mono">{pendingVets.length}</span>
        </div>
      </div>

      {/* ICAR-NIVEDI & State Department Data Access Status Note (Section 3) */}
      <div className="bg-[#F3F4F6] border border-[#D1D5DB] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <strong className="text-[#0F2F5C]">Epidemiological Data Integration Status:</strong>
            <span className="bg-amber-100 text-amber-900 border border-amber-300 font-mono text-[10px] px-2 py-0.5 rounded font-bold">
              Data access requested from NIVEDI / state department
            </span>
          </div>
          <p className="text-[11px] text-[#4B5563]">
            Disease seasonality profiles, historical endemic patterns, and 20th Livestock Census datasets are grounded in official public bulletins with strict academic attribution.
          </p>
        </div>
        <span className="text-[10px] text-[#4B5563] bg-white px-2.5 py-1 rounded border border-[#D1D5DB] flex-shrink-0 font-mono">
          Ref: AH-DIS-2026-RQ
        </span>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-300 shadow-sm flex items-center space-x-3">
        <Search className="w-4 h-4 text-gray-500" />
        <input
          type="text"
          value={searchFilter}
          onChange={e => setSearchFilter(e.target.value)}
          placeholder="Filter pending registrations by Doctor name, License No., or District..."
          className="w-full bg-[#F3F4F6] border border-gray-300 rounded-xl px-4 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0F2F5C]"
        />
      </div>

      {/* Pending List Container */}
      <div className="bg-white rounded-2xl border border-gray-300 p-6 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center space-x-2">
          <UserCheck className="w-4 h-4 text-[#0F2F5C]" />
          <span>Pending Officers Verification List ({filteredPending.length})</span>
        </h3>

        {filteredPending.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-500 space-y-2">
            <CheckCircle className="w-10 h-10 text-[#15803D] mx-auto" />
            <p className="font-bold text-gray-800 text-sm">No Pending Registrations</p>
            <p>All submitted veterinary officer profiles have been processed by the department.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPending.map(vet => (
              <div key={vet.id} className="bg-[#F3F4F6] border border-gray-300 rounded-xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-300 pb-3">
                  <div>
                    <h4 className="text-base font-bold text-gray-900">{vet.name}</h4>
                    <p className="text-xs text-gray-600">{vet.degree} • {vet.specialization}</p>
                  </div>

                  <span className="bg-amber-100 text-[#D97706] text-xs font-bold px-3 py-1 rounded-full border border-amber-300 flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>PENDING APPROVAL</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-white p-3 rounded-lg border border-gray-200 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase">VCI License No.</span>
                    <strong className="text-gray-900">{vet.licenseNumber}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase">Mobile</span>
                    <strong className="text-gray-900">{vet.mobile}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase">Assigned District</span>
                    <strong className="text-gray-900">{vet.district} ({vet.state})</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase">Certificate Document</span>
                    <strong className="text-[#15803D]">Uploaded ✓</strong>
                  </div>
                </div>

                {/* Actions */}
                {rejectingId === vet.id ? (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-xl space-y-3">
                    <label className="text-xs font-bold text-[#DC2626] block">Reason for Rejection (Required):</label>
                    <input
                      type="text"
                      value={rejectReason}
                      onChange={e => setRejectReason(e.target.value)}
                      placeholder="e.g. Invalid VCI License Number format or unreadable certificate image..."
                      className="w-full bg-white border border-red-300 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#DC2626]"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleConfirmReject(vet.id)}
                        className="bg-[#DC2626] hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg text-xs cursor-pointer"
                      >
                        Confirm Rejection
                      </button>
                      <button
                        onClick={() => setRejectingId(null)}
                        className="bg-gray-200 text-gray-800 font-bold px-4 py-2 rounded-lg text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      onClick={() => handleApprove(vet.id)}
                      className="flex-1 bg-[#0F2F5C] hover:bg-[#0B2447] text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer shadow-sm"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve Officer Registration</span>
                    </button>

                    <button
                      onClick={() => { setRejectingId(vet.id); setRejectReason(''); }}
                      className="flex-1 bg-red-100 hover:bg-red-200 text-[#DC2626] border border-red-300 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject Registration</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Already Approved Vets Section */}
      <div className="bg-white rounded-2xl border border-gray-300 p-6 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-[#15803D]" />
          <span>Active Approved Veterinary Officers ({approvedVets.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {approvedVets.map(v => (
            <div key={v.id} className="bg-[#F3F4F6] border border-gray-300 rounded-xl p-4 flex justify-between items-center text-xs">
              <div>
                <h5 className="font-bold text-gray-900 text-sm">{v.name}</h5>
                <p className="text-gray-600">{v.degree} • License: <span className="font-mono text-[#0F2F5C] font-bold">{v.licenseNumber}</span></p>
                <p className="text-gray-500 text-[11px]">{v.district} District ({v.state})</p>
              </div>
              <span className="bg-[#15803D] text-white font-bold px-2.5 py-1 rounded-full text-[10px]">
                APPROVED
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
