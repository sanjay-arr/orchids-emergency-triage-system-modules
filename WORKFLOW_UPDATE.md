# Updated Application Workflow

## Navigation Flow

The application now follows this workflow order:

```
START (/) 
  ↓
[1] EMERGENCY INTAKE PAGE (/emergency)
    └─ Patient/Caregiver Information Entry
    └─ Location & Ward Details
    └─ Category & Priority Assessment
    └─ Staff Login button available (top-right)
    ↓
    ├─→ CONTINUE AS PATIENT → Proceed to questions
    └─→ STAFF LOGIN button → Go to Login page
    
[2] LOGIN PAGE (/login)
    └─ Doctor, Nurse, Admin, or Caregiver quick access
    └─ Manual staff login with credentials
    └─ Guest access option
    ↓
    ├─→ Staff Login (Doctor/Nurse/Admin) → Dashboard
    └─→ Other roles → Emergency page
    
[3] EMERGENCY DASHBOARD (/dashboard)
    └─ Case queue and management
    └─ Active cases view
    └─ Critical cases monitoring
    └─ Patient details and notes
    └─ Dashboard link to go back to Emergency page
    ↓
    ├─→ New Case → Back to Emergency page
    └─→ Logout → Back to Emergency intake
    
[4] DETAILS FILLING PAGE (/emergency - questions stage)
    └─ Smart Question Flow (voice-enabled)
    └─ Dynamic questions based on category
    └─ Voice input and transcript
    └─ Interim and final responses
    ↓
    ├─→ Complete → Case Summary
    └─→ Escalate Priority → Updated assessment
    
CASE SUMMARY
    └─ PDF generation
    └─ Case details review
    └─ New case option
```

## Key Changes Made

### 1. **Home Page (`/`) Update**
   - Previously: Displayed landing page with features
   - Now: Redirects to Emergency page for initial entry
   - Maintains authentication checks for logged-in users

### 2. **Emergency Page Entry Flow**
   - First touchpoint for all users
   - Contains "Staff Login" button (top-right corner)
   - Emergency intake form starts immediately
   - Patients can fill details directly
   - Staff can click "Staff Login" to authenticate

### 3. **Login Page Access**
   - Accessible via "Staff Login" button on emergency page
   - Or direct navigation to `/login`
   - Supports quick access roles (Doctor, Nurse, Admin, Caregiver)
   - Manual login for staff credentials

### 4. **Dashboard Access**
   - Only for authenticated staff (Doctor, Nurse, Admin)
   - Shows case queue and management
   - Link back to emergency page available
   - Logout returns to emergency intake

### 5. **Question Flow**
   - Occurs after initial intake is complete
   - Voice-powered smart question system
   - Multilingual support
   - Priority escalation capability

## User Journey Examples

### Patient/Caregiver Path
```
Emergency Intake → Fill Details → Answer Questions → Case Summary → PDF
```

### Staff Member Path
```
Emergency Intake → Staff Login → Dashboard → Manage Cases → New Case → Repeat
```

### Mixed Path (Staff filling patient info)
```
Emergency Intake (Hospital Staff) → Answer Questions → Dashboard View
```

## Route Structure

```
/ (Home - Redirects to /emergency)
├── /emergency (Intake & Questions)
├── /login (Staff Authentication)
├── /dashboard (Staff Management)
└── /dashboard/[caseId] (Case Details - if applicable)
```

## Session Management

- User session stored in `localStorage` as `emergency_user`
- Contains: `role`, `name`, `id`
- Persists across page navigations
- Cleared on logout

## State Persistence

- Emergency cases stored in `localStorage` as `emergency_cases`
- Contains all case data, responses, and metadata
- Synced with dashboard when staff view cases

---

**Updated:** January 20, 2026
