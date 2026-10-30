import React from 'react';
import { 
  Activity, Stethoscope, History, FileText, MapPin, Globe, Type, 
  LogOut, ShieldAlert, User, Syringe, ClipboardList, FlaskConical, 
  Lock, ArrowRight, Sparkles, Users, Video
} from 'lucide-react';

export default function Header({ 
  lang, 
  setLang, 
  textSize, 
  setTextSize, 
  currentPath, 
  onNavigate, 
  dict = {},
  userSession,
  onLogout
}) {
  const role = userSession?.role; // null | 'farmer' | 'vet' | 'admin'
  const user = userSession?.user;

  // 1. PUBLIC MENU (When NOT logged in)
  const publicNav = [
    { path: '/', label: dict.navHome || 'Home', icon: Activity },
    { path: '/guide', label: dict.navKnowledge || 'Disease Guide', icon: FileText },
    { path: '/vets', label: dict.navVets || 'Nearby Vets', icon: MapPin },
    { path: '/outbreak', label: dict.navOutbreak || 'Outbreak Status', icon: ShieldAlert }
  ];

  // 2. FARMER MENU (Own pages only: Symptom Check, My History, My Consultations, Vaccination and Herd, Nearby Vets, Disease Guide, Logout)
  const farmerNav = [
    { path: '/triage', label: dict.navChecker || 'Symptom Check', icon: Stethoscope },
    { path: '/history', label: dict.navHistory || 'My History', icon: History },
    { path: '/farmer/consultations', label: dict.navConsultations || 'My Consultations', icon: ClipboardList },
    { path: '/farmer/vaccinations', label: dict.navVaccinationHerd || 'Vaccination & Herd', icon: Syringe },
    { path: '/vets', label: dict.navVets || 'Nearby Vets', icon: MapPin },
    { path: '/guide', label: dict.navKnowledge || 'Disease Guide', icon: FileText }
  ];

  // 3. VET OFFICER MENU (Own pages only: Queue, Consultations, Prescriptions, Lab Referrals, Profile, Logout)
  const vetNav = [
    { path: '/vet/queue', label: dict.navPatientQueue || 'Queue', icon: ClipboardList },
    { path: '/vet/consultations', label: dict.navConsultations || 'Consultations', icon: Video },
    { path: '/vet/prescriptions', label: dict.navPrescriptions || 'Prescriptions', icon: FileText },
    { path: '/vet/referrals', label: dict.navReferrals || 'Lab Referrals', icon: FlaskConical },
    { path: '/vet/profile', label: dict.navProfile || 'Profile', icon: User }
  ];

  // 4. ADMIN MENU (Own pages only: Vet Approvals, Users, Logout)
  const adminNav = [
    { path: '/admin/vets', label: 'Vet Approvals', icon: ShieldAlert },
    { path: '/admin/users', label: 'Users', icon: Users }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0F2F5C] text-white border-b border-[#0B2447] shadow-sm">
      {/* Utility Bar */}
      <div className="bg-[#0B2447] border-b border-[#0F2F5C] text-xs px-4 py-1.5 text-slate-300 font-medium">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-2">
            <span className="bg-[#E07B00] text-white font-bold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
              PashuSuraksha
            </span>
            <span className="hidden md:inline text-slate-300 text-[11px] font-semibold">
              {dict.appSubtitle || "Livestock Health & Disease Advisory System"}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Text Size Controls A- A A+ */}
            <div className="flex items-center space-x-1 bg-[#0F2F5C] border border-white/20 rounded-lg px-2 py-0.5" role="group" aria-label="Text size adjustments">
              <Type className="w-3 h-3 text-slate-300" />
              <button
                type="button"
                onClick={() => setTextSize && setTextSize('sm')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold cursor-pointer transition ${
                  textSize === 'sm' 
                    ? 'bg-[#E07B00] text-white shadow-xs font-black' 
                    : 'text-slate-200 hover:bg-[#0B2447]'
                }`}
                title="Small text size (A-)"
                aria-pressed={textSize === 'sm'}
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setTextSize && setTextSize('md')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold cursor-pointer transition ${
                  textSize === 'md' 
                    ? 'bg-[#E07B00] text-white shadow-xs font-black' 
                    : 'text-slate-200 hover:bg-[#0B2447]'
                }`}
                title="Normal text size (A)"
                aria-pressed={textSize === 'md'}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setTextSize && setTextSize('lg')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold cursor-pointer transition ${
                  textSize === 'lg' 
                    ? 'bg-[#E07B00] text-white shadow-xs font-black' 
                    : 'text-slate-200 hover:bg-[#0B2447]'
                }`}
                title="Large text size (A+)"
                aria-pressed={textSize === 'lg'}
              >
                A+
              </button>
            </div>

            {/* Language Selector */}
            <div className="flex items-center space-x-1 bg-[#0F2F5C] border border-white/20 rounded-lg px-2 py-0.5">
              <Globe className="w-3.5 h-3.5 text-slate-300" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-transparent text-[11px] font-bold text-white pr-1 py-0.5 focus:outline-none cursor-pointer"
              >
                <option value="en" className="bg-[#0F2F5C] text-white">English</option>
                <option value="mr" className="bg-[#0F2F5C] text-white">मराठी (Marathi)</option>
                <option value="hi" className="bg-[#0F2F5C] text-white">हिंदी (Hindi)</option>
                <option value="te" className="bg-[#0F2F5C] text-white">తెలుగు (Telugu)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('/')}>
            <div className="w-10 h-10 bg-[#0B2447] border border-white/20 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-[#E07B00]" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center space-x-2">
                <span>{dict.title || "PashuSuraksha"}</span>
              </h1>
              <p className="text-[11px] text-slate-300 font-semibold hidden sm:block">
                {dict.tagline || "Livestock Health & Disease Advisory Portal"}
              </p>
            </div>
          </div>

          {/* Role Status or Single "Login / Sign up" Button */}
          <div className="flex items-center space-x-3">
            {!role ? (
              // PUBLIC: Single "Login / Sign up" button (User Requirement)
              <button
                type="button"
                onClick={() => onNavigate('/login')}
                className="bg-[#E07B00] hover:bg-[#c96e00] text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 shadow-sm"
              >
                <span>Login / Sign up</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              // AUTHENTICATED: Role Badge + Logout Button
              <div className="flex items-center space-x-3">
                <div className="bg-[#0B2447] border border-white/20 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5">
                  {role === 'farmer' && <span className="text-amber-400">👨‍🌾</span>}
                  {role === 'vet' && <span className="text-blue-300">👨‍⚕️</span>}
                  {role === 'admin' && <span className="text-purple-300">🛡️</span>}
                  <span className="max-w-[140px] truncate">{user?.name || (role === 'admin' ? 'Administrator' : 'User')}</span>
                </div>

                <button
                  type="button"
                  onClick={onLogout}
                  className="bg-[#DC2626] hover:bg-red-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1 transition cursor-pointer shadow-sm"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Role-Specific Navigation Menu (Each role sees ONLY its own menu, never mixed) */}
        <nav className="flex space-x-1 overflow-x-auto pb-2 pt-1 scrollbar-none border-t border-[#0B2447]">
          {/* 1. PUBLIC NAV (when NOT logged in) */}
          {!role && publicNav.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentPath === tab.path;
            return (
              <button
                key={tab.path}
                type="button"
                onClick={() => onNavigate(tab.path)}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-t-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  isActive 
                    ? 'bg-[#0B2447] text-white border-b-2 border-[#E07B00]' 
                    : 'text-slate-300 hover:bg-[#0B2447]/60 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}

          {/* 2. FARMER NAV (Symptom Check, My History, My Consultations, Vaccination and Herd, Nearby Vets, Disease Guide, Logout) */}
          {role === 'farmer' && farmerNav.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentPath === tab.path || (tab.path === '/triage' && currentPath === '/checker');
            return (
              <button
                key={tab.path}
                type="button"
                onClick={() => onNavigate(tab.path)}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-t-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  isActive 
                    ? 'bg-[#0B2447] text-white border-b-2 border-[#E07B00]' 
                    : 'text-slate-300 hover:bg-[#0B2447]/60 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}

          {/* 3. VET OFFICER NAV (Queue, Consultations, Prescriptions, Lab Referrals, Profile, Logout) */}
          {role === 'vet' && vetNav.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentPath === tab.path;
            return (
              <button
                key={tab.path}
                type="button"
                onClick={() => onNavigate(tab.path)}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-t-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  isActive 
                    ? 'bg-[#0B2447] text-white border-b-2 border-[#E07B00]' 
                    : 'text-slate-300 hover:bg-[#0B2447]/60 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}

          {/* 4. ADMIN NAV (Vet Approvals, Users, Logout) */}
          {role === 'admin' && adminNav.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentPath === tab.path;
            return (
              <button
                key={tab.path}
                type="button"
                onClick={() => onNavigate(tab.path)}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-t-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  isActive 
                    ? 'bg-[#0B2447] text-white border-b-2 border-[#E07B00]' 
                    : 'text-slate-300 hover:bg-[#0B2447]/60 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
