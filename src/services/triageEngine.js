import { diseasesDB } from '../data/diseasesData.js';
import { initialSymptomsList } from '../data/symptomsData.js';

export const parseSymptomsFromText = (text, symptomsList) => {
  if (!text || !text.trim()) {
    return [];
  }
  const lower = text.toLowerCase();
  const matchedIds = [];

  const symSource = symptomsList || initialSymptomsList;
  if (symSource) {
    symSource.forEach(sym => {
      if (sym.keywords) {
        sym.keywords.forEach(kw => {
          if (lower.includes(kw.toLowerCase())) {
            if (!matchedIds.includes(sym.id)) {
              matchedIds.push(sym.id);
            }
          }
        });
      }
    });
  }

  diseasesDB.forEach(disease => {
    if (
      lower.includes(disease.id) || 
      (disease.nameEn && lower.includes(disease.nameEn.toLowerCase())) || 
      (disease.nameHi && lower.includes(disease.nameHi.toLowerCase())) || 
      (disease.nameTe && lower.includes(disease.nameTe.toLowerCase())) ||
      (disease.nameMr && lower.includes(disease.nameMr.toLowerCase()))
    ) {
      disease.matchSymptoms.forEach(sId => {
        if (!matchedIds.includes(sId)) {
          matchedIds.push(sId);
        }
      });
    }
  });

  return matchedIds;
};

export const DANGER_SYMPTOMS = [
  'blood_vomit', 
  'blood_stool', 
  'blood_urine', 
  'blood_milk', 
  'sudden_death', 
  'cannot_stand', 
  'severe_gasping'
];

export const calculateTriageDiagnosis = ({
  animalId = 'cow',
  symptomIds = [],
  customText = '',
  sickCount = 1,
  deadCount = 0,
  durationDays = 1,
  location = ''
}) => {
  // Companion Pet Check
  if (animalId === 'dog' || animalId === 'cat') {
    return {
      isPetNotice: true,
      petType: animalId === 'dog' ? 'Dog' : 'Cat',
      riskLevel: 'Low',
      riskBadge: 'Pet Advice',
      title: 'Companion Animal Care Notice',
      message: 'PashuSuraksha triage algorithms are specialized for livestock & poultry health. For dogs and cats, please consult a small animal veterinarian or local pet clinic for tailored medical diagnosis.',
      matchedConditions: [],
      followUpQuestions: [],
      recommendedActions: [
        'Contact a certified small animal veterinary clinic.',
        'Keep pet isolated in a safe, warm, and comfortable area.',
        'Ensure fresh water access and monitor eating habits.'
      ]
    };
  }

  // Pure Danger Signs check
  const hasDangerSigns = symptomIds.some(id => DANGER_SYMPTOMS.includes(id));

  // Single Fever check (Fever alone without other specific symptoms)
  const isOnlyFever = symptomIds.length === 1 && symptomIds.includes('fever');

  if (isOnlyFever) {
    let risk = 'Low';
    if (sickCount > 1 || deadCount > 0) risk = 'Medium';

    return {
      isOnlyFever: true,
      riskLevel: risk,
      riskBadge: risk === 'Medium' ? 'Medium Risk' : 'Low Risk',
      title: 'Non-Specific Systemic Fever Alert',
      summary: 'High fever (>104°F) is a general immune response to infection, stress, heat stroke, or early-stage viral/bacterial illness. Because fever alone does not pinpoint a specific disease, follow-up observation is necessary to identify emerging focal signs.',
      matchedConditions: [
        {
          id: 'early_infection',
          nameEn: 'Early-Stage Infection / Heat Stress',
          nameHi: 'प्रारंभिक संक्रमण या लू लगना',
          nameTe: 'ప్రారంభ దశ ఇన్ఫెక్షన్ / వడదెబ్బ',
          nameMr: 'प्राथमिक संसर्ग किंवा उष्माघात',
          categoryEn: 'General Fever',
          confidenceLabel: 'Non-Specific Symptom',
          matchedSymptomsNames: ['High Fever (>104°F)'],
          preventionEn: '• Move animal to a cool, shaded, well-ventilated shelter.\n• Provide clean cold drinking water with electrolytes.\n• Monitor body temperature twice daily.\n• Avoid heavy physical work or direct sun exposure.',
          treatmentEn: '• Apply damp towels or cold water sponge on body.\n• Strictly no antibiotics without written prescription.\n• Consult local veterinary officer if fever persists >24 hours.'
        }
      ],
      followUpQuestions: [
        'Are there any blisters, ulcers, or lesions on the mouth, tongue, or hooves?',
        'Is the animal coughing or breathing rapidly with frothy nasal discharge?',
        'Is there any reduction in milk yield, hard swelling in udder, or blood in milk?',
        'Are there any skin lumps, bumps, or crusts developing on the coat?',
        'Has the animal passed watery dung or bloody diarrhea?'
      ],
      recommendedActions: [
        'Isolate the feverish animal in a clean, shaded space.',
        'Offer electrolyte-mixed clean drinking water.',
        'Check body temperature every 6 hours with a clinical thermometer.',
        'Contact nearby Veterinary Officer if fever persists or new symptoms appear.'
      ]
    };
  }

  // Anthrax Suspect Trigger: Ruminant with sudden death or deadCount > 0 with bleeding
  const isRuminant = ['cow', 'buffalo', 'sheep', 'goat'].includes(animalId);
  const isAnthraxSuspect = isRuminant && (
    symptomIds.includes('sudden_death') ||
    (deadCount > 0 && (symptomIds.includes('blood_stool') || symptomIds.includes('blood_urine') || symptomIds.includes('convulsions')))
  );

  // Disease Matching Algorithm
  let matchedList = diseasesDB.map(disease => {
    let matched = disease.matchSymptoms.filter(sId => symptomIds.includes(sId));
    let matchCount = matched.length;

    // Check species relevance
    let speciesBonus = (disease.targetSpecies && disease.targetSpecies.includes(animalId)) ? 2 : 0;

    // Extra weight for Anthrax when sudden death in ruminants
    if (disease.id === 'anthrax' && isAnthraxSuspect) {
      matchCount += 5;
    }

    let totalScore = matchCount + speciesBonus;

    return {
      ...disease,
      matchedSymptomIds: matched,
      matchCount,
      totalScore
    };
  });

  // Filter out zero matches unless Anthrax suspect
  matchedList = matchedList.filter(d => d.matchCount > 0 || (d.id === 'anthrax' && isAnthraxSuspect));

  // Sort by total match score
  matchedList.sort((a, b) => b.totalScore - a.totalScore);

  // Determine overall risk level
  let baseRisk = 'Low';

  if (hasDangerSigns || deadCount > 0 || isAnthraxSuspect) {
    baseRisk = 'URGENT';
  } else if (matchedList.some(m => m.matchCount >= 3) || sickCount > 3) {
    baseRisk = 'High';
  } else if (matchedList.some(m => m.matchCount >= 2) || sickCount > 1) {
    baseRisk = 'Medium';
  } else if (matchedList.length > 0) {
    baseRisk = 'Low';
  }

  // Morbidity & Mortality Escalation
  if (baseRisk === 'High' && (sickCount >= 5 || deadCount >= 1)) {
    baseRisk = 'URGENT';
  } else if (baseRisk === 'Medium' && (sickCount > 2 || deadCount >= 1)) {
    baseRisk = 'High';
  } else if (baseRisk === 'Low' && (sickCount > 1)) {
    baseRisk = 'Medium';
  }

  // Format Top 2 Conditions
  const topConditions = matchedList.slice(0, 2).map(disease => {
    let matchLabel = disease.matchCount >= 3 ? 'High Pattern Match' : 'Moderate Alignment';
    if (disease.id === 'anthrax' && isAnthraxSuspect) {
      matchLabel = 'Urgent Clinical Warning';
    }

    // Resolve human-readable symptom names
    const matchedNames = disease.matchedSymptomIds.map(sId => {
      const found = initialSymptomsList.find(s => s.id === sId);
      return found ? found.labelEn : sId;
    });

    return {
      ...disease,
      confidenceLabel: matchLabel,
      matchedSymptomsNames: matchedNames.length > 0 ? matchedNames : ['Sudden mortality / Danger signs']
    };
  });

  // Fallback if no specific disease matches but symptoms selected
  if (topConditions.length === 0 && symptomIds.length > 0) {
    const fallbackNames = symptomIds.map(sId => {
      const found = initialSymptomsList.find(s => s.id === sId);
      return found ? found.labelEn : sId;
    });

    topConditions.push({
      id: 'general_livestock_illness',
      nameEn: 'Unspecified Livestock Health Condition',
      nameHi: 'अनिर्दिष्ट पशु स्वास्थ्य स्थिति',
      nameTe: 'సాధారణ పశువుల ఆరోగ్య రుగ్మత',
      nameMr: 'अनिश्चित पशु आरोग्य स्थिती',
      categoryEn: 'General Health Alert',
      confidenceLabel: 'Observational Match',
      matchedSymptomsNames: fallbackNames,
      preventionEn: '• Isolate animal from healthy herd members.\n• Ensure clean feeding trough and disinfected surroundings.',
      treatmentEn: '• Strictly avoid unprescribed drugs.\n• Consult local veterinary officer for physical clinical examination.'
    });
  }

  // Formulate follow-up questions if symptoms are sparse (< 2)
  let followUpQuestions = [];
  if (symptomIds.length < 2) {
    followUpQuestions = [
      'Have you noticed any change in feed or water intake in the last 24 hours?',
      'Is there any swelling around the throat, brisket, or joints?',
      'Has any neighboring farmer or herd reported similar symptoms recently?'
    ];
  }

  // Actions without any drug dosages
  const recommendedActions = [
    baseRisk === 'URGENT' 
      ? 'Call 1962 Emergency Animal Ambulance immediately.' 
      : 'Contact your assigned Veterinary Officer for clinical guidance.',
    'Immediately isolate affected animal(s) from the remaining herd in a dry, shaded stall.',
    'Disinfect shed premises with lime powder or potassium permanganate solution.',
    'Do not administer unprescribed antibiotics, painkillers, or human medications.'
  ];

  if (isAnthraxSuspect) {
    recommendedActions.unshift('CRITICAL: DO NOT OPEN OR CUT THE CARCASS. Avoid all contact with blood or body fluids.');
  }

  return {
    isPetNotice: false,
    isOnlyFever: false,
    isAnthraxSuspect,
    anthraxWarning: isAnthraxSuspect ? 'CRITICAL BIOSECURITY NOTICE: Potential Anthrax Suspect. DO NOT OPEN OR CUT THE CARCASS. Post-mortem is strictly forbidden by law to prevent lethal spore release into the environment. Quarantine the premises, do not skin the animal, and call 1962 Veterinary Emergency Helpline immediately.' : null,
    hasDangerSigns,
    riskLevel: baseRisk, // 'Low', 'Medium', 'High', 'URGENT'
    riskBadge: baseRisk === 'URGENT' ? 'URGENT EMERGENCY' : `${baseRisk} Risk`,
    matchedConditions: topConditions,
    followUpQuestions,
    incidentDetails: {
      animalId,
      symptomIds,
      customText,
      sickCount,
      deadCount,
      durationDays,
      location
    },
    recommendedActions
  };
};
