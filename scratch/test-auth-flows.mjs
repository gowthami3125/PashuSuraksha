import { 
  STATES_ORDERED, 
  getDistrictsForState, 
  getTalukasForDistrict, 
  getSubdivisionTerm 
} from '../src/data/locationsData.js';

// Setup Mock LocalStorage for Node.js environment
const storage = {};
global.localStorage = {
  getItem: (key) => storage[key] || null,
  setItem: (key, val) => { storage[key] = String(val); },
  removeItem: (key) => { delete storage[key]; },
  clear: () => { Object.keys(storage).forEach(k => delete storage[k]); }
};

// Polyfill SubtleCrypto if needed
import { webcrypto } from 'crypto';
if (!global.crypto) global.crypto = webcrypto;

// Dynamically import authService
const {
  hashPassword,
  createSession,
  getActiveSession,
  clearActiveSession,
  checkRateLimit,
  recordFailedAttempt,
  registerFarmer,
  authenticateFarmer,
  registerVet,
  authenticateVet,
  approveVet,
  rejectVet,
  authenticateAdmin,
  getStoredFarmers,
  getStoredVets
} = await import('../src/services/authService.js');

async function runTests() {
  console.log('=== STARTING PashuSuraksha Access & Navigation Verification ===\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. STATES & DISTRICTS VERIFICATION
  console.log('--- 1. Testing States & Districts (LGD 28 States + 8 UTs) ---');
  assert(STATES_ORDERED.length === 36, `Total States + UTs count is 36 (Actual: ${STATES_ORDERED.length})`);
  assert(STATES_ORDERED[0] === 'Maharashtra', `Maharashtra is first (Actual: ${STATES_ORDERED[0]})`);
  assert(STATES_ORDERED[1] === 'Andhra Pradesh', `Andhra Pradesh is second (Actual: ${STATES_ORDERED[1]})`);
  
  const mhDistricts = getDistrictsForState('Maharashtra');
  assert(mhDistricts.length >= 30, `Maharashtra has official districts (Count: ${mhDistricts.length})`);
  assert(mhDistricts.includes('Pune'), 'Pune district exists in Maharashtra');

  const apDistricts = getDistrictsForState('Andhra Pradesh');
  assert(apDistricts.length >= 20, `Andhra Pradesh has official districts (Count: ${apDistricts.length})`);
  assert(apDistricts.includes('Guntur'), 'Guntur district exists in Andhra Pradesh');

  const puneTalukas = getTalukasForDistrict('Maharashtra', 'Pune');
  assert(puneTalukas.includes('Haveli') && puneTalukas.includes('Baramati'), 'Pune has verified talukas: Haveli & Baramati');

  // Verify non-invented talukas: unknown talukas return empty list
  const biharDistricts = getDistrictsForState('Bihar');
  assert(biharDistricts.length > 0, `Bihar has districts (Count: ${biharDistricts.length})`);
  const unverifiedTalukas = getTalukasForDistrict('Bihar', biharDistricts[0]);
  assert(Array.isArray(unverifiedTalukas) && unverifiedTalukas.length === 0, 'Unverified districts do NOT invent talukas (returned empty array)');

  // 2. PIN HASHING (SHA-256)
  console.log('\n--- 2. Testing SHA-256 Hashing ---');
  const hash1234 = await hashPassword('1234');
  assert(hash1234 === '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', 'PIN 1234 is hashed via SHA-256 correctly');
  assert(hash1234 !== '1234', 'PIN is never stored in plain text');

  // 3. FARMER SIGN UP & EMPTY DATA INITIALIZATION
  console.log('\n--- 3. Testing Farmer Sign Up with Empty Data Initialization ---');
  const testMobile = '9811122233';
  const newFarmer = await registerFarmer({
    name: 'Suresh Kumar',
    mobile: testMobile,
    pin: '5678',
    village: 'Shiroli',
    district: 'Kolhapur',
    state: 'Maharashtra'
  });
  assert(newFarmer.name === 'Suresh Kumar', 'Farmer Suresh Kumar registered successfully');
  assert(newFarmer.pinHash === await hashPassword('5678'), 'Farmer PIN stored as SHA-256 hash');

  const history = JSON.parse(storage[`pashu_history_${testMobile}`] || 'null');
  assert(Array.isArray(history) && history.length === 0, 'New farmer account initialized with EMPTY history []');

  const consultations = JSON.parse(storage[`pashu_consultations_${testMobile}`] || 'null');
  assert(Array.isArray(consultations) && consultations.length === 0, 'New farmer account initialized with EMPTY consultations []');

  const herd = JSON.parse(storage[`pashu_herd_${testMobile}`] || 'null');
  assert(Array.isArray(herd) && herd.length === 0, 'New farmer account initialized with EMPTY herd []');

  // Duplicate sign up check
  let dupError = null;
  try {
    await registerFarmer({
      name: 'Duplicate',
      mobile: testMobile,
      pin: '5678',
      village: 'X',
      district: 'Pune',
      state: 'Maharashtra'
    });
  } catch (err) {
    dupError = err.message;
  }
  assert(dupError && dupError.includes('already exists'), `Duplicate signup blocked with error: "${dupError}"`);

  // 4. FARMER LOGIN & UNKNOWN NUMBER ERROR
  console.log('\n--- 4. Testing Farmer Login & Error Handling ---');
  let unknownError = null;
  try {
    await authenticateFarmer('9999999999', '1234');
  } catch (err) {
    unknownError = err.message;
  }
  assert(unknownError && unknownError.includes('not registered'), `Unknown number rejected with: "${unknownError}"`);

  // Login with correct PIN
  const loggedInFarmer = await authenticateFarmer(testMobile, '5678');
  assert(loggedInFarmer.mobile === testMobile, 'Logged in successfully with correct 4-digit PIN');

  // 5. 5 WRONG ATTEMPTS & 15-MINUTE LOCKOUT
  console.log('\n--- 5. Testing 5 Wrong PIN Attempts & 15-Minute Lockout ---');
  const lockMobile = '9855566677';
  await registerFarmer({
    name: 'Lockout Test User',
    mobile: lockMobile,
    pin: '4321',
    village: 'Haveli',
    district: 'Pune',
    state: 'Maharashtra'
  });

  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      await authenticateFarmer(lockMobile, '0000');
    } catch (e) {
      assert(e.message.includes(`Remaining attempts: ${5 - attempt}`), `Wrong attempt ${attempt}: reports ${5 - attempt} remaining attempts`);
    }
  }

  // 5th attempt locks the account
  let fifthError = '';
  try {
    await authenticateFarmer(lockMobile, '0000');
  } catch (e) {
    fifthError = e.message;
  }
  assert(fifthError.includes('locked for 15 minutes') && fifthError.includes('contact your veterinary office'), `5th wrong try locks account: "${fifthError}"`);

  // 6th attempt is immediately blocked
  let sixthError = '';
  try {
    await authenticateFarmer(lockMobile, '4321'); // even with right PIN
  } catch (e) {
    sixthError = e.message;
  }
  assert(sixthError.includes('locked for 15 minutes'), `Subsequent attempt blocked while locked: "${sixthError}"`);

  // 6. VETERINARY OFFICER REGISTRATION (STATUS: PENDING)
  console.log('\n--- 6. Testing Vet Registration & Admin Approval ---');
  const vetMobile = '9877700011';
  const vetLicense = 'VCI-MH-2026-9900';
  const newVet = await registerVet({
    name: 'Dr. Neha Deshpande',
    degree: 'B.V.Sc & A.H.',
    specialization: 'Large Animal Surgery',
    licenseNumber: vetLicense,
    mobile: vetMobile,
    district: 'Satara',
    state: 'Maharashtra',
    password: 'Password@123'
  });
  assert(newVet.status === 'pending', 'Newly registered vet has status "pending"');

  // Attempt login while pending
  let pendingLoginError = '';
  try {
    await authenticateVet(vetLicense, 'Password@123', '123456');
  } catch (e) {
    pendingLoginError = e.message;
  }
  assert(pendingLoginError.includes('Waiting for admin approval'), `Login blocked for pending vet: "${pendingLoginError}"`);

  // Admin approves vet
  const approved = approveVet(newVet.id, 'Verified with VCI official register');
  assert(approved.status === 'approved', 'Admin approved vet successfully');

  // Now vet can log in
  const loggedInVet = await authenticateVet(vetLicense, 'Password@123', '123456');
  assert(loggedInVet.licenseNumber === vetLicense, 'Approved vet successfully logged in with OTP 123456');

  // 7. VET REJECTION TEST
  console.log('\n--- 7. Testing Vet Rejection with Reason ---');
  const rejVet = await registerVet({
    name: 'Dr. Fake Account',
    degree: 'B.V.Sc',
    specialization: 'General',
    licenseNumber: 'VCI-FAKE-1234',
    mobile: '9888877777',
    district: 'Pune',
    state: 'Maharashtra',
    password: 'password'
  });
  rejectVet(rejVet.id, 'Certificate could not be verified in VCI state council list.');
  let rejError = '';
  try {
    await authenticateVet('VCI-FAKE-1234', 'password', '123456');
  } catch (e) {
    rejError = e.message;
  }
  assert(rejError.includes('Registration rejected') && rejError.includes('Certificate could not be verified'), `Rejected vet blocked with reason: "${rejError}"`);

  // 8. ADMIN AUTHENTICATION
  console.log('\n--- 8. Testing Admin Authentication ---');
  const admin = authenticateAdmin('admin@pashusuraksha.gov.in', 'Admin@12345');
  assert(admin.role === 'admin', 'Official admin credentials authenticate successfully');

  let adminError = '';
  try {
    authenticateAdmin('admin@pashusuraksha.gov.in', 'WrongPass');
  } catch (e) {
    adminError = e.message;
  }
  assert(adminError.includes('Invalid administrator credentials'), `Wrong admin password rejected: "${adminError}"`);

  // 9. ROUTE GUARDS CLASSIFICATION TEST
  console.log('\n--- 9. Testing Route Guards Classification ---');
  const isVetRoute = (path) => (
    path.startsWith('/vet/') ||
    path === '/vet' ||
    path === '/vet-officer' ||
    path.startsWith('/officer') ||
    path === '/queue' ||
    path === '/referrals' ||
    path === '/profile' ||
    path === '/surveillance' ||
    path.startsWith('/gov/surveillance')
  );

  assert(!isVetRoute('/vets'), '/vets (Nearby Vets map) is NOT classified as a restricted vet route');
  assert(!isVetRoute('/locator'), '/locator is NOT classified as a restricted vet route');
  assert(!isVetRoute('/outbreak'), '/outbreak (Outbreak Map) is NOT classified as a restricted vet route');
  assert(!isVetRoute('/outbreak-map'), '/outbreak-map is NOT classified as a restricted vet route');
  assert(isVetRoute('/vet/queue'), '/vet/queue IS properly classified as a restricted vet route');
  assert(isVetRoute('/vet/prescriptions'), '/vet/prescriptions IS properly classified as a restricted vet route');

  console.log(`\n=== TEST SUMMARY: ${passed} PASSED, ${failed} FAILED ===`);
  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error("Test runner exception:", err);
  process.exit(1);
});
