import crypto from 'crypto';

console.log('================================================================');
console.log(' PashuSuraksha Cryptographic Secret Generator');
console.log('================================================================\n');

// 1. Generate strong 256-bit JWT secret
const jwtSecret = crypto.randomBytes(32).toString('hex');
console.log('Generated JWT_SECRET:');
console.log(`JWT_SECRET=${jwtSecret}\n`);

// 2. Generate random VAPID key simulation / URL-safe tokens
const vapidPublic = crypto.randomBytes(32).toString('base64url');
const vapidPrivate = crypto.randomBytes(32).toString('base64url');

console.log('Generated VAPID Push Notification Keys:');
console.log(`VAPID_PUBLIC_KEY=${vapidPublic}`);
console.log(`VAPID_PRIVATE_KEY=${vapidPrivate}\n`);

console.log('Copy and paste these values into your .env file.');
console.log('================================================================\n');
