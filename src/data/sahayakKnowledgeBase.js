/**
 * Sahayak Comprehensive Veterinary Knowledge Base & Offline Inference Engine
 * Sources:
 * - ICAR-NIVEDI (National Institute of Veterinary Epidemiology and Disease Informatics) / NADRES v2
 * - DAHD (Department of Animal Husbandry & Dairying, Ministry of Fisheries, Animal Husbandry & Dairying, Govt of India)
 * - ICAR-IVRI (Indian Veterinary Research Institute) Division of Epidemiology
 * - ICAR-CARI (Central Avian Research Institute) Biosecurity Standards
 * - NDDB (National Dairy Development Board) Clean Milk & Mastitis Control Protocols
 */

export const KNOWLEDGE_BASE_ARTICLES = [
  {
    id: 'fmd',
    keywords: [
      'fmd', 'foot and mouth', 'foot & mouth', 'mouth disease', 'blister', 'drooling', 'salivation',
      'lameness', 'hoof', 'vesicle', 'खुरकूत', 'लाळ्या', 'खुरपका', 'मुंहपका', 'గాలికుంటు', 'లాలాజలం'
    ],
    topic: 'Foot and Mouth Disease (FMD / लाळ्या खुरकूत)',
    species: ['Cattle', 'Buffalo', 'Sheep', 'Goat', 'Pigs'],
    citation: {
      authority: 'DAHD & ICAR-NIVEDI',
      document: 'National Animal Disease Control Programme (NADCP) Standard Operating Procedure for FMD Containment & NADRES v2 Epidemiology Bulletin',
      year: '2024',
      section: 'Section 4: Bio-containment, Ring Vaccination & Supportive Care'
    },
    answers: {
      en: {
        title: 'Foot and Mouth Disease (FMD) Isolation & Management Protocol',
        summary: 'FMD is a highly contagious aphthovirus infection causing acute fever, vesicles on tongue/lips/dental pad and interdigital clefts of hooves, and sharp drop in milk production.',
        steps: [
          'Immediate Isolation: Shift affected animals to a dry, shaded shed away from healthy stock and common water troughs.',
          'Mouth & Hoof Hygiene: Clean mouth lesions twice daily with 1% potassium permanganate (KMnO4) wash or mild boric acid solution. Wash affected hooves with 4% sodium carbonate (washing soda) or 1% copper sulfate solution.',
          'Soft Nutrition: Offer cool clean water, easily digestible soft green grass, cooked rice/wheat gruel with jaggery to avoid chewing pain.',
          'Movement Restriction: Stop all cattle movements out of the village, do not sell unboiled milk, and restrict visitors or equipment sharing.',
          'Veterinary Care: Prohibit unprescribed antibiotic usage. Contact the nearest Veterinary Dispensary for supportive antipyretic/analgesic treatment and ring vaccination.'
        ],
        warning: '⚠️ High transmission risk through air, clothes, and vehicles. Calves drinking infected milk can suffer sudden death due to myocarditis (tiger heart).'
      },
      mr: {
        title: 'लाळ्या खुरकूत रोग (FMD) विलगीकरण व प्राथमिक उपचार नियमावली',
        summary: 'लाळ्या खुरकूत (FMD) हा अत्यंत संसर्गजन्य विषाणूजन्य रोग आहे. यामध्ये जनावरांना तीव्र ताप, तोंडात व जिभेवर फोड, लाळ गळणे, खुरांमध्ये जखमा व लंगडणे अशी लक्षणे दिसतात.',
        steps: [
          'तात्काळ विलगीकरण: आजारी जनावराला इतर निरोगी जनावरांपासून वेगळे करून कोरड्या, सावलीच्या गोठ्यात ठेवा.',
          'तोंड व खुरांची स्वच्छता: तोंडातील फोड १% पोटॅशियम परमँगनेटच्या पाण्याने (गुलाबी पाणी) किंवा बोरीक ॲसिडने दिवसातून दोनदा हळूवार धुवा. खुरांमधील जखमा ४% कपडे धुण्याच्या सोड्याने किंवा १% मोरचूद पाण्याने स्वच्छ करा.',
          'मऊ व सुपाच्य आहार: जनावराला कोमट पाणी, मऊ हिरवा चारा, पेज किंवा गूळ-भाताची कांजी द्या जेणेकरून खाताना तोंडात त्रास होणार नाही.',
          'वाहतूक बंदी: जनावरांना सामायिक चराऊ कुरणात किंवा बाजारात नेणे तात्काळ थांबवा. कच्चे दूध विकू नका.',
          'पशुवैद्यकीय संपर्क: स्वतःच्या मनाने कोणतीही प्रतिजैविके (एंटीबायोटिक) देऊ नका. जवळच्या पशुवैद्यकीय दवाखान्याशी संपर्क साधून उपचार घ्या.'
        ],
        warning: '⚠️ हा विषाणू हवेतून वेगाने पसरतो. लहान वासरांना बाधित गायीचे दूध दिल्यास हृदय विकाराने वासरू दगावू शकते.'
      },
      hi: {
        title: 'खुरपका-मुंहपका रोग (FMD) अलगाव एवं प्रबंधन प्रोटोकॉल',
        summary: 'एफएमडी एक अत्यंत संक्रामक विषाणु जनित रोग है, जिससे पशु में तेज बुखार, मुंह/जीभ पर छाले, लार टपकना, खुरों में छाले व लंगड़ापन होता है।',
        steps: [
          'तुरंत अलग करें: बीमार पशु को स्वस्थ पशुओं से तुरंत अलग हवादार व सूखे बाड़े में रखें।',
          'घावों की सफाई: मुंह के छालों को 1% पोटैशियम परमैंगनेट (लाल दवा) के घोल से दिन में दो बार साफ करें। खुरों के घावों को 4% वाशिंग सोडा घोल या 1% तूतिया घोल से धोएं।',
          'नरम चारा व दलिया: पशु को चबाने में दर्द होता है, इसलिए नरम हरा चारा, गुड़ का दलिया या चावल की मांड दें।',
          'आवाजाही पर रोक: पशु को बाहर चराने या बाजार में ले जाना पूर्णतया बंद करें।',
          'पशु चिकित्सक से संपर्क: बिना डॉक्टर की पर्ची कोई दवा न दें। सरकारी पशु अस्पताल से संपर्क करें।'
        ],
        warning: '⚠️ छोटे बछड़ों को संक्रमित दूध न पिलाएं, इससे उनकी अचानक मृत्यु हो सकती है।'
      },
      te: {
        title: 'గాలికుంటు వ్యాధి (FMD) రక్షణ & నిర్వహణ మార్గదర్శకాలు',
        summary: 'గాలికుంటు తీవ్రంగా వ్యాపించే వైరల్ వ్యాధి. తీవ్ర జ్వరం, నోటిలో పుండ్లు, లాలాజలం కారడం, గిట్టల మధ్య పుండ్లు మరియు కుంటుడు దీని ముఖ్య లక్షణాలు.',
        steps: [
          'వెంటనే వేరు చేయండి: అనారోగ్యంతో ఉన్న పశువులను ఆరోగ్యవంతమైన మంద నుండి వేరు చేసి పొడి పాకలో ఉంచండి.',
          'గాయాల శుభ్రత: నోటి పుండ్లను 1% పొటాషియం పర్మాంగనేట్ (గులాబీ నీరు) తో రోజుకు రెండుసార్లు కడగండి. గిట్టలను 4% సోడా నీటితో శుభ్రం చేయండి.',
          'మెత్తటి ఆహారం: నమలడానికి వీలుగా ఉండే మెత్తటి పచ్చిగడ్డి, గంజి, బెల్లం ద్రవం అందించండి.',
          'రవాణా నిషేధం: పశువులను ఇతర ప్రాంతాలకు లేదా సంతలకు తరలించవద్దు.',
          'పశువైద్యుడిని సంప్రదించండి: స్వంతంగా యాంటీబయాటిక్స్ వాడవద్దు. సమీప పశువైద్యశాలను సంప్రదించండి.'
        ],
        warning: '⚠️ చిన్న దూడలకు సోకిన పాలు తాగించవద్దు, గుండె వైఫల్యంతో చనిపోయే ప్రమాదం ఉంది.'
      }
    }
  },
  {
    id: 'anthrax',
    keywords: [
      'anthrax', 'sudden death', 'dark blood', 'uncoagulated', 'splenic fever', 'carcass', 'bleeding nose',
      'bleeding rectum', 'spores', 'zoonotic', 'अँथ्रॅक्स', 'प्लीहा ज्वर', 'शव', 'रक्तस्त्राव', 'एंथ्रेक्स',
      'ఆంథ్రాక్స్', 'రక్తం', 'అకస్మాత్తుగా మరణం'
    ],
    topic: 'Anthrax Bio-Containment Emergency Protocol (अँथ्रॅक्स आपत्कालीन नियमावली)',
    species: ['Cattle', 'Buffalo', 'Sheep', 'Goat', 'Humans (Zoonotic)'],
    citation: {
      authority: 'ICAR-IVRI & DAHD',
      document: 'National Anthrax Surveillance & Outbreak Bio-Containment Manual under Prevention of Contagious Diseases in Animals Act 2009',
      year: '2024',
      section: 'Schedule II Notifiable Zoonosis - Carcass Disposal SOP'
    },
    answers: {
      en: {
        title: 'Anthrax Bio-Containment & Carcass Disposal Protocol (CRITICAL ALERT)',
        summary: 'Anthrax (Bacillus anthracis) is a lethal bacterial zoonosis causing sudden death without prior illness, with dark, tarry, uncoagulated blood exuding from mouth, nostrils, and rectum. Rigor mortis is incomplete or absent.',
        steps: [
          'DO NOT OPEN OR DISSECT CARCASS: Post-mortem or flaying is STRICTLY PROHIBITED by law. When vegetative bacilli contact atmospheric air, they convert into resistant spores that survive in soil for 50+ years.',
          'Quarantine Stall Immediately: Barricade the stall. Cover the carcass with heavy tarpaulin, thorn bushes, or wire mesh to stop crows, dogs, rats, and predators from tearing flesh.',
          'Deep Pit Burial: Under official veterinary officer supervision, dig a pit at least 6 to 8 feet deep (well above ground water table). Cover bottom with 5 cm quicklime (unslaked lime), deposit carcass, cover with another thick layer of quicklime, then backfill.',
          'Premises Decontamination: Disinfect the stall, ropes, floor, and soil with 5% formalin or fresh 10% caustic soda (sodium hydroxide) solution. Burn bedding and left-over fodder.',
          'Emergency Notification: Immediately dial 1962 or notify the District Animal Husbandry Officer for ring vaccination of in-contact animals with Anthrax Spore Vaccine.'
        ],
        warning: '⚠️ EXTREME ZOONOTIC RISK: Humans touching infected fluids or skin can develop cutaneous anthrax (malignant carbuncle) or pulmonary anthrax. Always wear gloves, boots, and N95 masks.'
      },
      mr: {
        title: 'अँथ्रॅक्स संशयित आपत्कालीन जैव-सुरक्षा नियमावली (अति-तातडीचा इशारा)',
        summary: 'अँथ्रॅक्स (Bacillus anthracis) हा अत्यंत घातक जिवाणूजन्य संसर्ग आहे. जनावर कोणतीही पूर्वसूचना न देता अचानक मरण पावते व नाक, तोंड, गुदद्वारातून काळे, न गोठणारे डांबरासारखे रक्त वाहते.',
        steps: [
          'मृत जनावराचे शव कधीही कापू नका किंवा चिरू नका: कायद्यानुसार शवविच्छेदन (Post-mortem) व कातडे काढण्यास सक्त मनाई आहे. हवेच्या संपर्काने हवेत व मातीत ५० वर्षे टिकणारे प्राणघातक बीजाणू (spores) तयार होतात.',
          'गोठा तात्काळ बंद करा: मृतदेहावर ताडपत्री किंवा काटेरी झुडपे टाका जेणेकरून मोकाट कुत्रे, कावळे किंवा कोल्हे मृतदेहाला हात लावू शकणार नाहीत.',
          'खोल खड्ड्यात चुन्यासह दफन: पशुवैद्यकीय अधिकाऱ्यांच्या उपस्थितीत किमान ६ ते ८ फूट खोल खड्डा खणा. तळाशी चुन्याची पावडर टाका, मृतदेह ठेवा, त्यावर पुन्हा चुन्याचा ५ सेमी थर द्या आणि खड्डा मातीने बंद करा.',
          'गोठ्याचे निर्जंतुकीकरण: गोठ्याची जमीन, भिंती आणि अवजारे ५% फॉर्मेलिन किंवा १०% कॉस्टिक सोड्याने धुवून निर्जंतुक करा. शिल्लक चारा व अंथरूण जाळून टाका.',
          'तातडीने १९६२ वर कॉल करा: परिसरातील सर्व जनावरांच्या तात्काळ लसीकरणासाठी १९६२ हेल्पलाइन किंवा जिल्हा पशुसंवर्धन अधिकाऱ्यांशी संपर्क साधा.'
        ],
        warning: '⚠️ मानवी जीवितास धोका: हा रोग माणसांमध्येही पसरतो. मृत जनावराला उघड्या हाताने स्पर्श करू नका; हातमोजे व मास्क वापरा.'
      },
      hi: {
        title: 'एंथ्रेक्स जैव-सुरक्षा एवं शव निस्तारण आपातकालीन प्रोटोकॉल',
        summary: 'एंथ्रेक्स एक जानलेवा जीवाणु रोग है। पशु की अचानक मृत्यु होती है और प्राकृतिक छिद्रों (नाक, मुंह, गुदा) से काला, न जमने वाला खून बहता है।',
        steps: [
          'शव की चीर-फाड़ बिल्कुल न करें: पोस्टमार्टम या खाल उतारना कानूनी रूप से प्रतिबंधित है। हवा के संपर्क में आने से 50 साल तक जीवित रहने वाले घातक बीजाणु बनते हैं।',
          'बाड़े को तुरंत सील करें: शव को ढक दें ताकि कुत्ते, कौवे या जंगली जानवर इसे न नोच सकें।',
          '6-8 फीट गहरे गड्ढे में चूने के साथ दफनाएं: आधिकारिक पशु चिकित्सक की देखरेख में गहरे गड्ढे में चूना डालकर दफनाएं।',
          'कीटाणुशोधन: बाड़े और औजारों को 5% फॉर्मेलिन या चूने के घोल से साफ करें। बचा हुआ चारा जला दें।',
          '1962 पर तुरंत सूचित करें: नजदीकी पशुओं में आपातकालीन टीकाकरण हेतु 1962 पर कॉल करें।'
        ],
        warning: '⚠️ मनुष्यों के लिए घातक: संक्रमित पशु को छूने से इंसानों में भी यह रोग फैल सकता है।'
      },
      te: {
        title: 'ఆంథ్రాక్స్ అత్యవసర నిర్వహణ & పూడ్చివేత నిబంధనలు',
        summary: 'ఆంథ్రాక్స్ అత్యంత ప్రమాదకరమైన బాక్టీరియా వ్యాధి. పశువు అకస్మాత్తుగా మరణిస్తుంది, ముక్కు, నోరు, మలద్వారం నుండి గడ్డకట్టని నల్లటి రక్తం కారుతుంది.',
        steps: [
          'మృతదేహాన్ని ఎట్టి పరిస్థితుల్లోనూ కోయవద్దు: పోస్ట్‌మార్టం చేయడం చట్టరీత్యా నేరం. గాలి తగలడం వల్ల బ్యాక్టీరియా 50 ఏళ్ల పాటు మట్టిలో జీవించే బీజాలుగా మారుతుంది.',
          'పాకను వెంటనే క్వారంటైన్ చేయండి: కుక్కలు, పక్షులు తాకకుండా మృతదేహాన్ని గట్టిగా కప్పి ఉంచండి.',
          '6-8 అడుగుల లోతు గొయ్యిలో సున్నంతో పూడ్చండి: పశువైద్యాధికారి సమక్షంలో లోతైన గొయ్యి తీసి సున్నం వేసి పూడ్చాలి.',
          'క్రిమిసంహారక చర్యలు: 5% ఫార్మాలిన్ లేదా సున్నంతో పాకను పరిశుభ్రం చేయండి.',
          '1962 కు కాల్ చేయండి: సమీప పశువులకు రక్షణ టీకాలు వేయడానికి 1962 కు సమాచారం ఇవ్వండి.'
        ],
        warning: '⚠️ మనుషులకు వ్యాపించే ప్రమాదం ఉంది. గ్లోవ్స్ మరియు మాస్క్ లేకుండా తాకవద్దు.'
      }
    }
  },
  {
    id: 'ranikhet',
    keywords: [
      'ranikhet', 'newcastle', 'poultry', 'chicken', 'birds', 'flock', 'green diarrhea', 'neck twisting',
      'gasping', 'torticollis', 'rani khet', 'कोंबड्या', 'रानीखेत', 'कुक्कुट', 'पक्षी', 'ముర్గి', 'కోళ్ళు',
      'రాణీఖేత్', 'పౌల్ట్రీ'
    ],
    topic: 'Ranikhet Disease / Newcastle Disease (ND) in Poultry (रानीखेत रोग)',
    species: ['Poultry (Broilers, Layers, Backyard Country Birds)'],
    citation: {
      authority: 'ICAR-CARI & ICAR-NIVEDI',
      document: 'ICAR - Central Avian Research Institute Poultry Health Bulletin & NIVEDI Monthly Avian Pathogen Advisory',
      year: '2024',
      section: 'Standard Biosecurity Guideline for Velogenic Newcastle Disease Control'
    },
    answers: {
      en: {
        title: 'Ranikhet Disease (Newcastle Disease) Biosecurity & Control Protocol',
        summary: 'Ranikhet Disease is an acute, rapidly transmitting avian paramyxovirus causing high flock mortality, respiratory gasping, greenish-white diarrhea, and nervous signs (twisted neck / star gazing posture).',
        steps: [
          'Immediate Flock Quarantine: Halt all bird, egg, manure, and feed transport out of the farm premises. Ban visitors and poultry merchants.',
          'Strict Isolation: Physically separate visibly healthy birds from exhibiting birds in a separate shed. Do not share feeders or water pans.',
          'Deep Pit Carcass Disposal: Dead birds must be immediately collected in sealed plastic bags and buried at least 4-5 feet deep covered with quicklime powder or incinerated.',
          'Sanitization of Shed & Waterers: Disinfect poultry coops daily with 2-3% bleaching powder or potassium permanganate. Acidify drinking water with 1 ml apple cider vinegar or sanitizing chlorine tablets per 5 liters.',
          'Supportive Fluid Care: Provide oral electrolytes (ORS), Vitamin A, E, C and selenium stress packs in drinking water for surviving birds.',
          'Emergency Vaccination: Contact the Veterinary Officer for emergency Lasota / F1 strain eye-drop booster vaccination in unaffected birds in the 5 km surveillance zone.'
        ],
        warning: '⚠️ Highly infectious: The virus can spread mechanically through shoe soles, clothes, and poultry crates. Disinfect footwear before entering sheds.'
      },
      mr: {
        title: 'कोंबड्यांमधील रानीखेत रोग (Newcastle Disease) जैव-सुरक्षा व नियंत्रण नियमावली',
        summary: 'रानीखेत (ND) हा कुक्कुटपालनातील अत्यंत वेगाने पसरणारा विषाणूजन्य रोग आहे. यामध्ये कोंबड्यांना श्वास घेण्यास त्रास (घरघर), हिरवट पातळ विष्ठा, मान वाकडी होणे (लकवा) व मोठ्या प्रमाणावर अचानक मरतूक होते.',
        steps: [
          'फार्मची तात्काळ नाकेबंदी: शेतातील जिवंत पक्षी, अंडी, खत आणि खाद्याची शेताबाहेर वाहतूक त्वरित थांबवा. व्यापाऱ्यांना शेतात येण्यास बंदी घाला.',
          'पक्षांचे विलगीकरण: आजारी दिसणाऱ्या पक्षांना निरोगी पक्षांपासून त्वरित वेगळे करा. भांडी व खाद्य सामायिक करू नका.',
          'मृत पक्षांची सुरक्षित विल्हेवाट: मृत कोंबड्यांना त्वरित गोळा करून ४-५ फूट खोल खड्ड्यात चुन्याच्या पावडरसह पुरा किंवा जाळून टाका.',
          'खुराड्यांचे निर्जंतुकीकरण: खुराडे आणि पाण्याची भांडी २% ब्लिचिंग पावडर किंवा पोटॅशियम परमँगनेटच्या पाण्याने दररोज स्वच्छ करा.',
          'पाण्यातून जीवनसत्त्वे: पिण्याच्या पाण्यातून ओआरएस (इलेक्ट्रोलाइट्स), व्हिटॅमिन ई, सी आणि बी-कॉम्प्लेक्स पूरक औषधे द्या.',
          'तातडीचे लसीकरण: सरकारी पशुवैद्यकीय अधिकाऱ्यांशी संपर्क साधून आजूबाजूच्या निरोगी पक्षांमध्ये लासोटा (Lasota) लसीकरण करून घ्या.'
        ],
        warning: '⚠️ हा विषाणू चपला, कपडे आणि अंड्यांच्या क्रेट्सद्वारे एका शेतातून दुसऱ्या शेतात सहज पसरतो.'
      },
      hi: {
        title: 'मुर्गियों में रानीखेत रोग (न्यूकैसल डिजीज) नियंत्रण एवं जैव-सुरक्षा उपाय',
        summary: 'रानीखेत एक घातक संक्रामक रोग है जिससे मुर्गियों में सांस लेने में दिक्कत, हरी पतली बीट, गर्दन घूम जाना और भारी संख्या में मृत्यु होती है।',
        steps: [
          'फार्म का तुरंत क्वारंटाइन: मुर्गियों, अंडों और खाद की बिक्री तुरंत रोकें। बाहरी लोगों का प्रवेश बंद करें।',
          'अलग करें: बीमार पक्षियों को स्वस्थ पक्षियों से अलग शेड में रखें।',
          'मृत पक्षियों का सुरक्षित निस्तारण: मृत पक्षियों को 4-5 फीट गहरे गड्ढे में चूना डालकर दफनाएं।',
          'दड़बों की सफाई: ब्लीचिंग पाउडर या लाल दवा के घोल से बर्तन और जाली रोजाना साफ करें।',
          'इलेक्ट्रोलाइट्स व विटामिन: पीने के पानी में ओआरएस, विटामिन ए, ई और सी दें।',
          'पशु डॉक्टर से संपर्क: लासोटा वैक्सीन बूस्टर के लिए पशु चिकित्सा अधिकारी से संपर्क करें।'
        ],
        warning: '⚠️ जूते और कपड़ों के जरिए वायरस फैलता है। शेड में जाने से पहले पैर कीटाणुरहित करें।'
      },
      te: {
        title: 'కోళ్ళలో రాణీఖేత్ వ్యాధి నివారణ & నిర్వహణ నియమావళి',
        summary: 'రాణీఖేత్ కోళ్ళలో వేగంగా వ్యాపించే వైరస్. ఆయాసం, ఆకుపచ్చని విరేచనాలు, మెడ వంకరపోవడం మరియు అధిక సంఖ్యలో మరణాలు సంభవిస్తాయి.',
        steps: [
          'ఫారం రవాణా బంద్: కోళ్ళు, గుడ్లు మరియు ఎరువుల రవాణాను వెంటనే నిలిపివేయండి.',
          'జబ్బుపడిన కోళ్ళను వేరు చేయండి: అనారోగ్యంతో ఉన్న కోళ్ళను వేరే షెడ్డులోకి తరలించండి.',
          'మృతదేహాల పూడ్చివేత: చనిపోయిన పక్షులను 4 అడుగుల లోతు గొయ్యిలో సున్నం వేసి పూడ్చాలి.',
          'బ్లీచింగ్ పౌడర్ పిచికారీ: షెడ్డు, తాగునీటి పాత్రలను బ్లీచింగ్ లేదా క్రిమిసంహారకాలతో కడగాలి.',
          'విటమిన్లు & ORS: తాగునీటిలో ఎలక్ట్రోలైట్లు మరియు విటమిన్ సప్లిమెంట్లు ఇవ్వండి.',
          'టీకాలు: మిగిలిన కోళ్ళకు లాసోటా వ్యాక్సిన్ వేయించడానికి పశువైద్యుడిని సంప్రదించండి.'
        ],
        warning: '⚠️ పాదరక్షలు మరియు క్రేట్ల ద్వారా ఈ వైరస్ సులభంగా వ్యాపిస్తుంది.'
      }
    }
  },
  {
    id: 'vaccination',
    keywords: [
      'vaccine', 'vaccination', 'schedule', 'timetable', 'shots', 'nadcp', 'booster', 'immunization',
      'लसीकरण', 'लस', 'वेळापत्रक', 'टीकाकरण', 'टीका', 'सारणी', 'షెడ్యూల్', 'టీకాలు', 'వ్యాక్సిన్'
    ],
    topic: 'National Livestock Vaccination Schedule (राष्ट्रीय पशु लसीकरण वेळापत्रक)',
    species: ['Cattle', 'Buffalo', 'Sheep', 'Goat'],
    citation: {
      authority: 'DAHD & National Animal Disease Control Programme (NADCP)',
      document: 'National Comprehensive Vaccination Calendar & Guidelines for Dairy Cattle and Ruminants (Govt of India)',
      year: '2024',
      section: 'Standard Schedule for FMD, HS, BQ, Brucellosis and LSD'
    },
    answers: {
      en: {
        title: 'Official National Vaccination Schedule for Cattle and Buffaloes',
        summary: 'Timely vaccination is the only definitive protection against economically disastrous livestock epidemics. Under the Central Government NADCP scheme, vaccinations are provided free of cost.',
        steps: [
          'Foot & Mouth Disease (FMD): 1st dose at 4 months age; Booster after 1 month; thereafter Revaccination every 6 months (Bi-annually).',
          'Haemorrhagic Septicaemia (HS / Galghontu): Annual pre-monsoon vaccination in May-June before rain begins.',
          'Black Quarter (BQ / Pharsujna): Annual pre-monsoon vaccination in May-June for cattle aged 6 months to 3 years.',
          'Brucellosis (Calfhood S19 / Strain 19): Single lifetime dose strictly administered to female calves between 4 and 8 months of age. Never vaccinate male calves or adult cows.',
          'Lumpy Skin Disease (LSD): Annual vaccination using Goat Pox vaccine (Uttarkashi strain) at prescribed veterinary dosage prior to vector fly season.',
          'PPR (Peste des Petits Ruminants in Sheep/Goats): Single lifetime vaccination at 4 months of age providing 3+ years solid immunity.'
        ],
        warning: '⚠️ Cold Chain Mandate: Vaccines must be stored between 2°C to 8°C. Never vaccinate heavily pregnant animals (last month), debilitated animals, or animals currently running a high fever.'
      },
      mr: {
        title: 'गाई-म्हशींचे अधिकृत राष्ट्रीय लसीकरण वेळापत्रक (NADCP)',
        summary: 'जनावरांना घातक साथीच्या रोगांपासून वाचवण्यासाठी नियमित लसीकरण हाच एकमेव खात्रीशीर उपाय आहे. केंद्र व राज्य शासनाच्या योजनांनुसार लसीकरण मोफत उपलब्ध आहे.',
        steps: [
          'लाळ्या खुरकूत (FMD): वयाच्या ४ थ्या महिन्यात पहिला डोस; १ महिन्यानंतर बूस्टर; त्यानंतर दर ६ महिन्यांनी नियमित डोस.',
          'घटसर्प (HS): पावसाळ्यापूर्वी (मे-जून महिन्यात) दरवर्षी एकदा.',
          'फऱ्या (BQ): पावसाळ्यापूर्वी (मे-जून महिन्यात) ६ महिने ते ३ वर्षे वयाच्या जनावरांना दरवर्षी एकदा.',
          'ब्रुसेलोसिस (वासरू लसीकरण - S19): वयाच्या ४ ते ८ महिने वयाच्या केवळ कालवडींना (मादी वासरू) आयुष्यातून एकदाच दिली जाते. प्रौढ गायींना किंवा बैलांना देऊ नये.',
          'लंपी त्वचा रोग (LSD): गोट पॉक्स लस पावसाळ्यापूर्वी दरवर्षी एकदा.',
          'शेळ्या-मेंढ्यांचे पीपीआर (PPR): वयाच्या ४ थ्या महिन्यात एकदाच दिल्यास ३ वर्षांपेक्षा जास्त प्रतिकारशक्ती मिळते.'
        ],
        warning: '⚠️ लस नेहमी शीतसाखळीत (२° ते ८° सेल्सिअस) ठेवलेली असावी. तीव्र ताप असलेल्या किंवा शेवटच्या महिन्यातील गाभण जनावराला लस देऊ नये.'
      },
      hi: {
        title: 'गाय और भैंस के लिए राष्ट्रीय टीकाकरण सारणी (NADCP)',
        summary: 'घातक बीमारियों से बचाव के लिए समय पर टीकाकरण आवश्यक है। सरकारी पशु चिकित्सालयों में यह टीके उपलब्ध हैं।',
        steps: [
          'खुरपका-मुंहपका (FMD): 4 माह की उम्र में पहला टीका; 1 माह बाद बूस्टर; फिर हर 6 महीने में नियमित।',
          'गलघोंटू (HS): मानसून से पूर्व (मई-जून) में हर साल एक बार।',
          'लंगड़ा बुखार (BQ): मानसून से पूर्व (मई-जून) में 6 माह से 3 वर्ष के पशुओं को हर साल।',
          'ब्रूसीलोसिस: 4 से 8 माह की बछड़ियों को जीवन में सिर्फ एक बार (S19 टीका)।',
          'लम्पी स्किन रोग (LSD): गोट पॉक्स वैक्सीन साल में एक बार।',
          'बकरियों में पीपीआर: 4 महीने की उम्र में जीवन में एक बार।'
        ],
        warning: '⚠️ बीमार, तेज बुखार वाले या अंतिम महीने के गाभिन पशु को टीका न लगाएं।'
      },
      te: {
        title: 'పశువుల జాతీయ టీకాల షెడ్యూల్ (NADCP)',
        summary: 'తీవ్రమైన వ్యాధుల బారిన పడకుండా పశువులను కాపాడుకోవడానికి క్రమం తప్పకుండా టీకాలు వేయించడం తప్పనిసరి.',
        steps: [
          'గాలికుంటు (FMD): 4వ నెలలో మొదటి టీకా; 1 నెల తర్వాత బూస్టర్; ఆపై ప్రతి 6 నెలలకు ఒకసారి.',
          'గొంతువాపు (HS): వర్షాకాలానికి ముందు (మే-జూన్) లో సంవత్సరానికి ఒకసారి.',
          'జబ్బవాపు (BQ): వర్షాకాలానికి ముందు 6 నెలల నుండి 3 ఏళ్ల వయస్సున్న పశువులకు.',
          'బ్రూసెల్లోసిస్: 4 నుండి 8 నెలల ఆడ దూడలకు జీవితంలో ఒకే ఒకసారి.',
          'లంపీ స్కిన్ (LSD): వర్షాకాలానికి ముందు గోట్ పాక్స్ వ్యాక్సిన్ సంవత్సరానికి ఒకసారి.'
        ],
        warning: '⚠️ వ్యాక్సిన్లను 2°C నుండి 8°C ఉష్ణోగ్రత వద్ద భద్రపరచాలి. జ్వరం ఉన్న పశువులకు టీకాలు వేయవద్దు.'
      }
    }
  },
  {
    id: 'lsd',
    keywords: [
      'lsd', 'lumpy', 'skin disease', 'nodules', 'lumps', 'fly', 'mosquito', 'tick', 'लंपी', 'गाठी',
      'त्वचा', 'लम्पी', 'ఫోలికల్స్', 'లంపీ', 'ముద్దలు'
    ],
    topic: 'Lumpy Skin Disease (LSD) Vector Control & Herbal Care (लंपी त्वचा रोग)',
    species: ['Cattle', 'Buffalo'],
    citation: {
      authority: 'DAHD & ICAR-NIVEDI',
      document: 'Revised Advisory & Guidelines for Prevention and Control of Lumpy Skin Disease in Cattle (Govt of India)',
      year: '2024',
      section: 'Section 3: Vector Management, Supportive Herbal Formulation & Ring Vaccination'
    },
    answers: {
      en: {
        title: 'Lumpy Skin Disease (LSD) Management & First-Aid Guidelines',
        summary: 'LSD is a capripox viral infection transmitted by blood-sucking flies, mosquitoes, and ticks. Symptoms include high fever, 2-5 cm hard skin nodules, swelling in legs and dewlap, and nasal discharge.',
        steps: [
          'Vector Control: Spray cattle shed with botanical insect repellents (neem oil spray) or vet-recommended deltamethrin spray to stop biting flies and mosquitoes.',
          'Skin Lesion Care: Apply indigenous herbal paste (fresh neem leaves + turmeric powder + virgin coconut oil / sesame oil) gently over intact skin nodules.',
          'Hydration & Diet: Feed soft green grass and warm electrolyte water (water with salt, jaggery, and baking soda) to counter fever dehydration.',
          'Isolation: Keep infected cattle in mosquito-netted or shaded enclosures. Do not share grazing pasture.',
          'Ring Vaccination: Healthy cattle within 5-10 km radius should be vaccinated with Goat Pox Vaccine under veterinary supervision.'
        ],
        warning: '⚠️ Do not burst or cut the skin nodules. Secondary fly strike (maggots) can occur if open sores are neglected. Apply herbal fly repellent on open wounds.'
      },
      mr: {
        title: 'लंपी त्वचा रोग (LSD) कीटक नियंत्रण व प्राथमिक उपचार मार्गदर्शक',
        summary: 'लंपी हा गोवंशामध्ये डास, गोचीड आणि चावणाऱ्या माश्यांमुळे पसरणारा विषाणूजन्य रोग आहे. यामध्ये अंगावर २-५ सेमी आकाराच्या कडक गाठी येतात, पाय सुजतात आणि तीव्र ताप येतो.',
        steps: [
          'कीटक व माश्यांचे नियंत्रण: गोठ्यात डास व माश्यांचा प्रादुर्भाव रोखण्यासाठी कडुलिंबाच्या पाल्याची धुरी करा किंवा कडुनिंब तेलाची फवारणी करा.',
          'गाठींवर प्राथमिक मलम: अंगावरील गाठींवर ताजी हळद + कडुनिंबाची पाने + खोबरेल तेल यांची बारीक वाटून केलेली मलम हळूवार लावा.',
          'सुपाच्य आहार व पाणी: जनावराला भरपूर ताजे पिण्याचे पाणी, गूळ, मीठ व खाण्याचा सोडा मिसळलेले पाणी आणि मऊ हिरवा चारा द्या.',
          'विलगीकरण: आजारी जनावराला इतर जनावरांपासून पूर्णपणे वेगळे ठेवा.',
          'लसीकरण: परिसरातील निरोगी जनावरांना गोट पॉक्स लस टोचून घेण्यासाठी पशुवैद्यकीय दवाखान्याशी संपर्क साधा.'
        ],
        warning: '⚠️ त्वचेवरील गाठी फोडू नका किंवा कापू नका. जखमा उघड्या राहिल्यास त्यात किडे (अळ्या) पडू शकतात.'
      },
      hi: {
        title: 'लम्पी त्वचा रोग (LSD) प्रबंधन एवं प्राथमिक उपचार',
        summary: 'लम्पी रोग मच्छरों, मक्खियों और चीचड़ों द्वारा फैलता है। इसमें त्वचा पर 2-5 सेमी की गांठें, तेज बुखार और पैरों में सूजन आती है।',
        steps: [
          'मक्खी-मच्छर नियंत्रण: बाड़े में नीम की धूनी करें या नीम के तेल का छिड़काव करें।',
          'हल्दी-नीम लेप: त्वचा की गांठों पर ताजी पिसी हल्दी, नीम पत्ती और नारियल तेल का लेप लगाएं।',
          'तरल आहार: पशु को गुड़, नमक व मीठा सोडा मिला पानी और सुपाच्य हरा चारा दें।',
          'अलगाव: संक्रमित पशु को अलग शेड में रखें।',
          'टीकाकरण: स्वस्थ पशुओं को गोट पॉक्स का टीका लगवाएं।'
        ],
        warning: '⚠️ गांठों को फोड़ें नहीं, घाव में कीड़े पड़ने का खतरा रहता है।'
      },
      te: {
        title: 'లంపీ స్కిన్ వ్యాధి నివారణ & నాటు వైద్య మార్గదర్శకాలు',
        summary: 'లంపీ వ్యాధి ఈగలు, దోమలు మరియు గోమార్ల ద్వారా వ్యాపిస్తుంది. చర్మంపై కణుతులు, తీవ్ర జ్వరం, కాళ్ళ వాపు కనిపిస్తాయి.',
        steps: [
          'దోమలు, ఈగల నివారణ: పాకలో వేపనూనె పిచికారీ చేయండి లేదా వేపాకు పొగ వేయండి.',
          'పసుపు-వేప లేపనం: చర్మంపై వచ్చిన కణుతులపై పసుపు, వేపాకు ముద్ద మరియు కొబ్బరినూనె మిశ్రమాన్ని రాయండి.',
          'ద్రవ ఆహారం: బెల్లం, ఉప్పు కలిపిన స్వచ్ఛమైన నీరు మరియు మెత్తటి పచ్చిగడ్డి ఇవ్వండి.',
          'క్వారంటైన్: అనారోగ్యంతో ఉన్న పశువులను ఇతర పశువుల నుండి దూరంగా ఉంచండి.',
          'వ్యాక్సినేషన్: సమీప పశువైద్యశాలలో గోట్ పాక్స్ వ్యాక్సిన్ వేయించండి.'
        ],
        warning: '⚠️ కణుతులను కోయవద్దు, పురుగులు పడే ప్రమాదం ఉంది.'
      }
    }
  },
  {
    id: 'mastitis',
    keywords: [
      'mastitis', 'udder', 'teat', 'curdling', 'yellow milk', 'watery milk', 'blood milk', 'flakes',
      'clots', 'स्तनदाह', 'कासदाह', 'मॅस्टायटिस', 'दूध फाटणे', 'थनेला', 'थन', 'మస్టిటిస్', 'పొదుగు', 'పాలు చెడడం'
    ],
    topic: 'Bovine Mastitis & Clean Milk Hygiene (स्तनदाह / थनेला रोग)',
    species: ['Cattle', 'Buffalo', 'Goat'],
    citation: {
      authority: 'NDDB & ICAR-IVRI',
      document: 'National Dairy Development Board Mastitis Control Protocols & IVRI Udder Health Guidelines',
      year: '2024',
      section: 'Section 2: California Mastitis Test (CMT), Teat Dipping & Milking Hygiene'
    },
    answers: {
      en: {
        title: 'Bovine Mastitis Udder Care & Milking Protocol',
        summary: 'Mastitis is an inflammatory infection of the mammary glands caused by bacteria. Signs include swollen, hard, hot, or painful quarters, with milk turning watery, curdled, flaky, or blood-stained.',
        steps: [
          'Isolate Quarter Strippings: Strip out the infected quarter completely and frequently (3-4 times a day) into a separate discard cup containing disinfectant. NEVER strip infected milk onto the floor.',
          'Cold Water / Ice Compresses: If the udder is acutely hot and hard, apply cold water or ice pack compresses for 10-15 minutes to reduce pain and congestion.',
          'Pre- and Post-Milking Teat Dip: Dip all teats in 0.5% povidone-iodine solution before and immediately after milking.',
          'Maintain Milking Order: Always milk healthy young cows first, older cows next, and cows with mastitis strictly last.',
          'Professional Intramammary Therapy: Do not inject random antibiotics. Call a veterinarian for CMT (California Mastitis Test) and sterile intramammary infusion tube application.'
        ],
        warning: '⚠️ Do not consume, sell, or feed mastitic milk to young calves. Do not vigorously massage a hard, swollen udder as this can rupture internal glandular tissue.'
      },
      mr: {
        title: 'स्तनदाह / कासदाह (मॅस्टायटिस) व स्वच्छ दूध उत्पादन नियमावली',
        summary: 'स्तनदाह हा कासेचा जिवाणूजन्य संसर्ग आहे. यामध्ये कास कडक, गरम व सुजलेली असते, दूध पातळ, फाटलेले, गुठळ्या किंवा रक्ताळलेले येते.',
        steps: [
          'बाधित सडातील दूध वेगळे काढा: बाधित सडातील दूध दिवसातून ३-४ वेळा वेगळ्या भांड्यात पूर्णपणे पिळून बाहेर काढा. हे दूध कधीही गोठ्याच्या जमिनीवर पिळू नका.',
          'थंड पाण्याचा शेक: कास अत्यंत गरम व सुजलेली असल्यास १०-१५ मिनिटे बर्फाचा किंवा थंड पाण्याचा शेक द्या.',
          'सडांची निर्जंतुकीकरण बुडवणी (Teat Dipping): दूध काढण्यापूर्वी व नंतर सड ०.५% पोव्हिडोन आयोडिनच्या द्रावणात बुडवा.',
          'दूध काढण्याचा क्रम: प्रथम निरोगी जनावरांचे दूध काढा आणि कासदाह झालेल्या जनावराचे दूध सर्वात शेवटी काढा.',
          'पशुवैद्यकीय उपचार: स्वतःच्या मनाने सडात कोणतीही नळी घालू नका. डॉक्टरांना बोलावून सडात सोडायची योग्य मलम (इन्ट्रा-मॅमरी ट्यूब) टोचून घ्या.'
        ],
        warning: '⚠️ कासदाहाचे दूध पिऊ नका किंवा वासराला पाजू नका. सुजलेली कास जोराने चोळू नका.'
      },
      hi: {
        title: 'थनेला रोग (मास्टाइटिस) प्रबंधन एवं थनों की सुरक्षा',
        summary: 'थनेला थनों का गंभीर संक्रामक रोग है। थन में सूजन, कड़ापन, दूध का फटना, छीछड़े आना या खून आना इसके मुख्य लक्षण हैं।',
        steps: [
          'प्रभावित थन को बार-बार खाली करें: खराब दूध को दिन में 3-4 बार अलग बर्तन में निकालें। फर्श पर न गिराएं।',
          'बर्फ या ठंडे पानी की सिकाई: थन गर्म व सूजा होने पर ठंडे पानी की सिकाई करें।',
          'थनों की सफाई (टीट डिपिंग): दूध निकालने के बाद थनों को 0.5% पोविडोन आयोडीन में डुबोएं।',
          'दूध निकालने का सही क्रम: स्वस्थ पशुओं का दूध पहले और थनेला पीड़ित पशु का दूध सबसे अंत में निकालें।',
          'डॉक्टर से संपर्क: इंट्रा-मैमरी ट्यूब व सही एंटीबायोटिक हेतु पशु चिकित्सक से संपर्क करें।'
        ],
        warning: '⚠️ थनेला का दूध बच्चों या बछड़ों को न पिलाएं। थनों की जोर से मालिश न करें।'
      },
      te: {
        title: 'మస్టిటిస్ (పొదుగు వాపు) నియంత్రణ & పాల నాణ్యత మార్గదర్శకాలు',
        summary: 'మస్టిటిస్ పొదుగుకు వచ్చే తీవ్రమైన బాక్టీరియా సంక్రమణం. పొదుగు వాపు, గట్టిపడటం, పాలు విరిగిపోవడం లేదా రక్తం రావడం జరుగుతుంది.',
        steps: [
          'బాధిత పొదుగు పాలను వేరు చేయండి: చెడిపోయిన పాలను రోజుకు 3-4 సార్లు ప్రత్యేక పాత్రలోకి పిండి పారబోయండి.',
          'చల్లటి నీటి కాపడం: పొదుగు వేడిగా మరియు వాచి ఉంటే చల్లటి నీరు లేదా మంచుతో కాపడం పెట్టండి.',
          'టీట్ డిప్పింగ్: పాలు పితికిన తర్వాత చనుమొనలను పోవిడోన్ అయోడిన్ ద్రవంలో ముంచండి.',
          'పాలు పితికే క్రమం: ఆరోగ్యకరమైన పశువుల పాలు ముందుగా, వ్యాధి ఉన్న పశువుల పాలు చివరగా పితకాలి.',
          'పశువైద్య సహాయం: స్వయంగా మందులు వాడకుండా పశువైద్యుడి చేత పరీక్ష చేయించి చికిత్స అందించండి.'
        ],
        warning: '⚠️ ఈ పాలను తాగవద్దు మరియు దూడలకు తాగించవద్దు.'
      }
    }
  },
  {
    id: 'feeding_nutrition',
    keywords: [
      'feed', 'fodder', 'nutrition', 'diet', 'mineral mixture', 'silage', 'dry matter', 'ration',
      'चारा', 'खुराक', 'आहार', 'खनिज मिश्रण', 'पशु आहार', 'दाना', 'మేత', 'దాణా', 'ఖనిజ లవణాలు'
    ],
    topic: 'Scientific Dairy Feeding & Nutrition Guidelines (पशु पोषण व समतोल आहार)',
    species: ['Cattle', 'Buffalo'],
    citation: {
      authority: 'ICAR-NIANP & NDDB',
      document: 'ICAR - National Institute of Animal Nutrition and Physiology (NIANP) Scientific Livestock Ration Standards',
      year: '2024',
      section: 'Bulletin 14: Balanced Cattle Ration, Silage Making and Area-Specific Mineral Mixture'
    },
    answers: {
      en: {
        title: 'Scientific Dairy Cattle Ration & Nutrition Standards',
        summary: 'A milking cow or buffalo requires balanced dry matter (2.5% to 3% of body weight) split into green fodder, dry fodder, and concentrate balanced with minerals and clean water.',
        steps: [
          'Roughage Proportion: Feed 2/3 of total ration as roughages (1 part dry straw/kadbi + 2 parts succulent green grass like Napier, Lucerne, or Maize).',
          'Concentrate Mash: Provide 1.5 kg concentrate for body maintenance + 400g concentrate per liter of cow milk (or 500g per liter of buffalo milk).',
          'Area-Specific Mineral Mixture (ASMM): Add 50g to 80g of ISI-certified area-specific mineral mixture and 30g common salt daily to maintain reproductive fertility and milk yield.',
          'Clean Water Ad-Libitum: High yielding dairy cows require 60 to 80 liters of clean, fresh drinking water daily.',
          'Avoid Sudden Diet Changes: Introduce silage or new feed gradually over 7 to 10 days to avoid rumen acidosis or acute bloat.'
        ],
        warning: '⚠️ Never feed moldy, fungus-affected straw or spoiled damp feed (aflatoxin risk). Keep rock salt blocks in stalls.'
      },
      mr: {
        title: 'दुभत्या जनावरांचा समतोल आहार व पोषण नियमावली (ICAR-NIANP)',
        summary: 'जनावरांच्या शरीराच्या वजनाच्या २.५% ते ३% शुष्क घटक (Dry Matter) आहारातून मिळणे आवश्यक आहे. यामध्ये हिरवा चारा, सुका चारा व पशुखाद्य यांचा योग्य समतोल असावा.',
        steps: [
          'चाऱ्याचे प्रमाण: एकूण चाऱ्यामध्ये २/३ भाग चारा (१ भाग कडबा/सुका चारा + २ भाग हिरवा चारा जसे की नेपिअर, मका, लसूण घास) असावा.',
          'समतोल पशुखाद्य: जनावराच्या शरीराच्या देखभालीसाठी १.५ किलो आणि प्रत्येक लिटर दुधामागे ४०० ग्रॅम (म्हशीसाठी ५०० ग्रॅम) पशुखाद्य द्यावे.',
          'खनिज मिश्रण व मीठ: दररोज ५० ते ८० ग्रॅम दर्जेदार खनिज मिश्रण (Mineral Mixture) आणि ३० ते ५० ग्रॅम साधे मीठ खाद्यातून अवश्य द्यावे.',
          'स्वच्छ व मुबलक पाणी: एका दुभत्या जनावराला दिवसाला किमान ६० ते ८० लिटर स्वच्छ पिण्याचे पाणी उपलब्ध असावे.',
          'आहारात अचानक बदल नको: नवीन चारा किंवा सायलेज सुरू करताना ७-१० दिवसांत हळूहळू सवय लावावी.'
        ],
        warning: '⚠️ बुरशी लागलेला किंवा कुजलेला चारा जनावरांना कधीही खाऊ घालू नका (ॲफ्लाटॉक्सिन विषबाधेचा धोका).'
      },
      hi: {
        title: 'दुधारू पशुओं के लिए संतुलित आहार व पोषण निर्देशिका',
        summary: 'स्वस्थ पशु और अधिक दूध उत्पादन के लिए हरा चारा, सूखा चारा, दाना और खनिज मिश्रण का सही अनुपात आवश्यक है।',
        steps: [
          'चारे का अनुपात: 2/3 भाग चारा (1 भाग सूखा भूसा + 2 भाग हरा चारा) दें।',
          'दाना मिश्रण: शरीर रक्षा के लिए 1.5 किलो और प्रति लीटर दूध पर 400 ग्राम दाना दें।',
          'खनिज मिश्रण (मिनरल मिक्सचर): 50-80 ग्राम मिनरल मिक्सचर और 30 ग्राम साधारण नमक रोज दें।',
          'पीने का पानी: 24 घंटे स्वच्छ और ताजा पानी उपलब्ध रखें (रोज 60-80 लीटर)।',
          'अचानक बदलाव से बचें: नए चारे की आदत धीरे-धीरे 7-10 दिनों में डालें ताकि आफरा न हो।'
        ],
        warning: '⚠️ फफूंद लगा हुआ चारा न खिलाएं, इससे अफलाटॉक्सिन जहर फैलने का खतरा रहता है।'
      },
      te: {
        title: 'పాడి పశువుల సమతుల్య ఆహారం & పోషణ ప్రమాణాలు',
        summary: 'పాడి పశువులకు పచ్చిమేత, ఎండుమేత, దాణా మరియు ఖనిజ లవణాల మిశ్రమం సరైన మోతాదులో ఇవ్వాలి.',
        steps: [
          'మేత నిష్పత్తి: 2 భాగాలు పచ్చిమేత, 1 భాగం ఎండుమేత ఇవ్వాలి.',
          'దాణా: శరీర పోషణకు 1.5 కిలోలు మరియు ప్రతి లీటరు పాలకు 400 గ్రాముల దాణా అందించాలి.',
          'ఖనిజ లవణాలు: రోజుకు 50-80 గ్రాముల మినరల్ మిశ్రమం మరియు 30 గ్రాముల ఉప్పు తప్పనిసరిగా కలపాలి.',
          'మంచి నీరు: ప్రతి పాడి ఆవుకు రోజుకు 60-80 లీటర్ల తాజా నీరు అవసరం.',
          'ఆహారంలో మార్పులు: కొత్త ఆహారాన్ని క్రమంగా అలవాటు చేయండి.'
        ],
        warning: '⚠️ బూజు పట్టిన గడ్డిని ఎట్టి పరిస్థితుల్లోనూ పశువులకు వేయవద్దు.'
      }
    }
  },
  {
    id: 'emergency_1962',
    keywords: [
      '1962', 'toll free', 'emergency', 'ambulance', 'mvu', 'helpline', 'call center', 'पशु रुग्णवाहिका',
      'आपत्कालीन हेल्पलाइन', 'हेल्पलाइन', 'एम्बुलेंस', 'కాల్ సెంటర్', 'ఎమర్జెన్సీ', 'అంబులెన్స్'
    ],
    topic: '1962 Mobile Veterinary Unit (MVU) Emergency Service (१९६२ पशु रुग्णवाहिका सेवा)',
    species: ['All Livestock Species'],
    citation: {
      authority: 'DAHD (Govt of India) & State Animal Husbandry Department',
      document: 'Livestock Health and Disease Control Programme (LHDCP) Guidelines for Mobile Veterinary Units',
      year: '2024',
      section: 'Central Toll-Free 1962 Dispatch Protocol & On-Farm Emergency Response'
    },
    answers: {
      en: {
        title: '1962 National Animal Emergency & Mobile Veterinary Unit (MVU) Protocol',
        summary: 'Toll-free helpline 1962 connects rural farmers directly to the State Veterinary Emergency Command Center for on-farm emergency doctor dispatch.',
        steps: [
          'Dial 1962 (Toll-Free): Available 24x7 from any mobile or landline across Maharashtra, Andhra Pradesh, and other states.',
          'Provide Exact Location: Clearly tell the call executive your District, Taluka/Mandal, Village, and nearest landmark.',
          'Describe Animal Emergency: State species (cow, buffalo, sheep, goat), observed symptoms, temperature if taken, and whether animal is down/unable to stand.',
          'MVU Dispatch: The nearest Mobile Veterinary Unit (equipped with Veterinary Officer, Paravet, emergency drugs, and basic surgery kit) is dispatched to your doorstep.',
          'Pre-Arrival First-Aid: Keep the animal in shade, do not force-feed liquids if animal is choking or bloated, and keep clean drinking water ready.'
        ],
        warning: '⚠️ For suspected Anthrax or sudden uncoagulated bleeding, explicitly mention "Suspected Contagious Epidemic" during the 1962 call for hazmat containment.'
      },
      mr: {
        title: '१९६२ पशु रुग्णवाहिका (MVU) व आपत्कालीन सेवा नियमावली',
        summary: '१९६२ हा टोल-फ्री क्रमांक ग्रामीण भागातील पशुपालकांसाठी फिरत्या पशुवैद्यकीय रुग्णवाहिकेची (MVU) तातडीची सेवा पुरवतो.',
        steps: [
          '१९६२ वर संपर्क करा (टोल-फ्री): कोणत्याही मोबाईलवरून चोवीस तास मोफत कॉल करता येतो.',
          'अचूक पत्ता सांगा: तुमचा जिल्हा, तालुका, गाव आणि जवळची खूण कॉल ऑपरेटरला स्पष्ट सांगा.',
          'जनावराची समस्या सांगा: जनावराचा प्रकार (गाय, म्हैस, शेळी), दिसणारी लक्षणे आणि जनावर उभे राहू शकत नसल्यास स्पष्ट नमूद करा.',
          'रुग्णवाहिका आगमन: पशुवैद्यकीय अधिकारी, औषधे व साधनांसह सज्ज असलेली रुग्णवाहिका थेट तुमच्या गोठ्यात दाखल होते.',
          'डॉक्टर येईपर्यंत काळजी: जनावराला सावलीत ठेवा, पोटफुगी किंवा बेशुद्ध असल्यास जबरदस्तीने पाणी किंवा औषध पाजू नका.'
        ],
        warning: '⚠️ अँथ्रॅक्स किंवा अचानक मृत्यूचा संशय असल्यास कॉलवर तात्काळ सांगा जेणेकरून अधिकारी सुरक्षा साधनांसह येतील.'
      },
      hi: {
        title: '1962 पशु आपातकालीन एम्बुलेंस (MVU) सेवा निर्देश',
        summary: '1962 टोल-फ्री नंबर पर कॉल करके किसान अपने दरवाजे पर पशु चिकित्सक और एम्बुलेंस बुला सकते हैं।',
        steps: [
          '1962 पर कॉल करें: यह 24 घंटे चलने वाला मुफ्त सरकारी नंबर है।',
          'पूरा पता नोट कराएं: जिला, तहसील, गांव और लैंडमार्क बताएं।',
          'बीमारी की स्थिति बताएं: पशु की प्रजाति और आपात स्थिति स्पष्ट करें।',
          'मोबाइल वेटेरिनरी यूनिट: डॉक्टर और दवाइयों से लैस वाहन आपके बाड़े तक पहुंचेगा।',
          'डॉक्टर आने तक देखभाल: पशु को छायादार जगह पर रखें और जबरन दवा न पिलाएं।'
        ],
        warning: '⚠️ अगर संक्रामक बीमारी या अचानक खून बहने का शक हो तो कॉल पर तुरंत बताएं।'
      },
      te: {
        title: '1962 మొబైల్ వెటర్నరీ అంబులెన్స్ అత్యవసర సేవలు',
        summary: '1962 టోల్-ఫ్రీ నంబర్ ద్వారా రైతులు తమ ఇంటి వద్దకే పశువైద్య సేవలను మరియు అంబులెన్స్‌ను పొందవచ్చు.',
        steps: [
          '1962 కు కాల్ చేయండి: ఇది 24 గంటలు అందుబాటులో ఉండే ఉచిత ప్రభుత్వ నంబర్.',
          'సరైన చిరునామా తెలపండి: జిల్లా, మండలం, గ్రామం వివరాలు స్పష్టంగా చెప్పండి.',
          'సమస్యను వివరించండి: పశువు రకం మరియు అత్యవసర లక్షణాలను తెలియజేయండి.',
          'మొబైల్ అంబులెన్స్ రాక: పశువైద్యుడు మరియు మందులతో కూడిన అంబులెన్స్ మీ వద్దకు చేరుకుంటుంది.',
          'వైద్యుడు వచ్చే వరకు: పశువును నీడలో ఉంచండి, బలవంతంగా ద్రవాలు తాగించవద్దు.'
        ],
        warning: '⚠️ ఆంథ్రాక్స్ వంటి ప్రమాదకర వ్యాధుల అనుమానం ఉంటే కాల్‌లో వెంటనే చెప్పండి.'
      }
    }
  }
];

/**
 * Intelligent client-side query matcher with offline search support
 */
export function querySahayakKnowledgeBase(userQuery, lang = 'en') {
  if (!userQuery || typeof userQuery !== 'string') {
    return null;
  }

  const normalized = userQuery.toLowerCase().trim();

  // 1. Direct ID / Keyword Match Scoring
  let bestArticle = null;
  let highestScore = 0;

  for (const article of KNOWLEDGE_BASE_ARTICLES) {
    let score = 0;

    // Check if ID matches
    if (normalized.includes(article.id)) {
      score += 15;
    }

    // Check keyword hits
    for (const kw of article.keywords) {
      if (normalized.includes(kw.toLowerCase())) {
        score += 8;
      }
    }

    // Specific phrase bonuses
    if (article.id === 'fmd' && (normalized.includes('foot') || normalized.includes('mouth') || normalized.includes('खुर') || normalized.includes('लाळ्या'))) {
      score += 20;
    }
    if (article.id === 'anthrax' && (normalized.includes('sudden death') || normalized.includes('dark blood') || normalized.includes('carcass') || normalized.includes('अँथ्रॅक्स') || normalized.includes('ఆంథ్రాక్స్'))) {
      score += 25;
    }
    if (article.id === 'ranikhet' && (normalized.includes('ranikhet') || normalized.includes('newcastle') || normalized.includes('poultry') || normalized.includes('chicken') || normalized.includes('रानीखेत') || normalized.includes('కోళ్ళ'))) {
      score += 25;
    }
    if (article.id === 'vaccination' && (normalized.includes('vaccin') || normalized.includes('schedule') || normalized.includes('लस') || normalized.includes('टीका') || normalized.includes('టీకా'))) {
      score += 25;
    }
    if (article.id === 'lsd' && (normalized.includes('lumpy') || normalized.includes('lsd') || normalized.includes('लंपी') || normalized.includes('ലംపీ') || normalized.includes('nodule'))) {
      score += 25;
    }
    if (article.id === 'mastitis' && (normalized.includes('mastitis') || normalized.includes('udder') || normalized.includes('teat') || normalized.includes('कासदाह') || normalized.includes('थनेला') || normalized.includes('మస్టిటిస్'))) {
      score += 25;
    }
    if (article.id === 'emergency_1962' && (normalized.includes('1962') || normalized.includes('ambulance') || normalized.includes('helpline') || normalized.includes('रुग्णवाहिका') || normalized.includes('అంబులెన్స్'))) {
      score += 25;
    }
    if (article.id === 'feeding_nutrition' && (normalized.includes('feed') || normalized.includes('fodder') || normalized.includes('diet') || normalized.includes('चारा') || normalized.includes('आहार') || normalized.includes('మేత'))) {
      score += 25;
    }

    if (score > highestScore) {
      highestScore = score;
      bestArticle = article;
    }
  }

  // Target language selector with fallback to English
  const selectedLang = ['en', 'mr', 'hi', 'te'].includes(lang) ? lang : 'en';

  if (bestArticle && highestScore >= 5) {
    const localized = bestArticle.answers[selectedLang] || bestArticle.answers['en'];
    return {
      found: true,
      articleId: bestArticle.id,
      topic: bestArticle.topic,
      species: bestArticle.species,
      citation: bestArticle.citation,
      title: localized.title,
      summary: localized.summary,
      steps: localized.steps,
      warning: localized.warning,
      isOfflineCached: true
    };
  }

  // Default Generalized Veterinary Response with Authoritative Citation
  const generalResponses = {
    en: {
      title: 'General Veterinary Care & Diagnostic Guidance',
      summary: 'For optimal livestock health, ensure daily access to clean water (60-80L for cattle), balanced dry & green fodder, periodic deworming, and timely bi-annual vaccinations.',
      steps: [
        'Symptom Check: For clinical disease assessment and high-risk alerts, use the Symptom Check tool in this portal.',
        'Emergency 1962: For recumbent, comatose, or severely distressed animals, immediately call 1962 (Toll-Free Animal Ambulance).',
        'Biosecurity: Isolate any sick or feverish animal in a dry, disinfected shed away from healthy stock.',
        'Prescription Safety: Never administer antibiotics, steroids, or NSAIDs without a registered Veterinary Officer prescription.'
      ],
      warning: '⚠️ Tele-advisory guidance supports but does not replace on-farm physical examination by a registered veterinary doctor.'
    },
    mr: {
      title: 'सर्वसाधारण पशुवैद्यकीय काळजी व मार्गदर्शन',
      summary: 'जनावरांच्या उत्तम आरोग्यासाठी दररोज स्वच्छ पाणी (६०-८० लिटर), समतोल हिरवा व सुका चारा, नियमित जंतनिर्मूलन आणि वेळेवर लसीकरण अत्यंत आवश्यक आहे.',
      steps: [
        'लक्षण तपासणी: रोगाचे सविस्तर निदान करण्यासाठी या पोर्टलवरील "लक्षण तपासणी" (Symptom Check) सुविधेचा वापर करा.',
        'आपत्कालीन १९६२ सेवा: अति-गंभीर किंवा खाली पडलेल्या जनावरासाठी त्वरित १९६२ पशु रुग्णवाहिकेला कॉल करा.',
        'विलगीकरण: आजारी जनावराला इतर निरोगी जनावरांपासून तात्काळ कोरड्या व सावलीच्या गोठ्यात वेगळे ठेवा.',
        'औषध सुरक्षा: पशुवैद्यकाच्या सल्ल्याशिवाय कोणतीही प्रतिजैविके किंवा मानवी गोळ्या जनावराला देऊ नका.'
      ],
      warning: '⚠️ हे मार्गदर्शन प्राथमिक सल्ल्यासाठी आहे; प्रत्यक्ष उपचारासाठी सरकारी पशुवैद्यकीय अधिकाऱ्यांशी संपर्क साधा.'
    },
    hi: {
      title: 'सामान्य पशु स्वास्थ्य एवं प्राथमिक देखभाल',
      summary: 'पशुओं के अच्छे स्वास्थ्य के लिए पर्याप्त स्वच्छ पानी, संतुलित हरा व सूखा चारा, समय पर कृमिनाशक दवा और नियमित टीकाकरण जरूरी है।',
      steps: [
        'लक्षण जांच: रोग के सटीक आकलन हेतु पोर्टल के "Symptom Check" टूल का उपयोग करें।',
        '1962 हेल्पलाइन: गंभीर आपातकाल में तुरंत 1962 पशु एम्बुलेंस को कॉल करें।',
        'अलगाव: बीमार पशु को तुरंत अलग हवादार बाड़े में रखें।',
        'दवा सुरक्षा: बिना पशु चिकित्सक की सलाह के कोई एंटीबायोटिक न दें।'
      ],
      warning: '⚠️ यह डिजिटल परामर्श प्राथमिक सहायता के लिए है; डॉक्टर से प्रत्यक्ष जांच अवश्य करवाएं।'
    },
    te: {
      title: 'సాధారణ పశువైద్య సంరక్షణ & మార్గదర్శకాలు',
      summary: 'పశువుల ఆరోగ్యం కోసం సమతుల్య పచ్చిమేత, ఎండుమేత, పరిశుభ్రమైన నీరు మరియు సకాలంలో టీకాలు వేయించడం అవసరం.',
      steps: [
        'లక్షణాల తనిఖీ: ఖచ్చితమైన వ్యాధి నిర్ధారణ కోసం "Symptom Check" సాధనాన్ని ఉపయోగించండి.',
        '1962 ఎమర్జెన్సీ: అత్యవసర పరిస్థితుల్లో వెంటనే 1962 కు కాల్ చేయండి.',
        'వేరు చేయడం: జబ్బుపడిన పశువును ఆరోగ్యకరమైన పశువుల నుండి వేరుగా ఉంచండి.',
        'వైద్యుల సలహా: డాక్టర్ సలహా లేకుండా ఎలాంటి మందులు వాడవద్దు.'
      ],
      warning: '⚠️ ఈ మార్గదర్శకాలు ప్రాథమిక సలహా కోసం మాత్రమే; పశువైద్యుడిని ప్రత్యక్షంగా సంప్రదించండి.'
    }
  };

  const fallback = generalResponses[selectedLang] || generalResponses['en'];

  return {
    found: false,
    articleId: 'general',
    topic: 'General Veterinary Advisory & Preventive Health',
    species: ['All Livestock'],
    citation: {
      authority: 'ICAR-IVRI & DAHD',
      document: 'Compendium of Clinical Veterinary Medicine & Rural Livestock Advisory Guidelines',
      year: '2024',
      section: 'Primary Animal Healthcare & Tele-Advisory Standards'
    },
    title: fallback.title,
    summary: fallback.summary,
    steps: fallback.steps,
    warning: fallback.warning,
    isOfflineCached: true
  };
}

/**
 * 3 Official Demo/Quick-Test Health Questions to satisfy Task 7 with zero-typing requirement
 */
export const SAHAYAK_QUICK_QUESTIONS = [
  {
    id: 'fmd-q',
    category: 'fmd',
    en: 'How to manage and isolate a cow with suspected Foot and Mouth Disease (FMD)?',
    mr: 'लाळ्या खुरकूत रोग (FMD) संशयित गायीचे विलगीकरण व देखभाल कशी करावी?',
    hi: 'खुरपका-मुंहपका (FMD) पीड़ित गाय का अलगाव और देखभाल कैसे करें?',
    te: 'గాలికుంటు వ్యాధి (FMD) సోకిన ఆవును ఎలా వేరు చేయాలి మరియు రక్షించాలి?',
    badge: 'FMD Isolation & Care'
  },
  {
    id: 'anthrax-q',
    category: 'anthrax',
    en: 'What is the emergency protocol for sudden death with dark uncoagulated blood (Anthrax suspect)?',
    mr: 'अचानक मृत्यू व काळे न गोठणारे रक्त आल्यास अँथ्रॅक्स संशयित आपत्कालीन नियमावली काय आहे?',
    hi: 'अचानक मृत्यु और काले खून के रिसाव पर एंथ्रेक्स आपातकालीन प्रोटोकॉल क्या है?',
    te: 'ఆంథ్రాక్స్ అనుమానంతో అకస్మాత్తుగా మరణించిన పశువు విషయంలో అత్యవసర నిబంధనలు ఏమిటి?',
    badge: 'Anthrax Emergency Protocol'
  },
  {
    id: 'ranikhet-q',
    category: 'ranikhet',
    en: 'What are the biosecurity measures and signs of Ranikhet Disease in poultry?',
    mr: 'कुक्कुटपालनातील रानीखेत रोगाची लक्षणे व जैव-सुरक्षा उपाय काय आहेत?',
    hi: 'मुर्गियों में रानीखेत रोग के लक्षण और जैव-सुरक्षा उपाय क्या हैं?',
    te: 'కోళ్ళలో రాణీఖేత్ వ్యాధి లక్షణాలు మరియు బయోసెక్యూరిటీ నిబంధనలు ఏమిటి?',
    badge: 'Ranikhet Poultry Biosecurity'
  },
  {
    id: 'vaccine-q',
    category: 'vaccination',
    en: 'What is the recommended national vaccination schedule for cattle and buffaloes?',
    mr: 'गाई व म्हशींसाठी अधिकृत राष्ट्रीय लसीकरण वेळापत्रक काय आहे?',
    hi: 'गाय और भैंस के लिए राष्ट्रीय टीकाकरण सारणी क्या है?',
    te: 'పశువులకు సిఫార్సు చేసిన జాతీయ టీకాల షెడ్యూల్ ఏమిటి?',
    badge: 'National Vaccination Schedule'
  },
  {
    id: 'lsd-q',
    category: 'lsd',
    en: 'How to treat and prevent Lumpy Skin Disease (LSD) spread in dairy herds?',
    mr: 'लंपी त्वचा रोगाचा (LSD) प्रसार रोखण्यासाठी व उपचारासाठी काय करावे?',
    hi: 'लम्पी त्वचा रोग (LSD) के प्रसार को रोकने और प्राथमिक उपचार के क्या उपाय हैं?',
    te: 'లంపీ స్కిన్ వ్యాధి వ్యాప్తిని అరికట్టడానికి మరియు చికిత్సకు చర్యలు ఏమిటి?',
    badge: 'LSD Vector Control'
  },
  {
    id: 'mastitis-q',
    category: 'mastitis',
    en: 'What are the initial first-aid steps for clinical Mastitis and milk curdling?',
    mr: 'स्तनदाह / कासदाह (मॅस्टायटिस) व दूध फाटल्यास प्राथमिक उपचार काय करावेत?',
    hi: 'थनेला रोग और दूध फटने की स्थिति में प्राथमिक उपचार क्या है?',
    te: 'మస్టిటిస్ (పొదుగు వాపు) మరియు పాలు విరిగిపోవడంపై ప్రాథమిక చర్యలు ఏమిటి?',
    badge: 'Mastitis Care & Teat Dip'
  }
];
