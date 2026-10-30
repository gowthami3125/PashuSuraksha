import React, { useState } from 'react';
import { UserCheck, Lock, Key, ShieldCheck, FileText, CheckCircle, AlertCircle, X, ShieldAlert } from 'lucide-react';

export default function VetAuthModal({ 
  showModal, 
  setShowModal, 
  currentVetUser, 
  setCurrentVetUser, 
  pendingVets, 
  setPendingVets, 
  approvedVets, 
  setApprovedVets,
  dict 
}) {
  const [authTab, setAuthTab] = useState('login'); // 'login' | 'register' | 'admin'
  
  // Registration Form State
  const [regForm, setRegForm] = useState({
    name: '',
    degree: 'B.V.Sc & A.H.',
    specialization: 'Livestock Epidemiology',
    licenseNumber: '',
    mobile: '',
    district: 'Pune',
    state: 'Maharashtra',
    certificateFile: null,
    password: ''
  });
  const [regSubmittedMsg, setRegSubmittedMsg] = useState(false);

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('VCI-MH-2021-0842'); // License or Mobile
  const [loginPassword, setLoginPassword] = useState('vet123');
  const [otpStep, setOtpStep] = useState(false);
  const [inputOtp, setInputOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('123456');
  const [loginError, setLoginError] = useState('');

  // Admin approval notes
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedPendingId, setSelectedPendingId] = useState(null);

  if (!showModal) return null;

  const handleRegister = (e) => {
    e.preventDefault();
    if (!regForm.name || !regForm.licenseNumber || !regForm.mobile) return;

    const newVet = {
      id: `VET-REG-${Date.now()}`,
      name: regForm.name,
      degree: regForm.degree,
      specialization: regForm.specialization,
      licenseNumber: regForm.licenseNumber,
      mobile: regForm.mobile,
      district: regForm.district,
      state: regForm.state,
      status: 'pending', // 'pending' | 'approved' | 'rejected'
      password: regForm.password || 'vet123',
      submittedAt: new Date().toLocaleDateString()
    };

    setPendingVets(prev => [...prev, newVet]);
    setRegSubmittedMsg(true);
  };

  const handleLoginSubmitPassword = (e) => {
    e.preventDefault();
    setLoginError('');

    // Check if vet exists in approved list
    const foundVet = approvedVets.find(
      v => (v.licenseNumber.toLowerCase() === loginIdentifier.toLowerCase() || v.mobile === loginIdentifier)
    );

    if (!foundVet) {
      // Check if pending
      const isPending = pendingVets.some(
        v => (v.licenseNumber.toLowerCase() === loginIdentifier.toLowerCase() || v.mobile === loginIdentifier)
      );
      if (isPending) {
        setLoginError('Your registration is pending Admin Approval by the Animal Husbandry Department.');
      } else {
        setLoginError('Invalid License / Mobile number or Doctor profile not approved yet.');
      }
      return;
    }

    // Pass password step, proceed to OTP
    setGeneratedOtp('123456');
    setOtpStep(true);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (inputOtp === generatedOtp || inputOtp === '123456') {
      const foundVet = approvedVets.find(
        v => (v.licenseNumber.toLowerCase() === loginIdentifier.toLowerCase() || v.mobile === loginIdentifier)
      );
      setCurrentVetUser(foundVet || approvedVets[0]);
      setShowModal(false);
      setOtpStep(false);
      setInputOtp('');
    } else {
      setLoginError('Invalid OTP code. Please enter 123456 for demo.');
    }
  };

  const handleApproveVet = (vetId) => {
    const vetToApprove = pendingVets.find(v => v.id === vetId);
    if (!vetToApprove) return;

    const approvedObj = { ...vetToApprove, status: 'approved' };
    setApprovedVets(prev => [...prev, approvedObj]);
    setPendingVets(prev => prev.filter(v => v.id !== vetId));
  };

  const handleRejectVet = (vetId) => {
    setPendingVets(prev => prev.filter(v => v.id !== vetId));
    setSelectedPendingId(null);
    setRejectionReason('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-300 text-gray-900 w-full max-w-lg rounded-2xl p-6 space-y-5 shadow-xl relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={() => { setShowModal(false); setOtpStep(false); setRegSubmittedMsg(false); }} 
          className="absolute top-5 right-5 text-gray-500 hover:text-gray-700 p-2 rounded-lg bg-gray-100 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-[#0F2F5C]">
            <UserCheck className="w-6 h-6" />
            <h3 className="text-xl font-bold">Veterinary Officer Portal Authentication</h3>
          </div>
          <p className="text-xs text-gray-600">Official license registration, password + OTP login & department approval.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#F3F4F6] p-1 rounded-xl gap-1 text-xs font-bold border border-gray-300">
          <button
            onClick={() => { setAuthTab('login'); setLoginError(''); setOtpStep(false); }}
            className={`flex-1 py-2 rounded-lg transition cursor-pointer ${authTab === 'login' ? 'bg-[#0F2F5C] text-white shadow-xs' : 'text-gray-700 hover:text-gray-900'}`}
          >
            Officer Login
          </button>
          <button
            onClick={() => { setAuthTab('register'); setRegSubmittedMsg(false); }}
            className={`flex-1 py-2 rounded-lg transition cursor-pointer ${authTab === 'register' ? 'bg-[#0F2F5C] text-white shadow-xs' : 'text-gray-700 hover:text-gray-900'}`}
          >
            Register Profile
          </button>
          <button
            onClick={() => setAuthTab('admin')}
            className={`flex-1 py-2 rounded-lg transition cursor-pointer ${authTab === 'admin' ? 'bg-[#0F2F5C] text-white shadow-xs' : 'text-gray-700 hover:text-gray-900'}`}
          >
            Admin Approvals ({pendingVets.length})
          </button>
        </div>

        {/* TAB 1: LOGIN FLOW */}
        {authTab === 'login' && (
          <div>
            {!otpStep ? (
              <form onSubmit={handleLoginSubmitPassword} className="space-y-4 pt-1">
                {loginError && (
                  <div className="bg-red-50 border border-red-200 text-[#DC2626] p-3 rounded-xl text-xs font-semibold flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-[#DC2626] flex-shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">License Number or Mobile Number</label>
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={e => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. VCI-MH-2021-0842 or 9822012345"
                    className="w-full bg-[#F3F4F6] border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#0F2F5C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Password</label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full bg-[#F3F4F6] border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#0F2F5C]"
                  />
                </div>

                <div className="bg-[#F3F4F6] border border-gray-300 p-3 rounded-xl text-[11px] text-gray-900 font-semibold space-y-1">
                  <p>💡 Demo Hint:</p>
                  <p>License: <code className="bg-white px-1 py-0.5 rounded font-bold border border-gray-200">VCI-MH-2021-0842</code> | Password: <code className="bg-white px-1 py-0.5 rounded font-bold border border-gray-200">vet123</code></p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0F2F5C] hover:bg-[#0B2447] text-white font-bold py-3 rounded-xl text-xs transition cursor-pointer shadow-sm"
                >
                  Proceed to OTP Verification →
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4 pt-1">
                <div className="bg-[#F3F4F6] border border-gray-300 p-3 rounded-xl text-xs font-semibold text-gray-900 text-center">
                  🔐 OTP sent to registered mobile for license {loginIdentifier}.
                  <p className="mt-1 font-mono text-sm text-[#0F2F5C] font-bold">Demo OTP Code: {generatedOtp}</p>
                </div>

                {loginError && (
                  <div className="bg-red-50 border border-red-200 text-[#DC2626] p-3 rounded-xl text-xs font-semibold flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-[#DC2626] flex-shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Enter 6-Digit OTP Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={inputOtp}
                    onChange={e => setInputOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full bg-[#F3F4F6] border border-gray-300 rounded-xl px-3.5 py-2.5 text-center font-mono text-lg font-bold text-gray-900 tracking-widest focus:outline-none focus:border-[#0F2F5C]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0F2F5C] hover:bg-[#0B2447] text-white font-bold py-3 rounded-xl text-xs transition cursor-pointer shadow-sm"
                >
                  Verify OTP & Access Vet Officer Dashboard
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: REGISTRATION FORM */}
        {authTab === 'register' && (
          <div>
            {!regSubmittedMsg ? (
              <form onSubmit={handleRegister} className="space-y-3 pt-1">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-700">Doctor Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Dr. S. K. Kulkarni"
                      value={regForm.name}
                      onChange={e => setRegForm({...regForm, name: e.target.value})}
                      className="w-full bg-[#F3F4F6] border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-700">Degree / Qualification</label>
                    <select
                      value={regForm.degree}
                      onChange={e => setRegForm({...regForm, degree: e.target.value})}
                      className="w-full bg-[#F3F4F6] border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold"
                    >
                      <option value="B.V.Sc & A.H.">B.V.Sc & A.H.</option>
                      <option value="M.V.Sc (Epidemiology)">M.V.Sc (Epidemiology)</option>
                      <option value="M.V.Sc (Microbiology)">M.V.Sc (Microbiology)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-700">License / Reg Number</label>
                    <input
                      type="text"
                      required
                      placeholder="VCI-MH-2024-9988"
                      value={regForm.licenseNumber}
                      onChange={e => setRegForm({...regForm, licenseNumber: e.target.value})}
                      className="w-full bg-[#F3F4F6] border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-700">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="9822011223"
                      value={regForm.mobile}
                      onChange={e => setRegForm({...regForm, mobile: e.target.value})}
                      className="w-full bg-[#F3F4F6] border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-700">State</label>
                    <select
                      value={regForm.state}
                      onChange={e => setRegForm({...regForm, state: e.target.value})}
                      className="w-full bg-[#F3F4F6] border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold"
                    >
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-700">District Assigned</label>
                    <input
                      type="text"
                      required
                      placeholder="Pune / Kolhapur / Guntur"
                      value={regForm.district}
                      onChange={e => setRegForm({...regForm, district: e.target.value})}
                      className="w-full bg-[#F3F4F6] border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700">VCI Registration Certificate Upload (PDF/Image)</label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="w-full bg-[#F3F4F6] border border-gray-300 rounded-xl p-2 text-xs font-semibold text-gray-700 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700">Create Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Create secure password"
                    value={regForm.password}
                    onChange={e => setRegForm({...regForm, password: e.target.value})}
                    className="w-full bg-[#F3F4F6] border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0F2F5C] hover:bg-[#0B2447] text-white font-bold py-3 rounded-xl text-xs transition cursor-pointer shadow-sm"
                >
                  Submit Registration for Department Approval
                </button>
              </form>
            ) : (
              <div className="py-6 text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-[#15803D] mx-auto animate-bounce" />
                <h4 className="text-base font-bold text-gray-900">Registration Submitted!</h4>
                <p className="text-xs text-gray-600 leading-relaxed max-w-sm mx-auto">
                  Your registration profile and VCI certificate have been submitted for Department Admin Approval. Status starts as <strong>Pending Approval</strong>.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => { setAuthTab('admin'); }}
                    className="bg-[#0F2F5C] hover:bg-[#0B2447] text-white font-bold px-4 py-2 rounded-xl text-xs"
                  >
                    View in Admin Approvals List →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ADMIN APPROVAL DASHBOARD */}
        {authTab === 'admin' && (
          <div className="space-y-4 pt-1">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Pending Veterinary Officer Registrations</h4>
              <span className="bg-amber-100 text-[#D97706] text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300">
                {pendingVets.length} Pending
              </span>
            </div>

            {pendingVets.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-500 space-y-1">
                <CheckCircle className="w-8 h-8 text-[#15803D] mx-auto" />
                <p className="font-bold text-gray-800">No pending registrations</p>
                <p>All submitted veterinary officer profiles have been processed.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {pendingVets.map(vet => (
                  <div key={vet.id} className="bg-[#F3F4F6] border border-gray-300 rounded-xl p-3.5 space-y-2 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-bold text-gray-900">{vet.name}</h5>
                        <p className="text-[11px] text-gray-600">{vet.degree} • {vet.specialization}</p>
                      </div>
                      <span className="bg-amber-100 text-[#D97706] text-[10px] font-bold px-2 py-0.5 rounded border border-amber-300 uppercase">
                        Pending
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-700 bg-white p-2 rounded-lg border border-gray-200 font-mono">
                      <div>License: <strong className="text-gray-900">{vet.licenseNumber}</strong></div>
                      <div>Mobile: <strong className="text-gray-900">{vet.mobile}</strong></div>
                      <div>District: <strong className="text-gray-900">{vet.district} ({vet.state})</strong></div>
                      <div>Certificate: <strong className="text-[#15803D]">Uploaded ✓</strong></div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleApproveVet(vet.id)}
                        className="flex-1 bg-[#0F2F5C] hover:bg-[#0B2447] text-white font-bold py-1.5 rounded-lg text-[11px] transition"
                      >
                        ✓ Approve Officer
                      </button>
                      <button
                        onClick={() => handleRejectVet(vet.id)}
                        className="flex-1 bg-red-100 hover:bg-red-200 text-[#DC2626] font-bold py-1.5 rounded-lg text-[11px] transition"
                      >
                        ✕ Reject (Reason)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
