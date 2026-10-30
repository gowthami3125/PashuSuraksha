import React, { useState, useEffect } from 'react';

export default function DiseaseSpreadChain({ lang }) {
  const [disease, setDisease] = useState('Foot and Mouth Disease (FMD)');
  const [caseCount, setCaseCount] = useState(5);
  const [location, setLocation] = useState('Tenali Mandal, Guntur District');
  const [loading, setLoading] = useState(false);
  const [spreadData, setSpreadData] = useState(null);

  const calculateSpread = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/spread/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disease, caseCount, location })
      });
      if (res.ok) {
        const d = await res.json();
        setSpreadData(d);
      } else {
        throw new Error("API error");
      }
    } catch (err) {
      // Local calculation fallback
      const affectedCount = parseInt(caseCount || 5);
      const primaryExposed = affectedCount * 4;
      const secondaryExposed = affectedCount * 12;
      const riskRadiusKm = disease.includes('FMD') ? 12.5 : disease.includes('LSD') ? 10.0 : 8.0;

      setSpreadData({
        success: true,
        disease,
        location,
        metrics: {
          primaryExposedAnimals: primaryExposed,
          secondaryExposedAnimals: secondaryExposed,
          geographicRiskRadiusKm: riskRadiusKm,
          riskLevel: "CRITICAL HIGH CONTAINMENT REQUIRED"
        },
        nodes: [
          { id: 'n1', label: 'Index Symptomatic Animal(s)', type: 'Animal', risk: 'HIGH', count: affectedCount, desc: 'Primary infected livestock' },
          { id: 'n2', label: 'Primary Farm Herd', type: 'Herd', risk: 'HIGH', count: primaryExposed, desc: 'Co-located animals in shed' },
          { id: 'n3', label: 'Index Farm Location', type: 'Farm', risk: 'HIGH', count: 1, desc: location },
          { id: 'n4', label: 'Adjacent Farms (500m)', type: 'Nearby Farms', risk: 'HIGH', count: 6, desc: 'Neighboring cattle holdings' },
          { id: 'n5', label: 'Mandal Village Cluster', type: 'Villages', risk: 'MEDIUM', count: 14, desc: 'Shared mandal boundaries' },
          { id: 'n6', label: 'Communal Water Tank / Grazing', type: 'Shared Water/Feed', risk: 'MEDIUM', count: secondaryExposed, desc: 'Shared water trough & pasture' },
          { id: 'n7', label: 'Weekly Mandal Animal Haat', type: 'Markets/Haats', risk: 'HIGH', count: 450, desc: 'Livestock trading hub' },
          { id: 'n8', label: 'Inter-district Transport Route', type: 'Transport Routes', risk: 'MEDIUM', count: 1200, desc: 'State Highway transport corridor' }
        ],
        connections: [
          { from: 'Index Animal', to: 'Primary Herd', route: 'Direct Saliva / Inhalation' },
          { from: 'Primary Herd', to: 'Index Farm', route: 'Shed Bedding & Milking Gear' },
          { from: 'Index Farm', to: 'Adjacent Farms', route: 'Airborne Aerosol / Mosquito Vector' },
          { from: 'Adjacent Farms', to: 'Communal Grazing', route: 'Shared Pasture Discharge' },
          { from: 'Communal Grazing', to: 'Weekly Animal Haat', route: 'Cattle Hauling Trucks' }
        ],
        containmentChecklist: [
          { task: "Strict Quarantine of Index Herd", category: "Isolation", status: "PENDING" },
          { task: "Ban Movement to Weekly Livestock Haats", category: "Movement Control", status: "RECOMMENDED" },
          { task: "Disinfect Shed Floor with 1% KMnO4 / 2% NaOH", category: "Disinfection", status: "PENDING" },
          { task: "Daily Thermometer & Salivation Monitoring", category: "Monitoring", status: "IN_PROGRESS" },
          { task: "1962 Veterinary Ring-Vaccination Dispatch", category: "Veterinary Action", status: "REQUESTED" }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateSpread();
  }, []);

  return (
    <div className="gov-card p-6 mb-8">
      <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-[#D1D5DB]">
        <div className="p-3 bg-[#F3F4F6] border border-[#D1D5DB] text-[#0F2F5C] rounded-lg font-bold text-xl">🔗</div>
        <div>
          <h2 className="text-xl font-bold text-[#111827]">Spatiotemporal Disease Spread Chain & Containment Graph</h2>
          <p className="text-xs text-[#4B5563]">
            Model outbreak progression across herds, village water tanks, animal haats, and transport corridors.
          </p>
        </div>
      </div>

      {/* Simulator Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-[#F3F4F6] p-4 rounded-lg border border-[#D1D5DB]">
        <div>
          <label className="block text-xs font-bold text-[#111827] mb-1">Target Disease</label>
          <select
            value={disease}
            onChange={e => setDisease(e.target.value)}
            className="w-full border border-[#D1D5DB] rounded-lg p-2 text-xs bg-white font-medium text-[#111827]"
          >
            <option value="Foot and Mouth Disease (FMD)">Foot and Mouth Disease (FMD)</option>
            <option value="Lumpy Skin Disease (LSD)">Lumpy Skin Disease (LSD)</option>
            <option value="Peste des Petits Ruminants (PPR / Goat Plague)">PPR (Goat Plague)</option>
            <option value="Bovine Mastitis (Udder Inflammation)">Bovine Mastitis</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#111827] mb-1">Initial Index Cases</label>
          <input
            type="number"
            min="1"
            max="100"
            value={caseCount}
            onChange={e => setCaseCount(parseInt(e.target.value) || 1)}
            className="w-full border border-[#D1D5DB] rounded-lg p-2 text-xs bg-white font-bold text-[#111827]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#111827] mb-1">Outbreak Center</label>
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            className="w-full border border-[#D1D5DB] rounded-lg p-2 text-xs bg-white text-[#111827]"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={calculateSpread}
            disabled={loading}
            className="w-full btn-navy py-2 px-4 text-xs font-bold cursor-pointer"
          >
            {loading ? 'Simulating...' : '⚡ Run Spread Simulation'}
          </button>
        </div>
      </div>

      {/* Risk Metrics Cards */}
      {spreadData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#F3F4F6] border border-[#DC2626]/30 rounded-lg p-4 text-center">
              <span className="text-xs text-[#DC2626] font-semibold uppercase tracking-wider block">Primary Exposed Herds</span>
              <span className="text-2xl font-black text-[#111827] mt-1 block">{spreadData.metrics.primaryExposedAnimals} Livestock</span>
              <span className="text-[11px] text-[#4B5563] mt-1 block font-medium">Direct In-Shed Contact</span>
            </div>

            <div className="bg-[#F3F4F6] border border-[#D97706]/40 rounded-lg p-4 text-center">
              <span className="text-xs text-[#D97706] font-semibold uppercase tracking-wider block">Secondary Risk Animals</span>
              <span className="text-2xl font-black text-[#111827] mt-1 block">{spreadData.metrics.secondaryExposedAnimals} Livestock</span>
              <span className="text-[11px] text-[#4B5563] mt-1 block font-medium">Shared Pasture & Water Trough</span>
            </div>

            <div className="bg-[#0F2F5C] border border-[#0F2F5C] rounded-lg p-4 text-center text-white">
              <span className="text-xs text-slate-200 font-semibold uppercase tracking-wider block">Geographic Containment Radius</span>
              <span className="text-2xl font-black mt-1 block">{spreadData.metrics.geographicRiskRadiusKm} km</span>
              <span className="text-[11px] text-slate-300 mt-1 block font-medium">1962 Ring Vaccination Zone</span>
            </div>
          </div>

          {/* Directed Spread Chain Visualizer */}
          <div className="bg-[#0B2447] rounded-lg p-6 text-white border border-[#0F2F5C]">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span>📡 Multi-Node Transmission Topology</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {spreadData.nodes.slice(0, 4).map((node, i) => (
                <div key={i} className="bg-[#0F2F5C] border border-[#D1D5DB]/30 p-3.5 rounded-lg">
                  <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                    <span className="text-slate-300">{node.type}</span>
                    <span className="bg-[#DC2626] text-white px-1.5 py-0.5 rounded font-bold text-[10px]">{node.risk}</span>
                  </div>
                  <h4 className="font-bold text-xs text-white">{node.label}</h4>
                  <p className="text-xs text-amber-300 font-bold mt-1">{node.count} Estimated Affected</p>
                  <p className="text-[10px] text-slate-300 mt-1 leading-tight">{node.desc}</p>
                </div>
              ))}
            </div>

            <div className="my-3 text-center text-xs text-slate-300 font-mono">
              ⬇ Transmission Vector: Aerosol Dispersion / Fodder Equipment / Livestock Haats ⬇
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {spreadData.nodes.slice(4, 8).map((node, i) => (
                <div key={i} className="bg-[#0F2F5C] border border-[#D1D5DB]/30 p-3.5 rounded-lg">
                  <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                    <span className="text-slate-300">{node.type}</span>
                    <span className="bg-[#D97706] text-[#111827] px-1.5 py-0.5 rounded font-bold text-[10px]">{node.risk}</span>
                  </div>
                  <h4 className="font-bold text-xs text-white">{node.label}</h4>
                  <p className="text-xs text-amber-300 font-bold mt-1">{node.count} Potential Spread</p>
                  <p className="text-[10px] text-slate-300 mt-1 leading-tight">{node.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Biosecurity Containment Checklist */}
          <div className="bg-[#F3F4F6] border border-[#D1D5DB] rounded-lg p-5">
            <h3 className="text-sm font-bold text-[#111827] mb-3">🛡️ Mandatory Biosecurity & Containment Actions</h3>
            <div className="space-y-2">
              {spreadData.containmentChecklist.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg border border-[#D1D5DB] text-xs">
                  <div className="flex items-center space-x-3">
                    <span className="bg-[#0F2F5C] text-white font-bold px-2 py-0.5 rounded text-[10px]">{item.category}</span>
                    <span className="font-semibold text-[#111827]">{item.task}</span>
                  </div>
                  <span className="bg-[#F3F4F6] text-[#111827] border border-[#D1D5DB] font-bold px-2 py-0.5 rounded text-[10px]">{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
