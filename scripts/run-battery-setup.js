// Run this script to set up battery position
// node scripts/run-battery-setup.js

const { setBatteryPosition } = require('./set-battery-position.ts');

console.log('🔋 Setting up battery position...');
setBatteryPosition();
console.log('✅ Battery position configured!');
