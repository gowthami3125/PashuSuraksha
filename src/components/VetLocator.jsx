import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, PhoneCall, Share2, Compass, Navigation, AlertTriangle, 
  ExternalLink, CheckCircle, Copy, X, Calendar, Info, Search 
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchVerifiedVetsFromCsv } from '../services/csvParser';
import { getTrans } from '../data/dictionary';
import LocationPicker from './LocationPicker';

// District and Taluka reference mappings
const DISTRICT_TALUKAS = {
  'Maharashtra': {
    'Pune': ['All', 'Haveli', 'Baramati', 'Shirur', 'Indapur', 'Khed'],
    'Kolhapur': ['All', 'Karveer', 'Kagal', 'Hatkanangle'],
    'Nashik': ['All', 'Nashik', 'Niphad', 'Malegaon'],
    'Solapur': ['All', 'North Solapur', 'South Solapur', 'Pandharpur'],
    'Sindhudurg': ['All', 'Kudal', 'Sawantwadi'],
    'Ahmednagar': ['All', 'Rahuri', 'Sangamner']
  },
  'Andhra Pradesh': {
    'Guntur': ['All', 'Guntur', 'Tenali', 'Narasaraopet'],
    'Krishna': ['All', 'Vijayawada', 'Gudivada'],
    'Chittoor': ['All', 'Tirupati', 'Madanapalle'],
    'Visakhapatnam': ['All', 'Anakapalle', 'Bheemunipatnam']
  }
};

// District Headquarters Centroids for Accurate Fallback
const DISTRICT_CENTERS = {
  'Maharashtra': {
    'Pune': { lat: 18.5204, lng: 73.8567 },
    'Kolhapur': { lat: 16.7050, lng: 74.2433 },
    'Nashik': { lat: 19.9975, lng: 73.7898 },
    'Solapur': { lat: 17.6599, lng: 75.9064 },
    'Sindhudurg': { lat: 16.1264, lng: 73.6826 },
    'Ahmednagar': { lat: 19.0948, lng: 74.7480 }
  },
  'Andhra Pradesh': {
    'Guntur': { lat: 16.3067, lng: 80.4365 },
    'Krishna': { lat: 16.5062, lng: 80.6480 },
    'Chittoor': { lat: 13.6288, lng: 79.4192 },
    'Visakhapatnam': { lat: 17.6868, lng: 83.2185 }
  }
};

// Haversine distance calculator in kilometers
const calcHaversineDistanceKm = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
};

export default function VetLocator({ lang, dict, onNavigate }) {
  const [allVets, setAllVets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter Selection State
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedTaluka, setSelectedTaluka] = useState('All');

  // GPS Location State & District Fallback
  const [userCoords, setUserCoords] = useState(null);
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [districtFallbackActive, setDistrictFallbackActive] = useState(false);
  const [gpsStatusNote, setGpsStatusNote] = useState('');

  // Share Modal State
  const [shareTargetVet, setShareTargetVet] = useState(null);
  const [copySuccessNote, setCopySuccessNote] = useState(false);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);

  // Fetch CSV vet records on mount
  useEffect(() => {
    fetchVerifiedVetsFromCsv()
      .then(vets => {
        setAllVets(vets);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load vets CSV:", err);
        setLoading(false);
      });
  }, []);

  // Handler for Manual District Fallback
  const handleActivateDistrictFallback = (explicitDistrict = null) => {
    const targetDistrict = explicitDistrict || (selectedDistrict !== 'All' ? selectedDistrict : (selectedState === 'Maharashtra' ? 'Pune' : 'Guntur'));
    const coords = DISTRICT_CENTERS[selectedState]?.[targetDistrict] || { lat: 18.5204, lng: 73.8567 };
    setUserCoords(null);
    setDistrictFallbackActive(true);
    if (selectedDistrict === 'All') {
      setSelectedDistrict(targetDistrict);
    }
    setGpsStatusNote(`📍 Activated District Fallback: ${targetDistrict} District Center (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}). Distance computed from district HQ.`);
    
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([coords.lat, coords.lng], 10);
    }
  };

  // Handler for GPS Location
  const handleUseGpsLocation = () => {
    if (!navigator.geolocation) {
      handleActivateDistrictFallback();
      return;
    }

    setIsLocatingGps(true);
    setGpsStatusNote('Requesting browser location permission...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        setUserCoords(coords);
        setDistrictFallbackActive(false);
        setIsLocatingGps(false);
        setGpsStatusNote(`✓ Live GPS acquired: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}. Vets sorted by actual distance.`);
      },
      (err) => {
        setIsLocatingGps(false);
        const fallbackDistrict = selectedDistrict !== 'All' ? selectedDistrict : (selectedState === 'Maharashtra' ? 'Pune' : 'Guntur');
        handleActivateDistrictFallback(fallbackDistrict);
        setGpsStatusNote(`⚠️ Location permission not granted. Switched to ${fallbackDistrict} District Fallback.`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Compute active origin for distance & directions
  const activeFallbackDistrict = selectedDistrict !== 'All' ? selectedDistrict : (selectedState === 'Maharashtra' ? 'Pune' : 'Guntur');
  const activeOrigin = userCoords 
    ? { ...userCoords, label: 'GPS' } 
    : (districtFallbackActive || selectedDistrict !== 'All') 
      ? { 
          ...(DISTRICT_CENTERS[selectedState]?.[activeFallbackDistrict] || { lat: 18.5204, lng: 73.8567 }),
          label: `${activeFallbackDistrict} Center` 
        } 
      : null;

  // Filter & Distance Processing
  let processedVets = allVets.map(vet => {
    const dist = activeOrigin ? calcHaversineDistanceKm(activeOrigin.lat, activeOrigin.lng, vet.lat, vet.lng) : null;
    return {
      ...vet,
      distanceKm: dist ? parseFloat(dist) : null,
      distanceLabel: dist ? (activeOrigin.label === 'GPS' ? `${dist} km away` : `${dist} km from ${activeOrigin.label}`) : null
    };
  });

  // Filter by State
  processedVets = processedVets.filter(v => v.stateEn === selectedState);

  // Filter by District
  if (selectedDistrict !== 'All') {
    processedVets = processedVets.filter(v => v.districtEn === selectedDistrict);
  }

  // Filter by Taluka
  if (selectedTaluka !== 'All') {
    processedVets = processedVets.filter(v => v.talukaEn === selectedTaluka);
  }

  // TASK 5 REQUIREMENT: VERIFIED VETS ONLY
  processedVets = processedVets.filter(v => v.is_verified === true);

  // Sort by Distance if origin active
  if (activeOrigin) {
    processedVets.sort((a, b) => (a.distanceKm || 9999) - (b.distanceKm || 9999));
  }

  // Directions URL generator (opens exact coordinates with origin if available)
  const getDirectionsUrl = (vet) => {
    if (userCoords) {
      return `https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lng}&destination=${vet.lat},${vet.lng}`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${vet.lat},${vet.lng}`;
  };

  // District options for current selected state
  const availableDistricts = ['All', ...(DISTRICT_TALUKAS[selectedState] ? Object.keys(DISTRICT_TALUKAS[selectedState]) : [])];
  
  // Taluka options for current selected district
  const availableTalukas = selectedDistrict !== 'All' && DISTRICT_TALUKAS[selectedState] && DISTRICT_TALUKAS[selectedState][selectedDistrict]
    ? DISTRICT_TALUKAS[selectedState][selectedDistrict]
    : ['All'];

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create Map instance if not created
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([18.5204, 73.8567], 8);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18
      }).addTo(map);

      mapInstanceRef.current = map;
      markersGroupRef.current = L.layerGroup().addTo(map);
    }

    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;

    // Clear existing markers
    markersGroup.clearLayers();

    const bounds = L.latLngBounds();

    // Add user marker if GPS active
    if (userCoords) {
      const userMarker = L.marker([userCoords.lat, userCoords.lng], {
        icon: L.divIcon({
          className: 'custom-user-pin',
          html: `<div style="background-color: #0F2F5C; color: white; padding: 6px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); text-align: center;">📍</div>`,
          iconSize: [30, 30]
        })
      }).bindPopup(`<b>Your Current Location</b><br/>Lat: ${userCoords.lat.toFixed(4)}, Lng: ${userCoords.lng.toFixed(4)}`);
      
      markersGroup.addLayer(userMarker);
      bounds.extend([userCoords.lat, userCoords.lng]);
    }

    // Add vet markers
    processedVets.forEach(vet => {
      if (vet.lat && vet.lng) {
        const gmapsDirUrl = getDirectionsUrl(vet);
        
        const popupContent = `
          <div style="font-family: sans-serif; padding: 4px;">
            <b style="color: #0F2F5C; font-size: 13px;">${vet.nameEn}</b><br/>
            <span style="font-size: 11px; color: #4B5563;">${vet.addressEn}</span><br/>
            ${vet.phone ? `<span style="font-size: 11px; color: #15803D; font-weight: bold;">📞 ${vet.phone}</span><br/>` : ''}
            <a href="${gmapsDirUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; margin-top: 6px; background-color: #0F2F5C; color: white; padding: 4px 8px; border-radius: 4px; text-decoration: none; font-size: 10px; font-weight: bold;">
              Get Directions 🗺️
            </a>
          </div>
        `;

        const vetMarker = L.marker([vet.lat, vet.lng]).bindPopup(popupContent);
        markersGroup.addLayer(vetMarker);
        bounds.extend([vet.lat, vet.lng]);
      }
    });

    // Fit map bounds if markers exist
    if (processedVets.length > 0 || userCoords) {
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
      }
    } else {
      map.setView([18.5204, 73.8567], 7);
    }
  }, [processedVets, userCoords]);

  // Share handlers
  const handleOpenShareModal = (vet) => {
    setShareTargetVet(vet);
    setCopySuccessNote(false);
  };

  const getShareUrl = (vet) => {
    return `https://www.google.com/maps?q=${vet.lat},${vet.lng}`;
  };

  const handleNativeShare = async (vet) => {
    const url = getShareUrl(vet);
    if (navigator.share) {
      try {
        await navigator.share({
          title: vet.nameEn,
          text: `Verified Veterinary Center: ${vet.nameEn} (${vet.addressEn})`,
          url
        });
      } catch (e) {
        // User cancelled or error
      }
    } else {
      handleCopyLink(url);
    }
  };

  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url);
    setCopySuccessNote(true);
    setTimeout(() => setCopySuccessNote(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* HEADER BAR & GPS BUTTON */}
      <div className="bg-white border border-[#D1D5DB] rounded-lg p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#D1D5DB] pb-6">
          <div>
            <span className="text-[10px] font-bold text-[#0F2F5C] uppercase tracking-widest block">
              Verified Veterinary Directory
            </span>
            <h2 className="text-2xl font-bold text-[#111827] flex items-center space-x-3 mt-0.5">
              <MapPin className="w-7 h-7 text-[#0F2F5C]" />
              <span>Nearby Veterinary Hospitals & Ambulance Units</span>
            </h2>
            <p className="text-xs text-[#4B5563] mt-1">
              Verified coordinates & direct contacts. Emergency 1962 Helpline available 24/7.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={handleUseGpsLocation}
              className="btn-navy px-4 py-2.5 rounded-lg text-xs flex items-center space-x-2 cursor-pointer font-bold shadow-sm"
              title="Request browser GPS location"
            >
              <Compass className={`w-4 h-4 ${isLocatingGps ? 'animate-spin' : ''}`} />
              <span>{isLocatingGps ? 'Locating...' : 'Use My Current Location'}</span>
            </button>

            <button 
              onClick={() => handleActivateDistrictFallback()}
              className="bg-white hover:bg-[#F3F4F6] text-[#0F2F5C] border border-[#D1D5DB] px-3.5 py-2.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer shadow-sm"
              title="Activate District Center fallback"
            >
              <MapPin className="w-3.5 h-3.5 text-[#E07B00]" />
              <span>District HQ Fallback</span>
            </button>
          </div>
        </div>

        {/* GPS STATUS FEEDBACK NOTE */}
        {gpsStatusNote && (
          <div className={`p-4 rounded-lg text-xs font-bold border flex items-center space-x-2 ${
            gpsStatusNote.includes('✓')
              ? 'bg-[#15803D]/10 border-[#15803D]/30 text-[#15803D]'
              : 'bg-[#F3F4F6] border-[#D1D5DB] text-[#111827]'
          }`}>
            <Navigation className="w-4 h-4 text-[#0F2F5C] flex-shrink-0" />
            <span>{gpsStatusNote}</span>
          </div>
        )}

        {/* CASCADING LOCATION SELECTOR (STATE -> DISTRICT -> TALUKA) */}
        <div className="bg-[#F3F4F6] p-4 rounded-lg border border-[#D1D5DB]">
          <LocationPicker
            selectedState={selectedState}
            onChangeState={(s) => {
              setSelectedState(s);
              setSelectedDistrict('All');
              setSelectedTaluka('All');
            }}
            selectedDistrict={selectedDistrict}
            onChangeDistrict={(d) => {
              setSelectedDistrict(d);
              setSelectedTaluka('All');
            }}
            selectedTaluka={selectedTaluka}
            onChangeTaluka={(t) => setSelectedTaluka(t)}
            allowAllOption={true}
          />
        </div>

        {/* LEAFLET INTERACTIVE MAP CONTAINER */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-[#4B5563] uppercase tracking-widest block">
            Interactive OpenStreetMap View ({processedVets.length} Hospitals Marked)
          </span>
          <div 
            ref={mapContainerRef} 
            className="w-full h-80 rounded-lg border border-[#D1D5DB] z-0 shadow-inner"
          />
        </div>

        {/* DIRECTORY COMING SOON EMPTY STATE */}
        {!loading && processedVets.length === 0 && (
          <div className="bg-[#F3F4F6] border-2 border-[#D1D5DB] rounded-lg p-8 text-center space-y-3">
            <AlertTriangle className="w-10 h-10 text-[#D97706] mx-auto opacity-70" />
            <h3 className="text-base font-bold text-[#111827]">Directory Coming Soon</h3>
            <p className="text-xs text-[#4B5563] max-w-md mx-auto">
              Verified veterinary hospital entries for <strong>{selectedDistrict} District ({selectedTaluka})</strong> are currently being onboarded and verified by district officers.
            </p>
            <p className="text-xs font-bold text-[#0F2F5C]">
              For immediate emergency assistance, call the 1962 Mobile Veterinary Helpline.
            </p>
          </div>
        )}

        {/* CARDS LIST OF VERIFIED VETS */}
        {processedVets.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {processedVets.map(vet => {
              const exactGmapsDirectionsUrl = getDirectionsUrl(vet);

              return (
                <div key={vet.id} className="bg-white border border-[#D1D5DB] rounded-lg p-5 space-y-4 hover:border-[#0F2F5C] transition flex flex-col justify-between shadow-xs">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start flex-wrap gap-1">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] font-bold text-[#0F2F5C] uppercase tracking-widest">
                          {vet.districtEn} District
                        </span>
                        {vet.is_verified && (
                          <span className="bg-[#15803D]/10 text-[#15803D] text-[9px] font-bold px-1.5 py-0.5 rounded border border-[#15803D]/30">
                            Verified ✓
                          </span>
                        )}
                      </div>

                      {vet.distanceLabel ? (
                        <span className="bg-[#F3F4F6] border border-[#D1D5DB] text-[#0F2F5C] text-[10px] font-bold px-2 py-0.5 rounded">
                          📍 {vet.distanceLabel}
                        </span>
                      ) : vet.distanceKm !== null ? (
                        <span className="bg-[#F3F4F6] border border-[#D1D5DB] text-[#0F2F5C] text-[10px] font-bold px-2 py-0.5 rounded">
                          📍 {vet.distanceKm} km away
                        </span>
                      ) : null}
                    </div>

                    <h3 className="text-sm font-bold text-[#111827]">{vet.nameEn}</h3>
                    <p className="text-xs text-[#4B5563] leading-relaxed font-medium">{vet.addressEn}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[#D1D5DB]">
                    {/* VERIFIED PHONE DISPLAY (ONLY SHOWN IF VERIFIED PHONE EXISTS) */}
                    {vet.phone ? (
                      <div className="bg-[#F3F4F6] border border-[#D1D5DB] p-2 rounded-lg text-xs font-bold text-[#111827] flex items-center justify-between">
                        <span className="flex items-center space-x-1.5 text-[#0F2F5C]">
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>{vet.phone}</span>
                        </span>
                        <span className="text-[9px] text-[#15803D] font-bold">Verified Line</span>
                      </div>
                    ) : (
                      <div className="bg-[#F3F4F6] border border-[#D1D5DB] p-2 rounded-lg text-[11px] text-[#4B5563] italic">
                        Phone contact pending verification
                      </div>
                    )}

                    {/* 4 ACTION BUTTONS */}
                    <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                      {/* 1. DIRECTIONS BUTTON (EXACT GOOGLE MAPS ROUTING) */}
                      <a 
                        href={exactGmapsDirectionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#0F2F5C] hover:bg-[#0B2447] text-white py-2 rounded-lg flex items-center justify-center space-x-1 transition cursor-pointer"
                        title="Open exact Google Maps directions"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Directions</span>
                      </a>

                      {/* 2. SHARE MY LOCATION / VET LOCATION BUTTON */}
                      <button 
                        onClick={() => handleOpenShareModal(vet)}
                        className="bg-white hover:bg-[#F3F4F6] text-[#111827] border border-[#D1D5DB] py-2 rounded-lg flex items-center justify-center space-x-1 transition cursor-pointer"
                      >
                        <Share2 className="w-3.5 h-3.5 text-[#0F2F5C]" />
                        <span>Share</span>
                      </button>

                      {/* 3. CALL BUTTON (ONLY IF VERIFIED PHONE EXISTS) */}
                      {vet.phone ? (
                        <a 
                          href={`tel:${vet.phone}`}
                          className="bg-[#0F2F5C] hover:bg-[#0B2447] text-white py-2 rounded-lg flex items-center justify-center space-x-1 transition cursor-pointer"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Call Vet</span>
                        </a>
                      ) : (
                        <button 
                          disabled
                          className="bg-[#D1D5DB] text-[#4B5563] py-2 rounded-lg flex items-center justify-center space-x-1 cursor-not-allowed text-[11px]"
                        >
                          <span>No Phone</span>
                        </button>
                      )}

                      {/* 4. BOOK CONSULTATION BUTTON */}
                      <button 
                        onClick={() => {
                          if (onNavigate) onNavigate('/farmer/consultations');
                          else alert("Redirecting to consultation booking...");
                        }}
                        className="bg-[#0F2F5C] hover:bg-[#0B2447] text-white py-2 rounded-lg flex items-center justify-center space-x-1 transition cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Book</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SHARE LOCATION MODAL */}
      {shareTargetVet && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[#D1D5DB] max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-[#D1D5DB] pb-3">
              <h3 className="text-base font-bold text-[#111827] flex items-center space-x-2">
                <Share2 className="w-5 h-5 text-[#0F2F5C]" />
                <span>Share Vet Location</span>
              </h3>
              <button 
                onClick={() => setShareTargetVet(null)}
                className="text-[#4B5563] hover:text-[#111827] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#F3F4F6] p-3 rounded-lg border border-[#D1D5DB] space-y-1 text-xs">
              <span className="font-bold text-[#111827] block">{shareTargetVet.nameEn}</span>
              <p className="text-[#4B5563]">{shareTargetVet.addressEn}</p>
              <span className="font-mono text-[#0F2F5C] text-[11px] block mt-1">
                {getShareUrl(shareTargetVet)}
              </span>
            </div>

            {copySuccessNote && (
              <div className="bg-[#15803D]/10 border border-[#15803D]/30 text-[#15803D] text-xs font-bold p-2.5 rounded-lg flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-[#15803D]" />
                <span>Link copied to clipboard!</span>
              </div>
            )}

            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleNativeShare(shareTargetVet)}
                className="btn-navy w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share via Phone Menu</span>
              </button>

              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Verified Veterinary Center: ${shareTargetVet.nameEn} - Location: https://www.google.com/maps?q=${shareTargetVet.lat},${shareTargetVet.lng}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0F2F5C] hover:bg-[#0B2447] text-white w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center space-x-2 cursor-pointer transition"
              >
                <span>Share via WhatsApp</span>
              </a>

              <button
                onClick={() => handleCopyLink(getShareUrl(shareTargetVet))}
                className="bg-white border border-[#D1D5DB] hover:bg-[#F3F4F6] text-[#111827] w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Copy className="w-4 h-4 text-[#0F2F5C]" />
                <span>Copy Link</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
