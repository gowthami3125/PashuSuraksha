export const vetDirectory = {
  'Maharashtra': [
    {
      id: 1,
      nameEn: 'District Veterinary Polyclinic - Pune',
      nameMr: 'जिल्हा पशुवैद्यकीय सर्वोपचार रुग्णालय - पुणे',
      nameHi: 'जिला पशु चिकित्सालय - पुणे',
      nameTe: 'జిల్లా పశు వైద్యశాల - పూణే',
      addressEn: 'Aundh Road, Near ITI, Pune, Maharashtra 411007',
      districtEn: 'Pune',
      phone: '020-25880486',
      distanceKm: '4.2 km',
      is_verified: true,
      lat: 18.5601,
      lng: 73.8081
    },
    {
      id: 2,
      nameEn: 'Baramati Veterinary Dispensary & Referral Center',
      nameMr: 'बारामती पशुवैद्यकीय दवाखाना व संदर्भ केंद्र',
      nameHi: 'बारामती पशु चिकित्सालय',
      nameTe: 'బారామతి పశు వైద్యశాల',
      addressEn: 'Court Road, Baramati, Maharashtra 413102',
      districtEn: 'Pune',
      phone: '02112-224150',
      distanceKm: '8.5 km',
      is_verified: true,
      lat: 18.1517,
      lng: 74.5778
    },
    {
      id: 3,
      nameEn: 'Government Veterinary Hospital - Kolhapur',
      nameMr: 'शासकीय पशुवैद्यकीय रुग्णालय - कोल्हापूर',
      nameHi: 'सरकारी पशु अस्पताल - कोल्हापुर',
      nameTe: 'ప్రభుత్వ పశు వైద్యశాల - కొల్హాపూర్',
      addressEn: 'Bindu Chowk, Kolhapur, Maharashtra 416002',
      districtEn: 'Kolhapur',
      phone: '0231-2651234',
      distanceKm: '14.1 km',
      is_verified: true,
      lat: 16.7050,
      lng: 74.2433
    }
  ],
  'Andhra Pradesh': [
    {
      id: 4,
      nameEn: 'Super Specialty Veterinary Hospital - Guntur',
      nameMr: 'सुपर स्पेशालिटी पशुवैद्यकीय रुग्णालय - गुंटूर',
      nameHi: 'सुपर स्पेशलिटी पशु अस्पताल - गुंटूर',
      nameTe: 'సూపర్ స్పెషాలిటీ పశు వైద్యశాల - గుంటూరు',
      addressEn: 'Collectorate Road, Nagarampalem, Guntur, AP 522004',
      districtEn: 'Guntur',
      phone: '0863-2234567',
      distanceKm: '5.0 km',
      is_verified: true,
      lat: 16.3067,
      lng: 80.4365
    },
    {
      id: 5,
      nameEn: 'Area Veterinary Hospital - Vijayawada',
      nameMr: 'क्षेत्रीय पशुवैद्यकीय रुग्णालय - विजयवाडा',
      nameHi: 'क्षेत्रीय पशु अस्पताल - विजयवाड़ा',
      nameTe: 'ప్రాంతీయ పశు వైద్యశాల - విజయవాడ',
      addressEn: 'Labbipet, Vijayawada, AP 520010',
      districtEn: 'Krishna',
      phone: '0866-2478910',
      distanceKm: '11.3 km',
      is_verified: true,
      lat: 16.5062,
      lng: 80.6480
    },
    {
      id: 6,
      nameEn: 'Veterinary Polyclinic - Tenali',
      nameMr: 'पशुवैद्यकीय पॉलिक्लिनिक - तेनाली',
      nameHi: 'पशु चिकित्सालय - तेनाली',
      nameTe: 'పశు వైద్యశాల - తెనాలి',
      addressEn: 'Guntur Road, Tenali, AP 522201',
      districtEn: 'Guntur',
      phone: '08644-223100',
      distanceKm: '18.7 km',
      is_verified: true,
      lat: 16.2430,
      lng: 80.6400
    }
  ]
};

export const getTop3NearestVets = (selectedState = 'Maharashtra') => {
  const list = vetDirectory[selectedState] || vetDirectory['Maharashtra'];
  return list.slice(0, 3);
};
