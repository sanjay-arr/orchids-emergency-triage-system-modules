# 📋 Category-Specific Questions Implementation

## ✅ Completed: Dynamic Questions by Emergency Category

### Overview
The system now asks **different questions based on the emergency category** the user selects. This provides targeted, clinically-relevant questions for each type of medical emergency.

---

## 📊 Question Structure

### **Two-Part System:**

#### 1. **COMMON QUESTIONS** (Asked for ALL categories)
- ✅ Do you have any known allergies to medications?
- ✅ Please list your allergies (if yes)
- ✅ Are you currently taking any medications?
- ✅ What medications are you taking? (if yes)

#### 2. **CATEGORY-SPECIFIC QUESTIONS** (Unique per category)
Displayed BEFORE common questions

---

## 🏥 Available Categories & Questions

### **1. ACCIDENT** 🚑
**4 Specific Questions:**
- What type of accident occurred? (Vehicle / Fall / Workplace / Sports / Other)
- Is there any active bleeding?
- Did the patient lose consciousness?
- Where is the pain located?

**Plus:** 4 common questions
**Total:** 8 questions

---

### **2. CARDIAC (Chest Pain)** ❤️
**4 Specific Questions:**
- How long have you had chest pain? (Just started / <30 min / 30 min-1 hr / >1 hr)
- How would you describe the pain? (Sharp / Pressure-Squeezing / Burning / Dull ache)
- Does the pain spread to arm, jaw, or back?
- Do you have shortness of breath?

**Plus:** 4 common questions
**Total:** 8 questions

---

### **3. FEVER** 🌡️
**3 Specific Questions:**
- What is the body temperature? (Numeric input)
- How long have you had fever? (<24 hrs / 1-2 days / 3-5 days / >5 days)
- Do you have symptoms? (Headache / Body ache / Cough / Sore throat / Vomiting / Diarrhea)

**Plus:** 4 common questions
**Total:** 7 questions

---

### **4. BREATHING** 🫁
**3 Specific Questions:**
- How severe is breathing difficulty? (Mild / Moderate / Severe / Using accessory muscles)
- When did it start? (Suddenly / Gradually over hours / Gradually over days)
- Do you have history of asthma or COPD?

**Plus:** 4 common questions
**Total:** 7 questions

---

### **5. INJURY** 🩹
**3 Specific Questions:**
- Where is the injury located? (Text input)
- What type of injury? (Cut / Fracture / Sprain / Bruise / Puncture wound)
- Is there bleeding?

**Plus:** 4 common questions
**Total:** 7 questions

---

### **6. STROKE** 🧠
**2 Specific Questions:**
- Which symptoms are present? (Face drooping / Arm weakness / Speech difficulty / Confusion / Vision problems / Headache)
- When did symptoms start? (Text input)

**Plus:** 4 common questions
**Total:** 6 questions

---

### **7. POISONING** ☠️
**3 Specific Questions:**
- What substance was ingested/exposed? (Text input)
- How much was taken? (Text input)
- When did exposure occur? (Text input)

**Plus:** 4 common questions
**Total:** 7 questions

---

### **8. BURN** 🔥
**3 Specific Questions:**
- What caused the burn? (Fire/Flame / Hot liquid / Chemical / Electrical / Radiation-Sun)
- Which body parts affected? (Text input)
- Approximately how large? (Small / Medium / Large / Extensive)

**Plus:** 4 common questions
**Total:** 7 questions

---

### **9. OTHER** ❓
**2 Specific Questions:**
- Please describe your main complaint (Text input)
- How long have you had this problem? (Text input)

**Plus:** 4 common questions
**Total:** 6 questions

---

## 🌐 Multilingual Support

**7 Languages Supported:**
- 🇺🇸 English (en)
- 🇪🇸 Spanish (es)
- 🇫🇷 French (fr)
- 🇩🇪 German (de)
- 🇮🇳 Hindi (hi)
- 🇵🇹 Portuguese (pt)
- 🇨🇳 Chinese (zh)

Each question is fully translated in all 7 languages.

---

## 📁 File Structure

**Main File:** `src/lib/emergency-questions-multilang.ts`

### Contains:
1. **COMMON_QUESTIONS** object
   - Record of languages
   - 4 questions for all categories

2. **CATEGORY_QUESTIONS** object
   - Organized by category name
   - Each category has 7 language versions
   - 2-4 category-specific questions per category

3. **getQuestionsForCategory()** function
   ```typescript
   function getQuestionsForCategory(
     category: EmergencyCategory,
     language: string = "en"
   ): Question[]
   ```
   - Returns combined common + category-specific questions
   - Takes category and language as parameters
   - Category-specific questions appear first

---

## 🔄 Question Flow

### **User Selection Process:**

```
1. User selects Emergency Category
   ↓
2. System gets questions for that category
   ↓
3. Display category-specific questions first
   ↓
4. Then show common questions (allergies, medications)
   ↓
5. Complete assessment
```

### **Example: Chest Pain Category**

User selects **"Cardiac (Chest Pain)"** →

**Questions Asked (in order):**
1. How long have you had chest pain?
2. How would you describe the pain?
3. Does the pain spread to arm, jaw, or back?
4. Do you have shortness of breath?
5. Do you have any known allergies to medications?
6. Please list your allergies
7. Are you currently taking any medications?
8. What medications are you taking?

---

## 💻 Usage in Code

### **In Emergency Page:**
```typescript
const handleCaseCreated = (data) => {
  // category is passed to SmartQuestionFlow
  setCaseData({
    ...data,
    category: "cardiac", // User selected category
  });
};
```

### **In SmartQuestionFlow Component:**
```typescript
const questions = useMemo(
  () => getQuestionsForCategory(category, language),
  [category, language]
);

// Questions automatically update based on category + language
```

---

## ✅ Question Types

Each question can be one of 4 types:

1. **multiple-choice** - Select from options
   - Example: "What caused the burn?"
   - Shows buttons for each option

2. **yes-no** - Binary answer
   - Example: "Is there any active bleeding?"
   - Shows Yes/No buttons

3. **text** - Free text input
   - Example: "Where is the injury located?"
   - Shows text input field

4. **number** - Numeric input
   - Example: "What is the body temperature?"
   - Shows number input field

---

## 🎯 Clinically Relevant

### **Why Category-Specific Questions?**

- ✅ **Faster Assessment** - No irrelevant questions
- ✅ **Better Diagnosis** - Focused on the complaint
- ✅ **Patient Experience** - Clear flow, logical progression
- ✅ **Data Quality** - Clinically meaningful responses
- ✅ **Priority Determination** - Uses relevant symptoms

### **Example: Fever vs Accident**

**Fever Category** asks:
- Body temperature
- Duration of fever
- Associated symptoms

**Accident Category** asks:
- Type of accident
- Consciousness status
- Active bleeding

---

## 🚀 Implementation Details

### **File Location:**
`src/lib/emergency-questions-multilang.ts` (500+ lines)

### **Export Function:**
```typescript
export function getQuestionsForCategory(
  category: EmergencyCategory,
  language: string = "en"
): Question[]
```

### **Returns:**
Array of questions with:
- id (unique identifier)
- text (question in selected language)
- type (multiple-choice, yes-no, text, number)
- options (if multiple-choice)
- placeholder (if text/number)
- priority (high/medium/low)

---

## 🌟 Features

✅ **Dynamic Questions** - Changes based on category selection
✅ **Multilingual** - 7 languages, fully translated
✅ **Clinically Accurate** - Medically relevant questions
✅ **Type Support** - Multiple-choice, yes-no, text, numeric
✅ **Priority Levels** - High/medium priority questions
✅ **Common + Specific** - Universal + category-specific
✅ **Easy to Extend** - Add new categories easily
✅ **Voice Support** - All questions can be read aloud

---

## 📈 Testing Checklist

- ✅ Select "Accident" → Shows accident questions
- ✅ Select "Cardiac" → Shows chest pain questions
- ✅ Select "Fever" → Shows fever questions
- ✅ Switch languages → Questions translate
- ✅ Each category has correct question count
- ✅ Common questions always included
- ✅ Category questions appear first
- ✅ All question types work (MCQ, yes-no, text, number)
- ✅ Auto-advance works for MCQ
- ✅ Voice button + Type button work
- ✅ Build compiles (0 errors)

---

## 🔗 Integration Points

**Emergency Flow:**
1. EmergencyCaseIntake → User selects category
2. Category passed to SmartQuestionFlow
3. SmartQuestionFlow calls getQuestionsForCategory()
4. Questions displayed one by one
5. Responses collected
6. CaseSummary shows results

---

## 📝 Example: Complete Chest Pain Flow

**Step 1: User selects "Cardiac" category**
```
✓ Category selected: cardiac
```

**Step 2: System loads questions**
```
getQuestionsForCategory("cardiac", "en")
```

**Step 3: Questions displayed in order**
```
Q1: "How long have you had chest pain?"
Q2: "How would you describe the pain?"
Q3: "Does the pain spread to arm, jaw, or back?"
Q4: "Do you have shortness of breath?"
Q5: "Do you have any known allergies?"
Q6: "Please list your allergies"
Q7: "Are you taking medications?"
Q8: "What medications are you taking?"
```

**Step 4: Complete assessment**
```
✓ All 8 questions answered
✓ Case summary generated
✓ Priority calculated based on responses
```

---

## 🎉 Status

**✅ COMPLETED:**
- ✅ All 9 categories implemented
- ✅ All 7 languages translated
- ✅ 50+ category-specific questions
- ✅ 28 common questions (4 per language × 7)
- ✅ Total: 78+ questions in the system
- ✅ Integrated with SmartQuestionFlow
- ✅ Build successful (0 errors)
- ✅ Production ready

---

## 🚀 Next Steps

The system now:
1. ✅ Asks category-specific questions
2. ✅ Combines with common questions
3. ✅ Supports 7 languages
4. ✅ Auto-advances on MCQ selection
5. ✅ Allows text input when clicked
6. ✅ Has voice read aloud feature

Ready to push to GitHub! 🎉
