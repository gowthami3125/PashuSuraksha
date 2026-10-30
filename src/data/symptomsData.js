export const BODY_AREAS = [
  { id: 'mouth', labelEn: 'Mouth & Oral', labelHi: 'मुंह व जीभ', labelTe: 'నోరు & నాలుక', labelMr: 'तोंड व जीभ' },
  { id: 'skin', labelEn: 'Skin & Coat', labelHi: 'त्वचा व बाल', labelTe: 'చర్మం & వెంట్రుకలు', labelMr: 'त्वचा व केस' },
  { id: 'legs', labelEn: 'Legs & Feet', labelHi: 'पैर व खुर', labelTe: 'కాళ్ళు & గిట్టలు', labelMr: 'पाय व खूर' },
  { id: 'udder', labelEn: 'Udder & Milk', labelHi: 'थन व दूध', labelTe: 'పొదుగు & పాలు', labelMr: 'कास व दूध' },
  { id: 'breathing', labelEn: 'Breathing & Chest', labelHi: 'सांस व छाती', labelTe: 'శ్వాస & ఛాతి', labelMr: 'श्वसन व छाती' },
  { id: 'stomach', labelEn: 'Stomach & Dung', labelHi: 'पेट व गोबर', labelTe: 'కడుపు & విరేచనాలు', labelMr: 'पोट व शेण' },
  { id: 'eyes', labelEn: 'Eyes & Head', labelHi: 'आंख व सिर', labelTe: 'కళ్ళు & తల', labelMr: 'डोळे व डोके' },
  { id: 'systemic', labelEn: 'Behaviour & Whole Body', labelHi: 'व्यवहार व शरीर', labelTe: 'ప్రవర్తన & శరీరం', labelMr: 'वर्तन व संपूर्ण शरीर' },
];

export const initialSymptomsList = [
  // MOUTH & ORAL
  { 
    id: 'salivation', 
    bodyArea: 'mouth',
    labelEn: 'Excessive Stringy Salivation / Drooling', 
    labelHi: 'मुंह से अधिक लार बहना', 
    labelTe: 'నోటి నుండి చొంగ కార్చడం', 
    labelMr: 'तोंडातून अधिक लाळ गळणे',
    icon: '🤤', 
    keywords: ['salivation', 'drooling', 'chonga', 'laar', 'saliva', 'drool', 'mouth water', 'foam', 'froth', 'లాలాజలం', 'చొంగ', 'నోటి నీరు', 'लार', 'झाग', 'लाळ'] 
  },
  { 
    id: 'blisters_mouth', 
    bodyArea: 'mouth',
    labelEn: 'Mouth / Tongue Blisters & Ulcers', 
    labelHi: 'मुंह व जीभ पर छाले व घाव', 
    labelTe: 'నోరు, నాలుకపై పొక్కులు / పుండ్లు', 
    labelMr: 'तोंडात व जिभेवर फोड',
    icon: '👄', 
    keywords: ['blisters', 'ulcers', 'pokkulu', 'pundlu', 'chhale', 'lesion', 'sores', 'wounds', 'tongue', 'పొక్కులు', 'పుండ్లు', 'छाले', 'घाव', 'फोड'] 
  },
  { 
    id: 'teeth_grinding', 
    bodyArea: 'mouth',
    labelEn: 'Grinding Teeth / Pain in Mouth', 
    labelHi: 'दांत पीसना व मुंह दर्द', 
    labelTe: 'పళ్ళు కొరకడం / నోటి నొప్పితో బాధపడటం', 
    labelMr: 'दात खाणे व तोंडाची वेदना',
    icon: '😬', 
    keywords: ['teeth grinding', 'grinding', 'dant pisna', 'teeth pain', 'pallu korakadam', 'दांत पीसना', 'पल्लू'] 
  },
  { 
    id: 'inability_eat', 
    bodyArea: 'mouth',
    labelEn: 'Unable to Chew / Swallow Food', 
    labelHi: 'चारा चबाने व निगलने में असमर्थ', 
    labelTe: 'మేత నమలలేకపోవడం / మింగలేకపోవడం', 
    labelMr: 'चारा चावता न येणे व गिळणे कठीण',
    icon: '🚫', 
    keywords: ['cannot chew', 'swallow', 'cannot eat', 'meya ledu', 'chaba nahi pa raha', 'चारा'] 
  },
  { 
    id: 'foul_breath', 
    bodyArea: 'mouth',
    labelEn: 'Foul Smelling Mouth / Breath', 
    labelHi: 'मुंह से दुर्गंध आना', 
    labelTe: 'నోటి నుండి దుర్వాసన రావడం', 
    labelMr: 'तोंडातून दुर्गंधी येणे',
    icon: '💨', 
    keywords: ['foul breath', 'bad smell mouth', 'durvasana', 'durgandh', 'दुर्गंध', 'దుర్వాసన'] 
  },

  // SKIN & COAT
  { 
    id: 'skin_lesions', 
    bodyArea: 'skin',
    labelEn: 'Nodular Skin Lumps / Bumps', 
    labelHi: 'त्वचा पर सख्त गांठें व दाने', 
    labelTe: 'చర్మంపై గడ్డలు / కత్తుల లాంటి వాపులు', 
    labelMr: 'त्वचेवर गाठी व उंचवटे',
    icon: '🟣', 
    keywords: ['lumps', 'nodules', 'skin lesions', 'gadalu', 'gatte', 'lumpy', 'pimples', 'skin bumps', 'చర్మం గడ్డలు', 'गांठें', 'दाने', 'गाठी'] 
  },
  { 
    id: 'skin_crusts', 
    bodyArea: 'skin',
    labelEn: 'Scabs, Crusts & Hair Loss', 
    labelHi: 'त्वचा पर पपड़ी व बाल झड़ना', 
    labelTe: 'చర్మం పపడి / వెంట్రుకలు రాలిపోవడం', 
    labelMr: 'त्वचेवर खपल्या व केस गळणे',
    icon: '🩹', 
    keywords: ['scabs', 'crusts', 'hair loss', 'mange', 'skin peel', 'ventrukalu', 'पपड़ी', 'बाल झड़ना'] 
  },
  { 
    id: 'skin_redness', 
    bodyArea: 'skin',
    labelEn: 'Red Rashes & Intense Itching', 
    labelHi: 'लाल चकत्ते व तेज खुजली', 
    labelTe: 'ఎర్రని మచ్చలు & విపరీతమైన దురద', 
    labelMr: 'लाल चट्टे व तीव्र खाज',
    icon: '🔴', 
    keywords: ['red rash', 'itching', 'durada', 'khujli', 'skin red', 'लाल चकत्ते', 'खुजली', 'దురద'] 
  },
  { 
    id: 'skin_wounds', 
    bodyArea: 'skin',
    labelEn: 'Open Wounds / Maggot Sores', 
    labelHi: 'खुले घाव व कीड़े/कीड़े वाले जख्म', 
    labelTe: 'తెరిచిన పుండ్లు / పురుగులు పడిన గాయాలు', 
    labelMr: 'उघड्या जखमा व अळ्या',
    icon: '🩺', 
    keywords: ['wounds', 'maggot', 'open sores', 'purugulu', 'ghav', 'घाव', 'कीड़े', 'పురుగులు'] 
  },

  // LEGS & FEET
  { 
    id: 'lameness', 
    bodyArea: 'legs',
    labelEn: 'Severe Lameness & Limping Walk', 
    labelHi: 'लंगड़ाकर चलना व खुर दर्द', 
    labelTe: 'కుంటి నడక / గిట్టల నొప్పితో నడవలేకపోవడం', 
    labelMr: 'लंगडणे व खुरांचे दुखणे',
    icon: '🦶', 
    keywords: ['lameness', 'limping', 'kunti', 'langdana', 'hoof pain', 'leg pain', 'cannot walk', 'గిట్టల నొప్పి', 'కుంటి', 'लंगड़ा', 'पैर दर्द'] 
  },
  { 
    id: 'hoof_blisters', 
    bodyArea: 'legs',
    labelEn: 'Hoof Blisters / Swollen Feet', 
    labelHi: 'खुरों के बीच छाले व पैरों में सूजन', 
    labelTe: 'గిట్టల సందుల్లో పొక్కులు & వాపు', 
    labelMr: 'खुरांमध्ये फोड व पायांना सूज',
    icon: '👣', 
    keywords: ['hoof blisters', 'swollen feet', 'hoof sores', 'gittala pokkulu', 'खुर छाले', 'खुर दर्द'] 
  },
  { 
    id: 'cannot_stand', 
    bodyArea: 'legs',
    isDanger: true,
    labelEn: 'Inability to Stand Up / Downer Animal (URGENT)', 
    labelHi: 'खड़े न हो पाना / जमीन पर लेटे रहना (अति गंभीर)', 
    labelTe: 'నుంచోలేకపోవడం / పడిపోవడం (అత్యవసరం)', 
    labelMr: 'उभे राहता न येणे (तातडीचे)',
    icon: '🚨', 
    keywords: ['cannot stand', 'downer animal', 'cannot get up', 'padipovadam', 'khada nahi ho raha', 'खड़े न हो पाना', 'పడిపోవడం'] 
  },
  { 
    id: 'joint_swelling', 
    bodyArea: 'legs',
    labelEn: 'Swollen Joints & Stiff Knees', 
    labelHi: 'जोड़ों में सूजन व घुटनों में अकड़न', 
    labelTe: 'కీళ్ళు వాచిపోవడం & కాళ్ళు బిగుసుకుపోవడం', 
    labelMr: 'सांधेदुखी व गुडघ्यांना सूज',
    icon: '🦴', 
    keywords: ['swollen joints', 'stiff knees', 'joint pain', 'knee swelling', 'जोड़ों में सूजन', 'కీళ్ళ వాపు'] 
  },

  // UDDER & MILK
  { 
    id: 'udder_swelling', 
    bodyArea: 'udder',
    labelEn: 'Swollen Hard Udder / Teats (Mastitis)', 
    labelHi: 'थन में भारी सूजन, लाली व कड़ापन (थनेला)', 
    labelTe: 'పొదుగు బాగా వాచిపోవడం / గట్టిపడటం', 
    labelMr: 'कास सुजणे व कडक होणे',
    icon: '🥛', 
    keywords: ['udder', 'teat', 'mastitis', 'podugu', 'than', 'swollen udder', 'hard udder', 'పొదుగు', 'थनेला', 'थन सूजन', 'कास'] 
  },
  { 
    id: 'milk_drop', 
    bodyArea: 'udder',
    labelEn: 'Sudden Drop in Milk Production', 
    labelHi: 'दूध उत्पादन में अचानक भारी गिरावट', 
    labelTe: 'పాలు హఠాత్తుగా తగ్గిపోవడం', 
    labelMr: 'दूध उत्पादनात अचानक घट',
    icon: '📉', 
    keywords: ['milk drop', 'milk decrease', 'paalu tagadam', 'doodh kam', 'low milk', 'no milk', 'పాలు తగ్గిపోవడం', 'दूध कमी', 'दूध गिरावट'] 
  },
  { 
    id: 'blood_milk', 
    bodyArea: 'udder',
    isDanger: true,
    labelEn: 'Blood or Flakes/Clots in Milk (URGENT)', 
    labelHi: 'दूध में खून या थक्के आना (अति गंभीर)', 
    labelTe: 'పాలలో రక్తం / జిగట గడ్డలు రావడం (అత్యవసరం)', 
    labelMr: 'दुधात रक्त किंवा गुठळ्या (तातडीचे)',
    icon: '🩸', 
    keywords: ['blood in milk', 'bloody milk', 'milk clots', 'paalalo raktam', 'doodh me khoon', 'दूध में खून', 'రక్త పాలు'] 
  },
  { 
    id: 'watery_milk', 
    bodyArea: 'udder',
    labelEn: 'Discolored / Watery Thin Milk', 
    labelHi: 'दूध का रंग बदलना या पानी जैसा पतला होना', 
    labelTe: 'పాలు పల్చగా నీళ్ళలా మారడం', 
    labelMr: 'दूध पातळ किंवा पिवळसर होणे',
    icon: '🧪', 
    keywords: ['watery milk', 'discolored milk', 'thin milk', 'paalu neellala', 'पतला दूध'] 
  },

  // BREATHING & CHEST
  { 
    id: 'respiratory', 
    bodyArea: 'breathing',
    labelEn: 'Nasal Discharge & Heavy Coughing', 
    labelHi: 'नाक से स्राव व तेज खांसी', 
    labelTe: 'ముక్కు నుండి నీరు కారడం & దగ్గు', 
    labelMr: 'नाकातून शेंबूड व उबळ',
    icon: '🫁', 
    keywords: ['cough', 'coughing', 'nasal', 'breathing', 'daggu', 'khansi', 'sneezing', 'sardi', 'ముక్కు నీరు', 'దగ్గు', 'खांसी', 'जुकाम'] 
  },
  { 
    id: 'severe_gasping', 
    bodyArea: 'breathing',
    isDanger: true,
    labelEn: 'Severe Respiratory Gasping / Open Mouth (URGENT)', 
    labelHi: 'मुंह खोलकर हांफना व सांस लेने में अत्यधिक तकलीफ', 
    labelTe: 'నోరు తెరచుకొని శ్వాస పీల్చడం / తీవ్ర శ్వాసకష్టం', 
    labelMr: 'तोंड उघडून धाप लागणे (तातडीचे)',
    icon: '😮‍💨', 
    keywords: ['gasping', 'open mouth breathing', 'severe breathing', 'hafna', 'swasa kastam', 'हांफना', 'శ్వాస తీసుకోవడంలో ఇబ్బంది'] 
  },
  { 
    id: 'rapid_breathing', 
    bodyArea: 'breathing',
    labelEn: 'Very Fast Panting / Rapid Chest Heaving', 
    labelHi: 'बहुत तेज सांस लेना व छाती धड़कना', 
    labelTe: 'వేగంగా శ్వాస తీసుకోలు / ఛాతి ఆయాసం', 
    labelMr: 'जलद श्वासोच्छ्वास',
    icon: '⚡', 
    keywords: ['fast breathing', 'panting', 'rapid breathing', 'chati dhadkana', 'ayasam', 'तेज सांस', 'ఆయాసం'] 
  },
  { 
    id: 'frothy_nasal', 
    bodyArea: 'breathing',
    labelEn: 'Bloody or Frothy Nasal Discharge', 
    labelHi: 'नाक से झागदार या खूनी स्राव', 
    labelTe: 'ముక్కు నుండి నురుగు / రక్త స్రావం', 
    labelMr: 'नाकातून फेस किंवा रक्त येणे',
    icon: '🧼', 
    keywords: ['frothy nasal', 'bloody nasal', 'froth nose', 'jhaag nose', 'rakta mukku', 'नाक से झाग'] 
  },

  // STOMACH & DUNG
  { 
    id: 'diarrhea', 
    bodyArea: 'stomach',
    labelEn: 'Profuse Watery Diarrhea / Loose Dung', 
    labelHi: 'गंभीर पतले दस्त / पतला गोबर', 
    labelTe: 'పల్చటి నీళ్ళ విరేచనాలు', 
    labelMr: 'अतिसार व पातळ शेण',
    icon: '💧', 
    keywords: ['diarrhea', 'loose motion', 'virechanalu', 'dast', 'scours', 'watery dung', 'విరేచనాలు', 'दस्त', 'पतला गोबर'] 
  },
  { 
    id: 'blood_stool', 
    bodyArea: 'stomach',
    isDanger: true,
    labelEn: 'Blood or Mucus in Stool / Dung (URGENT)', 
    labelHi: 'गोबर में खून या आव आना (अति गंभीर)', 
    labelTe: 'మలంలో / విరేచనాల్లో రక్తం పడటం (అత్యవసరం)', 
    labelMr: 'शेणात रक्त किंवा शेवाळ (तातडीचे)',
    icon: '🚨', 
    keywords: ['bloody stool', 'blood in dung', 'bloody diarrhea', 'rakta virechanalu', 'khooni dast', 'खूनी दस्त', 'రక్త విరేచనాలు'] 
  },
  { 
    id: 'bloat', 
    bodyArea: 'stomach',
    labelEn: 'Swollen Left Flank / Gas Bloat in Belly', 
    labelHi: 'बाएं पेट में गैस भरना व अफारा', 
    labelTe: 'ఎడమ వైపు పొట్ట ఉబ్బడం / గ్యాస్ బ్లోట్', 
    labelMr: 'पोटाची डावी बाजू फुगणे (अफरा)',
    icon: '🎈', 
    keywords: ['bloat', 'gas bloat', 'swollen belly', 'afara', 'potta ubbadam', 'पेट फूटना', 'अफारा', 'పొట్ట ఉబ్బరం'] 
  },
  { 
    id: 'blood_vomit', 
    bodyArea: 'stomach',
    isDanger: true,
    labelEn: 'Vomiting Blood / Rumen Vomit (URGENT)', 
    labelHi: 'खून की उल्टी / पेट से खून निकलना (अति गंभीर)', 
    labelTe: 'రక్తపు వాంతులు చేసుకోవడం (అత్యవసరం)', 
    labelMr: 'रक्ताची उलटी (तातडीचे)',
    icon: '🚨', 
    keywords: ['blood vomit', 'vomiting blood', 'rumen vomit', 'rakta vaanthulu', 'khoon ki ulti', 'खून की उल्टी', 'రక్తపు వాంతులు'] 
  },

  // EYES & HEAD
  { 
    id: 'eye_discharge', 
    bodyArea: 'eyes',
    labelEn: 'Eye Watery Discharge / Tears / Pus', 
    labelHi: 'आंखों से पानी, कीचड़ व आंसू बहना', 
    labelTe: 'కళ్ళ నుండి నీరు / పీసులు కారడం', 
    labelMr: 'डोळ्यातून पाणी व पू येणे',
    icon: '👁️', 
    keywords: ['eye discharge', 'tears', 'pus eye', 'kallu neeru', 'aankh pani', 'आंखों से पानी', 'కళ్ళ నీరు'] 
  },
  { 
    id: 'eye_redness', 
    bodyArea: 'eyes',
    labelEn: 'Redness & Corneal Cloudiness / Opacity', 
    labelHi: 'आंखों में लालिमा व सफेदी आना', 
    labelTe: 'కళ్ళు ఎర్రబడటం / కంటిపాప పైన పొర రావడం', 
    labelMr: 'डोळे लाल होणे व पांढरी पडणे',
    icon: '🔴', 
    keywords: ['red eyes', 'corneal opacity', 'cloudy eye', 'blind', 'aankh laal', 'కళ్ళు ఎర్రబడటం', 'आंख लाल'] 
  },
  { 
    id: 'swollen_jaw', 
    bodyArea: 'eyes',
    labelEn: 'Swollen Throat / Bottle Jaw Swelling', 
    labelHi: 'जबड़े व गले के नीचे पानी वाली सूजन (बॉटल जॉ)', 
    labelTe: 'గడ్డం / గొంతు కింద నీటి వాపు (బాటిల్ జా)', 
    labelMr: 'हनुवटीखाली सुजणे (बॉटल जॉ)',
    icon: '🦒', 
    keywords: ['bottle jaw', 'swollen jaw', 'throat swelling', 'gala sujan', 'gaddam vaapu', 'गले में सूजन', 'गड्ढम వాపు'] 
  },

  // BEHAVIOUR & SYSTEMIC
  { 
    id: 'fever', 
    bodyArea: 'systemic',
    labelEn: 'High Fever (>104°F)', 
    labelHi: 'तेज बुखार (>104°F)', 
    labelTe: 'విపరీతమైన జ్వరం (>104°F)', 
    labelMr: 'अंगात तीव्र ताप (>१०४°F)',
    icon: '🌡️', 
    keywords: ['fever', 'bukhar', 'jwaram', 'feverish', 'temperature', 'tapam', 'shiver', 'జ్వరం', 'बुखार', 'ताप'] 
  },
  { 
    id: 'sudden_death', 
    bodyArea: 'systemic',
    isDanger: true,
    labelEn: 'Sudden Unexplained Death in Herd (URGENT)', 
    labelHi: 'पशु की अचानक बिना लक्षण मृत्यु (अति गंभीर)', 
    labelTe: 'లక్షణాలు లేకుండా హఠాత్తుగా చనిపోవడం (అత్యవసరం)', 
    labelMr: 'अचानक मृत्यू (तातडीचे)',
    icon: '🚨', 
    keywords: ['sudden death', 'dead animal', 'unexpected death', 'haathattu maranam', 'achanak maut', 'अचानक मृत्यु', 'హఠాత్ మరణం'] 
  },
  { 
    id: 'blood_urine', 
    bodyArea: 'systemic',
    isDanger: true,
    labelEn: 'Red / Coffee-Colored Urine (URGENT)', 
    labelHi: 'लाल या कॉफी रंग का पेशाब आना (अति गंभीर)', 
    labelTe: 'ఎర్రటి / కాఫీ రంగు మూత్రం పడటం (అత్యవసరం)', 
    labelMr: 'लासर किंवा कॉफी रंगाची लघवी (तातडीचे)',
    icon: '🩸', 
    keywords: ['blood urine', 'red urine', 'coffee urine', 'rakta mootram', 'laal peshab', 'लाल पेशाब', 'రక్త మూత్రం'] 
  },
  { 
    id: 'abortion', 
    bodyArea: 'systemic',
    labelEn: 'Late-term Abortion / Retained Placenta', 
    labelHi: 'समय से पहले बच्चा गिरना (गर्भपात)', 
    labelTe: 'ఈత చెడిపోవడం / గర్భస్రావం జరగడం', 
    labelMr: 'गर्भपात किंवा वार अडकणे',
    icon: '⚠️', 
    keywords: ['abortion', 'miscarriage', 'eetha chedipovadam', 'garbhpaat', 'calf loss', 'गार्भपात', 'ఈత చెడిపోవడం'] 
  },
  { 
    id: 'weakness', 
    bodyArea: 'systemic',
    labelEn: 'Lethargy, Depression & Loss of Appetite', 
    labelHi: 'सुस्ती, कमजोरी व दाना-पानी न खाना', 
    labelTe: 'నీరసం & మేత సరిగ్గా మేయకపోవడం', 
    labelMr: 'अशक्तपणा व चारा न खाणे',
    icon: '🥀', 
    keywords: ['weakness', 'lethargy', 'neerasam', 'kamzori', 'anorexia', 'not eating', 'dull', 'మేత మేయడం లేదు', 'నీరసం', 'कमजोरी', 'सुस्ती'] 
  },
  { 
    id: 'convulsions', 
    bodyArea: 'systemic',
    labelEn: 'Seizures, Shivering & Muscle Tremors', 
    labelHi: 'दौरे पड़ना, कांपना व मांसपेशियों में खिंचाव', 
    labelTe: 'వణుకు రావడం / ఫిట్స్ / కాళ్ళు కొట్టుకోవడం', 
    labelMr: 'कंप सुटणे व ताण येणे',
    icon: '⚡', 
    keywords: ['convulsions', 'seizures', 'shivering', 'tremors', 'vanuku', 'kampana', 'कांपना', 'వణుకు'] 
  },
];
