const { initializeApp } = require('firebase/app')
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth')
const { getFirestore, doc, setDoc, collection, addDoc, serverTimestamp, getDocs, query, where } = require('firebase/firestore')

const firebaseConfig = {
    apiKey: "AIzaSyBJfoqX_5ghf0Ggqv8cfjUJwP8ar5zptuU",
    authDomain: "finguard-ai-55aec.firebaseapp.com",
    projectId: "finguard-ai-55aec",
    storageBucket: "finguard-ai-55aec.firebasestorage.app",
    messagingSenderId: "620744063106",
    appId: "1:620744063106:web:e2bbce46722bf73ee99c9b"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

const categories = ['grocery', 'dining', 'transport', 'utilities', 'entertainment', 'shopping', 'healthcare']
const merchants = ['BigBasket', 'Swiggy', 'Uber', 'Electricity Board', 'Netflix', 'Amazon', 'Pharmacy', 'Salary']

async function seedUser(email, password, displayName, tier = 'consumer') {
    try {
        let userId
        try {
            const cred = await createUserWithEmailAndPassword(auth, email, password)
            userId = cred.user.uid
            console.log(`Created user: ${email} (${userId})`)
        } catch (err) {
            if (err.code === 'auth/email-already-in-use') {
                console.log(`User exists: ${email}, signing in...`)
                const cred = await signInWithEmailAndPassword(auth, email, password)
                userId = cred.user.uid
            } else {
                throw err
            }
        }

        // Create profile
        await setDoc(doc(db, 'users', userId), {
            email,
            displayName,
            tier,
            createdAt: serverTimestamp()
        })

        // Delete existing transactions to avoid duplicates during seed
        // (Optional, but good for clean demo)

        // Generate 60 days of transactions
        const transactions = []
        let balance = 50000

        for (let i = 0; i < 60; i++) {
            const date = new Date()
            date.setDate(date.getDate() - i)

            // Salary every 30 days
            if (i % 30 === 0) {
                transactions.push({
                    userId,
                    amount: 75000,
                    category: 'income',
                    merchantName: 'Employer',
                    timestamp: date,
                    type: 'credit',
                    description: 'Monthly salary'
                })
                balance += 75000
            }

            // Daily expenses
            const dailySpend = 1500 + Math.random() * 1000
            const category = categories[Math.floor(Math.random() * categories.length)]

            transactions.push({
                userId,
                amount: -Math.round(dailySpend),
                category,
                merchantName: merchants[Math.floor(Math.random() * merchants.length)],
                timestamp: date,
                type: 'debit',
                description: `${category} purchase`
            })
            balance -= dailySpend

            // Add some high-risk transactions for demo
            if (i === 5) {
                transactions.push({
                    userId,
                    amount: -5000,
                    category: 'cash_advance',
                    merchantName: 'ATM Withdrawal',
                    timestamp: date,
                    type: 'debit',
                    riskFlag: true,
                    description: 'Cash advance'
                })
            }
        }

        // Add transactions
        console.log(`Adding transactions for ${email}...`)
        for (const tx of transactions) {
            await addDoc(collection(db, 'users', userId, 'transactions'), tx)
        }

        console.log(`✅ Added ${transactions.length} transactions for ${email}`)

    } catch (error) {
        console.error(`Error seeding ${email}:`, error.message)
    }
}

async function main() {
    console.log('Seeding demo data...\n')

    // Demo consumer (high risk pattern)
    await seedUser('demo@finguard.ai', 'demo123456', 'Demo User', 'consumer')

    // Another consumer (stable)
    await seedUser('stable@finguard.ai', 'demo123456', 'Stable User', 'consumer')

    console.log('\n✅ Seeding complete!')
    console.log('Login with:')
    console.log('  demo@finguard.ai / demo123456 (high risk)')
    console.log('  stable@finguard.ai / demo123456 (stable)')
    process.exit(0)
}

main()
