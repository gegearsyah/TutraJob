/**
 * Quick script to check if .env.local exists and has required variables
 * Run: node check-env.js
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
];

console.log('🔍 Checking environment variables...\n');

// Check if file exists
if (!fs.existsSync(envPath)) {
  console.error('❌ File .env.local tidak ditemukan!');
  console.log('📝 Buat file .env.local di root directory');
  console.log('📋 Copy template dari ENV_EXAMPLE.md\n');
  process.exit(1);
}

console.log('✅ File .env.local ditemukan\n');

// Read and parse .env.local
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};

envContent.split('\n').forEach((line) => {
  const trimmed = line.trim();
  // Skip comments and empty lines
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      // Remove quotes if present
      envVars[key.trim()] = value.replace(/^["']|["']$/g, '');
    }
  }
});

console.log('📋 Variabel yang ditemukan:\n');

let allPresent = true;
requiredVars.forEach((key) => {
  const value = envVars[key];
  if (value && value !== '' && !value.includes('your-') && !value.includes('xxxxx')) {
    console.log(`  ✅ ${key} = ${value.substring(0, 30)}...`);
  } else {
    console.log(`  ❌ ${key} = ${value || '(tidak ditemukan atau kosong)'}`);
    allPresent = false;
  }
});

console.log('\n');

if (allPresent) {
  console.log('✅ Semua variabel required sudah diisi!');
  console.log('⚠️  Jangan lupa RESTART development server setelah membuat/mengubah .env.local');
  console.log('   Stop server (Ctrl+C) lalu jalankan: npm run dev\n');
} else {
  console.log('❌ Beberapa variabel masih kosong atau belum diisi dengan benar');
  console.log('📝 Pastikan:');
  console.log('   1. File .env.local ada di root directory');
  console.log('   2. Format: KEY=value (tanpa spasi, tanpa quotes)');
  console.log('   3. Nilai tidak kosong dan bukan placeholder');
  console.log('   4. Restart server setelah membuat/mengubah file\n');
  process.exit(1);
}
