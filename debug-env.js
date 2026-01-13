/**
 * Debug script to check what Next.js sees
 * Run: node debug-env.js
 */

console.log('🔍 Checking environment variables that Next.js can see...\n');

// Check if .env.local exists
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local file not found!');
  process.exit(1);
}

// Read .env.local
const envContent = fs.readFileSync(envPath, 'utf-8');
console.log('📄 Content of .env.local:\n');
console.log(envContent);
console.log('\n' + '='.repeat(60) + '\n');

// Parse environment variables
const envVars = {};
envContent.split('\n').forEach((line, index) => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const equalIndex = trimmed.indexOf('=');
    if (equalIndex > 0) {
      const key = trimmed.substring(0, equalIndex).trim();
      const value = trimmed.substring(equalIndex + 1).trim();
      // Remove quotes
      const cleanValue = value.replace(/^["']|["']$/g, '');
      envVars[key] = cleanValue;
      console.log(`Line ${index + 1}: ${key} = ${cleanValue.substring(0, 50)}${cleanValue.length > 50 ? '...' : ''}`);
    }
  }
});

console.log('\n' + '='.repeat(60) + '\n');
console.log('🔍 Checking required variables:\n');

const required = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'];
let allGood = true;

required.forEach((key) => {
  const value = envVars[key];
  if (value && value.length > 0 && !value.includes('your-') && !value.includes('xxxxx')) {
    console.log(`✅ ${key}: OK (${value.length} characters)`);
  } else {
    console.log(`❌ ${key}: ${value ? 'Empty or placeholder' : 'NOT FOUND'}`);
    allGood = false;
  }
});

console.log('\n' + '='.repeat(60) + '\n');

if (allGood) {
  console.log('✅ All variables are correctly set in .env.local');
  console.log('\n⚠️  IMPORTANT: If Next.js still shows them as missing:');
  console.log('   1. Make sure you RESTARTED the dev server after creating .env.local');
  console.log('   2. Stop server (Ctrl+C)');
  console.log('   3. Delete .next folder: rmdir /s /q .next');
  console.log('   4. Restart: npm run dev');
  console.log('\n💡 The variables are in the file, but Next.js needs a restart to read them!');
} else {
  console.log('❌ Some variables are missing or have placeholder values');
  console.log('   Please update .env.local with actual values from Supabase dashboard');
}
