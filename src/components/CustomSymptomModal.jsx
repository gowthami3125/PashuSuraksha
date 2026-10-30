import React from 'react';
import { X, Plus } from 'lucide-react';

export default function CustomSymptomModal({ 
  showCustomSymptomModal, setShowCustomSymptomModal, customSymptomInput, setCustomSymptomInput, 
  handleAddCustomSymptom, dict 
}) {
  if (!showCustomSymptomModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-300 text-gray-900 w-full max-w-md rounded-2xl p-6 space-y-5 shadow-xl relative max-h-[85vh] overflow-y-auto">
        <button onClick={() => setShowCustomSymptomModal(false)} className="absolute top-5 right-5 text-gray-500 hover:text-gray-700 p-2 rounded-lg bg-gray-100 cursor-pointer">
          <X className="w-4 h-4" />
        </button>
        <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
          <Plus className="w-5 h-5 text-[#0F2F5C]" />
          <span>{dict.addCustomSymptom}</span>
        </h3>

        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1">Observed Symptom Description</label>
          <input 
            type="text" 
            placeholder="Enter Symptom (e.g. Swollen joints, Ear discharge)..."
            value={customSymptomInput}
            onChange={(e) => setCustomSymptomInput(e.target.value)}
            className="w-full bg-[#F3F4F6] border border-gray-300 rounded-xl px-4 py-3 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#0F2F5C]"
          />
        </div>

        <div className="pt-2 flex space-x-3">
          <button 
            onClick={handleAddCustomSymptom} 
            className="flex-1 bg-[#0F2F5C] hover:bg-[#0B2447] text-white font-bold py-3 rounded-xl text-xs transition cursor-pointer shadow"
          >
            Add Symptom to Matrix
          </button>
        </div>
      </div>
    </div>
  );
}
