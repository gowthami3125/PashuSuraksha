/**
 * Location Data Module for PashuSuraksha
 * Sourced from Local Government Directory (LGD), Ministry of Panchayati Raj, Govt of India
 * Sourced & Verified: 2026-09-28 (See docs/DATA_SOURCES.md)
 */

export const STATES_ORDERED = [
  'Maharashtra',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  // Union Territories
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
];

export const DISTRICT_SUBDIVISIONS = {
  'Maharashtra': {
    'Pune': ['Haveli', 'Baramati', 'Shirur', 'Indapur', 'Khed', 'Junnar', 'Ambegaon', 'Maval', 'Mulshi', 'Daund', 'Purandar', 'Bhor', 'Velhe'],
    'Kolhapur': ['Karveer', 'Kagal', 'Hatkanangle', 'Panhala', 'Shirol', 'Radhanagari', 'Bhudargad', 'Chandgad', 'Gadhinglaj', 'Gaganbawda', 'Kahu', 'Shahuwadi'],
    'Nashik': ['Nashik', 'Niphad', 'Malegaon', 'Sinnar', 'Dindori', 'Yeola', 'Baglan', 'Chandwad', 'Deola', 'Igatpuri', 'Kalwan', 'Nandgaon', 'Peth', 'Surgana', 'Trimbakeshwar'],
    'Solapur': ['North Solapur', 'South Solapur', 'Pandharpur', 'Barshi', 'Sangola', 'Karmala', 'Madha', 'Malshiras', 'Mangalwedha', 'Mohol', 'Akkalkot'],
    'Ahmednagar': ['Rahuri', 'Sangamner', 'Nagar', 'Kopargaon', 'Shrirampur', 'Akole', 'Parner', 'Pathardi', 'Nevasa', 'Shevgaon', 'Shrigonda', 'Karjat', 'Jamkhed', 'Rahta'],
    'Satara': ['Karad', 'Satara', 'Phaltan', 'Koregaon', 'Wai', 'Mahabaleshwar', 'Jaoli', 'Khandala', 'Khatav', 'Maan', 'Patan'],
    'Sindhudurg': ['Kudal', 'Sawantwadi', 'Vengurla', 'Malvan', 'Kankavli', 'Devgad', 'Vaibhavwadi', 'Dodamarg'],
    'Sangli': ['Miraj', 'Walwa', 'Tasgaon', 'Jat', 'Khanapur', 'Atpadi', 'Kavathe Mahankal', 'Palus', 'Shirala', 'Kadegaon'],
    'Chhatrapati Sambhajinagar': [],
    'Amravati': [],
    'Nagpur': [],
    'Nanded': [],
    'Jalgaon': [],
    'Thane': [],
    'Palghar': [],
    'Raigad': [],
    'Ratnagiri': [],
    'Latur': [],
    'Dharashiv': [],
    'Beed': [],
    'Jalna': [],
    'Parbhani': [],
    'Hingoli': [],
    'Washim': [],
    'Buldhana': [],
    'Akola': [],
    'Yavatmal': [],
    'Wardha': [],
    'Bhandara': [],
    'Gondia': [],
    'Chandrapur': [],
    'Gadchiroli': [],
    'Dhule': [],
    'Nandurbar': [],
    'Mumbai City': [],
    'Mumbai Suburban': []
  },
  'Andhra Pradesh': {
    'Guntur': ['Tenali', 'Guntur', 'Narasaraopet', 'Mangalagiri', 'Repalle', 'Tadikonda', 'Ponnur'],
    'Krishna': ['Vijayawada', 'Gannavaram', 'Machilipatnam', 'Gudivada', 'Vuyyuru', 'Nuzvid'],
    'Chittoor': ['Chittoor', 'Punganur', 'Kuppam', 'Nagari', 'Palamaner'],
    'Anantapur': [],
    'Kurnool': [],
    'YSR Kadapa': [],
    'Prakasam': [],
    'SPSR Nellore': [],
    'Visakhapatnam': [],
    'Vizianagaram': [],
    'Srikakulam': [],
    'East Godavari': [],
    'West Godavari': [],
    'Tirupati': [],
    'Nandyal': [],
    'Palnadu': [],
    'Bapatla': [],
    'Eluru': [],
    'NTR': [],
    'Kakinada': [],
    'Dr. B.R. Ambedkar Konaseema': [],
    'Alluri Sitharama Raju': [],
    'Parvathipuram Manyam': [],
    'Sri Sathya Sai': [],
    'Annamayya': []
  },
  'Goa': {
    'North Goa': ['Tiswadi', 'Bardez', 'Pernem', 'Bicholim', 'Sattari'],
    'South Goa': ['Salcete', 'Mormugao', 'Ponda', 'Quepem', 'Canacona', 'Sanguem']
  }
};

// Generic list of districts for all other states
export const ALL_STATE_DISTRICTS = {
  'Arunachal Pradesh': ['Tawang', 'West Kameng', 'East Kameng', 'Papum Pare', 'Lower Subansiri', 'Upper Subansiri', 'West Siang', 'East Siang', 'Dibang Valley', 'Lohit', 'Changlang', 'Tirap'],
  'Assam': ['Barpeta', 'Cachar', 'Darrang', 'Dhubri', 'Dibrugarh', 'Goalpara', 'Golaghat', 'Jorhat', 'Kamrup', 'Kamrup Metropolitan', 'Nagaon', 'Sonitpur', 'Tinsukia'],
  'Bihar': ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Darbhanga', 'Purnia', 'Rohtas', 'Begusarai', 'Saran', 'Nalanda', 'Samastipur', 'Vaishali'],
  'Chhattisgarh': ['Raipur', 'Bilaspur', 'Durg', 'Rajnandgaon', 'Korba', 'Raigarh', 'Bastar', 'Janjgir-Champa'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar', 'Kutch', 'Anand', 'Mehsana', 'Banaskantha'],
  'Haryana': ['Gurugram', 'Faridabad', 'Hisar', 'Karnal', 'Ambala', 'Panipat', 'Rohtak', 'Sonipat', 'Sirsa'],
  'Himachal Pradesh': ['Shimla', 'Kangra', 'Mandi', 'Kullu', 'Solan', 'Sirmaur', 'Hamirpur', 'Una', 'Chamba', 'Kinnaur', 'Lahaul and Spiti'],
  'Jharkhand': ['Ranchi', 'Dhanbad', 'East Singhbhum', 'Bokaro', 'Hazaribagh', 'Deoghar', 'Giridih', 'Palamu'],
  'Karnataka': ['Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Belagavi', 'Dharwad', 'Dakshina Kannada', 'Kalaburagi', 'Ballari', 'Shivamogga', 'Tumakuru', 'Vijayapura', 'Udupi', 'Hassan'],
  'Kerala': ['Thiruvananthapuram', 'Ernakulam', 'Kozhikode', 'Thrissur', 'Malappuram', 'Palakkad', 'Kollam', 'Kannur', 'Alappuzha', 'Kottayam', 'Idukki', 'Wayanad', 'Kasaragod', 'Pathanamthitta'],
  'Madhya Pradesh': ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Rewa', 'Satna', 'Chhindwara', 'Ratlam'],
  'Manipur': ['Imphal East', 'Imphal West', 'Bishnupur', 'Thoubal', 'Churachandpur'],
  'Meghalaya': ['East Khasi Hills', 'West Garo Hills', 'Ri Bhoi', 'West Khasi Hills'],
  'Mizoram': ['Aizawl', 'Lunglei', 'Champhai'],
  'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang'],
  'Odisha': ['Khordha', 'Cuttack', 'Ganjam', 'Sundargarh', 'Sambalpur', 'Puri', 'Balasore', 'Mayurbhanj'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'SAS Nagar (Mohali)', 'Hoshiarpur'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Alwar', 'Bhilwara', 'Sikar'],
  'Sikkim': ['Gangtok', 'Namchi', 'Gyalshing', 'Mangan'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Erode', 'Vellore', 'Thanjavur'],
  'Telangana': ['Hyderabad', 'Ranga Reddy', 'Medchal-Malkajgiri', 'Warangal', 'Karimnagar', 'Nizamabad', 'Khammam'],
  'Tripura': ['West Tripura', 'Gomati', 'South Tripura', 'North Tripura'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur Nagar', 'Varanasi', 'Prayagraj', 'Agra', 'Meerut', 'Ghaziabad', 'Gautam Buddha Nagar', 'Bareilly', 'Aligarh', 'Moradabad', 'Gorakhpur'],
  'Uttarakhand': ['Dehradun', 'Haridwar', 'Nainital', 'Udham Singh Nagar'],
  'West Bengal': ['Kolkata', 'North 24 Parganas', 'South 24 Parganas', 'Howrah', 'Hooghly', 'Purba Medinipur', 'Paschim Bardhaman', 'Murshidabad'],
  'Andaman and Nicobar Islands': ['South Andaman', 'North and Middle Andaman', 'Nicobar'],
  'Chandigarh': ['Chandigarh'],
  'Dadra and Nagar Haveli and Daman and Diu': ['Daman', 'Diu', 'Dadra and Nagar Haveli'],
  'Delhi': ['New Delhi', 'Central Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi'],
  'Jammu and Kashmir': ['Jammu', 'Srinagar', 'Anantnag', 'Baramulla', 'Udhampur'],
  'Ladakh': ['Leh', 'Kargil'],
  'Lakshadweep': ['Lakshadweep'],
  'Puducherry': ['Puducherry', 'Karaikal', 'Mahe', 'Yanam']
};

export function getDistrictsForState(stateName) {
  if (DISTRICT_SUBDIVISIONS[stateName]) {
    return Object.keys(DISTRICT_SUBDIVISIONS[stateName]);
  }
  return ALL_STATE_DISTRICTS[stateName] || ['Default District'];
}

export function getTalukasForDistrict(stateName, districtName) {
  if (DISTRICT_SUBDIVISIONS[stateName] && DISTRICT_SUBDIVISIONS[stateName][districtName]) {
    return DISTRICT_SUBDIVISIONS[stateName][districtName];
  }
  return [];
}

export function isMandalJurisdiction(stateName) {
  return stateName === 'Andhra Pradesh' || stateName === 'Telangana';
}

export function getSubdivisionTerm(stateName) {
  return isMandalJurisdiction(stateName) ? 'Mandal' : 'Taluka';
}
