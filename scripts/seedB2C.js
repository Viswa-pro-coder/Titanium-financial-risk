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

async function seedUsers() {
  console.log('Seeding 100 users with transactions...');
  let batch = db.batch();
  let count = 0;

  for (let i = 0; i < 100; i++) {
    const userId = faker.string.uuid();
    const userRef = db.collection('users').doc(userId);

    batch.set(userRef, {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      tier: 'B2C',
      createdAt: admin.firestore.Timestamp.now()
    });
    count++;

    // 90 days transactions
    const numDays = 90;
    for (let d = 0; d < numDays; d++) {
        if (faker.datatype.boolean(0.7)) { // 70% chance of transaction on a day
            const txId = faker.string.uuid();
            const txRef = userRef.collection('transactions').doc(txId);
            const date = faker.date.recent({ days: 90 });

            batch.set(txRef, {
                amount: parseFloat(faker.finance.amount({ min: 10, max: 500, dec: 2 })),
                date: admin.firestore.Timestamp.fromDate(date),
                description: faker.finance.transactionDescription(),
                category: faker.finance.transactionType(),
                merchant: faker.company.name()
            });
            count++;
        }

        if (count >= 400) {
            await batch.commit();
            batch = db.batch();
            count = 0;
        }
    }
  }

  if (count > 0) {
    await batch.commit();
  }
  console.log('Seeding B2C complete.');
}

seedUsers().catch(console.error);
