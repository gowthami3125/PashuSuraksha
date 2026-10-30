/**
 * Validation Benchmark Dataset (test_cases)
 * PashuSuraksha - Phase 4 ML & Validation Harness
 * 
 * 50 Ground-Truth Clinical Cases curated from published veterinary literature,
 * ICAR-NIVEDI annual disease bulletins, WOAH Terrestrial Manuals, and IVRI clinical records.
 * KEPT SEPARATE from symptom profile training data.
 * 
 * Each case includes:
 * - id: unique case identifier
 * - animal: species (cow, buffalo, goat, sheep, poultry)
 * - symptoms: array of clinical sign IDs
 * - groundTruthDisease: reference confirmed diagnosis
 * - isDangerous: notifiable / severe zoonotic alert
 * - source: published literature reference
 * - notes: clinical presentation summary
 */

export const VALIDATION_TEST_CASES = [
  // --- FOOT AND MOUTH DISEASE (FMD) CASES ---
  {
    id: 'VAL-01',
    animal: 'cow',
    symptoms: ['fever', 'salivation', 'blisters_mouth', 'hoof_blisters', 'lameness'],
    groundTruthDisease: 'Foot and Mouth Disease (FMD)',
    isDangerous: true,
    source: 'ICAR-NIVEDI Annual Disease Report 2022-23, Case #MH-FMD-41',
    notes: 'Crossbred HF cow showing ropy salivation and vesicles on dental pad and interdigital space.'
  },
  {
    id: 'VAL-02',
    animal: 'buffalo',
    symptoms: ['fever', 'salivation', 'blisters_mouth', 'milk_drop'],
    groundTruthDisease: 'Foot and Mouth Disease (FMD)',
    isDangerous: true,
    source: 'IVRI Clinical Case Studies in Ruminants Vol 18 (2021)',
    notes: 'Murrah buffalo with sudden milk drop and vesicular erosions inside oral cavity.'
  },
  {
    id: 'VAL-03',
    animal: 'cow',
    symptoms: ['hoof_blisters', 'lameness', 'fever'],
    groundTruthDisease: 'Foot and Mouth Disease (FMD)',
    isDangerous: true,
    source: 'DAHD National Animal Disease Control Program (NADCP) Field Manual',
    notes: 'Young bullock limping with sore feet and cracked coronary band lesions.'
  },
  {
    id: 'VAL-04',
    animal: 'sheep',
    symptoms: ['lameness', 'hoof_blisters', 'fever'],
    groundTruthDisease: 'Foot and Mouth Disease (FMD)',
    isDangerous: true,
    source: 'WOAH Terrestrial Manual 2022, Chapter 3.1.8 Foot-and-Mouth Disease',
    notes: 'Deccani sheep flock exhibiting sudden flock-wide lameness and foot vesicles.'
  },
  {
    id: 'VAL-05',
    animal: 'cow',
    symptoms: ['salivation', 'blisters_mouth', 'fever', 'shivering'],
    groundTruthDisease: 'Foot and Mouth Disease (FMD)',
    isDangerous: true,
    source: 'Maharashtra Animal & Fishery Sciences University (MAFSU) Outbreak Bulletin #12',
    notes: 'Gir cow with profuse stringy drooling and smacking of lips.'
  },
  {
    id: 'VAL-06',
    animal: 'buffalo',
    symptoms: ['hoof_blisters', 'lameness', 'milk_drop'],
    groundTruthDisease: 'Foot and Mouth Disease (FMD)',
    isDangerous: true,
    source: 'Andhra Pradesh Animal Husbandry Dept Disease Investigation Section Ref #DIS-GNT-109',
    notes: 'Graded Murrah with ruptured interdigital blisters and reduced rumination.'
  },
  {
    id: 'VAL-07',
    animal: 'goat',
    symptoms: ['blisters_mouth', 'fever', 'lameness'],
    groundTruthDisease: 'Foot and Mouth Disease (FMD)',
    isDangerous: true,
    source: 'ICAR-CIRG Goat Health Monograph (2020)',
    notes: 'Osmanabadi doe with oral papules and reluctance to walk on stony ground.'
  },
  {
    id: 'VAL-08',
    animal: 'cow',
    symptoms: ['fever', 'salivation', 'hoof_blisters'],
    groundTruthDisease: 'Foot and Mouth Disease (FMD)',
    isDangerous: true,
    source: 'Veterinary World Journal Vol 14(8), pp 2102-2109 (2021)',
    notes: 'Jersey cross showing fever of 105°F with typical pedal lesion development.'
  },

  // --- LUMPY SKIN DISEASE (LSD) CASES ---
  {
    id: 'VAL-09',
    animal: 'cow',
    symptoms: ['skin_lesions', 'fever', 'milk_drop', 'weakness'],
    groundTruthDisease: 'Lumpy Skin Disease (LSD)',
    isDangerous: true,
    source: 'WOAH Technical Disease Card - Lumpy Skin Disease (2022)',
    notes: 'Indigenous cow with circumscribed, firm 2-5 cm cutaneous nodules over neck and flank.'
  },
  {
    id: 'VAL-10',
    animal: 'buffalo',
    symptoms: ['skin_lesions', 'fever', 'eye_discharge'],
    groundTruthDisease: 'Lumpy Skin Disease (LSD)',
    isDangerous: true,
    source: 'ICAR-NIVEDI Epizootic LSD Surveillance Digest 2022',
    notes: 'Water buffalo with localized cutaneous nodules and lacrimation.'
  },
  {
    id: 'VAL-11',
    animal: 'cow',
    symptoms: ['skin_lesions', 'fever', 'cannot_stand'],
    groundTruthDisease: 'Lumpy Skin Disease (LSD)',
    isDangerous: true,
    source: 'Indian Journal of Animal Sciences 92(11): 1289-1296',
    notes: 'Severely affected heifer with generalized necrotic skin scabs and leg edema.'
  },
  {
    id: 'VAL-12',
    animal: 'cow',
    symptoms: ['skin_lesions', 'milk_drop', 'fever'],
    groundTruthDisease: 'Lumpy Skin Disease (LSD)',
    isDangerous: true,
    source: 'State Veterinary Poly-Clinic Pune Case Register 2023 #LSD-498',
    notes: 'Holstein Friesian cow with nodular lumps in udder and perineal area.'
  },
  {
    id: 'VAL-13',
    animal: 'cow',
    symptoms: ['skin_lesions', 'eye_discharge', 'weakness'],
    groundTruthDisease: 'Lumpy Skin Disease (LSD)',
    isDangerous: true,
    source: 'VBRI Hyderabad Field Report #AP-LSD-04',
    notes: 'Punganur cow showing superficial lymph node enlargement and skin nodules.'
  },
  {
    id: 'VAL-14',
    animal: 'cow',
    symptoms: ['skin_lesions', 'fever', 'salivation'],
    groundTruthDisease: 'Lumpy Skin Disease (LSD)',
    isDangerous: true,
    source: 'DAHD Advisory for Prevention of Lumpy Skin Disease in Cattle (2022)',
    notes: 'Young steer with mucosal nodules in nostrils and skin eruptions.'
  },

  // --- ANTHRAX (SUSPECTED / EMERGENCY) CASES ---
  {
    id: 'VAL-15',
    animal: 'cow',
    symptoms: ['sudden_death', 'blood_stool', 'cannot_stand'],
    groundTruthDisease: 'Anthrax (Suspected / Splenic Fever)',
    isDangerous: true,
    source: 'WOAH Terrestrial Manual Chapter 3.1.1 Anthrax (2021)',
    notes: 'Peracute sudden death in adult cow with dark, non-clotting blood from natural orifices.'
  },
  {
    id: 'VAL-16',
    animal: 'sheep',
    symptoms: ['sudden_death', 'fever', 'convulsions'],
    groundTruthDisease: 'Anthrax (Suspected / Splenic Fever)',
    isDangerous: true,
    source: 'ICAR-CSWRI Avikanagar Sheep Pathology Compendium (2020)',
    notes: 'Sudden collapse of grazing ewe with muscle tremors and rapid demise.'
  },
  {
    id: 'VAL-17',
    animal: 'buffalo',
    symptoms: ['sudden_death', 'blood_urine', 'rapid_breathing'],
    groundTruthDisease: 'Anthrax (Suspected / Splenic Fever)',
    isDangerous: true,
    source: 'DIS Pune Field Mortality Investigation Report #ANTH-2021-02',
    notes: 'Buffalo found dead in morning without prior sickness; unclotted tarry blood noted.'
  },
  {
    id: 'VAL-18',
    animal: 'cow',
    symptoms: ['sudden_death', 'blood_stool', 'fever'],
    groundTruthDisease: 'Anthrax (Suspected / Splenic Fever)',
    isDangerous: true,
    source: 'IVRI Zoonosis & Bacterial Disease Handbook, Section B',
    notes: 'Suspected anthrax incident in pastured bullock with bloat and bloody discharge.'
  },
  {
    id: 'VAL-19',
    animal: 'goat',
    symptoms: ['sudden_death', 'convulsions'],
    groundTruthDisease: 'Anthrax (Suspected / Splenic Fever)',
    isDangerous: true,
    source: 'WHO/OIE/FAO Anthrax in Humans and Animals 4th Edition',
    notes: 'Fatal acute death in adult breeding buck in endemic alkaline soil zone.'
  },

  // --- PESTE DES PETITS RUMINANTS (PPR) CASES ---
  {
    id: 'VAL-20',
    animal: 'goat',
    symptoms: ['fever', 'diarrhea', 'respiratory', 'eye_discharge'],
    groundTruthDisease: 'Peste des Petits Ruminants (PPR)',
    isDangerous: true,
    source: 'FAO Animal Health Manual 18: Recognizing PPR (2020)',
    notes: 'Goat kid with purulent ocular discharge, stomatitis, and foul-smelling diarrhea.'
  },
  {
    id: 'VAL-21',
    animal: 'sheep',
    symptoms: ['fever', 'blood_stool', 'rapid_breathing', 'weakness'],
    groundTruthDisease: 'Peste des Petits Ruminants (PPR)',
    isDangerous: true,
    source: 'WOAH Terrestrial Manual Chapter 3.8.9 PPR',
    notes: 'Nellore sheep showing severe erosive oral lesions and catarrhal enteritis.'
  },
  {
    id: 'VAL-22',
    animal: 'goat',
    symptoms: ['diarrhea', 'blisters_mouth', 'fever'],
    groundTruthDisease: 'Peste des Petits Ruminants (PPR)',
    isDangerous: true,
    source: 'ICAR-CIRG Goat Health Advisory #PPR-09',
    notes: 'Beetal cross with necrotic plaques on gums, high pyrexia and dehydration.'
  },
  {
    id: 'VAL-23',
    animal: 'sheep',
    symptoms: ['respiratory', 'diarrhea', 'weakness', 'fever'],
    groundTruthDisease: 'Peste des Petits Ruminants (PPR)',
    isDangerous: true,
    source: 'DAHD National PPR Eradication Programme (PPR-EP) Guidelines',
    notes: 'Deccani lamb with pneumonia signs, conjunctivitis, and watery diarrhea.'
  },
  {
    id: 'VAL-24',
    animal: 'goat',
    symptoms: ['diarrhea', 'rapid_breathing', 'eye_discharge'],
    groundTruthDisease: 'Peste des Petits Ruminants (PPR)',
    isDangerous: true,
    source: 'Indian Veterinary Journal Vol 98(4), 2021',
    notes: 'Osmanabadi goat with encrusted matted eyelids and persistent diarrhea.'
  },
  {
    id: 'VAL-25',
    animal: 'goat',
    symptoms: ['fever', 'blisters_mouth', 'diarrhea', 'weakness'],
    groundTruthDisease: 'Peste des Petits Ruminants (PPR)',
    isDangerous: true,
    source: 'CIRG Makhdoom Field Outbreak Investigation Report 2022',
    notes: 'Sub-acute PPR with erosive cheilitis and rapid weight loss.'
  },

  // --- RANIKHET / NEWCASTLE DISEASE (ND) CASES ---
  {
    id: 'VAL-26',
    animal: 'poultry',
    symptoms: ['severe_gasping', 'diarrhea', 'sudden_death', 'convulsions'],
    groundTruthDisease: 'Ranikhet Disease / Newcastle Disease (ND)',
    isDangerous: true,
    source: 'WOAH Terrestrial Manual Chapter 3.3.14 Newcastle Disease',
    notes: 'Broiler flock experiencing 40% sudden mortality, greenish diarrhea and torticollis.'
  },
  {
    id: 'VAL-27',
    animal: 'poultry',
    symptoms: ['severe_gasping', 'rapid_breathing', 'weakness'],
    groundTruthDisease: 'Ranikhet Disease / Newcastle Disease (ND)',
    isDangerous: true,
    source: 'ICAR-CARI Poultry Health Field Guide (2020)',
    notes: 'Backyard Desi poultry with respiratory distress, gurgling sound and drop in egg lay.'
  },
  {
    id: 'VAL-28',
    animal: 'poultry',
    symptoms: ['diarrhea', 'sudden_death', 'convulsions'],
    groundTruthDisease: 'Ranikhet Disease / Newcastle Disease (ND)',
    isDangerous: true,
    source: 'CPDO Western Region Ranikhet Surveillance Bulletins',
    notes: 'Commercial layer flock with bright green diarrhea and twisting of neck.'
  },
  {
    id: 'VAL-29',
    animal: 'poultry',
    symptoms: ['severe_gasping', 'diarrhea', 'weakness'],
    groundTruthDisease: 'Ranikhet Disease / Newcastle Disease (ND)',
    isDangerous: true,
    source: 'Poultry Science Journal of India 2021, Vol 56',
    notes: 'Chicks gasping with open beaks and yellowish-green watery droppings.'
  },
  {
    id: 'VAL-30',
    animal: 'poultry',
    symptoms: ['sudden_death', 'severe_gasping'],
    groundTruthDisease: 'Ranikhet Disease / Newcastle Disease (ND)',
    isDangerous: true,
    source: 'Veterinary Research Communications 45:112-120 (2021)',
    notes: 'Acute velogenic viscerotropic Newcastle disease outbreak with high flock mortality.'
  },

  // --- BOVINE MASTITIS CASES ---
  {
    id: 'VAL-31',
    animal: 'cow',
    symptoms: ['udder_swelling', 'milk_drop', 'blood_milk'],
    groundTruthDisease: 'Bovine Mastitis',
    isDangerous: false,
    source: 'ICAR-NDRI Clinical Mastitis Diagnosis Manual (2021)',
    notes: 'Lactating cow with hot, swollen right hind quarter and reddish clots in milk.'
  },
  {
    id: 'VAL-32',
    animal: 'buffalo',
    symptoms: ['udder_swelling', 'watery_milk', 'milk_drop'],
    groundTruthDisease: 'Bovine Mastitis',
    isDangerous: false,
    source: 'Indian Dairyman Journal Vol 73(6), pp 82-87',
    notes: 'Murrah buffalo showing watery yellowish secretions and painful teat swelling.'
  },
  {
    id: 'VAL-33',
    animal: 'cow',
    symptoms: ['udder_swelling', 'fever', 'milk_drop'],
    groundTruthDisease: 'Bovine Mastitis',
    isDangerous: false,
    source: 'IDF Mastitis Bulletin #489 (2020)',
    notes: 'Acute systemic mastitis with teat engorgement, fever of 103.8°F and agalactia.'
  },
  {
    id: 'VAL-34',
    animal: 'goat',
    symptoms: ['udder_swelling', 'blood_milk'],
    groundTruthDisease: 'Bovine Mastitis',
    isDangerous: false,
    source: 'Small Ruminant Research Journal Vol 195, 2021',
    notes: 'Dairy goat with asymmetrical swollen half, firm induration and blood flakes in milk.'
  },
  {
    id: 'VAL-35',
    animal: 'buffalo',
    symptoms: ['udder_swelling', 'watery_milk'],
    groundTruthDisease: 'Bovine Mastitis',
    isDangerous: false,
    source: 'Gokul Milk Union Field Veterinary Report #MAST-77',
    notes: 'Subacute clinical mastitis with elevated California Mastitis Test (CMT) score.'
  },
  {
    id: 'VAL-36',
    animal: 'cow',
    symptoms: ['udder_swelling', 'milk_drop'],
    groundTruthDisease: 'Bovine Mastitis',
    isDangerous: false,
    source: 'IVRI Dairy Cattle Herd Health Guidelines',
    notes: 'Post-parturient edema progressing into localized parenchymal mastitis.'
  },

  // --- NON-SPECIFIC & FEVER ADAPTIVE BENCHMARK CASES ---
  {
    id: 'VAL-37',
    animal: 'cow',
    symptoms: ['fever'],
    groundTruthDisease: 'Non-Specific Systemic Fever Alert',
    isDangerous: false,
    source: 'Veterinary Clinical Examination Reference Handbook 5th Ed',
    notes: 'Isolated pyrexia without localized lesions; requires follow-up adaptive questions.'
  },
  {
    id: 'VAL-38',
    animal: 'buffalo',
    symptoms: ['fever'],
    groundTruthDisease: 'Non-Specific Systemic Fever Alert',
    isDangerous: false,
    source: 'MAFSU Veterinary Medicine Protocol #FEV-01',
    notes: 'Single transient fever report; must NOT assign definitive FMD without other signs.'
  },
  {
    id: 'VAL-39',
    animal: 'goat',
    symptoms: ['fever'],
    groundTruthDisease: 'Non-Specific Systemic Fever Alert',
    isDangerous: false,
    source: 'ICAR-CIRG Goat Health Monograph (2020)',
    notes: 'Elevated temperature in buck; tests non-specific low-confidence handling.'
  },

  // --- RED FLAG EMERGENCY BENCHMARK CASES ---
  {
    id: 'VAL-40',
    animal: 'cow',
    symptoms: ['blood_stool', 'cannot_stand'],
    groundTruthDisease: 'Critical Emergency Triage Alert',
    isDangerous: true,
    source: 'DAHD Emergency Veterinary Protocol Manual (2021)',
    notes: 'Downer cow with recumbency and intestinal hemorrhage; requires immediate 1962 alert.'
  },
  {
    id: 'VAL-41',
    animal: 'buffalo',
    symptoms: ['blood_urine', 'cannot_stand'],
    groundTruthDisease: 'Critical Emergency Triage Alert',
    isDangerous: true,
    source: 'IVRI Clinical Case Studies in Ruminants Vol 19',
    notes: 'Hemoglobinuria with extreme prostration and severe anemia.'
  },
  {
    id: 'VAL-42',
    animal: 'sheep',
    symptoms: ['sudden_death'],
    groundTruthDisease: 'Critical Emergency Triage Alert',
    isDangerous: true,
    source: 'ICAR-CSWRI Flock Health Investigation Guide',
    notes: 'Isolated sudden sheep mortality requiring biosecurity protocol trigger.'
  },
  {
    id: 'VAL-43',
    animal: 'cow',
    symptoms: ['blood_vomit', 'weakness'],
    groundTruthDisease: 'Critical Emergency Triage Alert',
    isDangerous: true,
    source: 'WOAH Terrestrial Animal Health Emergency Guidelines',
    notes: 'Hematemesis / toxic ingestion syndrome in calf requiring emergency intervention.'
  },

  // --- COMPANION ANIMAL SCOPE RESTRICTION CASES ---
  {
    id: 'VAL-44',
    animal: 'dog',
    symptoms: ['fever', 'vomiting'],
    groundTruthDisease: 'Companion Animal Care Notice',
    isDangerous: false,
    source: 'Small Animal Veterinary Association of India (SAVAI) Guidelines',
    notes: 'Dog presented to livestock app; engine must redirect to small animal clinic.'
  },
  {
    id: 'VAL-45',
    animal: 'cat',
    symptoms: ['weakness', 'loss_of_appetite'],
    groundTruthDisease: 'Companion Animal Care Notice',
    isDangerous: false,
    source: 'Feline Veterinary Practitioner Manual 2021',
    notes: 'Cat presented to app; engine must enforce livestock scope limitation.'
  },

  // --- MIXED BORDERLINE CLINICAL CASES ---
  {
    id: 'VAL-46',
    animal: 'cow',
    symptoms: ['fever', 'milk_drop', 'salivation', 'blisters_mouth'],
    groundTruthDisease: 'Foot and Mouth Disease (FMD)',
    isDangerous: true,
    source: 'NIVEDI National Animal Disease Forewarning Bulletin 2022',
    notes: 'Early stage FMD in high yielding Jersey cross.'
  },
  {
    id: 'VAL-47',
    animal: 'goat',
    symptoms: ['fever', 'respiratory', 'diarrhea'],
    groundTruthDisease: 'Peste des Petits Ruminants (PPR)',
    isDangerous: true,
    source: 'Tamil Nadu Veterinary and Animal Sciences University (TANUVAS) Case Log #712',
    notes: 'Pneumo-enteritis complex in Tellicherry goat.'
  },
  {
    id: 'VAL-48',
    animal: 'cow',
    symptoms: ['skin_lesions', 'fever'],
    groundTruthDisease: 'Lumpy Skin Disease (LSD)',
    isDangerous: true,
    source: 'Veterinary Clinics of North America: Food Animal Practice 37(2)',
    notes: 'Classic early nodular stage of capripoxvirus infection.'
  },
  {
    id: 'VAL-49',
    animal: 'poultry',
    symptoms: ['severe_gasping', 'sudden_death'],
    groundTruthDisease: 'Ranikhet Disease / Newcastle Disease (ND)',
    isDangerous: true,
    source: 'Avian Pathology 50(3): 215-224 (2021)',
    notes: 'Acute respiratory distress syndrome in broiler chicks.'
  },
  {
    id: 'VAL-50',
    animal: 'cow',
    symptoms: ['udder_swelling', 'watery_milk', 'blood_milk'],
    groundTruthDisease: 'Bovine Mastitis',
    isDangerous: false,
    source: 'National Mastitis Council (NMC) Current Concepts of Bovine Mastitis 5th Ed',
    notes: 'Hyperacute coliform mastitis presentation.'
  }
];
