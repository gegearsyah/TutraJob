/**
 * Fix .env.local file by removing markdown syntax
 * Run: node fix-env.js
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');

if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local file not found!');
  process.exit(1);
}

console.log('🔧 Fixing .env.local file...\n');

// Read current content
const content = fs.readFileSync(envPath, 'utf-8');

// Extract only the environment variables (between ```env and ```)
let fixedContent = content;

// Remove markdown code block markers
fixedContent = fixedContent.replace(/^```env\s*/gm, '');
fixedContent = fixedContent.replace(/^```\s*$/gm, '');

// Remove the instruction text at the top
fixedContent = fixedContent.replace(/^# Environment Variables Example\s*/gm, '');
fixedContent = fixedContent.replace(/^Copy this to.*fill in your values\.\s*/gm, '');

// Remove any leading/trailing whitespace
fixedContent = fixedContent.trim();

// Ensure it starts with a comment or variable
if (!fixedContent.startsWith('#') && !fixedContent.match(/^[A-Z_]+=/)) {
  // Find the first actual env var line
  const lines = fixedContent.split('\n');
  const firstVarIndex = lines.findIndex(line => line.trim().match(/^[A-Z_]+=/));
  if (firstVarIndex > 0) {
    fixedContent = lines.slice(firstVarIndex).join('\n');
  }
}

// Write fixed content
fs.writeFileSync(envPath, fixedContent, 'utf-8');

console.log('✅ Fixed .env.local file!');
console.log('\n📋 New content preview (first 10 lines):\n');
console.log(fixedContent.split('\n').slice(0, 10).join('\n'));
console.log('\n...\n');
console.log('✅ File has been fixed. Now RESTART your development server:');
console.log('   1. Stop server (Ctrl+C)');
console.log('   2. Delete .next folder: rmdir /s /q .next');
console.log('   3. Restart: npm run dev\n');
