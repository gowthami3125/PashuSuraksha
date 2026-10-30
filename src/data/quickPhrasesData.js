export const quickVoicePhrases = [
  { 
    id: 'fmd_phrase', 
    textEn: 'Cow has high fever, stringy salivation drooling, and hoof blisters', 
    textMr: 'गायीला तीव्र ताप आहे, तोंडातून लाळ गळत आहे आणि खुरांमध्ये फोड आले आहेत',
    textHi: 'गाय को तेज बुखार है, मुंह से लार टपक रही है और खुर में छाले हैं', 
    textTe: 'ఆవుకు విపరీతమైన జ్వరం ఉంది, నోటి నుండి చొంగ కారుతోంది మరియు గిట్టల పొక్కులు ఉన్నాయి',
    syms: ['fever', 'salivation', 'blisters', 'lameness']
  },
  { 
    id: 'skin_lumps', 
    textEn: 'Hard lumps and nodular blisters on cattle skin', 
    textMr: 'जनावरांच्या त्वचेवर कडक गाठी आणि फोड दिसत आहेत',
    textHi: 'गाय की चमड़ी पर सख्त गांठें और घाव दिखाई दे रहे हैं', 
    textTe: 'ఆవు చర్మంపై కత్తుల లాంటి గడ్డలు మరియు మచ్చలు వచ్చాయి',
    syms: ['skin_lesions', 'fever', 'milk_drop', 'weakness']
  },
  { 
    id: 'udder_swelling', 
    textEn: 'Udder is swollen and milk yield dropped sharply', 
    textMr: 'कास सुजली आहे आणि दुधाचे प्रमाण अचानक घटले आहे',
    textHi: 'थन में भारी सूजन है और दूध उत्पादन अचानक गिर गया है', 
    textTe: 'పొదుగు బాగా వాచిపోయింది మరియు పాలు తగ్గిపోయాయి',
    syms: ['udder_swelling', 'milk_drop', 'fever']
  },
  { 
    id: 'goat_diarrhea', 
    textEn: 'Goat has high fever and watery bloody diarrhea', 
    textMr: 'शेळीला तीव्र ताप आणि पातळ रक्ताचे संडास होत आहेत',
    textHi: 'बकरी को बहुत तेज बुखार और खूनी दस्त हो रहे हैं', 
    textTe: 'మేకకు విపరీతమైన జ్వరం మరియు రక్త విరేచనాలు అవుతున్నాయి',
    syms: ['fever', 'diarrhea', 'respiratory', 'weakness']
  }
];

export const sampleLesions = [
  {
    id: 'lsd_nodule',
    titleEn: 'Skin Nodules (LSD Lesion)',
    titleMr: 'त्वचेवरील गाठी (लम्पी त्वचा आजार)',
    titleHi: 'त्वचा पर गांठें (लम्पी घाव)',
    titleTe: 'చర్మంపై గడ్డలు (లంపీ మచ్చలు)',
    animal: 'Cattle',
    simulatedMatch: 'Lumpy Skin Disease (Sample)',
    image: 'https://images.unsplash.com/photo-1570042707229-37330c6a51d8?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'fmd_hoof',
    titleEn: 'Tongue & Hoof Blister Wounds',
    titleMr: 'जीभ आणि खुरांवरील फोड व जखमा (लाळ्या खुरकूत)',
    titleHi: 'खुर व जीभ के छाले (FMD)',
    titleTe: 'నోరు & గిట్టల పొక్కులు (FMD)',
    animal: 'Cattle / Goat',
    simulatedMatch: 'Foot and Mouth Disease (Sample)',
    image: 'https://images.unsplash.com/photo-1546445317-29f4545f9d52?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'mastitis_udder',
    titleEn: 'Udder Redness & Swelling',
    titleMr: 'कासेची सूज आणि लालसरपणा (मस्टाईटिस / स्तनदाह)',
    titleHi: 'थन की सूजन व लाली (मास्टाइटिस)',
    titleTe: 'పొదుగు వాపు & ఎర్రబడటం',
    animal: 'Dairy Cow',
    simulatedMatch: 'Bovine Mastitis (Sample)',
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=400&q=80'
  }
];
