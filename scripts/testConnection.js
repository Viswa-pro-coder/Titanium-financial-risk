const { initializeApp } = require('firebase/app')
const { getAuth, signInAnonymously } = require('firebase/auth')
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

async function test() {
    try {
        // Test Auth
        const userCred = await signInAnonymously(auth)
        console.log('✅ Auth working:', userCred.user.uid)

        // Test Firestore
        const testDoc = doc(db, 'test', 'connection')
        await setDoc(testDoc, {
            timestamp: new Date(),
            status: 'connected',
            user: userCred.user.uid
        })

        const snap = await getDoc(testDoc)
        console.log('✅ Firestore working:', snap.data())
        console.log('\n🚀 Firebase is ready! Proceed with development.')

    } catch (error) {
        console.error('❌ Error:', error.message)
        if (error.code === 'auth/invalid-api-key') {
            console.log('Check your API key in Firebase console > Project settings')
        }
    }
    process.exit(0)
}

test()