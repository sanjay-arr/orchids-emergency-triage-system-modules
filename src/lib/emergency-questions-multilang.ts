import { Question } from "@/components/SmartQuestionFlow";

export const EMERGENCY_QUESTIONS: Record<string, Question[]> = {
  // English
  en: [
    {
      id: "q1",
      text: "What is your chief complaint or reason for visiting emergency?",
      type: "multiple-choice",
      options: [
        "Chest pain or pressure",
        "Difficulty breathing",
        "Severe headache",
        "Abdominal pain",
        "Injury or trauma",
        "Other",
      ],
      priority: "high",
    },
    {
      id: "q2",
      text: "How long have you been experiencing these symptoms?",
      type: "multiple-choice",
      options: [
        "Less than 1 hour",
        "1-3 hours",
        "3-12 hours",
        "More than 12 hours",
      ],
      priority: "high",
    },
    {
      id: "q3",
      text: "Do you have any allergies to medications?",
      type: "yes-no",
      priority: "high",
    },
    {
      id: "q4",
      text: "Are you currently taking any medications?",
      type: "yes-no",
      priority: "medium",
    },
    {
      id: "q5",
      text: "Any previous medical conditions we should know about?",
      type: "text",
      placeholder: "List previous medical conditions",
      priority: "medium",
    },
    {
      id: "q6",
      text: "On a scale of 1-10, how severe is your pain?",
      type: "number",
      placeholder: "Enter pain level (1-10)",
      priority: "high",
    },
  ],

  // Spanish
  es: [
    {
      id: "q1",
      text: "¿Cuál es tu principal queja o razón para visitar urgencias?",
      type: "multiple-choice",
      options: [
        "Dolor o presión en el pecho",
        "Dificultad para respirar",
        "Dolor de cabeza severo",
        "Dolor abdominal",
        "Lesión o trauma",
        "Otro",
      ],
      priority: "high",
    },
    {
      id: "q2",
      text: "¿Cuánto tiempo llevas experimentando estos síntomas?",
      type: "multiple-choice",
      options: [
        "Menos de 1 hora",
        "1-3 horas",
        "3-12 horas",
        "Más de 12 horas",
      ],
      priority: "high",
    },
    {
      id: "q3",
      text: "¿Tienes alergia a algún medicamento?",
      type: "yes-no",
      priority: "high",
    },
    {
      id: "q4",
      text: "¿Estás tomando medicamentos actualmente?",
      type: "yes-no",
      priority: "medium",
    },
    {
      id: "q5",
      text: "¿Tienes alguna condición médica anterior que deberíamos conocer?",
      type: "text",
      placeholder: "Lista las condiciones médicas previas",
      priority: "medium",
    },
    {
      id: "q6",
      text: "En una escala del 1 al 10, ¿qué tan severo es tu dolor?",
      type: "number",
      placeholder: "Ingresa nivel de dolor (1-10)",
      priority: "high",
    },
  ],

  // French
  fr: [
    {
      id: "q1",
      text: "Quelle est votre plainte principale ou raison de votre visite aux urgences?",
      type: "multiple-choice",
      options: [
        "Douleur ou pression thoracique",
        "Difficulté à respirer",
        "Mal de tête sévère",
        "Douleur abdominale",
        "Blessure ou traumatisme",
        "Autre",
      ],
      priority: "high",
    },
    {
      id: "q2",
      text: "Depuis combien de temps ressentez-vous ces symptômes?",
      type: "multiple-choice",
      options: [
        "Moins d'1 heure",
        "1-3 heures",
        "3-12 heures",
        "Plus de 12 heures",
      ],
      priority: "high",
    },
    {
      id: "q3",
      text: "Êtes-vous allergique à des médicaments?",
      type: "yes-no",
      priority: "high",
    },
    {
      id: "q4",
      text: "Prenez-vous actuellement des médicaments?",
      type: "yes-no",
      priority: "medium",
    },
    {
      id: "q5",
      text: "Avez-vous des antécédents médicaux que nous devrions connaître?",
      type: "text",
      placeholder: "Énumérez les conditions médicales antérieures",
      priority: "medium",
    },
    {
      id: "q6",
      text: "Sur une échelle de 1 à 10, quelle est la gravité de votre douleur?",
      type: "number",
      placeholder: "Entrez le niveau de douleur (1-10)",
      priority: "high",
    },
  ],

  // German
  de: [
    {
      id: "q1",
      text: "Was ist Ihre Hauptbeschwerde oder der Grund für Ihren Besuch in der Notaufnahme?",
      type: "multiple-choice",
      options: [
        "Brustschmerzen oder Druck",
        "Atemstörungen",
        "Starke Kopfschmerzen",
        "Bauchschmerzen",
        "Verletzung oder Trauma",
        "Sonstiges",
      ],
      priority: "high",
    },
    {
      id: "q2",
      text: "Wie lange haben Sie diese Symptome bereits?",
      type: "multiple-choice",
      options: [
        "Weniger als 1 Stunde",
        "1-3 Stunden",
        "3-12 Stunden",
        "Mehr als 12 Stunden",
      ],
      priority: "high",
    },
    {
      id: "q3",
      text: "Sind Sie gegen Medikamente allergisch?",
      type: "yes-no",
      priority: "high",
    },
    {
      id: "q4",
      text: "Nehmen Sie derzeit Medikamente?",
      type: "yes-no",
      priority: "medium",
    },
    {
      id: "q5",
      text: "Gibt es medizinische Vorerkrankungen, die wir kennen sollten?",
      type: "text",
      placeholder: "Listen Sie frühere medizinische Erkrankungen auf",
      priority: "medium",
    },
    {
      id: "q6",
      text: "Wie schwerwiegend ist Ihr Schmerz auf einer Skala von 1-10?",
      type: "number",
      placeholder: "Schmerzniveau eingeben (1-10)",
      priority: "high",
    },
  ],

  // Hindi
  hi: [
    {
      id: "q1",
      text: "आपकी मुख्य शिकायत या आपातकाल विभाग का दौरा करने का कारण क्या है?",
      type: "multiple-choice",
      options: [
        "सीने में दर्द या दबाव",
        "सांस लेने में कठिनाई",
        "गंभीर सिरदर्द",
        "पेट में दर्द",
        "चोट या आघात",
        "अन्य",
      ],
      priority: "high",
    },
    {
      id: "q2",
      text: "आप कितने समय से इन लक्षणों का अनुभव कर रहे हैं?",
      type: "multiple-choice",
      options: [
        "1 घंटे से कम",
        "1-3 घंटे",
        "3-12 घंटे",
        "12 घंटे से अधिक",
      ],
      priority: "high",
    },
    {
      id: "q3",
      text: "क्या आपको दवाओं से कोई एलर्जी है?",
      type: "yes-no",
      priority: "high",
    },
    {
      id: "q4",
      text: "क्या आप वर्तमान में कोई दवा ले रहे हैं?",
      type: "yes-no",
      priority: "medium",
    },
    {
      id: "q5",
      text: "क्या कोई पिछली चिकित्सा स्थिति है जो हमें पता होनी चाहिए?",
      type: "text",
      placeholder: "पिछली चिकित्सा स्थितियों को सूचीबद्ध करें",
      priority: "medium",
    },
    {
      id: "q6",
      text: "1-10 के पैमाने पर, आपका दर्द कितना गंभीर है?",
      type: "number",
      placeholder: "दर्द का स्तर दर्ज करें (1-10)",
      priority: "high",
    },
  ],

  // Portuguese
  pt: [
    {
      id: "q1",
      text: "Qual é sua principal reclamação ou motivo da visita ao emergência?",
      type: "multiple-choice",
      options: [
        "Dor ou pressão no peito",
        "Dificuldade em respirar",
        "Dor de cabeça severa",
        "Dor abdominal",
        "Lesão ou trauma",
        "Outro",
      ],
      priority: "high",
    },
    {
      id: "q2",
      text: "Há quanto tempo você experimenta esses sintomas?",
      type: "multiple-choice",
      options: [
        "Menos de 1 hora",
        "1-3 horas",
        "3-12 horas",
        "Mais de 12 horas",
      ],
      priority: "high",
    },
    {
      id: "q3",
      text: "Você tem alergia a algum medicamento?",
      type: "yes-no",
      priority: "high",
    },
    {
      id: "q4",
      text: "Está tomando algum medicamento atualmente?",
      type: "yes-no",
      priority: "medium",
    },
    {
      id: "q5",
      text: "Há alguma condição médica anterior que devemos saber?",
      type: "text",
      placeholder: "Liste condições médicas anteriores",
      priority: "medium",
    },
    {
      id: "q6",
      text: "Em uma escala de 1-10, qual é a gravidade da sua dor?",
      type: "number",
      placeholder: "Digite o nível de dor (1-10)",
      priority: "high",
    },
  ],

  // Chinese
  zh: [
    {
      id: "q1",
      text: "你的主要症状是什么或来就诊的原因是什么?",
      type: "multiple-choice",
      options: [
        "胸痛或胸部压力",
        "呼吸困难",
        "严重头痛",
        "腹痛",
        "损伤或外伤",
        "其他",
      ],
      priority: "high",
    },
    {
      id: "q2",
      text: "你经历这些症状有多长时间了?",
      type: "multiple-choice",
      options: [
        "少于1小时",
        "1-3小时",
        "3-12小时",
        "超过12小时",
      ],
      priority: "high",
    },
    {
      id: "q3",
      text: "你对任何药物过敏吗?",
      type: "yes-no",
      priority: "high",
    },
    {
      id: "q4",
      text: "你目前在服用任何药物吗?",
      type: "yes-no",
      priority: "medium",
    },
    {
      id: "q5",
      text: "你有我们应该知道的既往病史吗?",
      type: "text",
      placeholder: "列出以前的医学状况",
      priority: "medium",
    },
    {
      id: "q6",
      text: "按1-10的等级,你的疼痛程度如何?",
      type: "number",
      placeholder: "输入疼痛程度(1-10)",
      priority: "high",
    },
  ],
};

export function getQuestionsForLanguage(language: string): Question[] {
  return EMERGENCY_QUESTIONS[language] || EMERGENCY_QUESTIONS.en;
}
