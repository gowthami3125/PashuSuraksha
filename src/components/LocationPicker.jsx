import React, { useEffect } from 'react';
import { 
  STATES_ORDERED, 
  getDistrictsForState, 
  getTalukasForDistrict, 
  getSubdivisionTerm 
} from '../data/locationsData';

export default function LocationPicker({
  selectedState = 'Maharashtra',
  onChangeState,
  selectedDistrict = 'Pune',
  onChangeDistrict,
  selectedTaluka = '',
  onChangeTaluka,
  allowAllOption = false,
  layout = 'grid', // 'grid' | 'stacked'
  className = '',
  disabled = false
}) {
  const availableDistricts = getDistrictsForState(selectedState);
  const availableTalukas = getTalukasForDistrict(selectedState, selectedDistrict);
  const subdivisionTerm = getSubdivisionTerm(selectedState);

  // If selected district is not in available districts, reset it to first
  useEffect(() => {
    if (availableDistricts.length > 0 && !availableDistricts.includes(selectedDistrict)) {
      if (allowAllOption) {
        onChangeDistrict('All');
      } else {
        onChangeDistrict(availableDistricts[0]);
      }
    }
  }, [selectedState, availableDistricts, selectedDistrict, allowAllOption, onChangeDistrict]);

  // If selected taluka is not in available talukas, reset it
  useEffect(() => {
    if (availableTalukas.length > 0 && !availableTalukas.includes(selectedTaluka)) {
      if (allowAllOption) {
        onChangeTaluka('All');
      } else {
        onChangeTaluka(availableTalukas[0] || '');
      }
    }
  }, [selectedDistrict, availableTalukas, selectedTaluka, allowAllOption, onChangeTaluka]);

  const handleStateSelect = (e) => {
    const newState = e.target.value;
    onChangeState(newState);
    const newDistricts = getDistrictsForState(newState);
    const firstDistrict = allowAllOption ? 'All' : (newDistricts[0] || '');
    onChangeDistrict(firstDistrict);
    const newTalukas = getTalukasForDistrict(newState, firstDistrict);
    onChangeTaluka(allowAllOption ? 'All' : (newTalukas[0] || ''));
  };

  const handleDistrictSelect = (e) => {
    const newDistrict = e.target.value;
    onChangeDistrict(newDistrict);
    const newTalukas = getTalukasForDistrict(selectedState, newDistrict);
    onChangeTaluka(allowAllOption ? 'All' : (newTalukas[0] || ''));
  };

  const containerClasses = layout === 'stacked' 
    ? 'space-y-3' 
    : 'grid grid-cols-1 sm:grid-cols-3 gap-3';

  return (
    <div className={`${containerClasses} ${className}`}>
      {/* 1. State Selector */}
      <div className="space-y-1">
        <label className="text-[11px] font-bold text-[#4B5563] uppercase tracking-wider block">
          State / UT:
        </label>
        <select
          disabled={disabled}
          value={selectedState}
          onChange={handleStateSelect}
          className="w-full bg-white border border-[#D1D5DB] rounded-lg px-3 py-2 text-xs font-bold text-[#111827] focus:outline-none focus:border-[#0F2F5C] cursor-pointer disabled:bg-gray-100"
        >
          {STATES_ORDERED.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* 2. District Selector */}
      <div className="space-y-1">
        <label className="text-[11px] font-bold text-[#4B5563] uppercase tracking-wider block">
          District:
        </label>
        <select
          disabled={disabled}
          value={selectedDistrict}
          onChange={handleDistrictSelect}
          className="w-full bg-white border border-[#D1D5DB] rounded-lg px-3 py-2 text-xs font-bold text-[#111827] focus:outline-none focus:border-[#0F2F5C] cursor-pointer disabled:bg-gray-100"
        >
          {allowAllOption && <option value="All">All Districts</option>}
          {availableDistricts.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* 3. Taluka / Mandal Selector or Input */}
      <div className="space-y-1">
        <label className="text-[11px] font-bold text-[#4B5563] uppercase tracking-wider block">
          {subdivisionTerm}:
        </label>
        {availableTalukas.length > 0 ? (
          <select
            disabled={disabled}
            value={selectedTaluka}
            onChange={(e) => onChangeTaluka(e.target.value)}
            className="w-full bg-white border border-[#D1D5DB] rounded-lg px-3 py-2 text-xs font-bold text-[#111827] focus:outline-none focus:border-[#0F2F5C] cursor-pointer disabled:bg-gray-100"
          >
            {allowAllOption && <option value="All">All {subdivisionTerm}s</option>}
            {availableTalukas.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            disabled={disabled}
            value={selectedTaluka}
            onChange={(e) => onChangeTaluka(e.target.value)}
            placeholder={`Enter ${subdivisionTerm} (or leave blank)`}
            className="w-full bg-white border border-[#D1D5DB] rounded-lg px-3 py-2 text-xs text-[#111827] focus:outline-none focus:border-[#0F2F5C] disabled:bg-gray-100"
          />
        )}
      </div>
    </div>
  );
}
