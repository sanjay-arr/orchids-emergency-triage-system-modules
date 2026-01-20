"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Language } from "@/lib/emergency-types";

interface Translations {
  [key: string]: {
    en: string;
    ta: string;
    hi: string;
  };
}

export const TRANSLATIONS: Translations = {
  welcome: {
    en: "Welcome to MedEmergency",
    ta: "MedEmergency க்கு வரவேற்கிறோம்",
    hi: "MedEmergency में आपका स्वागत है",
  },
  login: {
    en: "Login",
    ta: "உள்நுழை",
    hi: "लॉग इन करें",
  },
  signup: {
    en: "Sign Up",
    ta: "பதிவு செய்",
    hi: "साइन अप करें",
  },
  email: {
    en: "Email",
    ta: "மின்னஞ்சல்",
    hi: "ईमेल",
  },
  password: {
    en: "Password",
    ta: "கடவுச்சொல்",
    hi: "पासवर्ड",
  },
  name: {
    en: "Full Name",
    ta: "முழு பெயர்",
    hi: "पूरा नाम",
  },
  patient: {
    en: "Patient",
    ta: "நோயாளி",
    hi: "रोगी",
  },
  doctor: {
    en: "Doctor",
    ta: "மருத்துவர்",
    hi: "डॉक्टर",
  },
  emergency_intake: {
    en: "Emergency Intake",
    ta: "அவசர பதிவு",
    hi: "आपातकालीन प्रवेश",
  },
  dashboard: {
    en: "Dashboard",
    ta: "கட்டுப்பாட்டு அறை",
    hi: "डैशबोर्ड",
  },
  cases: {
    en: "Cases",
    ta: "வழக்குகள்",
    hi: "मामले",
  },
  yes: {
    en: "Yes",
    ta: "ஆம்",
    hi: "हाँ",
  },
  no: {
    en: "No",
    ta: "இல்லை",
    hi: "नहीं",
  },
  continue: {
    en: "Continue",
    ta: "தொடரவும்",
    hi: "जारी रखें",
  },
  skip: {
    en: "Skip",
    ta: "தவிர்",
    hi: "छोड़ें",
  },
  submit: {
    en: "Submit",
    ta: "சமர்ப்பி",
    hi: "जमा करें",
  },
  cancel: {
    en: "Cancel",
    ta: "ரத்து",
    hi: "रद्द करें",
  },
  save: {
    en: "Save",
    ta: "சேமி",
    hi: "सहेजें",
  },
  question_allergies: {
    en: "Do you have any known allergies to medications?",
    ta: "மருந்துகளுக்கு ஏதாவது ஒவ்வாமை உள்ளதா?",
    hi: "क्या आपको किसी दवाई से एलर्जी है?",
  },
  question_allergy_details: {
    en: "Please list your allergies",
    ta: "உங்கள் ஒவ்வாமைகளை பட்டியலிடுங்கள்",
    hi: "कृपया अपनी एलर्जी बताएं",
  },
  question_current_medications: {
    en: "Are you currently taking any medications?",
    ta: "நீங்கள் தற்போது ஏதேனும் மருந்துகள் எடுத்துக்கொள்கிறீர்களா?",
    hi: "क्या आप वर्तमान में कोई दवा ले रहे हैं?",
  },
  question_medication_details: {
    en: "What medications are you taking?",
    ta: "என்ன மருந்துகள் எடுத்துக்கொள்கிறீர்கள்?",
    hi: "आप कौन सी दवाएं ले रहे हैं?",
  },
  question_bleeding: {
    en: "Is there any active bleeding?",
    ta: "எந்த இரத்தப்போக்கும் உள்ளதா?",
    hi: "क्या कोई सक्रिय रक्तस्राव है?",
  },
  question_consciousness: {
    en: "Did the patient lose consciousness?",
    ta: "நோயாளி சுயநினைவை இழந்தாரா?",
    hi: "क्या रोगी ने होश खोया?",
  },
  question_accident_type: {
    en: "What type of accident occurred?",
    ta: "என்ன வகையான விபத்து நடந்தது?",
    hi: "किस प्रकार की दुर्घटना हुई?",
  },
  question_pain_location: {
    en: "Where is the pain located?",
    ta: "வலி எங்கே உள்ளது?",
    hi: "दर्द कहाँ है?",
  },
  question_chest_pain_duration: {
    en: "How long have you had chest pain?",
    ta: "எவ்வளவு நேரமாக நெஞ்சு வலி உள்ளது?",
    hi: "आपको कब से सीने में दर्द है?",
  },
  question_chest_pain_type: {
    en: "How would you describe the pain?",
    ta: "வலியை எப்படி விவரிப்பீர்கள்?",
    hi: "आप दर्द का वर्णन कैसे करेंगे?",
  },
  question_radiating_pain: {
    en: "Does the pain spread to arm, jaw, or back?",
    ta: "வலி கை, தாடை அல்லது முதுகுக்கு பரவுகிறதா?",
    hi: "क्या दर्द बांह, जबड़े या पीठ में फैलता है?",
  },
  question_shortness_breath: {
    en: "Do you have shortness of breath?",
    ta: "உங்களுக்கு மூச்சுத் திணறல் உள்ளதா?",
    hi: "क्या आपको सांस लेने में तकलीफ है?",
  },
  question_fever_temperature: {
    en: "What is the body temperature (if known)?",
    ta: "உடல் வெப்பநிலை என்ன (தெரிந்தால்)?",
    hi: "शरीर का तापमान क्या है (यदि पता हो)?",
  },
  question_fever_duration: {
    en: "How long have you had fever?",
    ta: "எவ்வளவு நாளாக காய்ச்சல் உள்ளது?",
    hi: "आपको कब से बुखार है?",
  },
  question_fever_symptoms: {
    en: "Do you have any of these symptoms?",
    ta: "இந்த அறிகுறிகளில் ஏதாவது உள்ளதா?",
    hi: "क्या आपको इनमें से कोई लक्षण है?",
  },
  question_breathing_severity: {
    en: "How severe is the breathing difficulty?",
    ta: "மூச்சுத் திணறல் எவ்வளவு தீவிரமானது?",
    hi: "सांस लेने में कितनी कठिनाई है?",
  },
  question_breathing_onset: {
    en: "When did the breathing problem start?",
    ta: "மூச்சு பிரச்சனை எப்போது தொடங்கியது?",
    hi: "सांस की समस्या कब शुरू हुई?",
  },
  question_asthma_history: {
    en: "Do you have a history of asthma or COPD?",
    ta: "ஆஸ்துமா அல்லது COPD வரலாறு உள்ளதா?",
    hi: "क्या आपको अस्थमा या COPD का इतिहास है?",
  },
  question_injury_location: {
    en: "Where is the injury located?",
    ta: "காயம் எங்கே உள்ளது?",
    hi: "चोट कहाँ है?",
  },
  question_injury_type: {
    en: "What type of injury is it?",
    ta: "இது என்ன வகையான காயம்?",
    hi: "यह किस प्रकार की चोट है?",
  },
  question_injury_bleeding: {
    en: "Is there bleeding?",
    ta: "இரத்தப்போக்கு உள்ளதா?",
    hi: "क्या खून बह रहा है?",
  },
  question_stroke_symptoms: {
    en: "Which symptoms are present?",
    ta: "என்ன அறிகுறிகள் உள்ளன?",
    hi: "कौन से लक्षण मौजूद हैं?",
  },
  question_stroke_onset: {
    en: "When did symptoms start?",
    ta: "அறிகுறிகள் எப்போது தொடங்கின?",
    hi: "लक्षण कब शुरू हुए?",
  },
  question_poison_substance: {
    en: "What substance was ingested/exposed?",
    ta: "என்ன பொருள் உட்கொள்ளப்பட்டது/வெளிப்பட்டது?",
    hi: "कौन सा पदार्थ निगला/संपर्क में आया?",
  },
  question_poison_amount: {
    en: "How much was taken (if known)?",
    ta: "எவ்வளவு எடுக்கப்பட்டது (தெரிந்தால்)?",
    hi: "कितना लिया गया (यदि पता हो)?",
  },
  question_poison_time: {
    en: "When did the exposure occur?",
    ta: "வெளிப்பாடு எப்போது ஏற்பட்டது?",
    hi: "संपर्क कब हुआ?",
  },
  question_burn_type: {
    en: "What caused the burn?",
    ta: "தீக்காயத்திற்கு என்ன காரணம்?",
    hi: "जलने का कारण क्या है?",
  },
  question_burn_area: {
    en: "Which body parts are affected?",
    ta: "உடலின் எந்த பகுதிகள் பாதிக்கப்பட்டுள்ளன?",
    hi: "शरीर के कौन से अंग प्रभावित हैं?",
  },
  question_burn_size: {
    en: "Approximately how large is the burn area?",
    ta: "தீக்காயம் எவ்வளவு பெரியது?",
    hi: "जले का क्षेत्र लगभग कितना बड़ा है?",
  },
  question_other_complaint: {
    en: "Please describe your main complaint",
    ta: "உங்கள் முக்கிய பிரச்சனையை விவரிக்கவும்",
    hi: "कृपया अपनी मुख्य शिकायत बताएं",
  },
  question_other_duration: {
    en: "How long have you had this problem?",
    ta: "இந்த பிரச்சனை எவ்வளவு நாளாக உள்ளது?",
    hi: "आपको यह समस्या कब से है?",
  },
  option_vehicle_accident: {
    en: "Vehicle accident",
    ta: "வாகன விபத்து",
    hi: "वाहन दुर्घटना",
  },
  option_fall: {
    en: "Fall",
    ta: "விழுதல்",
    hi: "गिरना",
  },
  option_workplace_injury: {
    en: "Workplace injury",
    ta: "பணியிட காயம்",
    hi: "कार्यस्थल चोट",
  },
  option_sports_injury: {
    en: "Sports injury",
    ta: "விளையாட்டு காயம்",
    hi: "खेल चोट",
  },
  option_other: {
    en: "Other",
    ta: "மற்றவை",
    hi: "अन्य",
  },
  type_your_answer: {
    en: "Type your answer here...",
    ta: "உங்கள் பதிலை இங்கே தட்டச்சு செய்யவும்...",
    hi: "अपना उत्तर यहाँ टाइप करें...",
  },
  speak_or_type: {
    en: "Speak or type your answer",
    ta: "உங்கள் பதிலை பேசவும் அல்லது தட்டச்சு செய்யவும்",
    hi: "बोलें या टाइप करें",
  },
};

const QUESTION_ID_MAP: Record<string, string> = {
  allergies: "question_allergies",
  allergy_details: "question_allergy_details",
  current_medications: "question_current_medications",
  medication_details: "question_medication_details",
  bleeding: "question_bleeding",
  consciousness: "question_consciousness",
  accident_type: "question_accident_type",
  pain_location: "question_pain_location",
  chest_pain_duration: "question_chest_pain_duration",
  chest_pain_type: "question_chest_pain_type",
  radiating_pain: "question_radiating_pain",
  shortness_breath: "question_shortness_breath",
  fever_temperature: "question_fever_temperature",
  fever_duration: "question_fever_duration",
  fever_symptoms: "question_fever_symptoms",
  breathing_severity: "question_breathing_severity",
  breathing_onset: "question_breathing_onset",
  asthma_history: "question_asthma_history",
  injury_location: "question_injury_location",
  injury_type: "question_injury_type",
  injury_bleeding: "question_injury_bleeding",
  stroke_symptoms: "question_stroke_symptoms",
  stroke_onset: "question_stroke_onset",
  poison_substance: "question_poison_substance",
  poison_amount: "question_poison_amount",
  poison_time: "question_poison_time",
  burn_type: "question_burn_type",
  burn_area: "question_burn_area",
  burn_size: "question_burn_size",
  other_complaint: "question_other_complaint",
  other_duration: "question_other_duration",
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  getQuestionText: (questionId: string, fallback: string) => string;
}

const defaultT = (key: string): string => {
  const translation = TRANSLATIONS[key];
  if (translation) {
    return translation.en;
  }
  return key;
};

const defaultGetQuestionText = (questionId: string, fallback: string): string => {
  const translationKey = QUESTION_ID_MAP[questionId];
  if (translationKey && TRANSLATIONS[translationKey]) {
    return TRANSLATIONS[translationKey].en || fallback;
  }
  return fallback;
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: defaultT,
  getQuestionText: defaultGetQuestionText,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    const translation = TRANSLATIONS[key];
    if (translation) {
      return translation[language] || translation.en;
    }
    return key;
  };

  const getQuestionText = (questionId: string, fallback: string): string => {
    const translationKey = QUESTION_ID_MAP[questionId];
    if (translationKey && TRANSLATIONS[translationKey]) {
      return TRANSLATIONS[translationKey][language] || fallback;
    }
    return fallback;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getQuestionText }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  return context;
}
