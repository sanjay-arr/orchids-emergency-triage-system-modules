import { Question } from "@/components/SmartQuestionFlow";
import { EmergencyCategory } from "./emergency-types";

// COMMON QUESTIONS (Asked for all categories)
export const COMMON_QUESTIONS: Record<string, Question[]> = {
  en: [
    {
      id: "allergies",
      text: "Do you have any known allergies to medications?",
      type: "yes-no",
      priority: "high",
    },
    {
      id: "allergies_detail",
      text: "Please list your allergies",
      type: "text",
      placeholder: "e.g., Penicillin, Aspirin, Latex...",
      priority: "high",
    },
    {
      id: "medications",
      text: "Are you currently taking any medications?",
      type: "yes-no",
      priority: "medium",
    },
    {
      id: "medications_detail",
      text: "What medications are you taking?",
      type: "text",
      placeholder: "List all current medications...",
      priority: "medium",
    },
  ],
  es: [
    {
      id: "allergies",
      text: "¿Tiene alguna alergia conocida a medicamentos?",
      type: "yes-no",
      priority: "high",
    },
    {
      id: "allergies_detail",
      text: "Por favor, indique sus alergias",
      type: "text",
      placeholder: "p. ej., Penicilina, Aspirina, Látex...",
      priority: "high",
    },
    {
      id: "medications",
      text: "¿Está tomando actualmente algún medicamento?",
      type: "yes-no",
      priority: "medium",
    },
    {
      id: "medications_detail",
      text: "¿Qué medicamentos está tomando?",
      type: "text",
      placeholder: "Enumere todos los medicamentos actuales...",
      priority: "medium",
    },
  ],
  fr: [
    {
      id: "allergies",
      text: "Avez-vous des allergies connues aux médicaments?",
      type: "yes-no",
      priority: "high",
    },
    {
      id: "allergies_detail",
      text: "Veuillez énumérer vos allergies",
      type: "text",
      placeholder: "p. ex., Pénicilline, Aspirine, Latex...",
      priority: "high",
    },
    {
      id: "medications",
      text: "Prenez-vous actuellement des médicaments?",
      type: "yes-no",
      priority: "medium",
    },
    {
      id: "medications_detail",
      text: "Quels médicaments prenez-vous?",
      type: "text",
      placeholder: "Énumérez tous les médicaments actuels...",
      priority: "medium",
    },
  ],
  de: [
    {
      id: "allergies",
      text: "Haben Sie bekannte Allergien gegen Medikamente?",
      type: "yes-no",
      priority: "high",
    },
    {
      id: "allergies_detail",
      text: "Bitte geben Sie Ihre Allergien an",
      type: "text",
      placeholder: "z. B. Penicillin, Aspirin, Latex...",
      priority: "high",
    },
    {
      id: "medications",
      text: "Nehmen Sie derzeit Medikamente?",
      type: "yes-no",
      priority: "medium",
    },
    {
      id: "medications_detail",
      text: "Welche Medikamente nehmen Sie?",
      type: "text",
      placeholder: "Alle aktuellen Medikamente aufzählen...",
      priority: "medium",
    },
  ],
  hi: [
    {
      id: "allergies",
      text: "क्या आको दवाओं से कोई ज्ञात एलर्जी है?",
      type: "yes-no",
      priority: "high",
    },
    {
      id: "allergies_detail",
      text: "कृपया अपनी एलर्जी की सूची दें",
      type: "text",
      placeholder: "उदा., पेनिसिलिन, एस्पिरिन, लेटेक्स...",
      priority: "high",
    },
    {
      id: "medications",
      text: "क्या आप वर्तमान में कोई दवा ले रहे हैं?",
      type: "yes-no",
      priority: "medium",
    },
    {
      id: "medications_detail",
      text: "आप कौन सी दवाएं ले रहे हैं?",
      type: "text",
      placeholder: "सभी वर्तमान दवाओं की सूची दें...",
      priority: "medium",
    },
  ],
  pt: [
    {
      id: "allergies",
      text: "Você tem alguma alergia conhecida a medicamentos?",
      type: "yes-no",
      priority: "high",
    },
    {
      id: "allergies_detail",
      text: "Por favor, liste suas alergias",
      type: "text",
      placeholder: "p. ex., Penicilina, Aspirina, Látex...",
      priority: "high",
    },
    {
      id: "medications",
      text: "Você está tomando algum medicamento atualmente?",
      type: "yes-no",
      priority: "medium",
    },
    {
      id: "medications_detail",
      text: "Quais medicamentos você está tomando?",
      type: "text",
      placeholder: "Liste todos os medicamentos atuais...",
      priority: "medium",
    },
  ],
  zh: [
    {
      id: "allergies",
      text: "您对药物有任何已知过敏吗？",
      type: "yes-no",
      priority: "high",
    },
    {
      id: "allergies_detail",
      text: "请列出您的过敏症",
      type: "text",
      placeholder: "例如：青霉素、阿司匹林、乳胶...",
      priority: "high",
    },
    {
      id: "medications",
      text: "您目前正在服用任何药物吗？",
      type: "yes-no",
      priority: "medium",
    },
    {
      id: "medications_detail",
      text: "您正在服用哪些药物？",
      type: "text",
      placeholder: "列出所有当前药物...",
      priority: "medium",
    },
  ],
};

// CATEGORY-SPECIFIC QUESTIONS
export const CATEGORY_QUESTIONS: Record<EmergencyCategory, Record<string, Question[]>> = {
  // ACCIDENT CATEGORY
  accident: {
    en: [
      {
        id: "accident_type",
        text: "What type of accident occurred?",
        type: "multiple-choice",
        options: ["Vehicle accident", "Fall", "Workplace injury", "Sports injury", "Other"],
        priority: "high",
      },
      {
        id: "bleeding",
        text: "Is there any active bleeding?",
        type: "yes-no",
        priority: "high",
      },
      {
        id: "consciousness",
        text: "Did the patient lose consciousness?",
        type: "yes-no",
        priority: "high",
      },
      {
        id: "pain_location",
        text: "Where is the pain located?",
        type: "text",
        placeholder: "Describe the location of pain...",
        priority: "high",
      },
    ],
    es: [
      {
        id: "accident_type",
        text: "¿Qué tipo de accidente ocurrió?",
        type: "multiple-choice",
        options: ["Accidente vehicular", "Caída", "Lesión laboral", "Lesión deportiva", "Otro"],
        priority: "high",
      },
      {
        id: "bleeding",
        text: "¿Hay sangrado activo?",
        type: "yes-no",
        priority: "high",
      },
      {
        id: "consciousness",
        text: "¿Perdió el paciente la conciencia?",
        type: "yes-no",
        priority: "high",
      },
      {
        id: "pain_location",
        text: "¿Dónde se localiza el dolor?",
        type: "text",
        placeholder: "Describa la ubicación del dolor...",
        priority: "high",
      },
    ],
    fr: [
      {
        id: "accident_type",
        text: "Quel type d'accident s'est produit?",
        type: "multiple-choice",
        options: ["Accident automobile", "Chute", "Blessure au travail", "Blessure sportive", "Autre"],
        priority: "high",
      },
      {
        id: "bleeding",
        text: "Y a-t-il un saignement actif?",
        type: "yes-no",
        priority: "high",
      },
      {
        id: "consciousness",
        text: "Le patient a-t-il perdu connaissance?",
        type: "yes-no",
        priority: "high",
      },
      {
        id: "pain_location",
        text: "Où se localise la douleur?",
        type: "text",
        placeholder: "Décrivez l'emplacement de la douleur...",
        priority: "high",
      },
    ],
    de: [
      {
        id: "accident_type",
        text: "Was für ein Unfall ist passiert?",
        type: "multiple-choice",
        options: ["Autounfall", "Sturz", "Arbeitsunfall", "Sportverletzung", "Sonstiges"],
        priority: "high",
      },
      {
        id: "bleeding",
        text: "Gibt es aktive Blutungen?",
        type: "yes-no",
        priority: "high",
      },
      {
        id: "consciousness",
        text: "Hat der Patient das Bewusstsein verloren?",
        type: "yes-no",
        priority: "high",
      },
      {
        id: "pain_location",
        text: "Wo befindet sich der Schmerz?",
        type: "text",
        placeholder: "Beschreiben Sie den Schmerzort...",
        priority: "high",
      },
    ],
    hi: [
      {
        id: "accident_type",
        text: "किस प्रकार का दुर्घटना हुई?",
        type: "multiple-choice",
        options: ["वाहन दुर्घटना", "गिरना", "कार्यस्थल पर चोट", "खेल चोट", "अन्य"],
        priority: "high",
      },
      {
        id: "bleeding",
        text: "क्या कोई सक्रिय रक्तस्राव है?",
        type: "yes-no",
        priority: "high",
      },
      {
        id: "consciousness",
        text: "क्या रोगी को होश खो गया?",
        type: "yes-no",
        priority: "high",
      },
      {
        id: "pain_location",
        text: "दर्द कहाँ स्थित है?",
        type: "text",
        placeholder: "दर्द के स्थान का वर्णन करें...",
        priority: "high",
      },
    ],
    pt: [
      {
        id: "accident_type",
        text: "Que tipo de acidente ocorreu?",
        type: "multiple-choice",
        options: ["Acidente veicular", "Queda", "Lesão no trabalho", "Lesão esportiva", "Outro"],
        priority: "high",
      },
      {
        id: "bleeding",
        text: "Há sangramento ativo?",
        type: "yes-no",
        priority: "high",
      },
      {
        id: "consciousness",
        text: "O paciente perdeu a consciência?",
        type: "yes-no",
        priority: "high",
      },
      {
        id: "pain_location",
        text: "Onde está localizado o incômodo?",
        type: "text",
        placeholder: "Descreva a localização da dor...",
        priority: "high",
      },
    ],
    zh: [
      {
        id: "accident_type",
        text: "发生了什么类型的事故？",
        type: "multiple-choice",
        options: ["车祸", "跌倒", "工作伤害", "运动损伤", "其他"],
        priority: "high",
      },
      {
        id: "bleeding",
        text: "是否有活跃出血？",
        type: "yes-no",
        priority: "high",
      },
      {
        id: "consciousness",
        text: "患者是否失去了意识？",
        type: "yes-no",
        priority: "high",
      },
      {
        id: "pain_location",
        text: "疼痛位置在哪里？",
        type: "text",
        placeholder: "描述疼痛位置...",
        priority: "high",
      },
    ],
  },

  // CHEST PAIN CATEGORY
  cardiac: {
    en: [
      {
        id: "chest_pain_duration",
        text: "How long have you had chest pain?",
        type: "multiple-choice",
        options: ["Just started", "Less than 30 minutes", "30 min to 1 hour", "More than 1 hour"],
        priority: "high",
      },
      {
        id: "chest_pain_type",
        text: "How would you describe the pain?",
        type: "multiple-choice",
        options: ["Sharp", "Pressure/Squeezing", "Burning", "Dull ache"],
        priority: "high",
      },
      {
        id: "pain_spread",
        text: "Does the pain spread to arm, jaw, or back?",
        type: "yes-no",
        priority: "high",
      },
      {
        id: "shortness_breath",
        text: "Do you have shortness of breath?",
        type: "yes-no",
        priority: "high",
      },
    ],
    es: [
      {
        id: "chest_pain_duration",
        text: "¿Cuánto tiempo ha tenido dolor en el pecho?",
        type: "multiple-choice",
        options: ["Acaba de empezar", "Menos de 30 minutos", "30 min a 1 hora", "Más de 1 hora"],
        priority: "high",
      },
      {
        id: "chest_pain_type",
        text: "¿Cómo describiría el dolor?",
        type: "multiple-choice",
        options: ["Agudo", "Presión/Compresión", "Ardor", "Dolor sordo"],
        priority: "high",
      },
      {
        id: "pain_spread",
        text: "¿El dolor se extiende al brazo, mandíbula o espalda?",
        type: "yes-no",
        priority: "high",
      },
      {
        id: "shortness_breath",
        text: "¿Tiene falta de aire?",
        type: "yes-no",
        priority: "high",
      },
    ],
    fr: [
      {
        id: "chest_pain_duration",
        text: "Depuis combien de temps avez-vous une douleur thoracique?",
        type: "multiple-choice",
        options: ["Vient de commencer", "Moins de 30 minutes", "30 min à 1 heure", "Plus d'1 heure"],
        priority: "high",
      },
      {
        id: "chest_pain_type",
        text: "Comment décririez-vous la douleur?",
        type: "multiple-choice",
        options: ["Aiguë", "Pression/Serrement", "Brûlure", "Douleur sourde"],
        priority: "high",
      },
      {
        id: "pain_spread",
        text: "La douleur s'étend-elle au bras, à la mâchoire ou au dos?",
        type: "yes-no",
        priority: "high",
      },
      {
        id: "shortness_breath",
        text: "Avez-vous un essoufflement?",
        type: "yes-no",
        priority: "high",
      },
    ],
    de: [
      {
        id: "chest_pain_duration",
        text: "Wie lange haben Sie Brustschmerzen?",
        type: "multiple-choice",
        options: ["Gerade eben", "Weniger als 30 Minuten", "30 min bis 1 Stunde", "Mehr als 1 Stunde"],
        priority: "high",
      },
      {
        id: "chest_pain_type",
        text: "Wie würden Sie den Schmerz beschreiben?",
        type: "multiple-choice",
        options: ["Scharf", "Druck/Quetschen", "Brennen", "Dumpfer Schmerz"],
        priority: "high",
      },
      {
        id: "pain_spread",
        text: "Strahlt der Schmerz in Arm, Kiefer oder Rücken aus?",
        type: "yes-no",
        priority: "high",
      },
      {
        id: "shortness_breath",
        text: "Haben Sie Atemnot?",
        type: "yes-no",
        priority: "high",
      },
    ],
    hi: [
      {
        id: "chest_pain_duration",
        text: "आपको कितने समय से सीने में दर्द है?",
        type: "multiple-choice",
        options: ["अभी शुरू हुआ", "30 मिनट से कम", "30 मिनट से 1 घंटा", "1 घंटे से अधिक"],
        priority: "high",
      },
      {
        id: "chest_pain_type",
        text: "आप दर्द को कैसे बताएंगे?",
        type: "multiple-choice",
        options: ["तीव्र", "दबाव/निचोड़", "जलन", "सुस्त दर्द"],
        priority: "high",
      },
      {
        id: "pain_spread",
        text: "क्या दर्द बाहु, जबड़े या पीठ तक फैलता है?",
        type: "yes-no",
        priority: "high",
      },
      {
        id: "shortness_breath",
        text: "क्या आपको सांस लेने में कठिनाई है?",
        type: "yes-no",
        priority: "high",
      },
    ],
    pt: [
      {
        id: "chest_pain_duration",
        text: "Há quanto tempo você tem dor no peito?",
        type: "multiple-choice",
        options: ["Acabou de começar", "Menos de 30 minutos", "30 min a 1 hora", "Mais de 1 hora"],
        priority: "high",
      },
      {
        id: "chest_pain_type",
        text: "Como você descreveria a dor?",
        type: "multiple-choice",
        options: ["Aguda", "Pressão/Aperto", "Queimação", "Dor maçante"],
        priority: "high",
      },
      {
        id: "pain_spread",
        text: "A dor se estende para o braço, mandíbula ou costas?",
        type: "yes-no",
        priority: "high",
      },
      {
        id: "shortness_breath",
        text: "Você tem falta de ar?",
        type: "yes-no",
        priority: "high",
      },
    ],
    zh: [
      {
        id: "chest_pain_duration",
        text: "您有多长时间的胸痛？",
        type: "multiple-choice",
        options: ["刚刚开始", "少于30分钟", "30分钟至1小时", "超过1小时"],
        priority: "high",
      },
      {
        id: "chest_pain_type",
        text: "你会如何描述这种疼痛？",
        type: "multiple-choice",
        options: ["尖锐", "压力/挤压", "灼烧", "钝痛"],
        priority: "high",
      },
      {
        id: "pain_spread",
        text: "疼痛是否延伸到手臂、下颌或背部？",
        type: "yes-no",
        priority: "high",
      },
      {
        id: "shortness_breath",
        text: "您是否气短？",
        type: "yes-no",
        priority: "high",
      },
    ],
  },

  // FEVER CATEGORY
  fever: {
    en: [
      {
        id: "temperature",
        text: "What is the body temperature (if known)?",
        type: "number",
        placeholder: "Temperature in °F or °C",
        priority: "high",
      },
      {
        id: "fever_duration",
        text: "How long have you had fever?",
        type: "multiple-choice",
        options: ["Less than 24 hours", "1-2 days", "3-5 days", "More than 5 days"],
        priority: "high",
      },
      {
        id: "fever_symptoms",
        text: "Do you have any of these symptoms?",
        type: "multiple-choice",
        options: ["Headache", "Body ache", "Cough", "Sore throat", "Vomiting", "Diarrhea"],
        priority: "high",
      },
    ],
    es: [
      {
        id: "temperature",
        text: "¿Cuál es la temperatura corporal (si se conoce)?",
        type: "number",
        placeholder: "Temperatura en °F o °C",
        priority: "high",
      },
      {
        id: "fever_duration",
        text: "¿Cuánto tiempo ha tenido fiebre?",
        type: "multiple-choice",
        options: ["Menos de 24 horas", "1-2 días", "3-5 días", "Más de 5 días"],
        priority: "high",
      },
      {
        id: "fever_symptoms",
        text: "¿Tiene alguno de estos síntomas?",
        type: "multiple-choice",
        options: ["Dolor de cabeza", "Dolor corporal", "Tos", "Dolor de garganta", "Vómito", "Diarrea"],
        priority: "high",
      },
    ],
    fr: [
      {
        id: "temperature",
        text: "Quelle est la température corporelle (si connue)?",
        type: "number",
        placeholder: "Température en °F ou °C",
        priority: "high",
      },
      {
        id: "fever_duration",
        text: "Depuis combien de temps avez-vous de la fièvre?",
        type: "multiple-choice",
        options: ["Moins de 24 heures", "1-2 jours", "3-5 jours", "Plus de 5 jours"],
        priority: "high",
      },
      {
        id: "fever_symptoms",
        text: "Avez-vous l'un de ces symptômes?",
        type: "multiple-choice",
        options: ["Mal de tête", "Douleur corporelle", "Toux", "Mal de gorge", "Vomissement", "Diarrhée"],
        priority: "high",
      },
    ],
    de: [
      {
        id: "temperature",
        text: "Wie hoch ist die Körpertemperatur (falls bekannt)?",
        type: "number",
        placeholder: "Temperatur in °F oder °C",
        priority: "high",
      },
      {
        id: "fever_duration",
        text: "Wie lange haben Sie Fieber?",
        type: "multiple-choice",
        options: ["Weniger als 24 Stunden", "1-2 Tage", "3-5 Tage", "Mehr als 5 Tage"],
        priority: "high",
      },
      {
        id: "fever_symptoms",
        text: "Haben Sie eines dieser Symptome?",
        type: "multiple-choice",
        options: ["Kopfschmerzen", "Gliederschmerzen", "Husten", "Halsweh", "Erbrechen", "Durchfall"],
        priority: "high",
      },
    ],
    hi: [
      {
        id: "temperature",
        text: "शरीर का तापमान क्या है (यदि ज्ञात हो)?",
        type: "number",
        placeholder: "तापमान °F या °C में",
        priority: "high",
      },
      {
        id: "fever_duration",
        text: "आपको कितने समय से बुखार है?",
        type: "multiple-choice",
        options: ["24 घंटे से कम", "1-2 दिन", "3-5 दिन", "5 दिन से अधिक"],
        priority: "high",
      },
      {
        id: "fever_symptoms",
        text: "क्या आपको इनमें से कोई लक्षण है?",
        type: "multiple-choice",
        options: ["सिरदर्द", "शरीर में दर्द", "खांसी", "गले में खराश", "उल्टी", "दस्त"],
        priority: "high",
      },
    ],
    pt: [
      {
        id: "temperature",
        text: "Qual é a temperatura corporal (se conhecida)?",
        type: "number",
        placeholder: "Temperatura em °F ou °C",
        priority: "high",
      },
      {
        id: "fever_duration",
        text: "Há quanto tempo você tem febre?",
        type: "multiple-choice",
        options: ["Menos de 24 horas", "1-2 dias", "3-5 dias", "Mais de 5 dias"],
        priority: "high",
      },
      {
        id: "fever_symptoms",
        text: "Você tem algum desses sintomas?",
        type: "multiple-choice",
        options: ["Dor de cabeça", "Dores corporais", "Tosse", "Dor de garganta", "Vômito", "Diarreia"],
        priority: "high",
      },
    ],
    zh: [
      {
        id: "temperature",
        text: "体温是多少（如果已知）？",
        type: "number",
        placeholder: "温度，单位为°F或°C",
        priority: "high",
      },
      {
        id: "fever_duration",
        text: "您发烧多长时间了？",
        type: "multiple-choice",
        options: ["少于24小时", "1-2天", "3-5天", "5天以上"],
        priority: "high",
      },
      {
        id: "fever_symptoms",
        text: "您有这些症状中的任何一个吗？",
        type: "multiple-choice",
        options: ["头痛", "身体疼痛", "咳嗽", "喉咙痛", "呕吐", "腹泻"],
        priority: "high",
      },
    ],
  },

  // BREATHING CATEGORY
  breathing: {
    en: [
      {
        id: "breathing_severity",
        text: "How severe is the breathing difficulty?",
        type: "multiple-choice",
        options: ["Mild", "Moderate", "Severe", "Using accessory muscles"],
        priority: "high",
      },
      {
        id: "breathing_onset",
        text: "When did the breathing problem start?",
        type: "multiple-choice",
        options: ["Suddenly", "Gradually over hours", "Gradually over days"],
        priority: "high",
      },
      {
        id: "asthma_copd",
        text: "Do you have a history of asthma or COPD?",
        type: "yes-no",
        priority: "high",
      },
    ],
    es: [
      {
        id: "breathing_severity",
        text: "¿Qué tan grave es la dificultad respiratoria?",
        type: "multiple-choice",
        options: ["Leve", "Moderada", "Grave", "Usando músculos accesorios"],
        priority: "high",
      },
      {
        id: "breathing_onset",
        text: "¿Cuándo comenzó el problema respiratorio?",
        type: "multiple-choice",
        options: ["De repente", "Gradualmente durante horas", "Gradualmente durante días"],
        priority: "high",
      },
      {
        id: "asthma_copd",
        text: "¿Tiene antecedentes de asma o EPOC?",
        type: "yes-no",
        priority: "high",
      },
    ],
    fr: [
      {
        id: "breathing_severity",
        text: "Quelle est la gravité de la difficulté respiratoire?",
        type: "multiple-choice",
        options: ["Légère", "Modérée", "Grave", "Utilisant les muscles accessoires"],
        priority: "high",
      },
      {
        id: "breathing_onset",
        text: "Quand le problème respiratoire a-t-il commencé?",
        type: "multiple-choice",
        options: ["Soudainement", "Progressivement sur des heures", "Progressivement sur des jours"],
        priority: "high",
      },
      {
        id: "asthma_copd",
        text: "Avez-vous des antécédents d'asthme ou de MPOC?",
        type: "yes-no",
        priority: "high",
      },
    ],
    de: [
      {
        id: "breathing_severity",
        text: "Wie schwerwiegend ist die Atembesch werden?",
        type: "multiple-choice",
        options: ["Mild", "Moderat", "Schwer", "Mit Hilfsmuskeln"],
        priority: "high",
      },
      {
        id: "breathing_onset",
        text: "Wann hat das Atemwegsproblem begonnen?",
        type: "multiple-choice",
        options: ["Plötzlich", "Allmählich über Stunden", "Allmählich über Tage"],
        priority: "high",
      },
      {
        id: "asthma_copd",
        text: "Haben Sie eine Vorgeschichte von Asthma oder COPD?",
        type: "yes-no",
        priority: "high",
      },
    ],
    hi: [
      {
        id: "breathing_severity",
        text: "सांस लेने में कठिनाई कितनी गंभीर है?",
        type: "multiple-choice",
        options: ["हल्का", "मध्यम", "गंभीर", "सहायक मांसपेशियों का उपयोग"],
        priority: "high",
      },
      {
        id: "breathing_onset",
        text: "सांस लेने की समस्या कब शुरू हुई?",
        type: "multiple-choice",
        options: ["अचानक", "घंटों में क्रमिक", "दिनों में क्रमिक"],
        priority: "high",
      },
      {
        id: "asthma_copd",
        text: "क्या आपको अस्थमा या COPD का इतिहास है?",
        type: "yes-no",
        priority: "high",
      },
    ],
    pt: [
      {
        id: "breathing_severity",
        text: "Quão grave é a dificuldade respiratória?",
        type: "multiple-choice",
        options: ["Leve", "Moderada", "Grave", "Usando músculos acessórios"],
        priority: "high",
      },
      {
        id: "breathing_onset",
        text: "Quando começou o problema respiratório?",
        type: "multiple-choice",
        options: ["Subitamente", "Gradualmente durante horas", "Gradualmente durante dias"],
        priority: "high",
      },
      {
        id: "asthma_copd",
        text: "Você tem histórico de asma ou DPOC?",
        type: "yes-no",
        priority: "high",
      },
    ],
    zh: [
      {
        id: "breathing_severity",
        text: "呼吸困难有多严重？",
        type: "multiple-choice",
        options: ["轻微", "中等", "严重", "使用辅助肌肉"],
        priority: "high",
      },
      {
        id: "breathing_onset",
        text: "呼吸问题何时开始？",
        type: "multiple-choice",
        options: ["突然", "在数小时内逐渐", "在数天内逐渐"],
        priority: "high",
      },
      {
        id: "asthma_copd",
        text: "您是否有哮喘或COPD病史？",
        type: "yes-no",
        priority: "high",
      },
    ],
  },

  // INJURY CATEGORY
  injury: {
    en: [
      {
        id: "injury_location",
        text: "Where is the injury located?",
        type: "text",
        placeholder: "Describe the body part injured...",
        priority: "high",
      },
      {
        id: "injury_type",
        text: "What type of injury is it?",
        type: "multiple-choice",
        options: ["Cut", "Fracture", "Sprain", "Bruise", "Puncture wound"],
        priority: "high",
      },
      {
        id: "injury_bleeding",
        text: "Is there bleeding?",
        type: "yes-no",
        priority: "high",
      },
    ],
    es: [
      {
        id: "injury_location",
        text: "¿Dónde se localiza la lesión?",
        type: "text",
        placeholder: "Describe la parte del cuerpo lesionada...",
        priority: "high",
      },
      {
        id: "injury_type",
        text: "¿Qué tipo de lesión es?",
        type: "multiple-choice",
        options: ["Corte", "Fractura", "Esguince", "Hematoma", "Herida punzante"],
        priority: "high",
      },
      {
        id: "injury_bleeding",
        text: "¿Hay sangrado?",
        type: "yes-no",
        priority: "high",
      },
    ],
    fr: [
      {
        id: "injury_location",
        text: "Où se localise la blessure?",
        type: "text",
        placeholder: "Décrivez la partie du corps blessée...",
        priority: "high",
      },
      {
        id: "injury_type",
        text: "Quel type de blessure est-ce?",
        type: "multiple-choice",
        options: ["Coupure", "Fracture", "Entorse", "Contusion", "Blessure par perforation"],
        priority: "high",
      },
      {
        id: "injury_bleeding",
        text: "Y a-t-il un saignement?",
        type: "yes-no",
        priority: "high",
      },
    ],
    de: [
      {
        id: "injury_location",
        text: "Wo befindet sich die Verletzung?",
        type: "text",
        placeholder: "Beschreiben Sie das verletzte Körperteil...",
        priority: "high",
      },
      {
        id: "injury_type",
        text: "Was für eine Verletzung ist es?",
        type: "multiple-choice",
        options: ["Schnitt", "Bruch", "Verstauchung", "Prellung", "Stichwunde"],
        priority: "high",
      },
      {
        id: "injury_bleeding",
        text: "Gibt es Blutungen?",
        type: "yes-no",
        priority: "high",
      },
    ],
    hi: [
      {
        id: "injury_location",
        text: "चोट कहाँ स्थित है?",
        type: "text",
        placeholder: "घायल शरीर के हिस्से का वर्णन करें...",
        priority: "high",
      },
      {
        id: "injury_type",
        text: "यह किस प्रकार की चोट है?",
        type: "multiple-choice",
        options: ["कट", "फ्रैक्चर", "मोच", "चोट", "पंचर घाव"],
        priority: "high",
      },
      {
        id: "injury_bleeding",
        text: "क्या रक्तस्राव है?",
        type: "yes-no",
        priority: "high",
      },
    ],
    pt: [
      {
        id: "injury_location",
        text: "Onde está localizada a ferida?",
        type: "text",
        placeholder: "Descreva a parte do corpo ferida...",
        priority: "high",
      },
      {
        id: "injury_type",
        text: "Que tipo de ferida é?",
        type: "multiple-choice",
        options: ["Corte", "Fratura", "Entorse", "Hematoma", "Ferida de perfuração"],
        priority: "high",
      },
      {
        id: "injury_bleeding",
        text: "Há sangramento?",
        type: "yes-no",
        priority: "high",
      },
    ],
    zh: [
      {
        id: "injury_location",
        text: "伤口位置在哪里？",
        type: "text",
        placeholder: "描述受伤的身体部位...",
        priority: "high",
      },
      {
        id: "injury_type",
        text: "什么类型的伤？",
        type: "multiple-choice",
        options: ["切割", "骨折", "扭伤", "瘀伤", "穿刺伤"],
        priority: "high",
      },
      {
        id: "injury_bleeding",
        text: "有出血吗？",
        type: "yes-no",
        priority: "high",
      },
    ],
  },

  // STROKE CATEGORY
  stroke: {
    en: [
      {
        id: "stroke_symptoms",
        text: "Which symptoms are present?",
        type: "multiple-choice",
        options: ["Face drooping", "Arm weakness", "Speech difficulty", "Sudden confusion", "Vision problems", "Severe headache"],
        priority: "high",
      },
      {
        id: "stroke_onset",
        text: "When did symptoms start?",
        type: "text",
        placeholder: "Time of symptom onset...",
        priority: "high",
      },
    ],
    es: [
      {
        id: "stroke_symptoms",
        text: "¿Cuáles síntomas están presentes?",
        type: "multiple-choice",
        options: ["Caída facial", "Debilidad del brazo", "Dificultad del habla", "Confusión repentina", "Problemas de visión", "Dolor de cabeza severo"],
        priority: "high",
      },
      {
        id: "stroke_onset",
        text: "¿Cuándo comenzaron los síntomas?",
        type: "text",
        placeholder: "Hora de inicio del síntoma...",
        priority: "high",
      },
    ],
    fr: [
      {
        id: "stroke_symptoms",
        text: "Quels symptômes sont présents?",
        type: "multiple-choice",
        options: ["Affaissement du visage", "Faiblesse du bras", "Difficulté à parler", "Confusion soudaine", "Problèmes de vision", "Mal de tête sévère"],
        priority: "high",
      },
      {
        id: "stroke_onset",
        text: "Quand les symptômes ont-ils commencé?",
        type: "text",
        placeholder: "Heure du début du symptôme...",
        priority: "high",
      },
    ],
    de: [
      {
        id: "stroke_symptoms",
        text: "Welche Symptome sind vorhanden?",
        type: "multiple-choice",
        options: ["Gesichtshängung", "Armsschwäche", "Sprachschwierigkeiten", "Plötzliche Verwirrtheit", "Sehstörungen", "Starke Kopfschmerzen"],
        priority: "high",
      },
      {
        id: "stroke_onset",
        text: "Wann begannen die Symptome?",
        type: "text",
        placeholder: "Zeitpunkt des Symptombeginns...",
        priority: "high",
      },
    ],
    hi: [
      {
        id: "stroke_symptoms",
        text: "कौन से लक्षण मौजूद हैं?",
        type: "multiple-choice",
        options: ["चेहरे का गिरना", "बाहु की कमजोरी", "बोलने में कठिनाई", "अचानक भ्रम", "दृष्टि की समस्या", "गंभीर सिरदर्द"],
        priority: "high",
      },
      {
        id: "stroke_onset",
        text: "लक्षण कब शुरू हुए?",
        type: "text",
        placeholder: "लक्षण शुरुआत का समय...",
        priority: "high",
      },
    ],
    pt: [
      {
        id: "stroke_symptoms",
        text: "Quais sintomas estão presentes?",
        type: "multiple-choice",
        options: ["Queda facial", "Fraqueza no braço", "Dificuldade de fala", "Confusão súbita", "Problemas de visão", "Dor de cabeça severa"],
        priority: "high",
      },
      {
        id: "stroke_onset",
        text: "Quando os sintomas começaram?",
        type: "text",
        placeholder: "Hora do início do sintoma...",
        priority: "high",
      },
    ],
    zh: [
      {
        id: "stroke_symptoms",
        text: "存在哪些症状？",
        type: "multiple-choice",
        options: ["面部下垂", "手臂无力", "言语困难", "突然困惑", "视力问题", "剧烈头痛"],
        priority: "high",
      },
      {
        id: "stroke_onset",
        text: "症状何时开始？",
        type: "text",
        placeholder: "症状开始时间...",
        priority: "high",
      },
    ],
  },

  // POISONING CATEGORY
  poisoning: {
    en: [
      {
        id: "poison_substance",
        text: "What substance was ingested/exposed?",
        type: "text",
        placeholder: "Name of substance...",
        priority: "high",
      },
      {
        id: "poison_amount",
        text: "How much was taken (if known)?",
        type: "text",
        placeholder: "Amount taken...",
        priority: "high",
      },
      {
        id: "poison_time",
        text: "When did the exposure occur?",
        type: "text",
        placeholder: "Time of exposure...",
        priority: "high",
      },
    ],
    es: [
      {
        id: "poison_substance",
        text: "¿Qué sustancia fue ingerida/expuesta?",
        type: "text",
        placeholder: "Nombre de la sustancia...",
        priority: "high",
      },
      {
        id: "poison_amount",
        text: "¿Cuánto se tomó (si se conoce)?",
        type: "text",
        placeholder: "Cantidad tomada...",
        priority: "high",
      },
      {
        id: "poison_time",
        text: "¿Cuándo ocurrió la exposición?",
        type: "text",
        placeholder: "Hora de exposición...",
        priority: "high",
      },
    ],
    fr: [
      {
        id: "poison_substance",
        text: "Quelle substance a été ingérée/exposée?",
        type: "text",
        placeholder: "Nom de la substance...",
        priority: "high",
      },
      {
        id: "poison_amount",
        text: "Combien a été pris (si connu)?",
        type: "text",
        placeholder: "Quantité prise...",
        priority: "high",
      },
      {
        id: "poison_time",
        text: "Quand l'exposition s'est-elle produite?",
        type: "text",
        placeholder: "Heure de l'exposition...",
        priority: "high",
      },
    ],
    de: [
      {
        id: "poison_substance",
        text: "Welche Substanz wurde aufgenommen/ausgesetzt?",
        type: "text",
        placeholder: "Name der Substanz...",
        priority: "high",
      },
      {
        id: "poison_amount",
        text: "Wie viel wurde genommen (falls bekannt)?",
        type: "text",
        placeholder: "Aufgenommene Menge...",
        priority: "high",
      },
      {
        id: "poison_time",
        text: "Wann ereignete sich die Exposition?",
        type: "text",
        placeholder: "Zeitpunkt der Exposition...",
        priority: "high",
      },
    ],
    hi: [
      {
        id: "poison_substance",
        text: "कौन सा पदार्थ निगला गया/उजागर हुआ?",
        type: "text",
        placeholder: "पदार्थ का नाम...",
        priority: "high",
      },
      {
        id: "poison_amount",
        text: "कितना लिया गया (यदि ज्ञात हो)?",
        type: "text",
        placeholder: "लिया गया मात्रा...",
        priority: "high",
      },
      {
        id: "poison_time",
        text: "जोखिम कब हुआ?",
        type: "text",
        placeholder: "जोखिम का समय...",
        priority: "high",
      },
    ],
    pt: [
      {
        id: "poison_substance",
        text: "Qual substância foi ingerida/exposta?",
        type: "text",
        placeholder: "Nome da substância...",
        priority: "high",
      },
      {
        id: "poison_amount",
        text: "Quanto foi ingerido (se conhecido)?",
        type: "text",
        placeholder: "Quantidade ingerida...",
        priority: "high",
      },
      {
        id: "poison_time",
        text: "Quando ocorreu a exposição?",
        type: "text",
        placeholder: "Hora da exposição...",
        priority: "high",
      },
    ],
    zh: [
      {
        id: "poison_substance",
        text: "摄入/暴露了什么物质？",
        type: "text",
        placeholder: "物质名称...",
        priority: "high",
      },
      {
        id: "poison_amount",
        text: "摄入了多少（如果已知）？",
        type: "text",
        placeholder: "摄入量...",
        priority: "high",
      },
      {
        id: "poison_time",
        text: "何时发生暴露？",
        type: "text",
        placeholder: "暴露时间...",
        priority: "high",
      },
    ],
  },

  // BURN CATEGORY
  burn: {
    en: [
      {
        id: "burn_cause",
        text: "What caused the burn?",
        type: "multiple-choice",
        options: ["Fire/Flame", "Hot liquid", "Chemical", "Electrical", "Radiation/Sun"],
        priority: "high",
      },
      {
        id: "burn_location",
        text: "Which body parts are affected?",
        type: "text",
        placeholder: "Describe affected areas...",
        priority: "high",
      },
      {
        id: "burn_area",
        text: "Approximately how large is the burn area?",
        type: "multiple-choice",
        options: ["Small", "Medium", "Large", "Extensive"],
        priority: "high",
      },
    ],
    es: [
      {
        id: "burn_cause",
        text: "¿Qué causó la quemadura?",
        type: "multiple-choice",
        options: ["Fuego/Llama", "Líquido caliente", "Química", "Eléctrica", "Radiación/Sol"],
        priority: "high",
      },
      {
        id: "burn_location",
        text: "¿Cuáles partes del cuerpo están afectadas?",
        type: "text",
        placeholder: "Describe las áreas afectadas...",
        priority: "high",
      },
      {
        id: "burn_area",
        text: "¿Aproximadamente cuán grande es el área quemada?",
        type: "multiple-choice",
        options: ["Pequeña", "Mediana", "Grande", "Extensa"],
        priority: "high",
      },
    ],
    fr: [
      {
        id: "burn_cause",
        text: "Qu'est-ce qui a causé la brûlure?",
        type: "multiple-choice",
        options: ["Feu/Flamme", "Liquide chaud", "Chimique", "Électrique", "Rayonnement/Soleil"],
        priority: "high",
      },
      {
        id: "burn_location",
        text: "Quelles parties du corps sont affectées?",
        type: "text",
        placeholder: "Décrivez les zones affectées...",
        priority: "high",
      },
      {
        id: "burn_area",
        text: "Quelle est approximativement la taille de la zone brûlée?",
        type: "multiple-choice",
        options: ["Petite", "Moyenne", "Grande", "Étendue"],
        priority: "high",
      },
    ],
    de: [
      {
        id: "burn_cause",
        text: "Was hat die Verbrennung verursacht?",
        type: "multiple-choice",
        options: ["Feuer/Flamme", "Heißes Wasser", "Chemisch", "Elektrisch", "Strahlung/Sonne"],
        priority: "high",
      },
      {
        id: "burn_location",
        text: "Welche Körperteile sind betroffen?",
        type: "text",
        placeholder: "Beschreiben Sie die betroffenen Bereiche...",
        priority: "high",
      },
      {
        id: "burn_area",
        text: "Wie groß ist die Brandwunde ungefähr?",
        type: "multiple-choice",
        options: ["Klein", "Mittel", "Groß", "Ausgedehnt"],
        priority: "high",
      },
    ],
    hi: [
      {
        id: "burn_cause",
        text: "जलने का कारण क्या था?",
        type: "multiple-choice",
        options: ["आग/लपटें", "गर्म द्रव", "रासायनिक", "विद्युत", "विकिरण/सूर्य"],
        priority: "high",
      },
      {
        id: "burn_location",
        text: "शरीर के कौन से हिस्से प्रभावित हैं?",
        type: "text",
        placeholder: "प्रभावित क्षेत्रों का वर्णन करें...",
        priority: "high",
      },
      {
        id: "burn_area",
        text: "जली हुई जगह लगभग कितनी बड़ी है?",
        type: "multiple-choice",
        options: ["छोटा", "मध्यम", "बड़ा", "व्यापक"],
        priority: "high",
      },
    ],
    pt: [
      {
        id: "burn_cause",
        text: "O que causou a queimadura?",
        type: "multiple-choice",
        options: ["Fogo/Chama", "Líquido quente", "Química", "Elétrica", "Radiação/Sol"],
        priority: "high",
      },
      {
        id: "burn_location",
        text: "Quais partes do corpo são afetadas?",
        type: "text",
        placeholder: "Descreva as áreas afetadas...",
        priority: "high",
      },
      {
        id: "burn_area",
        text: "Aproximadamente qual é o tamanho da área queimada?",
        type: "multiple-choice",
        options: ["Pequena", "Média", "Grande", "Extensa"],
        priority: "high",
      },
    ],
    zh: [
      {
        id: "burn_cause",
        text: "烧伤的原因是什么？",
        type: "multiple-choice",
        options: ["火焰", "热液体", "化学", "电气", "辐射/太阳"],
        priority: "high",
      },
      {
        id: "burn_location",
        text: "身体的哪些部分受到影响？",
        type: "text",
        placeholder: "描述受影响的区域...",
        priority: "high",
      },
      {
        id: "burn_area",
        text: "烧伤面积大约是多少？",
        type: "multiple-choice",
        options: ["小", "中", "大", "大范围"],
        priority: "high",
      },
    ],
  },

  // OTHER CATEGORY
  other: {
    en: [
      {
        id: "other_complaint",
        text: "Please describe your main complaint",
        type: "text",
        placeholder: "Describe your symptoms or concerns...",
        priority: "medium",
      },
      {
        id: "other_duration",
        text: "How long have you had this problem?",
        type: "text",
        placeholder: "Duration of symptoms...",
        priority: "medium",
      },
    ],
    es: [
      {
        id: "other_complaint",
        text: "Por favor, describe tu queja principal",
        type: "text",
        placeholder: "Describe tus síntomas o preocupaciones...",
        priority: "medium",
      },
      {
        id: "other_duration",
        text: "¿Cuánto tiempo has tenido este problema?",
        type: "text",
        placeholder: "Duración de los síntomas...",
        priority: "medium",
      },
    ],
    fr: [
      {
        id: "other_complaint",
        text: "Veuillez décrire votre plainte principale",
        type: "text",
        placeholder: "Décrivez vos symptômes ou préoccupations...",
        priority: "medium",
      },
      {
        id: "other_duration",
        text: "Depuis combien de temps avez-vous ce problème?",
        type: "text",
        placeholder: "Durée des symptômes...",
        priority: "medium",
      },
    ],
    de: [
      {
        id: "other_complaint",
        text: "Bitte beschreiben Sie Ihre Hauptbeschwerde",
        type: "text",
        placeholder: "Beschreiben Sie Ihre Symptome oder Bedenken...",
        priority: "medium",
      },
      {
        id: "other_duration",
        text: "Wie lange haben Sie dieses Problem?",
        type: "text",
        placeholder: "Dauer der Symptome...",
        priority: "medium",
      },
    ],
    hi: [
      {
        id: "other_complaint",
        text: "कृपया अपनी मुख्य शिकायत का वर्णन करें",
        type: "text",
        placeholder: "अपने लक्षणों या चिंताओं का वर्णन करें...",
        priority: "medium",
      },
      {
        id: "other_duration",
        text: "आपको यह समस्या कितने समय से है?",
        type: "text",
        placeholder: "लक्षणों की अवधि...",
        priority: "medium",
      },
    ],
    pt: [
      {
        id: "other_complaint",
        text: "Por favor, descreva sua reclamação principal",
        type: "text",
        placeholder: "Descreva seus sintomas ou preocupações...",
        priority: "medium",
      },
      {
        id: "other_duration",
        text: "Há quanto tempo você tem esse problema?",
        type: "text",
        placeholder: "Duração dos sintomas...",
        priority: "medium",
      },
    ],
    zh: [
      {
        id: "other_complaint",
        text: "请描述您的主要症状",
        type: "text",
        placeholder: "描述您的症状或关切...",
        priority: "medium",
      },
      {
        id: "other_duration",
        text: "您有这个问题多长时间了？",
        type: "text",
        placeholder: "症状持续时间...",
        priority: "medium",
      },
    ],
  },
};

// Function to get questions for a specific category
export function getQuestionsForCategory(
  category: EmergencyCategory,
  language: string = "en"
): Question[] {
  const common = COMMON_QUESTIONS[language as keyof typeof COMMON_QUESTIONS] || COMMON_QUESTIONS.en;
  const categorySpecific = CATEGORY_QUESTIONS[category]?.[language as keyof typeof COMMON_QUESTIONS] || 
    CATEGORY_QUESTIONS[category]?.en || [];
  
  return [...categorySpecific, ...common];
}
