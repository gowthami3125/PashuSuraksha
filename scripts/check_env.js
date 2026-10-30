import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ENV_SPECS = [
  { name: 'PORT', required: false, defaultVal: '5000', purpose: 'Backend server listening port' },
  { name: 'NODE_ENV', required: false, defaultVal: 'development', purpose: 'Runtime environment mode' },
  { name: 'FRONTEND_URL', required: true, defaultVal: 'http://localhost:5173', purpose: 'Client frontend application URL' },
  { name: 'ALLOWED_ORIGINS', required: true, defaultVal: 'http://localhost:5173,http://localhost:3000', purpose: 'CORS & WebSocket allowed domains' },
  { name: 'DATABASE_URL', required: false, defaultVal: 'sqlite://./pashusuraksha.sqlite', purpose: 'Database connection string' },
  { name: 'STORAGE_MODE', required: false, defaultVal: 'local', purpose: 'Storage engine (local or cloud)' },
  { name: 'JWT_SECRET', required: true, defaultVal: null, purpose: 'JWT cryptographic signing key' },
  { name: 'ADMIN_EMAIL', required: false, defaultVal: 'admin@pashusuraksha.gov.in', purpose: 'Master admin email' },
  { name: 'ADMIN_PASSWORD', required: false, defaultVal: 'PashuAdmin@2026', purpose: 'Master admin initial password' },
  { name: 'OTP_MODE', required: false, defaultVal: 'mock', purpose: 'OTP login verification driver' },
  { name: 'DEMO_MODE', required: false, defaultVal: 'true', purpose: 'Pre-seeding simulated data toggle' },
  { name: 'AI_SERVICE', required: false, defaultVal: 'mock', purpose: 'AI vision & chat backend provider' },
  { name: 'AI_API_KEY', required: false, defaultVal: null, purpose: 'Google Gemini API key (optional)' },
  { name: 'GOOGLE_PLACES_KEY', required: false, defaultVal: null, purpose: 'Google Cloud Places key (optional)' },
  { name: 'VAPID_PUBLIC_KEY', required: false, defaultVal: null, purpose: 'Web Push notification public key' },
  { name: 'VAPID_PRIVATE_KEY', required: false, defaultVal: null, purpose: 'Web Push notification private key' },
  { name: 'JITSI_BASE_URL', required: false, defaultVal: 'https://meet.jit.si', purpose: 'Jitsi tele-consultation base domain' }
];

console.log('================================================================');
console.log(' PashuSuraksha Environment Configuration Pre-Flight Audit');
console.log('================================================================\n');

let missingRequired = 0;

ENV_SPECS.forEach(item => {
  const val = process.env[item.name];
  if (val) {
    console.log(`[OK]       ${item.name.padEnd(20)} = ${val.slice(0, 20)}${val.length > 20 ? '...' : ''} (${item.purpose})`);
  } else if (item.required) {
    console.log(`[MISSING]  ${item.name.padEnd(20)} - REQUIRED: ${item.purpose}`);
    missingRequired++;
  } else {
    console.log(`[OPTIONAL] ${item.name.padEnd(20)} - Not set (Default: ${item.defaultVal || 'None'})`);
  }
});

console.log('\n----------------------------------------------------------------');
if (missingRequired === 0) {
  console.log('All required environment variables are satisfied. System ready.');
} else {
  console.warn(`WARNING: ${missingRequired} required variable(s) are missing. Check .env before production deploy.`);
}
console.log('================================================================\n');
