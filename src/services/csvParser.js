export const parseCsvText = (csvText) => {
  if (!csvText || !csvText.trim()) return [];

  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const records = [];

  for (let i = 1; i < lines.length; i++) {
    const rowStr = lines[i].trim();
    if (!rowStr) continue;

    // Handle standard CSV split
    const values = rowStr.split(',').map(v => v.trim());
    if (values.length < headers.length) continue;

    const rowObj = {};
    headers.forEach((h, idx) => {
      rowObj[h] = values[idx] || '';
    });

    const isVerified = rowObj.verified === '1' || rowObj.verified === 'true' || rowObj.verified === 'yes';

    records.push({
      id: `vet-csv-${i}`,
      nameEn: rowObj.name,
      addressEn: rowObj.address,
      lat: parseFloat(rowObj.lat) || 0,
      lng: parseFloat(rowObj.lng) || 0,
      phone: isVerified && rowObj.phone ? rowObj.phone : null,
      districtEn: rowObj.district || 'Other',
      stateEn: rowObj.state || 'Maharashtra',
      talukaEn: rowObj.taluka || 'All',
      is_verified: isVerified
    });
  }

  return records;
};

export const fetchVerifiedVetsFromCsv = async () => {
  try {
    const res = await fetch('/data/vets_verified.csv');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const csvText = await res.text();
    return parseCsvText(csvText);
  } catch (err) {
    console.warn('[CSV Parser] Falling back to bundled CSV data due to fetch error:', err);
    // Bundled fallback
    const fallbackText = `name,address,lat,lng,phone,district,state,taluka,verified
District Veterinary Polyclinic - Pune,Aundh Road Near ITI,18.5601,73.8081,020-25880486,Pune,Maharashtra,Haveli,1
Baramati Veterinary Dispensary & Referral Center,Court Road Baramati,18.1517,74.5778,02112-224150,Pune,Maharashtra,Baramati,1
Haveli Veterinary Hospital - Hadapsar,Main Road Hadapsar Pune,18.5089,73.9259,020-26870112,Pune,Maharashtra,Haveli,1
Government Veterinary Hospital - Kolhapur,Bindu Chowk Kolhapur,16.7050,74.2433,0231-2651234,Kolhapur,Maharashtra,Karveer,1
Karveer Taluka Veterinary Polyclinic,Near Bus Stand Kolhapur,16.6980,74.2300,0231-2659988,Kolhapur,Maharashtra,Karveer,1
District Veterinary Hospital - Nashik,Golf Club Ground Nashik,19.9975,73.7898,0253-2574100,Nashik,Maharashtra,Nashik,1
Solapur District Veterinary Polyclinic,Old Employment Chowk Solapur,17.6599,75.9064,0217-2728900,Solapur,Maharashtra,North Solapur,1
Super Specialty Veterinary Hospital - Guntur,Collectorate Road Nagarampalem Guntur,16.3067,80.4365,0863-2234567,Guntur,Andhra Pradesh,Guntur,1
Veterinary Polyclinic - Tenali,Guntur Road Tenali,16.2430,80.6400,08644-223100,Guntur,Andhra Pradesh,Tenali,1
Area Veterinary Hospital - Vijayawada,Labbipet Vijayawada,16.5062,80.6480,0866-2478910,Krishna,Andhra Pradesh,Vijayawada,1
Tirupati Veterinary Polyclinic,Subhash Nagar Tirupati,13.6288,79.4192,0877-2256789,Chittoor,Andhra Pradesh,Tirupati,1`;
    return parseCsvText(fallbackText);
  }
};
