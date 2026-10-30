import React, { useState } from 'react';
import { ShieldAlert, Lock, Mail, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { authenticateAdmin, createSession } from '../services/authService';

export default function AdminLogin({ onLoginSuccess, onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const adminUser = authenticateAdmin(email, password);
      const session = createSession(adminUser, 'admin');
      onLoginSuccess(session, 'admin');
    } catch (err) {
      setErrorMsg(err.message || 'Invalid administrator credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-[#0F2F5C] text-white flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert className="w-7 h-7 text-[#E07B00]" />
        </div>
        <h2 className="text-2xl font-black text-[#111827]">
          Animal Husbandry Department
        </h2>
        <p className="text-xs text-[#4B5563]">
          Official Administrative Command & Verification Console
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#D1D5DB] shadow-sm p-6 sm:p-8 space-y-5">
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Authentication Failed:</span>
              <p>{errorMsg}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#111827] block mb-1">
              Admin Official Email:
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#6B7280] absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@pashusuraksha.gov.in"
                className="w-full bg-white border border-[#D1D5DB] rounded-lg pl-9 pr-3 py-2 text-xs font-bold text-[#111827] focus:outline-none focus:border-[#0F2F5C]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#111827] block mb-1">
              Master Admin Password:
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#6B7280] absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-white border border-[#D1D5DB] rounded-lg pl-9 pr-3 py-2 text-xs font-bold text-[#111827] focus:outline-none focus:border-[#0F2F5C]"
              />
            </div>
          </div>

          <div className="bg-[#F9FAFB] p-3 rounded-xl border border-[#E5E7EB] text-[11px] text-[#6B7280] space-y-1">
            <p className="font-bold text-[#111827]">Configured Environment Credentials:</p>
            <p>Email: <code className="bg-white px-1 py-0.5 rounded border border-[#D1D5DB] font-mono">admin@pashusuraksha.gov.in</code></p>
            <p>Password: <code className="bg-white px-1 py-0.5 rounded border border-[#D1D5DB] font-mono">Admin@12345</code></p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0F2F5C] hover:bg-[#0B2447] text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer shadow-sm disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In as Administrator'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="text-xs text-[#4B5563] hover:text-[#0F2F5C] font-semibold"
        >
          ← Return to Public Homepage
        </button>
      </div>
    </div>
  );
}
