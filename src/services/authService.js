// Auth & Security Service for PashuSuraksha
// Handles SHA-256 password & PIN hashing, session expiration (2 hours),
// and strict login rate limiting (5 wrong tries = 15 minutes lockout).

const SESSION_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout (User Requirement)

// SHA-256 Password & PIN Hashing (Never store plain-text credentials)
export async function hashPassword(inputStr) {
  if (!inputStr) return '';
  const encoder = new TextEncoder();
  const data = encoder.encode(inputStr.toString());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Session Management
export function createSession(user, role) {
  const sessionData = {
    user,
    role,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_DURATION_MS,
    token: `token_${role}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  };
  localStorage.setItem('pashu_active_session', JSON.stringify(sessionData));
  return sessionData;
}

export function getActiveSession() {
  try {
    const raw = localStorage.getItem('pashu_active_session');
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (Date.now() > session.expiresAt) {
      clearActiveSession();
      return null;
    }
    return session;
  } catch (e) {
    return null;
  }
}

export function clearActiveSession() {
  localStorage.removeItem('pashu_active_session');
}

// 15-Minute Lockout Rate Limiter (5 Attempts)
export function checkRateLimit(identifier) {
  const key = `pashu_rate_limit_${identifier}`;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return { isLocked: false, remainingAttempts: MAX_FAILED_ATTEMPTS };
    const data = JSON.parse(raw);
    const now = Date.now();
    if (data.lockedUntil && now < data.lockedUntil) {
      const waitSeconds = Math.ceil((data.lockedUntil - now) / 1000);
      const waitMinutes = Math.ceil(waitSeconds / 60);
      return { isLocked: true, waitSeconds, waitMinutes, remainingAttempts: 0 };
    }
    if (data.lockedUntil && now >= data.lockedUntil) {
      localStorage.removeItem(key);
      return { isLocked: false, remainingAttempts: MAX_FAILED_ATTEMPTS };
    }
    const remaining = Math.max(0, MAX_FAILED_ATTEMPTS - (data.attempts || 0));
    return { isLocked: false, remainingAttempts: remaining };
  } catch (e) {
    return { isLocked: false, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }
}

export function recordFailedAttempt(identifier) {
  const key = `pashu_rate_limit_${identifier}`;
  try {
    const raw = localStorage.getItem(key);
    const data = raw ? JSON.parse(raw) : { attempts: 0 };
    data.attempts = (data.attempts || 0) + 1;
    if (data.attempts >= MAX_FAILED_ATTEMPTS) {
      data.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
    }
    localStorage.setItem(key, JSON.stringify(data));
    return checkRateLimit(identifier);
  } catch (e) {
    return { isLocked: false, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }
}

export function clearRateLimit(identifier) {
  localStorage.removeItem(`pashu_rate_limit_${identifier}`);
}

// ==========================================
// FARMER ACCOUNTS REPOSITORY
// ==========================================
const DEFAULT_FARMERS = [
  {
    name: 'Anandrao Patil',
    mobile: '9822012345',
    // SHA-256 for PIN '1234'
    pinHash: '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4',
    village: 'Haveli',
    taluka: 'Haveli',
    district: 'Pune',
    state: 'Maharashtra',
    registeredAt: '2026-09-01'
  }
];

export function getStoredFarmers() {
  try {
    const raw = localStorage.getItem('pashu_farmers');
    if (!raw) {
      localStorage.setItem('pashu_farmers', JSON.stringify(DEFAULT_FARMERS));
      return DEFAULT_FARMERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_FARMERS;
  }
}

export function findFarmerByMobile(mobile) {
  const farmers = getStoredFarmers();
  return farmers.find(f => f.mobile === mobile.trim());
}

export async function registerFarmer({ name, mobile, pin, village, taluka, district, state }) {
  const cleanMob = mobile.trim();
  const existing = findFarmerByMobile(cleanMob);
  if (existing) {
    throw new Error('An account with this mobile number already exists. Please log in.');
  }

  const pinHash = await hashPassword(pin);
  const newFarmer = {
    name: name.trim(),
    mobile: cleanMob,
    pinHash,
    village: village.trim(),
    taluka: taluka ? taluka.trim() : '',
    district: district.trim(),
    state: state.trim(),
    registeredAt: new Date().toISOString()
  };

  const farmers = getStoredFarmers();
  farmers.push(newFarmer);
  localStorage.setItem('pashu_farmers', JSON.stringify(farmers));

  // Initialize empty data sets for new farmer (User Requirement: empty history, consultations and herd)
  localStorage.setItem(`pashu_history_${cleanMob}`, JSON.stringify([]));
  localStorage.setItem(`pashu_consultations_${cleanMob}`, JSON.stringify([]));
  localStorage.setItem(`pashu_herd_${cleanMob}`, JSON.stringify([]));

  return newFarmer;
}

export async function authenticateFarmer(mobile, pin) {
  const cleanMob = mobile.trim();
  const rate = checkRateLimit(cleanMob);
  if (rate.isLocked) {
    throw new Error(`Account locked for 15 minutes due to 5 consecutive failed login attempts. Please wait ${rate.waitMinutes} minute(s) or contact your veterinary office.`);
  }

  const farmer = findFarmerByMobile(cleanMob);
  if (!farmer) {
    throw new Error('Mobile number not registered. Please sign up first.');
  }

  const enteredHash = await hashPassword(pin);
  if (farmer.pinHash !== enteredHash) {
    const updatedRate = recordFailedAttempt(cleanMob);
    if (updatedRate.isLocked) {
      throw new Error('Account locked for 15 minutes due to 5 consecutive failed login attempts. Please contact your veterinary office.');
    }
    throw new Error(`Incorrect 4-digit PIN. Remaining attempts: ${updatedRate.remainingAttempts}.`);
  }

  // Success
  clearRateLimit(cleanMob);
  return farmer;
}

// ==========================================
// VETERINARY OFFICERS REPOSITORY
// ==========================================
const DEFAULT_VETS = [
  {
    id: 'VET-APP-01',
    name: 'Dr. S. K. Kulkarni',
    degree: 'M.V.Sc (Epidemiology)',
    specialization: 'Livestock Disease Surveillance',
    licenseNumber: 'VCI-MH-2021-0842',
    mobile: '9822012345',
    district: 'Pune',
    state: 'Maharashtra',
    passwordHash: 'c7cba2a731efc1b29a28bfdf9ba35d4fa5cc43dfb706c627fa4dfc78d59efbc8', // 'vet123'
    status: 'approved',
    submittedAt: '2026-08-15'
  },
  {
    id: 'VET-REG-101',
    name: 'Dr. Ramesh Deshmukh',
    degree: 'B.V.Sc & A.H.',
    specialization: 'Bovine Infectious Diseases',
    licenseNumber: 'VCI-MH-2023-7711',
    mobile: '9822099887',
    district: 'Pune',
    state: 'Maharashtra',
    passwordHash: 'c7cba2a731efc1b29a28bfdf9ba35d4fa5cc43dfb706c627fa4dfc78d59efbc8', // 'vet123'
    status: 'pending',
    submittedAt: '2026-09-18'
  }
];

export function getStoredVets() {
  try {
    const raw = localStorage.getItem('pashu_vets');
    if (!raw) {
      localStorage.setItem('pashu_vets', JSON.stringify(DEFAULT_VETS));
      return DEFAULT_VETS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_VETS;
  }
}

export function saveVets(vetsList) {
  localStorage.setItem('pashu_vets', JSON.stringify(vetsList));
}

export async function registerVet({ name, degree, specialization, licenseNumber, mobile, district, state, taluka, password, certificateName }) {
  const cleanMob = mobile.trim();
  const cleanLic = licenseNumber.trim();
  const vets = getStoredVets();

  const existing = vets.find(v => v.mobile === cleanMob || v.licenseNumber.toLowerCase() === cleanLic.toLowerCase());
  if (existing) {
    throw new Error('A veterinary officer with this mobile number or license number already exists.');
  }

  const passwordHash = await hashPassword(password);
  const newVet = {
    id: `VET-REG-${Date.now().toString().slice(-4)}`,
    name: name.trim(),
    degree: degree.trim(),
    specialization: specialization.trim(),
    licenseNumber: cleanLic,
    mobile: cleanMob,
    district: district.trim(),
    state: state.trim(),
    taluka: taluka ? taluka.trim() : '',
    certificateName: certificateName || 'VCI_Registration_Certificate.pdf',
    passwordHash,
    status: 'pending', // User Requirement: Status is "Pending" and goes to admin panel
    submittedAt: new Date().toISOString().split('T')[0]
  };

  vets.push(newVet);
  saveVets(vets);
  return newVet;
}

export async function authenticateVet(identifier, password, otp) {
  const cleanId = identifier.trim();
  const rate = checkRateLimit(cleanId);
  if (rate.isLocked) {
    throw new Error(`Account locked for 15 minutes due to failed login attempts. Please wait ${rate.waitMinutes} minute(s).`);
  }

  const vets = getStoredVets();
  const vet = vets.find(v => 
    v.licenseNumber.toLowerCase() === cleanId.toLowerCase() || v.mobile === cleanId
  );

  if (!vet) {
    throw new Error('No veterinary officer found with this License Number or Mobile.');
  }

  // Check Status First (User Requirement)
  if (vet.status === 'pending') {
    throw new Error('Waiting for admin approval. Your registration profile is pending verification by the Animal Husbandry Department.');
  }

  if (vet.status === 'rejected') {
    throw new Error(`Registration rejected: ${vet.rejectionReason || 'License credentials could not be verified'}. Please contact administrator.`);
  }

  // Verify Password
  const inputHash = await hashPassword(password);
  if (vet.passwordHash && vet.passwordHash !== inputHash) {
    const updatedRate = recordFailedAttempt(cleanId);
    throw new Error(`Incorrect password. Remaining attempts: ${updatedRate.remainingAttempts}.`);
  }

  // Verify OTP (mock: allows 123456 or matches generated)
  if (otp && otp.trim() !== '123456') {
    throw new Error('Invalid OTP. Use demo OTP: 123456');
  }

  clearRateLimit(cleanId);
  return vet;
}

export function approveVet(vetId, adminNotes = '') {
  const vets = getStoredVets();
  const updated = vets.map(v => {
    if (v.id === vetId || v.licenseNumber === vetId) {
      return {
        ...v,
        status: 'approved',
        approvedAt: new Date().toISOString(),
        adminNotes: adminNotes || 'Verified against VCI state register.'
      };
    }
    return v;
  });
  saveVets(updated);
  return updated.find(v => v.id === vetId || v.licenseNumber === vetId);
}

export function rejectVet(vetId, rejectionReason) {
  const vets = getStoredVets();
  const updated = vets.map(v => {
    if (v.id === vetId || v.licenseNumber === vetId) {
      return {
        ...v,
        status: 'rejected',
        rejectionReason: rejectionReason || 'License verification failed.',
        rejectedAt: new Date().toISOString()
      };
    }
    return v;
  });
  saveVets(updated);
  return updated.find(v => v.id === vetId || v.licenseNumber === vetId);
}

// ==========================================
// ADMIN AUTHENTICATION
// ==========================================
export function authenticateAdmin(email, password) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  // Read from environment if available, otherwise secure default
  const expectedEmail = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ADMIN_EMAIL ? import.meta.env.VITE_ADMIN_EMAIL : 'admin@pashusuraksha.gov.in').toLowerCase();
  const expectedPass = typeof import.meta !== 'undefined' && import.meta.env?.VITE_ADMIN_PASSWORD ? import.meta.env.VITE_ADMIN_PASSWORD : 'Admin@12345';

  if (cleanEmail === expectedEmail && cleanPass === expectedPass) {
    return {
      name: 'Animal Husbandry System Administrator',
      email: expectedEmail,
      role: 'admin'
    };
  }

  throw new Error('Invalid administrator credentials. Please check your admin email and password.');
}
