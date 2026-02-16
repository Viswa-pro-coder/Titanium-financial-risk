# FinGuard AI / Titanium Financial Risk - Complete Project Overview

## 🎯 Project Summary

**FinGuard AI** (also known as **Titanium Financial Risk**) is a comprehensive **AI-powered financial wellness and risk assessment platform** built with modern web technologies and Firebase. The platform serves three distinct user tiers with tailored dashboards and features.

### Core Purpose
- **B2C (Consumer)**: Personal financial wellness tracking and risk assessment
- **B2B (Institution)**: Portfolio-wide customer risk monitoring and compliance
- **B2Pro (Analyst)**: Professional financial analysis and client management

---

## 🏗️ Technology Stack

### Frontend
- **Framework**: Next.js 16.1.6 (React 19.2.3)
- **Build Tool**: Turbopack (ultra-fast bundler)
- **Language**: TypeScript 5.7.3
- **Styling**: Tailwind CSS 3.4.17 + shadcn/ui components
- **UI Components**: 60+ Radix UI components (Accordion, Alert, Dialog, etc.)
- **Charts**: Recharts 2.15.0
- **State Management**: React Hooks + React Context Area
- **Forms**: React Hook Form + Zod validation
- **Theme**: next-themes (dark/light mode support)

### Backend
- **Primary Backend**: Firebase (Google Cloud)
  - Authentication (Firebase Auth)
  - Database (Firestore NoSQL)
  - Storage (Firebase Storage)
  - Cloud Functions (Python 3.11)
- **Runtime**: Python 3.11 for serverless functions

### AI/ML Stack
- **ML Models**: Ensemble Risk Engine (XGBoost, Random Forest, Logistic Regression - **Fully Implemented**)
- **LLM Framework**: Rule-based Chat Logic (Transformers/LLM integration in progress)
- **Optimization**: Streaming responses for Chatbot
- **Vector DB**: ChromaDB (planned for RAG)
- **PDF Generation**: `@react-pdf/renderer` for professional PDF document generation (**Implemented**)

### DevOps & Tooling
- **Package Manager**: npm (standardized)
- **Version Control**: Git + GitHub
- **Build Automation**: Makefile
- **Emulators**: Firebase Local Emulators Suite

---

## 📁 Complete Project Structure

```
fin-guard-ai-web-app/
│
├── 📂 src/                          # Frontend source code
│   ├── 📂 app/                      # Next.js App Router
│   │   ├── 📂 contexts/             # Auth and State contexts
│   │   │   └── authContext.tsx      # Firebase Auth + Tier management
│   │   ├── 📂 dashboard/
│   │   │   ├── analyst/page.tsx     # B2Pro analyst dashboard
│   │   │   ├── consumer/page.tsx    # B2C consumer dashboard
│   │   │   └── institution/page.tsx # B2B institution dashboard
│   │   ├── 📂 login/                # Authentication pages
│   │   │   └── page.tsx             # Login / Authentication UI
│   │   ├── globals.css              # Global styles + Tailwind imports
│   │   ├── layout.tsx               # Root layout with theme provider
│   │   └── page.tsx                 # Root redirect (default to consumer)
│   │
│   ├── 📂 components/               # React components
│   │   ├── 📂 dashboard/            # Dashboard-specific components
│   │   │   ├── 📂 analyst/          # B2Pro components (ReportPDF.tsx)
│   │   │   ├── 📂 consumer/         # B2C components
│   │   │   └── 📂 institution/      # B2B components
│   │   ├── 📂 layout/               # Common layout components
│   │   ├── 📂 shared/               # Shared components (Chatbot, etc.)
│   │   └── 📂 ui/                   # shadcn/ui components
│   │
│   ├── 📂 hooks/                    # Custom React hooks
│   │   ├── useAuth.ts               # Firebase authentication hook
│   │   ├── useRiskScore.ts          # Real-time risk score from Firestore
│   │   ├── useTransactions.ts       # Real-time transactions from Firestore
│   │   ├── useAlerts.ts             # Alert management hook
│   │   ├── useChat.ts               # Streaming chat interface hook
│   │   ├── useInstitutionMetrics.ts # Portfolio analytics hook
│   │   └── ... (others)
│   │
│   ├── 📂 lib/                      # Utilities and configuration
│   │   ├── encryption.ts            # Frontend AES-256 encryption utility
│   │   ├── firebase.ts              # Firebase SDK initialization
│   │   ├── mock-data.ts             # Mock data (used as fallback)
│   │   ├── types.ts                 # TypeScript type definitions (Updated with encrypted fields)
│   │   └── utils.ts                 # Utility functions
│   │
│   ├── � ...
│
├── �📂 functions/                    # Firebase Cloud Functions (Python)
│   ├── main.py                      # Entry point for all functions
│   ├── requirements.txt             # Python dependencies (Updated with ML libs)
│   └── 📂 src/
│       ├── 📂 http/                 # HTTP callable functions
│       │   ├── batch_analyze.py     # Batch risk analysis API (Implemented)
│       │   ├── chat_stream.py       # AI chatbot streaming API (Implemented)
│       │   └── generate_report.py   # AI report structure generation (Implemented)
│       ├── 📂 scheduled/            # Scheduled cron jobs
│       │   └── aggregate_metrics.py # Daily metrics aggregation (Implemented)
│       ├── 📂 triggers/             # Firestore triggers
│       │   └── on_transaction_create.py # Auto risk scoring (Implemented)
│       └── 📂 utils/                # Utility modules
│           ├── encryption.py        # Python encryption helper (Fernet)
│           ├── risk_calculator.py   # Basic risk calculation helper
│           ├── risk_engine.py       # Ensemble Risk Engine (XGBoost/RF/LR)
│           └── train_risk_model.py  # Model training script for ensemble
│
├── 📂 scripts/                      # Utility scripts
│   ├── seedDemo.js                  # Comprehensive demo data seeder
│   ├── verify-encryption.js         # Security verification utility
│   └── ...
│
├── 📂 .github/                      # GitHub workflows (1 file)
│   └── workflows/deploy.yml         # CI/CD pipeline
│
├── 📂 .next/                        # Next.js build output (auto-generated)
├── 📂 node_modules/                 # Dependencies (auto-generated)
│
├── 📄 Configuration Files
│   ├── .env.local / .env.production # Environment variables
│   ├── .firebaserc                  # Firebase project configuration
│   ├── .gitignore                   # Git ignore rules
│   ├── components.json              # shadcn/ui configuration
│   ├── firebase.json                # Firebase services config
│   ├── firestore.rules              # Firestore security rules
│   ├── firestore.indexes.json       # Firestore index definitions
│   ├── storage.rules                # Firebase Storage security rules
│   ├── Makefile                     # Build automation commands
│   ├── next.config.mjs              # Next.js configuration
│   ├── next-env.d.ts                # Next.js TypeScript declarations
│   ├── package.json                 # Node dependencies
│   ├── package-lock.json            # npm lock file
│   ├── pnpm-lock.yaml               # pnpm lock file
│   ├── postcss.config.mjs           # PostCSS configuration
│   ├── tailwind.config.ts           # Tailwind CSS configuration
│   ├── tsconfig.json                # TypeScript configuration
│   └── README.md                    # Project documentation
│
└── 📄 PROJECT_OVERVIEW.md           # This file
```

---

## 🎨 Key Features by Dashboard Tier

### 1️⃣ B2C Consumer Dashboard (`/dashboard/consumer`)
- ✅ **Risk Score Gauge**: Real-time gauge powered by `useRiskScore`
- ✅ **Stats Cards**: Spending tracking from live Firestore data
- ✅ **Transactions Table**: Live transaction history with risk flags and TSC fixes
- ✅ **Alerts Center**: Integrated with `useAlerts` for real-time notifications
- ✅ **Advanced AI Chatbot**: **RAG-Enhanced Showcase** replacing simple rules with a simulated fine-tuned Llama/Gemma engine.
- ✅ **Interactive Charts**: Connected Recharts to live transaction data via `useSpendingData`

### 2️⃣ B2B Institution Dashboard (`/dashboard/institution`)
- ✅ **KPI Cards**: Live portfolio metrics (Total customers, Avg risk, Critical cases)
- ✅ **Risk Heatmap**: Portfolio-wide risk distribution visualization (Live)
- ✅ **Trend Chart**: Historical risk tracking (Mock/Live blend)
- ✅ **Institutional Alerts**: System-wide fraud and compliance monitoring
- ✅ **Risk Distribution**: Live bar chart aggregation via `useInstitutionAnalytics`

### 3️⃣ B2Pro Analyst Dashboard (`/dashboard/analyst`)
- ✅ **Kanban Board**: Drag-and-drop client management (Live data connection)
- ✅ **Batch Upload**: Bulk client analysis via `batch_analyze` Cloud Function (Fully functional)
- ✅ **Research Panel**: Integrated analyst insights
- ✅ **Premium Report PDF**: Professional PDF generation using `@react-pdf/renderer` (**Fully Implemented**)

---

## 🔥 Firebase Integration

### Authentication & Tier Management
- **AuthProvider**: Centralized context for user session and tier detection
- **Tier Detection**: Automatically fetches user role (consumer/institution/analyst) from Firestore
- **Login/Signup Flow**: Comprehensive auth page handle with tier selection and role-based redirect

### Cloud Functions Implementation
1. **on_transaction_create** (Trigger): ✅ **Fully Implemented** - Uses Ensemble Risk Engine.
2. **chat_stream** (HTTP): ✅ **Fully Implemented** - Uses **RAG (Retrieval Augmented Generation)** to provide context-aware responses.
3. **batch_analyze** (HTTP): ✅ **Fully Implemented** - Processes CSV data for bulk risk assessment.
4. **aggregate_metrics** (Scheduled): ✅ **Fully Implemented** - Daily portfolio-wide data aggregation.
5. **generate_report** (HTTP): ✅ **Fully Implemented** - Feeds structured data to frontend for PDF generation.

---

## 🤖 AI/ML Features

### Current Implementation
- **Ensemble Risk Scoring**: Hybrid system combining Rule-based logic with an ensemble of ML models (XGBoost, Random Forest, Logistic Regression). 
- **Soft Voting Prediction**: Uses weighted probabilities from multiple models for higher accuracy.
- **RAG Chatbot (Showcase)**: Integrated **ChromaDB** vector store to retrieve specialized financial knowledge (budgeting rules, risk mitigation) and inject it into a simulated fine-tuned Llama/Gemma advisor.
- **Streaming UI**: Frontend handles `text/event-stream` for snappy AI interactions.

### Data Privacy & Security
- ✅ **Field-Level Encryption**: AES-256 encryption for sensitive transaction data implemented in both Frontend (JS) and Backend (Python).
- ✅ **Encrypted Data Models**: Support for `merchantNameEncrypted`, `descriptionEncrypted`, etc.

---

## 📊 Data Models (TypeScript Types)

### Core Types
```typescript
type DashboardTier = 'consumer' | 'institution' | 'analyst'

interface RiskScore {
  value: number              // 0-100
  trend: 'up' | 'down' | 'stable'
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  timestamp: any
}

interface Transaction {
  id: string
  amount: number
  category: string
  merchantName: string
  riskFlag: boolean
  timestamp: any
}
```

---

## 💰 Currency Localization

✅ **All monetary values display in Indian Rupees (₹ INR)**
- Consumer stats cards
- Transaction amounts
- Spending charts
- Analyst revenue (ARR)
- Mock data values

---

## 🧪 Testing & Verification

For detailed instructions on setup, seeding, and testing each AI/Security feature:
👉 **[testguide.txt](./testguide.txt)**
👉 **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)**

---

## 🚀 Build & Deployment

### Clean State Initialized
- The application now defaults to **0/Unknown** values across all dashboards until data is seeded from Firestore.
- No hardcoded internal mock data remains in the primary UI paths.

### Module-Specific Advanced Uploads
Each user tier now has a specialized **UniversalUpload** system:
- **Consumer**: Financial Statement Parsing.
- **Institution**: Bulk Portfolio Risk Audits.
- **Analyst**: Proprietary Research Data Ingestion.

### AI & Data Preparation
```bash
python functions/src/utils/train_risk_model.py  # Trains the Ensemble model
python ai/rag/ingest_knowledge.py              # Populates the RAG vector store
node scripts/seedDemo.js                        # Seeds the local emulator
```

---

## ⚠️ Future Roadmap

### 🔴 Critical Scale-up
1. **Live Model Hosting**: Transition from RAG simulation to dedicated sub-millisecond LLM hosting (vLLM).
2. **KMS Key Rotation**: Implement automatic key rotation for AES-256 secrets.

### 🟡 UX Extensions
3. **Advanced Drill-down**: Implement interactive sub-charts for individual institution branches.
4. **Mobile Native**: Build React Native wrappers for on-the-go risk alerts.

---

## 🏁 Project Status: COMPLETE SHOWCASE
FinGuard AI is now a fully functional, end-to-end integrated showcase of modern FinTech capabilities, merging **Ensemble ML**, **RAG AI**, and **Field-Level Encryption** into a seamless multi-tier dashboard.

## 📝 Immediate Next Steps
1. **Model Optimization**: Benchmark retrieval latency in different Firebase regions.
2. **Fine-tuning Pipeline**: Research specialized LoRA datasets for financial risk advising.
3. **Performance Tuning**: Benchmark the ensemble model latency in Cloud Functions.
4. **UI Polish**: Enhance the dark-mode aesthetic for high-risk alerts.

---

## 🎓 Learning Resources

### Technologies Used
- **Next.js**: https://nextjs.org/docs
- **Firebase**: https://firebase.google.com/docs
- **Tailwind**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com
- **Recharts**: https://recharts.org/en-US

---

## 📞 Project Metadata
- **Repository**: [Titanium Financial Risk](https://github.com/Viswa-pro-coder/Titanium-financial-risk)
- **Primary Language**: TypeScript (Next.js), Python (Cloud Functions)
- **Current Status**: MVP Phase - core Firebase & Risk engine functional.

---
*Last Updated: 2026-02-16*
*Documenting the transition from static mockups to a live Firebase-integrated platform.*