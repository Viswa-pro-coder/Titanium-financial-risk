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
- **UI Components**: 50+ Radix UI components
- **Charts**: Recharts 2.15.0
- **State Management**: React Hooks (useState, useEffect)
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
- **ML Models**: XGBoost (financial risk prediction)
- **LLM Framework**: Transformers, PEFT (Parameter-Efficient Fine-Tuning)
- **Optimization**: Accelerate, BitsAndBytes (quantization)
- **Vector DB**: ChromaDB (for RAG - Retrieval Augmented Generation)
- **Embeddings**: Sentence-Transformers

### DevOps & Tooling
- **Package Manager**: pnpm (parallel npm)
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
│   │   ├── dashboard/
│   │   │   ├── analyst/page.tsx     # B2Pro analyst dashboard
│   │   │   ├── consumer/page.tsx    # B2C consumer dashboard
│   │   │   └── institution/page.tsx # B2B institution dashboard
│   │   ├── globals.css              # Global styles + Tailwind imports
│   │   ├── layout.tsx               # Root layout with theme provider
│   │   └── page.tsx                 # Root redirect to /dashboard/consumer
│   │
│   ├── 📂 components/               # React components (70 files)
│   │   ├── 📂 dashboard/            # Dashboard-specific components
│   │   │   ├── 📂 analyst/          # B2Pro components (5 files)
│   │   │   │   ├── batch-upload.tsx      # Bulk data upload UI
│   │   │   │   ├── kanban-board.tsx      # Client risk management board
│   │   │   │   ├── quick-stats.tsx       # KPI metrics display
│   │   │   │   ├── report-templates.tsx  # Report generation UI
│   │   │   │   └── research-panel.tsx    # Research/analysis panel
│   │   │   │
│   │   │   ├── 📂 consumer/         # B2C components (5 files)
│   │   │   │   ├── alerts-center.tsx          # Personal alerts
│   │   │   │   ├── risk-score-gauge.tsx       # Visual risk score
│   │   │   │   ├── spending-charts.tsx        # Pie/Area charts
│   │   │   │   ├── stats-cards.tsx            # Financial metrics
│   │   │   │   └── transactions-table.tsx     # Transaction history
│   │   │   │
│   │   │   └── 📂 institution/      # B2B components (5 files)
│   │   │       ├── alerts-table.tsx      # System-wide alerts
│   │   │       ├── kpi-cards.tsx         # Institutional KPIs
│   │   │       ├── risk-bar-chart.tsx    # Risk distribution
│   │   │       ├── risk-heatmap.tsx      # Customer risk heatmap
│   │   │       └── trend-chart.tsx       # Risk trend over time
│   │   │
│   │   ├── 📂 layout/               # Common layout components (3 files)
│   │   │   ├── app-header.tsx       # Top navigation bar
│   │   │   ├── app-layout.tsx       # Main layout wrapper
│   │   │   └── app-sidebar.tsx      # Collapsible sidebar navigation
│   │   │
│   │   ├── 📂 shared/               # Shared components (1 file)
│   │   │   └── chatbot-modal.tsx    # AI chatbot interface
│   │   │
│   │   ├── 📂 ui/                   # shadcn/ui components (50 files)
│   │   │   ├── accordion.tsx, alert-dialog.tsx, alert.tsx
│   │   │   ├── avatar.tsx, badge.tsx, button.tsx, calendar.tsx
│   │   │   ├── card.tsx, carousel.tsx, chart.tsx, checkbox.tsx
│   │   │   ├── dialog.tsx, dropdown-menu.tsx, form.tsx, input.tsx
│   │   │   ├── select.tsx, table.tsx, tabs.tsx, toast.tsx
│   │   │   └── ... (and 30+ more UI primitives)
│   │   │
│   │   └── theme-provider.tsx       # Dark/light theme context
│   │
│   ├── 📂 hooks/                    # Custom React hooks (4 files)
│   │   ├── use-mobile.tsx           # Mobile breakpoint detection
│   │   ├── use-toast.ts             # Toast notification system
│   │   ├── useAuth.ts               # Firebase authentication hook
│   │   └── useFirestore.ts          # Firestore real-time data hook
│   │
│   ├── 📂 lib/                      # Utilities and configuration (4 files)
│   │   ├── firebase.ts              # Firebase SDK initialization
│   │   ├── mock-data.ts             # Mock data for all 3 tiers (406 lines)
│   │   ├── types.ts                 # TypeScript type definitions (201 lines)
│   │   └── utils.ts                 # Utility functions (cn classnames)
│   │
│   └── 📂 styles/                   # Additional styles (1 file)
│       └── globals.css              # Global CSS styles
│
├── 📂 functions/                    # Firebase Cloud Functions (Python)
│   ├── main.py                      # Entry point for all functions
│   ├── requirements.txt             # Python dependencies
│   └── 📂 src/
│       ├── 📂 http/                 # HTTP callable functions (3 files)
│       │   ├── batch_analyze.py     # Batch risk analysis API
│       │   ├── chat_stream.py       # AI chatbot streaming API
│       │   └── __init__.py
│       │
│       ├── 📂 scheduled/            # Scheduled cron jobs (2 files)
│       │   ├── aggregate_metrics.py # Daily metrics aggregation
│       │   └── __init__.py
│       │
│       ├── 📂 triggers/             # Firestore triggers (2 files)
│       │   ├── on_transaction_create.py  # Auto risk scoring on new txn
│       │   └── __init__.py
│       │
│       └── 📂 utils/                # Utility modules (3 files)
│           ├── risk_engine.py       # Risk calculation algorithms
│           ├── llm_client.py        # LLM integration
│           └── __init__.py
│
├── 📂 ai/                           # AI model infrastructure
│   ├── 📂 finetune/                 # Model fine-tuning scripts (1 file)
│   │   └── train.py
│   └── 📂 rag/                      # RAG system implementation (1 file)
│       └── vectorstore.py
│
├── 📂 scripts/                      # Database seeding scripts (3 files)
│   ├── seedB2C.js                   # Seed consumer data
│   ├── seedB2B.js                   # Seed institution data
│   └── seedB2Pro.js                 # Seed analyst data
│
├── 📂 .github/                      # GitHub workflows (1 file)
│   └── workflows/deploy.yml         # CI/CD pipeline
│
├── 📂 .next/                        # Next.js build output (auto-generated)
├── 📂 node_modules/                 # Dependencies (auto-generated)
│
├── 📄 Configuration Files
│   ├── .env.production              # Production environment variables
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
**Target Users**: Individual consumers tracking personal finances

**Features**:
- ✅ **Risk Score Gauge**: Visual circular gauge showing risk level (0-100)
- ✅ **Stats Cards**: Monthly spending, income, emergency fund, savings progress (₹ INR)
- ✅ **Spending Charts**: Pie chart by category + Area chart for trends
- ✅ **Transactions Table**: Sortable list of recent transactions
- ✅ **Alerts Center**: Predictive alerts, fraud warnings, compliance reminders
- ✅ **AI Chatbot**: Financial advice and query resolution

**Data Types**:
- Financial metrics (spending, income, savings)
- Transaction history (merchant, category, amount, risk flags)
- Personalized alerts based on spending patterns
- Risk score with trend indicators

---

### 2️⃣ B2B Institution Dashboard (`/dashboard/institution`)
**Target Users**: Banks, credit unions, financial institutions

**Features**:
- ✅ **KPI Cards**: Total customers, avg risk score, critical cases, compliance rate
- ✅ **Risk Heatmap**: 100-cell grid showing customer segment risk distribution
- ✅ **Risk Bar Chart**: Risk level distribution across portfolio
- ✅ **Trend Chart**: Historical average risk score over time
- ✅ **Alerts Table**: System-wide fraud, compliance, and predictive alerts
- ✅ **Batch Processing**: Upload and analyze customer data in bulk

**Data Types**:
- Portfolio-wide KPIs and metrics
- Customer segmentation and risk clusters
- Compliance monitoring and reporting
- Fraud detection alerts

---

### 3️⃣ B2Pro Analyst Dashboard (`/dashboard/analyst`)
**Target Users**: Financial analysts and risk assessment professionals

**Features**:
- ✅ **Quick Stats**: Active clients, critical cases, avg risk, monthly revenue (₹ INR)
- ✅ **Kanban Board**: Drag-and-drop client management (Low/Medium/High/Critical)
- ✅ **Batch Upload**: CSV/Excel upload for bulk client analysis
- ✅ **Report Templates**: Pre-built financial health and risk assessment reports
- ✅ **Research Panel**: AI-powered research and analysis tools
- ✅ **Client Cards**: Show ARR, risk score, trend, last contact date

**Data Types**:
- Client portfolio management
- Risk scoring and trending
- Revenue tracking (ARR - Annual Recurring Revenue)
- Custom report generation

---

## 🔥 Firebase Integration

### Firestore Collections Structure
```
/users/{userId}
  ├── transactions/
  ├── alerts/
  └── metrics/

/institutions/{instId}
  ├── users/
  └── portfolios/

/analysts/{analystId}
  └── client_links/

/shared/
  └── (read-only reference data)
```

### Security Rules
- **Role-based access control** (B2C, B2B, B2Pro tiers)
- Users can only access their own data
- Analysts can access linked clients
- Institutions can access their portfolio users
- Custom token claims for tier identification

### Cloud Functions
1. **on_transaction_create** (Trigger): Auto-scores risk when new transaction added
2. **chat_stream** (HTTP): Handles AI chatbot conversations
3. **batch_analyze** (HTTP): Processes bulk risk analysis requests
4. **aggregate_metrics** (Scheduled): Daily aggregation of portfolio metrics

---

## 🤖 AI/ML Features

### Current Implementation
- **Risk Scoring Engine**: XGBoost-based risk prediction
- **AI Chatbot**: LLM-powered financial advisor (streaming responses)
- **Fraud Detection**: Anomaly detection on transactions
- **Predictive Alerts**: Proactive warnings based on spending patterns

### AI Infrastructure
- **Fine-tuning**: Custom model training on financial data (`ai/finetune/train.py`)
- **RAG System**: Vector database for enhanced contextual responses (`ai/rag/vectorstore.py`)
- **Embeddings**: Sentence transformers for semantic search
- **Quantization**: BitsAndBytes for efficient model inference

---

## 📊 Data Models (TypeScript Types)

### Core Types
```typescript
// User tiers
type DashboardTier = 'consumer' | 'institution' | 'analyst'

// Risk assessment
interface RiskScore {
  value: number              // 0-100
  trend: 'up' | 'down' | 'stable'
  lastUpdated: Date
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
}

// Financial data
interface Transaction {
  id: string
  date: Date
  amount: number
  category: string
  merchantName: string
  riskFlag?: boolean
}

// Alert system
interface Alert {
  id: string
  title: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  type: 'predictive' | 'fraud' | 'compliance'
  acknowledged: boolean
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

## 🚀 Build & Deployment

### Local Development
```bash
# Install dependencies
make install
# or
pnpm install

# Run dev server (Turbopack)
pnpm dev

# Access at http://localhost:3000
```

### Firebase Emulators
```bash
make emulate
```
- Auth: `localhost:9099`
- Firestore: `localhost:8080`
- Functions: `localhost:5001`
- Emulator UI: Auto-enabled

### Database Seeding
```bash
make seed
# Runs: seedB2C.js, seedB2B.js, seedB2Pro.js
```

### Production Deployment
```bash
make deploy
# 1. Builds Next.js static site
# 2. Deploys to Firebase Hosting
# 3. Deploys Cloud Functions
```

---

## ⚠️ What's Missing / Pending

### 🔴 Critical Missing Items

1. **Environment Variables** ❌
   - `.env.production` is empty (no Firebase credentials)
   - Need to create `.env.local` for development
   - **Required Variables**:
     ```env
     NEXT_PUBLIC_FIREBASE_API_KEY=
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
     NEXT_PUBLIC_FIREBASE_APP_ID=
     ```

2. **Authentication Pages** ❌
   - No login page (`/login`)
   - No signup page (`/signup`)
   - No password reset flow
   - No user profile page

3. **Cloud Functions Implementation** ⚠️ Partially Missing
   - `functions/src/http/chat_stream.py` - File exists but implementation unknown
   - `functions/src/http/batch_analyze.py` - File exists but implementation unknown
   - `functions/src/triggers/on_transaction_create.py` - File exists but implementation unknown
   - `functions/src/scheduled/aggregate_metrics.py` - File exists but implementation unknown
   - `functions/src/utils/risk_engine.py` - File exists but implementation unknown
   - `functions/src/utils/llm_client.py` - File exists but implementation unknown

4. **AI Models** ❌
   - No trained models included
   - `ai/finetune/train.py` - Training script exists but no trained weights
   - `ai/rag/vectorstore.py` - RAG implementation exists but no vector data

5. **Real Data Integration** ❌
   - All dashboards currently use mock data (`lib/mock-data.ts`)
   - No actual Firebase data fetching implemented in components
   - useFirestore hook exists but not utilized in dashboard components

### 🟡 Important Incomplete Features

6. **Chatbot Integration** ⚠️
   - UI component exists (`components/shared/chatbot-modal.tsx`)
   - Backend function declared but implementation unclear
   - No streaming response handling in frontend

7. **Batch Upload Processing** ⚠️
   - Frontend UI exists (`components/dashboard/analyst/batch-upload.tsx`)
   - Backend processing function exists but implementation unclear
   - No file upload to Firebase Storage implemented

8. **Report Generation** ⚠️
   - Template UI exists (`components/dashboard/analyst/report-templates.tsx`)
   - No actual PDF/document generation logic
   - No backend function for report creation

9. **Real-time Updates** ⚠️
   - Firestore onSnapshot hooks exist
   - Not connected to dashboard components
   - Mock data is static, not reactive

10. **User Tier Detection** ❌
    - No logic to determine user tier (B2C/B2B/B2Pro)
    - Routing currently hardcoded to consumer dashboard
    - No tier-based access control in frontend

### 🟢 Nice-to-Have Missing Features

11. **Testing** ❌
    - No unit tests
    - No integration tests
    - No E2E tests

12. **Error Boundaries** ❌
    - No error handling UI
    - No 404 page
    - No 500 error page

13. **Loading States** ⚠️
    - Some components have loading states
    - Not consistent across all components
    - No skeleton loaders

14. **Internationalization** ❌
    - Currently English only
    - INR currency implemented but no multi-language support

15. **Analytics** ❌
    - No Google Analytics
    - No Firebase Analytics events
    - No user behavior tracking

16. **Documentation** ⚠️
    - README is minimal
    - No API documentation
    - No component documentation
    - No deployment guide

17. **CI/CD** ⚠️
    - `.github/workflows/deploy.yml` exists but content unknown
    - No automated testing pipeline
    - No staging environment

18. **Data Validation** ⚠️
    - Zod schemas not defined for all types
    - No input validation on forms
    - No API request/response validation

19. **Accessibility** ⚠️
    - No ARIA labels
    - No keyboard navigation testing
    - No screen reader optimization

20. **Mobile Responsiveness** ⚠️
    - Tailwind responsive classes used
    - Not tested on actual devices
    - Complex charts may not work well on mobile

---

## 📝 Immediate Next Steps (Priority Order)

### Phase 1: Make It Work (Essential)
1. ✅ **Setup Firebase Project**
   - Create Firebase project in console
   - Enable Authentication, Firestore, Storage, Functions
   - Copy credentials to `.env.local`

2. ✅ **Implement Authentication**
   - Create login/signup pages
   - Implement Firebase Auth (email/password, Google)
   - Add protected route middleware
   - Store user tier in Firestore on signup

3. ✅ **Connect Real Data**
   - Replace mock data with Firestore queries
   - Use `useFirestore` and `useAuth` hooks in components
   - Implement real-time listeners for live updates

4. ✅ **Implement Cloud Functions**
   - Complete `on_transaction_create.py` risk scoring
   - Implement `chat_stream.py` for chatbot
   - Deploy functions to Firebase

### Phase 2: Make It Better (Important)
5. Add error handling and loading states
6. Implement chatbot with streaming responses
7. Add batch upload file processing
8. Create tier-based routing logic
9. Add form validation with Zod

### Phase 3: Make It Great (Polish)
10. Add unit tests for utilities
11. Create comprehensive documentation
12. Optimize performance and bundle size
13. Add analytics and monitoring
14. Implement CI/CD pipeline

---

## 🎓 Learning Resources

### Technologies Used
- **Next.js**: https://nextjs.org/docs
- **Firebase**: https://firebase.google.com/docs
- **Tailwind**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com
- **Recharts**: https://recharts.org/en-US

### Best Practices
- Use Server Components where possible (Next.js 13+)
- Keep client components minimal
- Implement proper error boundaries
- Follow Firebase security best practices
- Use TypeScript strictly

---

## 📞 Project Metadata

- **Repository**: https://github.com/Viswa-pro-coder/Titanium-financial-risk
- **Local Path**: `c:\Users\flour\Desktop\fin-guard-ai-web-app`
- **Primary Language**: TypeScript (Frontend), Python (Backend)
- **Total Files**: 180+ files (excluding node_modules)
- **Total Components**: 70+ React components
- **Current Status**: Development (MVP stage with mock data)

---

*Last Updated: 2026-02-13*
*This document provides a complete overview of the FinGuard AI project structure, features, and development status.*
