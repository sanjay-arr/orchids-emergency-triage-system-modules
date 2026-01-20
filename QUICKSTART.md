# 🚀 Quick Start Guide - Emergency Triage System

## Installation & Setup (2 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open in Browser
```
http://localhost:3000
```

## 🎯 Testing the Application

### Demo Users (Quick Login)

1. **Doctor Mode**
   - Click on "Quick Demo Login"
   - Select: "Dr. Sharma" (Doctor role)
   - View: Doctor's Emergency Dashboard
   - Features: Filter cases by priority, view case details

2. **Patient/Caregiver Mode**
   - Click on "Quick Demo Login"
   - Select: "Family Member" (Caregiver role) OR any non-staff role
   - Flow: Emergency Intake → Smart Questions → Case Summary

## 🌐 Testing Multi-Language Support

1. **Change Language**:
   - Look at navbar (top right)
   - Click globe icon with language code
   - Select from: 🇺🇸 🇪🇸 🇫🇷 🇩🇪 🇮🇳 🇵🇹 🇨🇳

2. **Observe Changes**:
   - All UI text updates instantly
   - Emergency questions change to selected language
   - Form labels translate

## 🎨 Testing Dark/Light Mode

1. **Toggle Theme**:
   - Click sun/moon icon in navbar
   - Theme switches immediately
   - Preference is saved

2. **Visual Changes**:
   - Dark: Slate-950 backgrounds, bright text
   - Light: Light backgrounds, dark text
   - Smooth animation transition

## 📱 Testing Responsive Design

1. **Desktop**: Full width layout with all features
2. **Tablet**: Adjusted spacing and layout
3. **Mobile**: Hamburger menu, stacked layout

Try resizing browser window or use developer tools (F12) → Toggle device toolbar

## ✅ Test Checklist

- [ ] Login with different roles
- [ ] Switch between 2-3 languages
- [ ] Toggle dark/light theme
- [ ] Fill out emergency intake form
- [ ] Answer questions in different languages
- [ ] View doctor dashboard with case filtering
- [ ] Check responsive layout on mobile
- [ ] Try voice feature (click speaker icon)
- [ ] Generate and download PDF forms

## 🎓 Feature Testing Guide

### Emergency Intake Form
1. Select user type (Patient/Caregiver/Staff)
2. Choose arrival mode (Walk-in/Ambulance)
3. Select emergency category
4. Enter hospital and ward (NOW USER INPUT!)
5. Fill patient information
6. Click "Continue to Questions"

### Smart Question Flow
- **Multiple Choice**: Click option OR click text icon to type
- **Yes/No**: Click Yes or No button
- **Numeric**: Enter pain level (1-10)
- **Text**: Type detailed response
- **Voice**: Click speaker icon to hear question read aloud

### Doctor Dashboard
- See all emergency cases
- Filter by priority level
- View case details with patient info
- See color-coded priority badges
- Statistics at top

## 📊 Mock Data

Doctor Dashboard includes sample cases:
- 2 Critical cases (Red)
- 1 Urgent case (Amber)
- 1 Normal case (Green)
- Various emergency categories

## 🔍 Key Files to Review

For Hackathon Judges:
- `/src/lib/translations.ts` - 7 languages support
- `/src/lib/emergency-questions-multilang.ts` - Language-specific questions
- `/src/components/SmartQuestionFlow.tsx` - Flexible answer input
- `/src/components/Navbar.tsx` - Theme & language switching
- `/src/app/dashboard/page.tsx` - Doctor dashboard
- `/src/lib/theme-context.tsx` - Theme provider

## 🎯 Unique Features to Highlight

1. **Multi-Language AI Questions**
   - Questions adapt to selected language
   - Real-time language switching
   - 7 complete translations

2. **Flexible Answer Input**
   - Choose between multiple-choice OR type answer
   - For any question type

3. **Beautiful Animations**
   - Smooth transitions
   - Hover effects
   - Progress indicators

4. **Responsive Design**
   - Mobile, tablet, desktop
   - Touch-friendly interface

5. **Doctor Dashboard**
   - Real-time case management
   - Priority-based filtering
   - Statistics overview

## 🆘 Troubleshooting

**Port 3000 in use?**
```bash
npm run dev
# Will use 3001 instead automatically
```

**Build fails?**
```bash
npm install
npm run build
```

**Theme not persisting?**
- Check localStorage: Browser Dev Tools → Application → LocalStorage
- Look for "theme" key

**Language not changing?**
- Check localStorage for "language" key
- Try clearing browser cache

## 📝 Code Quality

```bash
# Lint check
npm run lint

# Build production
npm run build

# Type checking happens automatically
```

## 🎬 Demo Script (2 mins)

1. Show login page (mention role-based access)
2. Quick demo login as Patient
3. Fill emergency intake form
4. Answer 2-3 questions in English
5. Switch to Spanish language mid-flow (show changes!)
6. Answer remaining questions in Spanish
7. Show case summary
8. Switch to Doctor dashboard
9. Show filter functionality
10. Toggle theme and show responsiveness

---

**That's it! You're ready to present!** 🎉

All features are production-ready and mobile-optimized.
