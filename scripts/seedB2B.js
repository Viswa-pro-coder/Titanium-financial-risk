const admin = require('firebase-admin');
const { faker } = require('@faker-js/faker');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

if (!admin.apps.length) {
  if (process.env.FIRESTORE_EMULATOR_HOST) {
    admin.initializeApp({ projectId: 'finguard-ai-dev' });
  } else {
    admin.initializeApp();
  }
}

const db = admin.firestore();

async function seedInstitutions() {
  console.log('Seeding 3 institutions with portfolio data...');
  const batch = db.batch();

  for (let i = 0; i < 3; i++) {
    const instId = faker.string.uuid();
    const instRef = db.collection('institutions').doc(instId);

    batch.set(instRef, {
      name: faker.company.name(),
      type: 'Bank',
      tier: 'B2B',
      createdAt: admin.firestore.Timestamp.now(),
      portfolioValue: parseFloat(faker.finance.amount({ min: 1000000, max: 100000000, dec: 2 })),
      clientsCount: faker.number.int({ min: 100, max: 5000 })
    });

    // Add some users to institution
    for (let j = 0; j < 5; j++) {
        const userId = faker.string.uuid();
        const userRef = instRef.collection('users').doc(userId);
        batch.set(userRef, {
            userId: userId, // Reference to actual user ID
            joinedAt: admin.firestore.Timestamp.recent()
        });
    }
  }

  await batch.commit();
  console.log('Seeding B2B complete.');
}

seedInstitutions().catch(console.error);
