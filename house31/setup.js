#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🎉 House31 Analytics & Monetization Setup');
console.log('==========================================\n');

async function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setup() {
  console.log('Let\'s configure your analytics and monetization settings!\n');

  // Google Analytics setup
  console.log('📊 GOOGLE ANALYTICS 4 SETUP');
  console.log('1. Go to https://analytics.google.com/');
  console.log('2. Create a GA4 property for your website');
  console.log('3. Get your Measurement ID (starts with G-)');
  console.log('');

  const gaTrackingId = await question('Enter your GA4 Measurement ID (or press Enter to skip): ');

  // Google AdSense setup
  console.log('\n💰 GOOGLE ADSENSE SETUP');
  console.log('1. Go to https://www.google.com/adsense/');
  console.log('2. Apply for AdSense and get approved');
  console.log('3. Get your Publisher ID (starts with ca-pub-)');
  console.log('');

  const adsenseClient = await question('Enter your AdSense Publisher ID (or press Enter to skip): ');

  // Environment mode
  console.log('\n🔧 ENVIRONMENT SETUP');
  const nodeEnv = await question('Environment (development/production) [development]: ') || 'development';

  // Create .env.local file
  const envContent = `# House31 Analytics & Monetization Configuration
# Generated on ${new Date().toISOString()}

# Google Analytics 4 Configuration
NEXT_PUBLIC_GA_TRACKING_ID=${gaTrackingId}

# Google AdSense Configuration  
NEXT_PUBLIC_ADSENSE_CLIENT=${adsenseClient}

# Environment mode
NODE_ENV=${nodeEnv}

# Debug mode for analytics
DEBUG_ANALYTICS=${nodeEnv === 'development' ? 'true' : 'false'}
`;

  fs.writeFileSync('.env.local', envContent);

  console.log('\n✅ Configuration saved to .env.local');
  console.log('\n📋 WHAT\'S BEEN SET UP:');
  console.log('✓ Google Analytics 4 integration');
  console.log('✓ Google AdSense monetization');
  console.log('✓ Exit intent popup system');
  console.log('✓ Comprehensive event tracking');
  console.log('✓ Responsive ad placement');
  console.log('✓ Dark mode compatibility');

  console.log('\n🚀 NEXT STEPS:');
  if (!gaTrackingId) {
    console.log('1. Set up Google Analytics 4 and add your tracking ID');
  }
  if (!adsenseClient) {
    console.log('2. Apply for Google AdSense and add your publisher ID');
  }
  console.log('3. Run: npm run dev');
  console.log('4. Test the analytics in browser dev tools');
  console.log('5. Check GA4 real-time reports for tracking');

  console.log('\n📚 Documentation:');
  console.log('- Read ANALYTICS_SETUP.md for detailed instructions');
  console.log('- Check IMPLEMENTATION_COMPLETE.md for feature overview');

  rl.close();
}

setup().catch(console.error);
