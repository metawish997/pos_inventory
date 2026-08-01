// scripts/updateHsnSac.js
const mongoose = require('mongoose');
const https = require('https');
const HsnSac = require('../models/HsnSac');

// Connect to MongoDB
const connStr = process.env.MONGODB_URI || 'mongodb://bhavishybhaisaniya1432_db_user:mYo9ExyeKTyu0w6r@ac-isjawpj-shard-00-00.1lbuwsd.mongodb.net:27017,ac-isjawpj-shard-00-01.1lbuwsd.mongodb.net:27017,ac-isjawpj-shard-00-02.1lbuwsd.mongodb.net:27017/dreamPos?ssl=true&replicaSet=atlas-4adcig-shard-0&authSource=admin&appName=Cluster0';

// A baseline of default/common HSN/SAC codes in India
const BASELINE_CODES = [
  { code: '01', description: 'LIVE ANIMALS', type: 'HSN' },
  { code: '010121', description: 'PURE-BRED BREEDING ANIMALS', type: 'HSN' },
  { code: '01013090', description: 'OTHER LIVE ANIMALS', type: 'HSN' },
  { code: '0102', description: 'LIVE BOVINE ANIMALS.', type: 'HSN' },
  { code: '01021010', description: 'LIVE BOVINE ANIMALS - BULLS - PURE-BRED BREEDING ANIMALS', type: 'HSN' },
  { code: '01023100', description: 'Pure-bred breeding animals', type: 'HSN' },
  { code: '01029020', description: 'LIVE BOVINE ANIMALS - OTHER - BUFFALOES, ADULT AND CALVES', type: 'HSN' },
  { code: '010613', description: 'CAMELS AND OTHER CAMELIDS (CAMELIDAE)', type: 'HSN' },
  { code: '010614', description: 'RABBITS AND HARES', type: 'HSN' },
  { code: '01063900', description: 'OTHER BIRDS', type: 'HSN' },
  { code: '84713010', description: 'PERSONAL COMPUTER (LAPTOP, NOTEBOOK)', type: 'HSN' },
  { code: '85171300', description: 'SMARTPHONES / MOBILE PHONES', type: 'HSN' },
  { code: '998311', description: 'MANAGEMENT CONSULTING SERVICES', type: 'SAC' },
  { code: '998313', description: 'IT DESIGN AND DEVELOPMENT SERVICES', type: 'SAC' },
  { code: '998713', description: 'COMPUTER AND PERIPHERAL MAINTENANCE & REPAIR', type: 'SAC' }
];

async function updateHsnSac() {
  try {
    await mongoose.connect(connStr);
    console.log('MongoDB Connected for HSN/SAC Import');
    
    // 1. Seed/Upsert baseline codes
    for (const item of BASELINE_CODES) {
      await HsnSac.updateOne(
        { code: item.code },
        { $set: item },
        { upsert: true }
      );
    }
    console.log('Successfully seeded HSN/SAC baseline codes.');

    // 2. Fetch/Scrape additional official HSN codes from remote JSON if online
    // Pull public-domain JSON dump directly from GitHub raw content
    const url = 'https://raw.githubusercontent.com/crusher95/hsn-sac-gst-json/master/hsn_all.json';
    
    https.get(url, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', async () => {
        try {
          const rawData = JSON.parse(body);
          console.log(`Fetched ${rawData.length || 0} HSN records from repository raw output.`);
          
          let count = 0;
          for (const rawItem of rawData) {
            const code = String(rawItem.hsn || '').trim();
            const description = String(rawItem.description || '').trim();
            if (!code || !description) continue;
            
            await HsnSac.updateOne(
              { code },
              {
                $set: {
                  code,
                  description,
                  type: code.startsWith('99') ? 'SAC' : 'HSN'
                }
              },
              { upsert: true }
            );
            count++;
          }
          console.log(`Update complete. Upserted/Synchronized ${count} HSN/SAC records.`);
          process.exit(0);
        } catch (e) {
          console.error('Error parsing remote HSN/SAC JSON data:', e.message);
          process.exit(1);
        }
      });
    }).on('error', (err) => {
      console.error('Failed to fetch remote HSN/SAC list:', err.message);
      process.exit(1);
    });

  } catch (err) {
    console.error('Database connection error during HSN/SAC sync:', err.message);
    process.exit(1);
  }
}

updateHsnSac();
