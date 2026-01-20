# 🏥 Emergency Triage System - Hackathon Edition

A comprehensive, multi-language emergency assessment and triage platform designed for hospitals and healthcare facilities.

## ✨ Key Features Implemented

### 1. **Authentication System**
- ✅ Role-based login (Patient, Caregiver, Nurse, Doctor, Admin)
- ✅ Quick demo login for testing
- ✅ User role persistence
- ✅ Secure logout functionality
- Location: `/src/app/login/page.tsx`

### 2. **Multi-Language Support (7 Languages)**
- 🌍 **English (en)** - Default language
- 🇪🇸 **Spanish (es)** - Full translation
- 🇫🇷 **French (fr)** - Full translation
- 🇩🇪 **German (de)** - Full translation
- 🇮🇳 **Hindi (hi)** - Full translation
- 🇵🇹 **Portuguese (pt)** - Full translation
- 🇨🇳 **Chinese (zh)** - Full translation

**Implementation Files:**
- Theme Context: `/src/lib/theme-context.tsx`
- Translations: `/src/lib/translations.ts`
- Translation Hook: `/src/lib/use-translation.ts`
- Multi-lang Questions: `/src/lib/emergency-questions-multilang.ts`

### 3. **Dark/Light Theme Toggle**
- ✅ Persistent theme storage
- ✅ Smooth transitions
- ✅ System-wide theme provider
- ✅ Toggle button in navbar with smooth animations
- Location: Theme Context & Navbar components

### 4. **Navigation Navbar**
- 🎯 Sticky navbar with smooth animations
- 📱 Responsive mobile menu
- 🌐 Language selector with flag icons
- 🌙 Theme toggle button
- 👤 User profile display
- 🚪 Logout functionality
- Location: `/src/components/Navbar.tsx`

### 5. **Emergency Intake Form**
- ✅ Multi-step form wizard (4 steps)
- ✅ Role selection (Patient, Caregiver, Hospital Staff)
- ✅ Arrival mode (Walk-in, Ambulance with fast-track)
- ✅ Emergency category selection (10 types)
- ✅ Patient information collection:
  - Hospital name (user input)
  - Ward (user input)
  - Patient name
  - Age
  - Gender
  - Contact phone
- 🎨 Beautiful gradient styling with hover effects
- ⚡ Smooth animations and transitions
- Location: `/src/components/emergency/EmergencyCaseIntake.tsx`

### 6. **Smart Question Flow**
- 🤖 AI-powered adaptive questioning
- 📝 Multiple answer types:
  - **Multiple choice** with text input fallback
  - **Yes/No buttons**
  - **Text input** with placeholders
  - **Numeric input** for pain levels (1-10)
- 🔊 Voice-to-text capability (read question aloud)
- 🌐 Language-aware questions
- 📊 Progress bar with priority indicators
- 🎯 Smart priority-based question flow
- Location: `/src/components/SmartQuestionFlow.tsx`

### 7. **Doctor's Emergency Dashboard**
- 📊 Real-time case management
- 🎯 Filter by priority (All, Critical, Urgent, Normal)
- 📈 Statistics dashboard:
  - Critical cases count
  - Urgent cases count
  - Normal cases count
  - Resolved cases count
- 🗂️ Case cards with:
  - Patient name & ID
  - Priority badge with color coding
  - Emergency category
  - Patient age
  - Ward location
  - Arrival time
  - Quick action buttons
- Location: `/src/app/dashboard/page.tsx` (updated)

### 8. **Attractive UI/UX Features**
- 🎨 **Modern Design**:
  - Gradient backgrounds
  - Glassmorphism effects
  - Smooth animations
  - Color-coded priority system
  - Rich icon set (Lucide icons)

- ⚡ **Framer Motion Animations**:
  - Entrance animations
  - Hover effects (scale & lift)
  - Progress indicators
  - Transition effects
  - Pulsing pulse indicators

- 📱 **Responsive Design**:
  - Mobile-first approach
  - Adaptive layouts
  - Touch-friendly buttons
  - Readable typography

- 🎭 **Theme Consistency**:
  - Dark mode optimized
  - Light mode ready
  - Semantic color coding
  - High contrast for accessibility

### 9. **File Upload & PDF Generation**
- 📄 Generate emergency forms as PDFs
- 📤 Multiple form types:
  - Emergency Intake Form
  - Triage Assessment Form
  - Allergy & Medication Form
  - Accident & Symptom Form
  - Doctor Summary Form
- 💾 Download functionality
- Location: `/src/lib/pdf-generator.ts`

## 🗂️ Project Structure

```
src/
├── app/
│   ├── layout.tsx                 # Root layout with ThemeProvider
│   ├── page.tsx                   # Home page
│   ├── login/
│   │   └── page.tsx              # Login/SignUp page
│   ├── dashboard/
│   │   └── page.tsx              # Doctor's dashboard
│   ├── emergency/
│   │   └── page.tsx              # Emergency intake flow
│   └── globals.css               # Global styles
├── components/
│   ├── Navbar.tsx                # Navigation with theme toggle
│   ├── SmartQuestionFlow.tsx      # AI question flow
│   ├── emergency/
│   │   ├── EmergencyCaseIntake.tsx
│   │   ├── CaseSummary.tsx
│   │   ├── SmartQuestionFlow.tsx
│   │   └── VoiceInteraction.tsx
│   └── ui/                        # Reusable UI components
├── lib/
│   ├── theme-context.tsx          # Theme & Language context
│   ├── use-translation.ts         # Translation hook
│   ├── translations.ts            # All translations (7 languages)
│   ├── emergency-questions-multilang.ts  # Language-specific questions
│   ├── emergency-types.ts
│   ├── emergency-questions.ts
│   └── utils.ts
├── types/
│   └── speech.d.ts               # Speech recognition types
└── visual-edits/
    └── VisualEditsMessenger.tsx
```

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Access at `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

## 🎯 User Flows

### 1. **Doctor User Flow**
```
Login (Select Doctor Role)
  ↓
Main Dashboard (Doctor's Emergency Dashboard)
  ↓
View all emergency cases
  ↓
Filter by priority
  ↓
Review case details
  ↓
Manage emergency response
```

### 2. **Patient/Caregiver Flow**
```
Login (Select Patient/Caregiver Role)
  ↓
Emergency Intake Form
  ├─ Select user type
  ├─ Select arrival mode
  ├─ Select emergency category
  └─ Enter patient info (multilingual)
  ↓
Smart Question Flow
  ├─ Language-specific questions
  ├─ Multiple answer types
  ├─ Voice support
  └─ Dynamic priority assessment
  ↓
Case Summary
  ├─ View assessment results
  ├─ Generate PDF forms
  └─ Share information
```

## 🌐 Language Support Details

Each language includes:
- 🗣️ All UI text in target language
- ❓ 6 medical assessment questions
- 📝 Emergency intake form labels
- 🎯 Navigation menus
- ⚠️ Alert and status messages

**Supported Languages:**
- English, Spanish, French, German, Hindi, Portuguese, Chinese (Mandarin)

## 🎨 Color Scheme & Priority System

### Priority Colors
- 🔴 **Critical**: Red (#e53e3e)
- 🟠 **Urgent**: Amber (#d97706)
- 🟢 **Normal**: Emerald (#059669)

### Theme Colors
- **Dark Mode**: Slate-950, Slate-900 base
- **Light Mode**: Slate-50 base (ready to implement)
- **Accent**: Red, Purple, Blue gradients

## 🔧 Technologies Used

- **Framework**: Next.js 15.3.5 with Turbopack
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Validation**: Zod
- **State Management**: React Context + Hooks
- **PDF Generation**: jsPDF
- **Voice**: Web Speech API
- **Database**: Drizzle ORM + LibSQL

## 🎓 Hackathon Winning Features

1. **Multi-Language AI**: Asks questions in user's selected language
2. **Smart Triage**: Priority-based question flow
3. **Accessibility**: Voice support, large buttons, readable fonts
4. **Real-time Dashboard**: Live case management
5. **Beautiful UI**: Gradient designs, smooth animations
6. **Mobile Responsive**: Works on all devices
7. **PDF Export**: Generate professional medical forms
8. **Theme Support**: Dark/Light mode preference
9. **Role-Based Access**: Different flows for different users
10. **Typed Answers**: Flexible response options

## 📋 Environment Setup

Create `.env.local`:
```env
NEXT_PUBLIC_APP_NAME=Emergency Triage System
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## 🔐 Security Notes

- ✅ User authentication check
- ✅ Role-based access control
- ✅ LocalStorage for session management
- ⚠️ Note: This is a demo version. For production, use proper authentication (NextAuth.js, Auth0, etc.)

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🚨 Emergency Priority Assessment

The system automatically determines priority based on:
- **Emergency Category**: Trauma, Cardiac, Neuro, Respiratory, etc.
- **Arrival Mode**: Ambulance = Higher priority
- **Symptom Severity**: Pain level, duration, additional conditions
- **Risk Factors**: Medical history, allergies

## 🎉 Key Differentiators

✨ **What Makes This Special:**
- 7 Language Support with AI-powered question adaptation
- Beautiful glassmorphism UI with smooth animations
- Flexible answer input (multiple choice + text input)
- Real-time doctor dashboard with case filtering
- PDF export for medical records
- Voice support for accessibility
- Dark/Light theme switching
- Mobile-first responsive design

## 📞 Support & Contact

For questions or improvements, feel free to contribute!

---

**Built with ❤️ for Emergency Healthcare Systems**
**Ready for Hackathon Submission** ✅
