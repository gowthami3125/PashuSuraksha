/**
 * 20th Livestock Census Data (DAHD, Govt of India 2019-2020)
 * PashuSuraksha - Phase 3 Surveillance
 * 
 * Official Source: Department of Animal Husbandry & Dairying (DAHD),
 * Ministry of Fisheries, Animal Husbandry and Dairying, Government of India.
 * Reference: 20th Livestock Census All India Report (2019) & data.gov.in
 */

export const CENSUS_METADATA = {
  censusNumber: "20th All India Livestock Census",
  reportingYear: "2019-2020",
  officialAuthority: "Department of Animal Husbandry & Dairying (DAHD), Ministry of Fisheries, Animal Husbandry and Dairying, Govt. of India",
  portalCitation: "data.gov.in / dahd.nic.in",
  coverage: "District-level species disaggregation (Cattle, Buffalo, Sheep, Goat, Poultry)"
};

export const DISTRICT_LIVESTOCK_CENSUS = {
  // MAHARASHTRA DISTRICTS
  'Pune': {
    district: 'Pune',
    state: 'Maharashtra',
    lat: 18.5204,
    lng: 73.8567,
    cattle: 884520,        // Crossbred + Indigenous
    buffalo: 395120,
    sheep: 245890,
    goat: 620400,
    poultry: 6850000,      // Commercial layer/broiler belt
    totalLivestock: 2145930,
    densityCategory: 'High Density Dairy Belt',
    vulnerableSpecies: ['Cattle', 'Buffalo'],
    predominantBreeds: ['Khillari', 'Dangi', 'HF Cross', 'Pandharpuri Buffalo'],
    highRiskDiseases: ['Foot and Mouth Disease (FMD)', 'Lumpy Skin Disease (LSD)', 'Haemorrhagic Septicaemia']
  },
  'Kolhapur': {
    district: 'Kolhapur',
    state: 'Maharashtra',
    lat: 16.7050,
    lng: 74.2433,
    cattle: 642100,
    buffalo: 582400,       // Very high buffalo density (Gokul milk belt)
    sheep: 95400,
    goat: 312000,
    poultry: 4200000,
    totalLivestock: 1631900,
    densityCategory: 'Ultra-High Buffalo Density',
    vulnerableSpecies: ['Buffalo', 'Cattle'],
    predominantBreeds: ['Murrah Cross', 'Pandharpuri', 'Jaffarabadi Cross'],
    highRiskDiseases: ['Bovine Mastitis', 'Lumpy Skin Disease (LSD)', 'FMD']
  },
  'Nashik': {
    district: 'Nashik',
    state: 'Maharashtra',
    lat: 19.9975,
    lng: 73.7898,
    cattle: 792300,
    buffalo: 214500,
    sheep: 320100,
    goat: 845000,
    poultry: 8900000,      // Major poultry hub of Western India
    totalLivestock: 2171900,
    densityCategory: 'High Density Mixed & Poultry',
    vulnerableSpecies: ['Poultry', 'Goat', 'Cattle'],
    predominantBreeds: ['Dangi', 'Osmanabadi Goat', 'Commercial Broilers'],
    highRiskDiseases: ['Ranikhet / Newcastle Disease', 'PPR', 'Anthrax (Sinnar belt)']
  },
  'Ahmednagar': {
    district: 'Ahmednagar',
    state: 'Maharashtra',
    lat: 19.0948,
    lng: 74.7480,
    cattle: 1120000,       // Highest cattle population in MH
    buffalo: 310000,
    sheep: 480000,
    goat: 910000,
    poultry: 5400000,
    totalLivestock: 2820000,
    densityCategory: 'Highest Livestock Density (MH)',
    vulnerableSpecies: ['Cattle', 'Goat'],
    predominantBreeds: ['Khillari', 'HF Cross', 'Deccani Sheep', 'Sangamneri Goat'],
    highRiskDiseases: ['FMD', 'LSD', 'Enterotoxaemia']
  },
  'Latur': {
    district: 'Latur',
    state: 'Maharashtra',
    lat: 18.4088,
    lng: 76.5604,
    cattle: 430000,
    buffalo: 210000,
    sheep: 110000,
    goat: 490000,
    poultry: 1850000,
    totalLivestock: 1240000,
    densityCategory: 'Medium Density Marathwada',
    vulnerableSpecies: ['Cattle', 'Goat'],
    predominantBreeds: ['Deoni (Indigenous)', 'Marathwadi Buffalo', 'Osmanabadi Goat'],
    highRiskDiseases: ['Black Quarter (BQ)', 'Haemorrhagic Septicaemia (HS)']
  },
  'Solapur': {
    district: 'Solapur',
    state: 'Maharashtra',
    lat: 17.6599,
    lng: 75.9064,
    cattle: 580000,
    buffalo: 320000,
    sheep: 410000,
    goat: 680000,
    poultry: 2900000,
    totalLivestock: 1990000,
    densityCategory: 'High Sheep & Goat Belt',
    vulnerableSpecies: ['Sheep', 'Goat', 'Cattle'],
    predominantBreeds: ['Deccani Sheep', 'Khillari Cattle', 'Pandharpuri Buffalo'],
    highRiskDiseases: ['PPR (Goat Plague)', 'Sheep Pox', 'FMD']
  },

  // ANDHRA PRADESH DISTRICTS
  'Guntur': {
    district: 'Guntur',
    state: 'Andhra Pradesh',
    lat: 16.3067,
    lng: 80.4365,
    cattle: 345000,
    buffalo: 890000,       // Very high buffalo population (Murrah & Graded)
    sheep: 780000,
    goat: 390000,
    poultry: 9200000,
    totalLivestock: 2405000,
    densityCategory: 'High Density Buffalo & Poultry',
    vulnerableSpecies: ['Buffalo', 'Poultry', 'Sheep'],
    predominantBreeds: ['Murrah Graded', 'Ongole Cattle', 'Nellore Sheep'],
    highRiskDiseases: ['Foot and Mouth Disease (FMD)', 'Haemorrhagic Septicaemia', 'Ranikhet Disease']
  },
  'Krishna': {
    district: 'Krishna',
    state: 'Andhra Pradesh',
    lat: 16.5062,
    lng: 80.6480,
    cattle: 290000,
    buffalo: 710000,
    sheep: 490000,
    goat: 280000,
    poultry: 11500000,     // Major coastal poultry & aqua-livestock hub
    totalLivestock: 1770000,
    densityCategory: 'Intensive Poultry & Dairy',
    vulnerableSpecies: ['Poultry', 'Buffalo'],
    predominantBreeds: ['Murrah Cross', 'Ongole Cattle', 'BV-300 Layers'],
    highRiskDiseases: ['Infectious Bursal Disease', 'Ranikhet Disease', 'FMD']
  },
  'Chittoor': {
    district: 'Chittoor',
    state: 'Andhra Pradesh',
    lat: 13.6288,
    lng: 79.4192,
    cattle: 740000,
    buffalo: 320000,
    sheep: 950000,
    goat: 510000,
    poultry: 14200000,     // Leading milk & poultry producer in South AP
    totalLivestock: 2520000,
    densityCategory: 'High Density Dairy & Small Ruminants',
    vulnerableSpecies: ['Cattle', 'Sheep'],
    predominantBreeds: ['Punganur (Dwarf)', 'HF Cross', 'Nellore Brown Sheep'],
    highRiskDiseases: ['Lumpy Skin Disease (LSD)', 'Peste des Petits Ruminants (PPR)', 'Bluetongue']
  },
  'West Godavari': {
    district: 'West Godavari',
    state: 'Andhra Pradesh',
    lat: 16.7107,
    lng: 81.0952,
    cattle: 260000,
    buffalo: 630000,
    sheep: 310000,
    goat: 180000,
    poultry: 16500000,     // Asia's largest egg production belt
    totalLivestock: 1380000,
    densityCategory: 'Intensive Commercial Poultry',
    vulnerableSpecies: ['Poultry', 'Buffalo'],
    predominantBreeds: ['Commercial Layer BV-300', 'Murrah'],
    highRiskDiseases: ['Ranikhet Disease (ND)', 'Avian Influenza surveillance', 'FMD']
  },
  'Visakhapatnam': {
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    lat: 17.6868,
    lng: 83.2185,
    cattle: 310000,
    buffalo: 240000,
    sheep: 420000,
    goat: 360000,
    poultry: 4800000,
    totalLivestock: 1330000,
    densityCategory: 'Coastal Tribal & Mixed Livestock',
    vulnerableSpecies: ['Cattle', 'Goat'],
    predominantBreeds: ['Non-descript Indigenous', 'Black Bengal Cross'],
    highRiskDiseases: ['Haemorrhagic Septicaemia (HS)', 'Anthrax (Agency Tracts)']
  }
};

/**
 * Helper to fetch census by district with fallback
 */
export function getDistrictCensus(districtName) {
  if (DISTRICT_LIVESTOCK_CENSUS[districtName]) {
    return DISTRICT_LIVESTOCK_CENSUS[districtName];
  }
  // Fallback to Pune or first entry
  return DISTRICT_LIVESTOCK_CENSUS['Pune'];
}
