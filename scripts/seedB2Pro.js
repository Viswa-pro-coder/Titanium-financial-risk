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

async function seedAnalysts() {
  console.log('Seeding 5 analysts with client rosters...');
  const batch = db.batch();

  for (let i = 0; i < 5; i++) {
    const analystId = faker.string.uuid();
    const analystRef = db.collection('analysts').doc(analystId);

    batch.set(analystRef, {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      specialization: faker.person.jobTitle(),
      tier: 'B2Pro',
      createdAt: admin.firestore.Timestamp.now()
    });

    // Client roster
    for (let j = 0; j < 10; j++) {
        const clientId = faker.string.uuid();
        const clientLinkRef = analystRef.collection('client_links').doc(clientId);
        batch.set(clientLinkRef, {
            clientId: clientId,
            assignedAt: admin.firestore.Timestamp.recent(),
            status: 'Active'
        });
    }
  }

  await batch.commit();
  console.log('Seeding B2Pro complete.');
}

seedAnalysts().catch(console.error);
