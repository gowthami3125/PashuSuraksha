import React, { useState } from 'react';
import { 
  User, Stethoscope, Lock, Key, ShieldAlert, ArrowRight, CheckCircle, 
  AlertCircle, Phone, FileText, Upload, ChevronLeft, HelpCircle, X, Info
} from 'lucide-react';
import LocationPicker from './LocationPicker';
import { 
  registerFarmer, 
  authenticateFarmer, 
  registerVet, 
  authenticateVet, 
  createSession 
} from '../services/authService';

export default function AuthPortal({ 
  onLoginSuccess, 
  onNavigate, 
  initialRole = null, 
  dict = {},
  lang = 'en',
  userSession = null
}) {
  // Selected Choice: null | 'farmer' | 'vet'
  const [selectedRole, setSelectedRole] = useState(initialRole);
  
  // Tabs: 'login' | 'signup'
  const [authMode, setAuthMode] = useState('login');

  // General Status Messages
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPinModal, setShowForgotPinModal] = useState(false);

  // Farmer Form State
  const [farmerForm, setFarmerForm] = useState({
    name: '',
    mobile: '',
    pin: '',
    confirmPin: '',
    state: 'Maharashtra',
    district: 'Pune',
    taluka: 'Haveli',
    village: ''
  });

  // Vet Form State
  const [vetForm, setVetForm] = useState({
    identifier: '', // mobile or license number for login
    password: '',
    otp: '123456',
    // Registration Fields
    name: '',
    degree: 'B.V.Sc & A.H.',
    specialization: 'Bovine Infectious Diseases',
    licenseNumber: '',
    mobile: '',
    state: 'Maharashtra',
    district: 'Pune',
    taluka: 'Haveli',
    certificateFile: null,
    regPassword: ''
  });

  // ----------------------------------------------------
  // FARMER SUBMIT HANDLERS
  // ----------------------------------------------------
  const handleFarmerLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (!farmerForm.mobile || farmerForm.mobile.length !== 10) {
        throw new Error('Please enter a valid 10-digit mobile number.');
      }
      if (!farmerForm.pin || farmerForm.pin.length !== 4) {
        throw new Error('Please enter your 4-digit PIN.');
      }

      const farmer = await authenticateFarmer(farmerForm.mobile, farmerForm.pin);
      const session = createSession(farmer, 'farmer');
      onLoginSuccess(session, 'farmer');
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please verify your mobile and PIN.');
    } finally {
      setLoading(false);
    }
  };

  const handleFarmerSignup = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (!farmerForm.name.trim()) throw new Error('Please enter your full name.');
      if (!farmerForm.mobile || farmerForm.mobile.length !== 10) {
        throw new Error('Please enter a valid 10-digit mobile number.');
      }
      if (!/^\d{4}$/.test(farmerForm.pin)) {
        throw new Error('PIN must be exactly 4 numeric digits.');
      }
      if (farmerForm.pin !== farmerForm.confirmPin) {
        throw new Error('4-digit PIN and Confirm PIN do not match.');
      }
      if (!farmerForm.village.trim()) {
        throw new Error('Please enter your village name.');
      }

      const newFarmer = await registerFarmer({
        name: farmerForm.name,
        mobile: farmerForm.mobile,
        pin: farmerForm.pin,
        village: farmerForm.village,
        taluka: farmerForm.taluka,
        district: farmerForm.district,
        state: farmerForm.state
      });

      setSuccessMsg('Account created successfully with fresh health record! Logging in...');
      setTimeout(() => {
        const session = createSession(newFarmer, 'farmer');
        onLoginSuccess(session, 'farmer');
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message || 'Sign up failed.');
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // VET SUBMIT HANDLERS
  // ----------------------------------------------------
  const handleVetLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (!vetForm.identifier.trim()) {
        throw new Error('Please enter your License Number or Mobile.');
      }
      if (!vetForm.password.trim()) {
        throw new Error('Please enter your password.');
      }

      const vet = await authenticateVet(vetForm.identifier, vetForm.password, vetForm.otp);
      const session = createSession(vet, 'vet');
      onLoginSuccess(session, 'vet');
    } catch (err) {
      setErrorMsg(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleVetRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (!vetForm.name.trim()) throw new Error('Please enter your full name.');
      if (!vetForm.licenseNumber.trim()) throw new Error('Please enter your VCI registration / license number.');
      if (!vetForm.mobile || vetForm.mobile.length !== 10) throw new Error('Please enter a 10-digit mobile number.');
      if (!vetForm.regPassword || vetForm.regPassword.length < 6) throw new Error('Password must be at least 6 characters.');

      await registerVet({
        name: vetForm.name,
        degree: vetForm.degree,
        specialization: vetForm.specialization,
        licenseNumber: vetForm.licenseNumber,
        mobile: vetForm.mobile,
        district: vetForm.district,
        state: vetForm.state,
        taluka: vetForm.taluka,
        password: vetForm.regPassword,
        certificateName: vetForm.certificateFile ? vetForm.certificateFile.name : 'VCI_License_Document.pdf'
      });

      // User Requirement: Status is "Pending" and request goes to admin panel. Show "Waiting for admin approval".
      setSuccessMsg('Waiting for admin approval. Your registration profile has been submitted to the Animal Husbandry Department administrator for verification.');
      setAuthMode('login');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">
      
      {/* Active Session Notice if Already Logged In */}
      {userSession && userSession.user && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xs animate-in fade-in">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{userSession.role === 'farmer' ? '👨‍🌾' : '👨‍⚕️'}</span>
            <div>
              <p className="font-bold text-emerald-950 text-sm">
                Already signed in as {userSession.user?.name || userSession.role}
              </p>
              <p className="text-emerald-800 text-[11px]">
                Active role: <strong className="capitalize">{userSession.role === 'farmer' ? 'Farmer' : 'Veterinary Officer'}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate(userSession.role === 'farmer' ? '/triage' : '/vet/queue')}
            className="bg-[#0F2F5C] hover:bg-[#0B2447] text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-sm"
          >
            Continue to Portal ➜
          </button>
        </div>
      )}

      {/* 1. SELECTION SCREEN (Two choices: "I am a farmer" and "I am a veterinary officer") */}
      {!selectedRole && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[11px] font-bold text-[#E07B00] uppercase tracking-widest block">
              PashuSuraksha Identity & Access
            </span>
            <h2 className="text-2xl font-black text-[#111827]">
              Select Your Role to Continue
            </h2>
            <p className="text-xs text-[#4B5563] max-w-md mx-auto">
              Please choose how you interact with the livestock health and disease advisory portal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            {/* Choice 1: Farmer */}
            <div 
              onClick={() => {
                setSelectedRole('farmer');
                setAuthMode('login');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="bg-white border-2 border-[#D1D5DB] hover:border-[#0F2F5C] rounded-2xl p-6 text-center space-y-4 cursor-pointer transition shadow-xs hover:shadow-md group"
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[#E07B00] flex items-center justify-center mx-auto text-3xl group-hover:scale-105 transition">
                👨‍🌾
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-[#111827]">I am a Farmer</h3>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  Log in or sign up with your phone and secure 4-digit PIN to check livestock symptoms and view health history.
                </p>
              </div>
              <button 
                type="button"
                className="w-full bg-[#0F2F5C] text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-xs"
              >
                <span>Continue as Farmer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Choice 2: Vet Officer */}
            <div 
              onClick={() => {
                setSelectedRole('vet');
                setAuthMode('login');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="bg-white border-2 border-[#D1D5DB] hover:border-[#0F2F5C] rounded-2xl p-6 text-center space-y-4 cursor-pointer transition shadow-xs hover:shadow-md group"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#0F2F5C] flex items-center justify-center mx-auto text-3xl group-hover:scale-105 transition">
                👨‍⚕️
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-[#111827]">I am a Veterinary Officer</h3>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  Log in with your license number and password to manage patient queues, write e-prescriptions and review cases.
                </p>
              </div>
              <button 
                type="button"
                className="w-full bg-[#0F2F5C] text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-xs"
              >
                <span>Continue as Vet Officer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* User Requirement: Small line asking "Are you an admin?" */}
          <div className="pt-4 text-center border-t border-[#E5E7EB]">
            <p className="text-xs text-[#4B5563]">
              Are you an admin?{' '}
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('/admin/login')}
                className="text-[#0F2F5C] hover:text-[#0B2447] font-bold underline inline-flex items-center space-x-1 cursor-pointer ml-1"
                title="Animal Husbandry Department Admin Console"
              >
                <Lock className="w-3.5 h-3.5 inline mr-1 text-[#E07B00]" />
                <span>Admin Login</span>
              </button>
            </p>
          </div>
        </div>
      )}

      {/* 2. AUTHENTICATION BOX (FARMER OR VET) */}
      {selectedRole && (
        <div className="bg-white rounded-2xl border border-[#D1D5DB] shadow-sm p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150">
          
          {/* Back button and Header */}
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
            <button
              type="button"
              onClick={() => {
                setSelectedRole(null);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="text-xs font-bold text-[#4B5563] hover:text-[#0F2F5C] flex items-center space-x-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Role Selection</span>
            </button>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#0F2F5C]/10 text-[#0F2F5C]">
              {selectedRole === 'farmer' ? '👨‍🌾 Farmer Portal' : '👨‍⚕️ Veterinary Officer Portal'}
            </span>
          </div>

          {/* Login vs Sign-up Tabs */}
          <div className="flex bg-[#F3F4F6] p-1 rounded-xl border border-[#D1D5DB]">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                authMode === 'login' ? 'bg-[#0F2F5C] text-white shadow-xs' : 'text-[#4B5563] hover:text-black'
              }`}
            >
              {selectedRole === 'farmer' ? 'Farmer Login' : 'Vet Officer Login'}
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                authMode === 'signup' ? 'bg-[#0F2F5C] text-white shadow-xs' : 'text-[#4B5563] hover:text-black'
              }`}
            >
              {selectedRole === 'farmer' ? 'Sign Up (New Account)' : 'Register New Vet'}
            </button>
          </div>

          {/* Feedback Notices */}
          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold block">Access Error:</span>
                <p>{errorMsg}</p>
              </div>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Notice:</span>
                <p>{successMsg}</p>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------ */}
          {/* A. FARMER FORMS                                                    */}
          {/* ------------------------------------------------------------------ */}
          {selectedRole === 'farmer' && authMode === 'login' && (
            <form onSubmit={handleFarmerLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#111827] block mb-1">
                  Registered Mobile Number (10 digits):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-[#6B7280]">+91</span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={farmerForm.mobile}
                    onChange={e => setFarmerForm({ ...farmerForm, mobile: e.target.value.replace(/\D/g, '') })}
                    placeholder="9822012345"
                    className="w-full bg-white border border-[#D1D5DB] rounded-lg pl-12 pr-3 py-2 text-xs font-bold text-[#111827] focus:outline-none focus:border-[#0F2F5C]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#111827] block mb-1">
                  Secret 4-Digit PIN:
                </label>
                <input
                  type="password"
                  required
                  maxLength={4}
                  inputMode="numeric"
                  value={farmerForm.pin}
                  onChange={e => setFarmerForm({ ...farmerForm, pin: e.target.value.replace(/\D/g, '') })}
                  placeholder="••••"
                  className="w-full bg-white border border-[#D1D5DB] rounded-lg px-3 py-2 text-center text-lg tracking-widest font-mono font-bold text-[#111827] focus:outline-none focus:border-[#0F2F5C]"
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[#6B7280]">5 wrong attempts lock login for 15 min.</span>
                <button
                  type="button"
                  onClick={() => setShowForgotPinModal(true)}
                  className="text-[#0F2F5C] hover:underline font-bold cursor-pointer"
                >
                  Forgot PIN?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0F2F5C] hover:bg-[#0B2447] text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer shadow-sm disabled:opacity-50"
              >
                {loading ? 'Verifying PIN...' : 'Log In to My Account'}
              </button>
            </form>
          )}

          {selectedRole === 'farmer' && authMode === 'signup' && (
            <form onSubmit={handleFarmerSignup} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#111827] block mb-1">Farmer Full Name:</label>
                  <input
                    type="text"
                    required
                    value={farmerForm.name}
                    onChange={e => setFarmerForm({ ...farmerForm, name: e.target.value })}
                    placeholder="e.g. Tukaram Patil"
                    className="w-full bg-white border border-[#D1D5DB] rounded-lg px-3 py-2 text-xs font-bold text-[#111827]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#111827] block mb-1">Mobile Number (10 digits):</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-[#6B7280]">+91</span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={farmerForm.mobile}
                      onChange={e => setFarmerForm({ ...farmerForm, mobile: e.target.value.replace(/\D/g, '') })}
                      placeholder="98220XXXXX"
                      className="w-full bg-white border border-[#D1D5DB] rounded-lg pl-12 pr-3 py-2 text-xs font-bold text-[#111827]"
                    />
                  </div>
                </div>
              </div>

              {/* 4-digit PIN entered twice (User Requirement) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#F9FAFB] p-3 rounded-xl border border-[#E5E7EB]">
                <div>
                  <label className="text-xs font-bold text-[#111827] block mb-1">Create 4-Digit PIN:</label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    inputMode="numeric"
                    value={farmerForm.pin}
                    onChange={e => setFarmerForm({ ...farmerForm, pin: e.target.value.replace(/\D/g, '') })}
                    placeholder="••••"
                    className="w-full bg-white border border-[#D1D5DB] rounded-lg px-3 py-2 text-center text-lg tracking-widest font-mono font-bold text-[#111827]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#111827] block mb-1">Confirm 4-Digit PIN:</label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    inputMode="numeric"
                    value={farmerForm.confirmPin}
                    onChange={e => setFarmerForm({ ...farmerForm, confirmPin: e.target.value.replace(/\D/g, '') })}
                    placeholder="••••"
                    className="w-full bg-white border border-[#D1D5DB] rounded-lg px-3 py-2 text-center text-lg tracking-widest font-mono font-bold text-[#111827]"
                  />
                </div>
              </div>

              {/* Unified State -> District -> Taluka Picker */}
              <LocationPicker
                selectedState={farmerForm.state}
                onChangeState={(s) => setFarmerForm(prev => ({ ...prev, state: s }))}
                selectedDistrict={farmerForm.district}
                onChangeDistrict={(d) => setFarmerForm(prev => ({ ...prev, district: d }))}
                selectedTaluka={farmerForm.taluka}
                onChangeTaluka={(t) => setFarmerForm(prev => ({ ...prev, taluka: t }))}
              />

              <div>
                <label className="text-xs font-bold text-[#111827] block mb-1">Village Name:</label>
                <input
                  type="text"
                  required
                  value={farmerForm.village}
                  onChange={e => setFarmerForm({ ...farmerForm, village: e.target.value })}
                  placeholder="e.g. Haveli Budruk"
                  className="w-full bg-white border border-[#D1D5DB] rounded-lg px-3 py-2 text-xs font-bold text-[#111827]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0F2F5C] hover:bg-[#0B2447] text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer shadow-sm disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Sign Up as Farmer (Creates Fresh Account)'}
              </button>
            </form>
          )}

          {/* ------------------------------------------------------------------ */}
          {/* B. VETERINARY OFFICER FORMS                                        */}
          {/* ------------------------------------------------------------------ */}
          {selectedRole === 'vet' && authMode === 'login' && (
            <form onSubmit={handleVetLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#111827] block mb-1">
                  License Number or Registered Mobile:
                </label>
                <input
                  type="text"
                  required
                  value={vetForm.identifier}
                  onChange={e => setVetForm({ ...vetForm, identifier: e.target.value })}
                  placeholder="VCI-MH-2021-0842 or 9822012345"
                  className="w-full bg-white border border-[#D1D5DB] rounded-lg px-3 py-2 text-xs font-bold text-[#111827] focus:outline-none focus:border-[#0F2F5C]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#111827] block mb-1">
                  Password:
                </label>
                <input
                  type="password"
                  required
                  value={vetForm.password}
                  onChange={e => setVetForm({ ...vetForm, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-white border border-[#D1D5DB] rounded-lg px-3 py-2 text-xs text-[#111827] focus:outline-none focus:border-[#0F2F5C]"
                />
              </div>

              <div className="bg-[#F9FAFB] p-3 rounded-xl border border-[#E5E7EB] space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#111827]">Two-Factor Verification OTP:</span>
                  <span className="text-[10px] text-green-700 bg-green-50 px-2 py-0.5 rounded font-bold">Demo OTP: 123456</span>
                </div>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={vetForm.otp}
                  onChange={e => setVetForm({ ...vetForm, otp: e.target.value })}
                  placeholder="123456"
                  className="w-full bg-white border border-[#D1D5DB] rounded-lg px-3 py-2 text-center text-sm font-mono font-bold text-[#111827] focus:outline-none focus:border-[#0F2F5C]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0F2F5C] hover:bg-[#0B2447] text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer shadow-sm disabled:opacity-50"
              >
                {loading ? 'Verifying Vet Credentials...' : 'Log In to Vet Portal'}
              </button>
            </form>
          )}

          {selectedRole === 'vet' && authMode === 'signup' && (
            <form onSubmit={handleVetRegister} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#111827] block mb-1">Officer Full Name:</label>
                  <input
                    type="text"
                    required
                    value={vetForm.name}
                    onChange={e => setVetForm({ ...vetForm, name: e.target.value })}
                    placeholder="Dr. Rajesh Sharma"
                    className="w-full bg-white border border-[#D1D5DB] rounded-lg px-3 py-2 text-xs font-bold text-[#111827]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#111827] block mb-1">Degree / Qualification:</label>
                  <input
                    type="text"
                    required
                    value={vetForm.degree}
                    onChange={e => setVetForm({ ...vetForm, degree: e.target.value })}
                    placeholder="B.V.Sc & A.H."
                    className="w-full bg-white border border-[#D1D5DB] rounded-lg px-3 py-2 text-xs font-bold text-[#111827]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#111827] block mb-1">Specialization:</label>
                  <input
                    type="text"
                    required
                    value={vetForm.specialization}
                    onChange={e => setVetForm({ ...vetForm, specialization: e.target.value })}
                    placeholder="Livestock Epidemiology"
                    className="w-full bg-white border border-[#D1D5DB] rounded-lg px-3 py-2 text-xs font-bold text-[#111827]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#111827] block mb-1">VCI / State License Number:</label>
                  <input
                    type="text"
                    required
                    value={vetForm.licenseNumber}
                    onChange={e => setVetForm({ ...vetForm, licenseNumber: e.target.value })}
                    placeholder="VCI-MH-2026-9901"
                    className="w-full bg-white border border-[#D1D5DB] rounded-lg px-3 py-2 text-xs font-bold text-[#111827]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#111827] block mb-1">Mobile Number (10 digits):</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={vetForm.mobile}
                    onChange={e => setVetForm({ ...vetForm, mobile: e.target.value.replace(/\D/g, '') })}
                    placeholder="9822XXXXXX"
                    className="w-full bg-white border border-[#D1D5DB] rounded-lg px-3 py-2 text-xs font-bold text-[#111827]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#111827] block mb-1">Choose Password:</label>
                  <input
                    type="password"
                    required
                    value={vetForm.regPassword}
                    onChange={e => setVetForm({ ...vetForm, regPassword: e.target.value })}
                    placeholder="At least 6 characters"
                    className="w-full bg-white border border-[#D1D5DB] rounded-lg px-3 py-2 text-xs text-[#111827]"
                  />
                </div>
              </div>

              {/* Location Picker */}
              <LocationPicker
                selectedState={vetForm.state}
                onChangeState={(s) => setVetForm(prev => ({ ...prev, state: s }))}
                selectedDistrict={vetForm.district}
                onChangeDistrict={(d) => setVetForm(prev => ({ ...prev, district: d }))}
                selectedTaluka={vetForm.taluka}
                onChangeTaluka={(t) => setVetForm(prev => ({ ...prev, taluka: t }))}
              />

              {/* Certificate Upload Field (User Requirement) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#111827] block">
                  VCI Registration Certificate / ID Proof:
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={e => setVetForm({ ...vetForm, certificateFile: e.target.files[0] })}
                    className="w-full bg-white border border-[#D1D5DB] rounded-lg p-1.5 text-xs text-[#111827] file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-[#0F2F5C] file:text-white cursor-pointer"
                  />
                </div>
                <span className="text-[10px] text-[#6B7280]">Accepted formats: PDF, JPG, PNG (Max 5MB)</span>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 space-y-0.5">
                <span className="font-bold flex items-center space-x-1">
                  <Info className="w-3.5 h-3.5 text-amber-700" />
                  <span>Administrative Verification Policy:</span>
                </span>
                <p>Status will be set to &quot;Pending&quot; and verified by the State Animal Husbandry Department before account activation.</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0F2F5C] hover:bg-[#0B2447] text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer shadow-sm disabled:opacity-50"
              >
                {loading ? 'Submitting Registration...' : 'Submit Vet Registration for Admin Approval'}
              </button>
            </form>
          )}

          {/* User Requirement: Small line asking "Are you an admin?" */}
          <div className="pt-3 text-center border-t border-[#E5E7EB]">
            <p className="text-[11px] text-[#4B5563]">
              Are you an admin?{' '}
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('/admin/login')}
                className="text-[#0F2F5C] hover:text-[#0B2447] font-bold underline inline-flex items-center space-x-1 cursor-pointer ml-1"
                title="Animal Husbandry Department Admin Console"
              >
                <Lock className="w-3 h-3 inline mr-0.5 text-[#E07B00]" />
                <span>Admin Login</span>
              </button>
            </p>
          </div>

        </div>
      )}

      {/* 3. FORGOT PIN MODAL (User Requirement: "Please contact your veterinary office." No email/SMS reset for now) */}
      {showForgotPinModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 border border-[#D1D5DB] shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
              <h4 className="font-bold text-sm text-[#111827] flex items-center space-x-1.5">
                <HelpCircle className="w-4 h-4 text-[#0F2F5C]" />
                <span>Forgot PIN</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowForgotPinModal(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-center py-2">
              <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-[#111827]">
                Please contact your veterinary office.
              </p>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                For livestock data security and farmer record integrity, PIN resets must be validated through your local Veterinary Dispensary or by calling the 1962 helpline.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowForgotPinModal(false)}
              className="w-full bg-[#0F2F5C] text-white font-bold py-2 rounded-xl text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
