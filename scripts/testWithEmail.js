const { initializeApp } = require('firebase/app')
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth')
const { getFirestore, doc, setDoc, getDoc } = require('firebase/firestore')

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

const TEST_EMAIL = 'test@finguard.ai'
const TEST_PASSWORD = 'Test123456!'

async function test() {
    try {
        // Try to create user (fails if exists, then we login)
        try {
            const userCred = await createUserWithEmailAndPassword(auth, TEST_EMAIL, TEST_PASSWORD)
            console.log('✅ Created new user:', userCred.user.uid)
        } catch (err) {
            if (err.code === 'auth/email-already-in-use') {
                const userCred = await signInWithEmailAndPassword(auth, TEST_EMAIL, TEST_PASSWORD)
                console.log('✅ Logged in existing user:', userCred.user.uid)
            } else {
                throw err
            }
        }

        // Test Firestore write
        const user = auth.currentUser
        const userDoc = doc(db, 'users', user.uid)
        await setDoc(userDoc, {
            email: TEST_EMAIL,
            tier: 'consumer',
            createdAt: new Date()
        }, { merge: true })

        const snap = await getDoc(userDoc)
        console.log('✅ Firestore working:', snap.data())
        console.log('\n🚀 Firebase Auth + Firestore ready!')

    } catch (error) {
        console.error('❌ Error:', error.code, error.message)
    }
    process.exit(0)
}

test()