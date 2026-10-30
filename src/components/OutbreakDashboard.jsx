import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, AlertTriangle, Layers, CloudRain, Thermometer, Wind, 
  MapPin, CheckCircle, RefreshCw, BarChart2, Info, Compass, 
  ChevronRight, Database, ExternalLink, Activity
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  OUTBREAK_EPICENTERS, 
  detectDistrictAnomalies, 
  masterStateOutbreakData 
} from '../data/outbreakData';
import { fetchDistrictWeather } from '../services/weatherService';
import { getDistrictCensus, CENSUS_METADATA } from '../data/censusData';
import { getTrans } from '../data/dictionary';
import DiseaseSpreadChain from './DiseaseSpreadChain';

// Default state view coordinates
const STATE_CENTERS = {
  'Maharashtra': { lat: 18.9500, lng: 74.8000, zoom: 7 },
  'Andhra Pradesh': { lat: 15.9129, lng: 79.7400, zoom: 7 }
};

export default function OutbreakDashboard({ 
  selectedState = 'Maharashtra', 
  setSelectedState, 
  reportedAlertNotice, 
  lang = 'mr', 
  dict = {} 
}) {
  const [activeState, setActiveState] = useState(selectedState || 'Maharashtra');
  const [selectedDistrict, setSelectedDistrict] = useState('Pune');
  const [activeLayer, setActiveLayer] = useState('all'); // 'all', 'quarantine', 'weather', 'census'
  const [dashboardSubTab, setDashboardSubTab] = useState('map'); // 'map', 'spread_chain', 'anomalies'
  
  // Dynamic Weather and Census state
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [censusData, setCensusData] = useState(null);

  // Anomaly Engine state
  const anomalies = detectDistrictAnomalies();

  // Leaflet map container and instances
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersGroupRef = useRef({
    quarantine: null,
    weather: null,
    census: null
  });

  // Sync external state if passed
  useEffect(() => {
    if (selectedState && selectedState !== activeState) {
      setActiveState(selectedState);
    }
  }, [selectedState]);

  const handleStateChange = (newState) => {
    setActiveState(newState);
    if (setSelectedState) setSelectedState(newState);
    // Switch default district
    const nextDistrict = newState === 'Maharashtra' ? 'Pune' : 'Guntur';
    setSelectedDistrict(nextDistrict);
  };

  // Load weather and census for active district
  useEffect(() => {
    let isSubscribed = true;
    const loadDetails = async () => {
      setWeatherLoading(true);
      const census = getDistrictCensus(selectedDistrict);
      setCensusData(census);

      const weather = await fetchDistrictWeather(selectedDistrict);
      if (isSubscribed) {
        setWeatherData(weather);
        setWeatherLoading(false);
      }
    };

    loadDetails();
    return () => { isSubscribed = false; };
  }, [selectedDistrict]);

  // Leaflet Map Initialization & Rendering
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // 1. Initialize map if not yet created
    if (!mapInstanceRef.current) {
      const initialCenter = STATE_CENTERS[activeState] || STATE_CENTERS['Maharashtra'];
      const map = L.map(mapContainerRef.current, {
        scrollWheelZoom: true
      }).setView([initialCenter.lat, initialCenter.lng], initialCenter.zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | ICAR-NIVEDI / DAHD Reference',
        maxZoom: 18
      }).addTo(map);

      mapInstanceRef.current = map;

      // Layer groups for toggleable data layers
      layersGroupRef.current = {
        quarantine: L.layerGroup().addTo(map),
        weather: L.layerGroup().addTo(map),
        census: L.layerGroup().addTo(map)
      };
    }

    const map = mapInstanceRef.current;
    const { quarantine, weather: weatherLayer, census: censusLayer } = layersGroupRef.current;

    // Clear previous layers
    quarantine.clearLayers();
    weatherLayer.clearLayers();
    censusLayer.clearLayers();

    // Filter epicenters by current state
    const currentEpicenters = OUTBREAK_EPICENTERS.filter(e => e.state === activeState);
    const bounds = L.latLngBounds();

    // 1. QUARANTINE LAYER (5km Infected Zone & 10km Surveillance Zone)
    if (activeLayer === 'all' || activeLayer === 'quarantine') {
      currentEpicenters.forEach(o => {
        const centerLatLng = [o.lat, o.lng];
        bounds.extend(centerLatLng);

        const isConfirmed = o.status === 'CONFIRMED';
        const localizedDisease = lang === 'mr' ? o.diseaseMr : lang === 'hi' ? o.diseaseHi : lang === 'te' ? o.diseaseTe : o.diseaseEn;

        // 10 km Surveillance Zone (Outer amber ring)
        const outerSurveillanceCircle = L.circle(centerLatLng, {
          radius: 10000, // 10 km
          color: '#D97706',
          weight: 2,
          opacity: 0.85,
          dashArray: '6, 6',
          fillColor: '#F59E0B',
          fillOpacity: 0.12
        });

        // 5 km Infected Zone (Inner red ring)
        const innerInfectedCircle = L.circle(centerLatLng, {
          radius: 5000, // 5 km
          color: '#DC2626',
          weight: 2.5,
          opacity: 0.95,
          fillColor: '#DC2626',
          fillOpacity: 0.28
        });

        // Center Pin Marker
        const markerIcon = L.divIcon({
          className: 'outbreak-epicenter-pin',
          html: `
            <div style="background-color: ${isConfirmed ? '#DC2626' : '#D97706'}; color: white; width: 34px; height: 34px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: bold;">
              ${isConfirmed ? '☣️' : '⚠️'}
            </div>
          `,
          iconSize: [34, 34],
          iconAnchor: [17, 17]
        });

        const popupHtml = `
          <div style="font-family: sans-serif; min-width: 240px; padding: 4px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="font-size: 10px; font-weight: 800; background: ${isConfirmed ? '#DC2626' : '#D97706'}; color: white; padding: 2px 6px; border-radius: 4px;">
                ${isConfirmed ? 'LAB CONFIRMED' : 'SUSPECTED CLUSTER'}
              </span>
              <span style="font-size: 10px; color: #6B7280; font-weight: bold;">${o.reportedDate}</span>
            </div>
            <h4 style="margin: 4px 0; color: #111827; font-size: 14px; font-weight: bold;">${localizedDisease}</h4>
            <p style="margin: 2px 0; font-size: 11px; color: #4B5563;">
              📍 <b>${o.mandal} Mandal</b>, ${o.district} (${o.village})
            </p>
            <div style="background: #F3F4F6; padding: 6px; border-radius: 4px; margin: 6px 0; font-size: 11px; border: 1px solid #D1D5DB;">
              <div>Active Cases: <b style="color: #DC2626;">${o.cases} Livestock</b></div>
              <div>Affected: <b>${o.affectedSpecies.join(', ')}</b></div>
              <div style="color: #0F2F5C; font-size: 10px; margin-top: 3px;">🔬 ${o.labConfirmation}</div>
            </div>
            <div style="font-size: 10px; color: #DC2626; font-weight: bold; margin-bottom: 4px;">
              🔴 5 km Ring: Animal movement forbidden<br/>
              🟡 10 km Ring: Active syndromic ring surveillance
            </div>
          </div>
        `;

        const centerMarker = L.marker(centerLatLng, { icon: markerIcon }).bindPopup(popupHtml);

        // Add to quarantine layer
        quarantine.addLayer(outerSurveillanceCircle);
        quarantine.addLayer(innerInfectedCircle);
        quarantine.addLayer(centerMarker);
      });
    }

    // 2. LIVE WEATHER & VECTOR RISK LAYER
    if (activeLayer === 'all' || activeLayer === 'weather') {
      if (weatherData && weatherData.lat && weatherData.lng) {
        const isHighVector = weatherData.vectorRisk.riskLevel === 'HIGH';
        const weatherIcon = L.divIcon({
          className: 'weather-vector-pin',
          html: `
            <div style="background-color: ${isHighVector ? '#DC2626' : '#0F2F5C'}; color: white; padding: 4px 8px; border-radius: 12px; border: 2px solid white; font-size: 10px; font-weight: bold; box-shadow: 0 2px 6px rgba(0,0,0,0.3); white-space: nowrap;">
              🦟 Vector Risk: ${weatherData.vectorRisk.riskLevel} (${weatherData.temperature}°C)
            </div>
          `,
          iconAnchor: [60, 20]
        });

        const weatherPopup = `
          <div style="font-family: sans-serif; padding: 4px;">
            <b style="color: #0F2F5C; font-size: 13px;">${weatherData.district} Agro-Weather</b><br/>
            <span style="font-size: 11px;">Temp: <b>${weatherData.temperature}°C</b> | Humidity: <b>${weatherData.humidity}%</b></span><br/>
            <div style="margin-top: 4px; font-size: 10px; color: ${isHighVector ? '#DC2626' : '#15803D'}; font-weight: bold;">
              ${weatherData.vectorRisk.primaryThreat}
            </div>
            <div style="font-size: 9px; color: #6B7280; margin-top: 4px;">Source: Open-Meteo Live API</div>
          </div>
        `;

        const weatherMarker = L.marker([weatherData.lat, weatherData.lng], { icon: weatherIcon }).bindPopup(weatherPopup);
        weatherLayer.addLayer(weatherMarker);
      }
    }

    // 3. 20th LIVESTOCK CENSUS DENSITY LAYER
    if (activeLayer === 'all' || activeLayer === 'census') {
      if (censusData && censusData.lat && censusData.lng) {
        const censusCircle = L.circle([censusData.lat, censusData.lng], {
          radius: 15000,
          color: '#0F2F5C',
          weight: 1.5,
          dashArray: '3, 4',
          fillColor: '#0F2F5C',
          fillOpacity: 0.08
        });

        const censusPopup = `
          <div style="font-family: sans-serif; padding: 4px;">
            <b style="color: #0F2F5C; font-size: 13px;">${censusData.district} Livestock Census</b><br/>
            <span style="font-size: 11px; color: #4B5563;">${censusData.densityCategory}</span>
            <div style="margin-top: 4px; font-size: 11px;">
              • Cattle: <b>${censusData.cattle.toLocaleString()}</b><br/>
              • Buffalo: <b>${censusData.buffalo.toLocaleString()}</b><br/>
              • Sheep & Goat: <b>${(censusData.sheep + censusData.goat).toLocaleString()}</b>
            </div>
            <div style="font-size: 9px; color: #6B7280; margin-top: 4px;">20th Livestock Census (DAHD)</div>
          </div>
        `;
        censusCircle.bindPopup(censusPopup);
        censusLayer.addLayer(censusCircle);
      }
    }

    // Pan map to state center or bounds
    const stateConfig = STATE_CENTERS[activeState];
    if (stateConfig) {
      map.setView([stateConfig.lat, stateConfig.lng], stateConfig.zoom);
    }
  }, [activeState, activeLayer, weatherData, censusData, lang]);

  // Clean teardown on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const stateOutbreaks = OUTBREAK_EPICENTERS.filter(e => e.state === activeState);
  const districtList = activeState === 'Maharashtra' 
    ? ['Pune', 'Kolhapur', 'Nashik', 'Ahmednagar', 'Latur', 'Solapur']
    : ['Guntur', 'Krishna', 'Chittoor', 'West Godavari', 'Visakhapatnam'];

  return (
    <div className="space-y-6">
      
      {/* 1. TOP HEADER & OFFICIAL NIVEDI COMPLIANCE NOTICE */}
      <div className="gov-card p-6 md:p-8 space-y-6">
        
        {/* State and Title Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#D1D5DB] pb-6">
          <div>
            <span className="text-[10px] font-bold text-[#0F2F5C] uppercase tracking-widest block">
              National Animal Disease Surveillance System (NADSS) & Epidemic Matrix
            </span>
            <h2 className="text-2xl font-bold text-[#111827] flex items-center space-x-3 mt-0.5">
              <ShieldAlert className="w-7 h-7 text-[#DC2626]" />
              <span>{dict?.outbreakTitle || 'Interactive Outbreak & Biosecurity Surveillance Hub'}</span>
            </h2>
            <p className="text-xs text-[#4B5563] mt-1">
              Real-time epidemiological cluster mapping, 5 km containment / 10 km surveillance rings, vector threat forewarning, and 20th Livestock Census overlays.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-[#4B5563]">{dict?.stateSyncBanner || 'Active State:'}</span>
              <select
                value={activeState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="bg-[#F3F4F6] border border-[#D1D5DB] rounded-lg px-4 py-2 text-xs font-bold text-[#111827] focus:outline-none focus:border-[#0F2F5C] cursor-pointer"
              >
                <option value="Maharashtra">Maharashtra (महाराष्ट्र)</option>
                <option value="Andhra Pradesh">Andhra Pradesh (ఆంధ్రప్రదేశ్)</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-[#4B5563]">{dict?.districtLabel || 'District:'}</span>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-[#F3F4F6] border border-[#D1D5DB] rounded-lg px-3 py-2 text-xs font-bold text-[#111827] focus:outline-none focus:border-[#0F2F5C] cursor-pointer"
              >
                {districtList.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* OFFICIAL NIVEDI / STATE DEPARTMENT STATUS BANNER */}
        <div className="bg-[#0F2F5C]/5 border border-[#0F2F5C]/20 rounded-lg p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2 text-[#0F2F5C] font-bold">
            <Info className="w-4 h-4 text-[#0F2F5C] shrink-0" />
            <span>{dict?.nivediNotice || 'Official NIVEDI Notice: Data access requested from NIVEDI / state department (Status: Public Bulletin Referenced)'}</span>
          </div>
          <span className="bg-[#0F2F5C] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0">
            {dict?.nivediCompliant || 'ICAR-NIVEDI Protocol Compliant'}
          </span>
        </div>

        {/* OUTBREAK HUB SUB-TAB SWITCHER */}
        <div className="flex flex-wrap border-b border-[#D1D5DB] gap-2 pt-2">
          <button
            onClick={() => setDashboardSubTab('map')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition flex items-center space-x-1.5 cursor-pointer ${
              dashboardSubTab === 'map'
                ? 'bg-[#0F2F5C] text-white shadow-xs'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-[#D1D5DB]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>🗺️ GIS Outbreak Map & Quarantine Rings</span>
          </button>
          
          <button
            onClick={() => setDashboardSubTab('spread_chain')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition flex items-center space-x-1.5 cursor-pointer ${
              dashboardSubTab === 'spread_chain'
                ? 'bg-[#0F2F5C] text-white shadow-xs'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-[#D1D5DB]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>🔗 Spatiotemporal Spread Chain & Haat Corridors</span>
          </button>

          <button
            onClick={() => setDashboardSubTab('anomalies')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition flex items-center space-x-1.5 cursor-pointer ${
              dashboardSubTab === 'anomalies'
                ? 'bg-[#0F2F5C] text-white shadow-xs'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-[#D1D5DB]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>⚡ Anomaly Surge Detector ({anomalies.length})</span>
          </button>
        </div>

        {/* SUBTAB 2: SPATIOTEMPORAL SPREAD CHAIN SIMULATOR */}
        {dashboardSubTab === 'spread_chain' && (
          <div className="pt-2 animate-fadeIn">
            <DiseaseSpreadChain lang={lang} />
          </div>
        )}

        {/* SUBTAB 1 & 3: LEAFLET MAP & LAYER CONTROLS */}
        {dashboardSubTab !== 'spread_chain' && (
        <div className="space-y-6">
        <div className="space-y-3">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <Compass className="w-5 h-5 text-[#0F2F5C]" />
              <h3 className="text-sm font-bold text-[#111827]">
                Live Geospatial Disease Quarantine Map ({activeState})
              </h3>
            </div>

            {/* Layer Filter Toggles */}
            <div className="flex flex-wrap items-center gap-1.5 bg-[#F3F4F6] p-1 rounded-lg border border-[#D1D5DB] text-xs">
              <button
                onClick={() => setActiveLayer('all')}
                className={`px-3 py-1 rounded font-bold transition cursor-pointer ${
                  activeLayer === 'all' ? 'bg-[#0F2F5C] text-white' : 'text-[#4B5563] hover:text-[#111827]'
                }`}
              >
                {dict?.allLayers || 'All Layers'}
              </button>
              <button
                onClick={() => setActiveLayer('quarantine')}
                className={`px-3 py-1 rounded font-bold transition cursor-pointer ${
                  activeLayer === 'quarantine' ? 'bg-[#DC2626] text-white' : 'text-[#4B5563] hover:text-[#111827]'
                }`}
              >
                {dict?.quarantineZones || '🔴 5km/10km Quarantine Rings'}
              </button>
              <button
                onClick={() => setActiveLayer('weather')}
                className={`px-3 py-1 rounded font-bold transition cursor-pointer ${
                  activeLayer === 'weather' ? 'bg-[#E07B00] text-white' : 'text-[#4B5563] hover:text-[#111827]'
                }`}
              >
                {dict?.vectorWeather || '🦟 Vector & Weather'}
              </button>
              <button
                onClick={() => setActiveLayer('census')}
                className={`px-3 py-1 rounded font-bold transition cursor-pointer ${
                  activeLayer === 'census' ? 'bg-[#0F2F5C] text-white' : 'text-[#4B5563] hover:text-[#111827]'
                }`}
              >
                {dict?.livestockCensus || '📊 Livestock Census'}
              </button>
            </div>
          </div>

          {/* Interactive Leaflet Map Container */}
          <div className="relative rounded-lg overflow-hidden border-2 border-[#D1D5DB] shadow-inner bg-[#E5E7EB]">
            <div 
              ref={mapContainerRef} 
              style={{ height: '460px', width: '100%', zIndex: 1 }} 
            />

            {/* Floating Map Legend Overlay */}
            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs p-3 rounded-lg border border-[#D1D5DB] shadow-md z-10 text-[11px] space-y-1.5 max-w-xs">
              <span className="font-bold text-[#111827] block border-b pb-1">Biosecurity Cordon Legend</span>
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 rounded-full bg-[#DC2626]/80 border-2 border-[#DC2626] inline-block" />
                <span className="text-[#111827] font-semibold">5 km Infected Zone (Movement Freeze)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 rounded-full bg-[#F59E0B]/50 border-2 border-[#D97706] border-dashed inline-block" />
                <span className="text-[#111827] font-semibold">10 km Surveillance Zone (Monitoring)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 rounded-full bg-[#0F2F5C] inline-block" />
                <span className="text-[#111827] font-semibold">20th Livestock Census Belt</span>
              </div>
            </div>

            {/* Layer Legend Quick Indicator */}
            <div className="absolute top-3 right-3 bg-white/95 px-3 py-1.5 rounded-lg border border-[#D1D5DB] shadow-md z-10 text-[11px] font-bold text-[#0F2F5C]">
              📍 {stateOutbreaks.length} Active Epicenters Mapped
            </div>
          </div>

        </div>

        {/* 3. DUAL INSPECTOR: LIVE OPEN-METEO WEATHER & 20th CENSUS DATA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          
          {/* WEATHER & VECTOR FOREWARNING CARD */}
          <div className="bg-[#F3F4F6] border border-[#D1D5DB] rounded-lg p-5 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-[#0F2F5C] uppercase tracking-wider block">
                  Agro-Meteorological Forewarning
                </span>
                <h4 className="font-bold text-base text-[#111827] flex items-center space-x-2 mt-0.5">
                  <CloudRain className="w-5 h-5 text-[#0F2F5C]" />
                  <span>{selectedDistrict} District Weather & Vector Index</span>
                </h4>
              </div>

              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center space-x-1 ${
                weatherData?.isLive ? 'bg-green-100 text-[#15803D] border border-green-300' : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}>
                <span>{weatherData?.isLive ? '● Live Open-Meteo' : '▲ Offline Baseline'}</span>
              </span>
            </div>

            {weatherLoading ? (
              <div className="p-8 text-center text-xs text-[#4B5563] flex items-center justify-center space-x-2">
                <RefreshCw className="w-4 h-4 animate-spin text-[#0F2F5C]" />
                <span>Polling live atmospheric telemetry...</span>
              </div>
            ) : weatherData ? (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded-lg border border-[#D1D5DB] text-center">
                    <Thermometer className="w-4 h-4 text-[#DC2626] mx-auto mb-1" />
                    <span className="text-[10px] text-[#4B5563] block font-bold">Temperature</span>
                    <strong className="text-base text-[#111827]">{weatherData.temperature}°C</strong>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-[#D1D5DB] text-center">
                    <CloudRain className="w-4 h-4 text-[#0F2F5C] mx-auto mb-1" />
                    <span className="text-[10px] text-[#4B5563] block font-bold">Rel. Humidity</span>
                    <strong className="text-base text-[#111827]">{weatherData.humidity}%</strong>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-[#D1D5DB] text-center">
                    <Wind className="w-4 h-4 text-[#E07B00] mx-auto mb-1" />
                    <span className="text-[10px] text-[#4B5563] block font-bold">Wind Speed</span>
                    <strong className="text-base text-[#111827]">{weatherData.windSpeed} km/h</strong>
                  </div>
                </div>

                {/* Vector Multiplication Forewarning Gauge */}
                <div className={`p-3.5 rounded-lg border ${
                  weatherData.vectorRisk.riskLevel === 'HIGH' 
                    ? 'bg-red-50 border-red-300 text-red-900' 
                    : weatherData.vectorRisk.riskLevel === 'MODERATE'
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-green-50 border-green-300 text-green-900'
                }`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-xs uppercase tracking-wide">
                      🦟 Vector Risk Level: {weatherData.vectorRisk.riskLevel}
                    </span>
                    <span className="text-[10px] font-mono font-bold">Score: {weatherData.vectorRisk.score}/100</span>
                  </div>
                  <p className="text-xs font-semibold">{weatherData.vectorRisk.primaryThreat}</p>
                  <p className="text-[11px] mt-1.5 opacity-90 leading-relaxed font-medium">
                    {weatherData.vectorRisk.recommendations[lang] || weatherData.vectorRisk.recommendations['en']}
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          {/* 20th LIVESTOCK CENSUS STATS (DAHD) */}
          <div className="bg-[#F3F4F6] border border-[#D1D5DB] rounded-lg p-5 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-[#0F2F5C] uppercase tracking-wider block">
                  Official Demographic Baseline
                </span>
                <h4 className="font-bold text-base text-[#111827] flex items-center space-x-2 mt-0.5">
                  <Database className="w-5 h-5 text-[#0F2F5C]" />
                  <span>20th Livestock Census ({selectedDistrict})</span>
                </h4>
              </div>

              <span className="bg-[#0F2F5C] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                DAHD 2019-2020
              </span>
            </div>

            {censusData ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="bg-white p-2.5 rounded-lg border border-[#D1D5DB]">
                    <span className="text-[10px] text-[#4B5563] block font-bold">Cattle</span>
                    <strong className="text-sm text-[#111827]">{censusData.cattle.toLocaleString()}</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-[#D1D5DB]">
                    <span className="text-[10px] text-[#4B5563] block font-bold">Buffalo</span>
                    <strong className="text-sm text-[#111827]">{censusData.buffalo.toLocaleString()}</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-[#D1D5DB]">
                    <span className="text-[10px] text-[#4B5563] block font-bold">Sheep & Goat</span>
                    <strong className="text-sm text-[#111827]">{(censusData.sheep + censusData.goat).toLocaleString()}</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-[#D1D5DB]">
                    <span className="text-[10px] text-[#4B5563] block font-bold">Poultry</span>
                    <strong className="text-sm text-[#111827]">{censusData.poultry.toLocaleString()}</strong>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-lg border border-[#D1D5DB] space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#4B5563] font-semibold">Density Classification:</span>
                    <strong className="text-[#0F2F5C]">{censusData.densityCategory}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4B5563] font-semibold">Predominant Local Breeds:</span>
                    <strong className="text-[#111827]">{censusData.predominantBreeds.join(', ')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4B5563] font-semibold">Priority Vaccine Targets:</span>
                    <strong className="text-[#DC2626]">{censusData.highRiskDiseases.join(' | ')}</strong>
                  </div>
                </div>

                <p className="text-[10px] text-[#6B7280] italic leading-tight">
                  Citation: {CENSUS_METADATA.officialAuthority} — {CENSUS_METADATA.censusNumber}
                </p>
              </div>
            ) : null}
          </div>

        </div>

        {/* 4. ANOMALY DETECTION ENGINE & DISTRICT SURGE MONITOR */}
        <div className="pt-4 border-t border-[#D1D5DB] space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-[#111827] flex items-center space-x-2">
                <Activity className="w-5 h-5 text-[#DC2626]" />
                <span>Automated Epidemiological Anomaly Detector</span>
              </h3>
              <p className="text-xs text-[#4B5563] mt-0.5">
                Clustering rule: Triggered when 3+ similar disease syndromic reports occur within 15 km in 7 days, or when weekly reports exceed 2x the 14-day rolling baseline.
              </p>
            </div>
            <span className="bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/30 text-xs font-bold px-3 py-1 rounded-full">
              {anomalies.length} District Anomalies Flagged
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {anomalies.map((anom, idx) => (
              <div key={idx} className="bg-white border-l-4 border-l-[#DC2626] border border-[#D1D5DB] rounded-lg p-4 space-y-2 shadow-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-[#DC2626] uppercase tracking-wider block">
                      {anom.state} • {anom.district} District
                    </span>
                    <h5 className="font-bold text-sm text-[#111827]">{anom.disease}</h5>
                  </div>
                  <span className="bg-[#DC2626] text-white text-xs font-mono font-black px-2.5 py-0.5 rounded">
                    +{anom.surgePercent}% Surge
                  </span>
                </div>

                <div className="text-xs text-[#4B5563] space-y-1">
                  <p>Trigger: <strong>{anom.triggerReason}</strong></p>
                  <p>Baseline: <strong>{anom.baseline14d} avg/wk</strong> ➜ Current: <strong className="text-[#DC2626]">{anom.current7d} reports</strong></p>
                </div>

                <div className="bg-[#F3F4F6] p-2 rounded text-[11px] text-[#0F2F5C] font-semibold border border-[#D1D5DB]/60">
                  Action Mandate: {anom.recommendedAction}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. ACTIVE CONTAINMENT EPISODES ACCORDION */}
        <div className="pt-4 border-t border-[#D1D5DB] space-y-4">
          <h3 className="text-base font-bold text-[#111827]">
            Active Outbreak Epicenters & Quarantine Zones ({activeState})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stateOutbreaks.map(o => {
              const isConfirmed = o.status === 'CONFIRMED';
              const localizedDisease = lang === 'mr' ? o.diseaseMr : lang === 'hi' ? o.diseaseHi : lang === 'te' ? o.diseaseTe : o.diseaseEn;

              return (
                <div key={o.id} className="bg-[#F3F4F6] border border-[#D1D5DB] rounded-lg p-4 space-y-2 hover:border-[#0F2F5C] transition">
                  <div className="flex justify-between items-start">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      isConfirmed ? 'bg-[#DC2626] text-white' : 'bg-[#D97706] text-white'
                    }`}>
                      {isConfirmed ? '5 km Infected Zone' : 'Suspected Alert'}
                    </span>
                    <span className="text-[10px] font-mono text-[#6B7280]">{o.trend}</span>
                  </div>

                  <h4 className="font-bold text-sm text-[#111827]">{localizedDisease}</h4>
                  <p className="text-xs text-[#4B5563]">
                    📍 <b>{o.mandal} Mandal</b> ({o.village})
                  </p>
                  
                  <div className="bg-white p-2.5 rounded border border-[#D1D5DB] text-xs space-y-1">
                    <div>Active Affected: <strong className="text-[#DC2626]">{o.cases} Animals</strong></div>
                    <div className="text-[11px] text-[#4B5563] truncate">Lab: {o.labConfirmation}</div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedDistrict(o.district);
                      if (mapInstanceRef.current) {
                        mapInstanceRef.current.flyTo([o.lat, o.lng], 11);
                      }
                    }}
                    className="w-full text-center text-xs font-bold text-[#0F2F5C] hover:underline pt-1 cursor-pointer"
                  >
                    Focus on Map ➜
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        </div>
        )}

      </div>
    </div>
  );
}
