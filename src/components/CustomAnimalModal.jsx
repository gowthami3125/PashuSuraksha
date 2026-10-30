import React from 'react';
import { X, Plus, Image as ImageIcon } from 'lucide-react';

export default function CustomAnimalModal({ 
  showCustomAnimalModal, setShowCustomAnimalModal, customAnimalInput, setCustomAnimalInput, 
  customAnimalImage, handleCustomAnimalPhotoUpload, handleAddCustomAnimal, dict 
}) {
  if (!showCustomAnimalModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-300 text-gray-900 w-full max-w-md rounded-2xl p-6 space-y-5 shadow-xl relative max-h-[85vh] overflow-y-auto">
        <button onClick={() => setShowCustomAnimalModal(false)} className="absolute top-5 right-5 text-gray-500 hover:text-gray-700 p-2 rounded-lg bg-gray-100 cursor-pointer">
          <X className="w-4 h-4" />
        </button>
        <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
          <Plus className="w-5 h-5 text-[#0F2F5C]" />
          <span>{dict.addCustomAnimal}</span>
        </h3>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">Species / Animal Name</label>
            <input 
              type="text" 
              placeholder="Enter Species (e.g. Horse, Camel, Duck)..."
              value={customAnimalInput}
              onChange={(e) => setCustomAnimalInput(e.target.value)}
              className="w-full bg-[#F3F4F6] border border-gray-300 rounded-xl px-4 py-3 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#0F2F5C]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">{dict.uploadCustomPhoto}</label>
            <div className="flex items-center space-x-3">
              <label htmlFor="custom-animal-photo" className="bg-[#F3F4F6] border border-gray-300 hover:border-[#0F2F5C] text-gray-800 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer flex items-center space-x-2 transition">
                <ImageIcon className="w-4 h-4 text-[#0F2F5C]" />
                <span>Choose Photo File</span>
              </label>
              <input id="custom-animal-photo" type="file" accept="image/*" className="hidden" onChange={handleCustomAnimalPhotoUpload} />
              {customAnimalImage && (
                <img src={customAnimalImage} alt="Preview" className="w-10 h-10 object-cover rounded-xl border border-[#0F2F5C]" />
              )}
            </div>
          </div>
        </div>

        <div className="pt-2 flex space-x-3">
          <button 
            onClick={handleAddCustomAnimal} 
            className="flex-1 bg-[#0F2F5C] hover:bg-[#0B2447] text-white font-bold py-3 rounded-xl text-xs transition cursor-pointer shadow"
          >
            Add Animal Species
          </button>
        </div>
      </div>
    </div>
  );
}
