import React, { useState, useEffect } from 'react';
import { 
  FileText, ShieldAlert, CheckCircle, AlertTriangle, Play, Download, 
  ExternalLink, Layers, Database, Activity, RefreshCw, Cpu, Lock, Check, X
} from 'lucide-react';
import { runValidationSuite, exportValidationResultsCsv } from '../services/validationHarness';

export default function ModelCard({ lang = 'en', onNavigate }) {
  const [evaluation, setEvaluation] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [filterResult, setFilterResult] = useState('ALL'); // 'ALL' | 'FAIL' | 'DANGEROUS'
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Run initial evaluation on mount
  useEffect(() => {
    const res = runValidationSuite();
    setEvaluation(res);
  }, []);

  const handleRunLiveSuite = () => {
    setIsRunning(true);
    setTimeout(() => {
      const res = runValidationSuite();
      setEvaluation(res);
      setIsRunning(false);
    }, 450);
  };

  const handleDownloadCsv = () => {
    if (!evaluation) return;
    const csvContent = exportValidationResultsCsv(evaluation);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `PashuSuraksha_Validation_Harness_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const metrics = evaluation?.metrics || {
    top1Accuracy: 88.0,
    top3Accuracy: 92.0,
    dangerousRecall: 84.2,
    nonSpecificAccuracy: 100.0,
    totalCases: 50,
    top1Hits: 44,
    top3Hits: 46
  };

  const filteredCases = evaluation?.caseResults.filter(c => {
    if (filterResult === 'FAIL') return !c.isTop1Match;
    if (filterResult === 'DANGEROUS') return c.isDangerous;
    return true;
  }) || [];

  return (
    <div className="space-y-6">
      
      {/* 1. MODEL CARD HEADER & TRANSPARENCY BANNER */}
      <div className="gov-card p-6 md:p-8 space-y-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#D1D5DB] pb-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-[#0F2F5C] uppercase tracking-widest bg-[#0F2F5C]/10 px-2.5 py-0.5 rounded">
                Official ML System Specification
              </span>
              <span className="text-[10px] font-mono text-[#4B5563]">Version: {evaluation?.metadata.modelVersion || 'v2.1-triage-ensemble'}</span>
            </div>
            <h2 className="text-2xl font-bold text-[#111827] flex items-center space-x-3 mt-1.5">
              <Cpu className="w-7 h-7 text-[#0F2F5C]" />
              <span>Model Card & Independent Validation Harness</span>
            </h2>
            <p className="text-xs text-[#4B5563] mt-1">
              Transparent, uninflated accuracy metrics evaluated against 50 published veterinary clinical cases.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleRunLiveSuite}
              disabled={isRunning}
              className="btn-navy px-4 py-2 rounded-lg text-xs font-bold flex items-center space-x-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Running Harness...' : 'Run Live 50-Case Suite'}</span>
            </button>

            <button
              onClick={handleDownloadCsv}
              className="bg-white hover:bg-[#F3F4F6] text-[#0F2F5C] border border-[#D1D5DB] px-3.5 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="bg-green-100 text-[#15803D] border border-green-300 px-4 py-2 rounded-lg text-xs font-bold flex items-center space-x-2 animate-fadeIn">
            <Check className="w-4 h-4 text-[#15803D]" />
            <span>Benchmark validation dataset exported as CSV successfully.</span>
          </div>
        )}

        {/* MANDATORY ETHICAL DISCLAIMER (SECTION 5 COMPLIANCE) */}
        <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 text-xs space-y-1">
          <div className="flex items-center space-x-2 text-amber-900 font-bold">
            <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0" />
            <span>Core Evaluation Standard: Genuine, Uninflated Metrics (Section 5)</span>
          </div>
          <p className="text-amber-900 leading-relaxed font-medium">
            This model card reports true empirical accuracy across separate literature test cases. 
            <strong> Statement of limitation:</strong> PashuSuraksha is a pre-triage decision-support and syndromic prioritization tool; it is <em>never</em> a substitute for licensed on-site veterinary diagnosis, does not prescribe drug dosages to farmers, and is not marketed as clinically validated for final diagnosis.
          </p>
        </div>

        {/* 2. REAL ACCURACY SCORECARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-[#F3F4F6] border border-[#D1D5DB] rounded-lg p-4 space-y-1">
            <span className="text-[10px] font-bold text-[#0F2F5C] uppercase tracking-wider block">Top-1 Accuracy</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-[#111827]">{metrics.top1Accuracy}%</span>
              <span className="text-[11px] text-[#4B5563]">({metrics.top1Hits}/{metrics.totalCases})</span>
            </div>
            <p className="text-[10px] text-[#4B5563] leading-tight">Correct disease is the exact #1 ranked prediction.</p>
          </div>

          <div className="bg-[#F3F4F6] border border-[#D1D5DB] rounded-lg p-4 space-y-1">
            <span className="text-[10px] font-bold text-[#0F2F5C] uppercase tracking-wider block">Top-3 Accuracy</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-[#15803D]">{metrics.top3Accuracy}%</span>
              <span className="text-[11px] text-[#4B5563]">({metrics.top3Hits}/{metrics.totalCases})</span>
            </div>
            <p className="text-[10px] text-[#4B5563] leading-tight">Correct disease ranked within candidate Top-3.</p>
          </div>

          <div className="bg-[#F3F4F6] border border-[#D1D5DB] rounded-lg p-4 space-y-1">
            <span className="text-[10px] font-bold text-[#DC2626] uppercase tracking-wider block">Dangerous Disease Recall</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-[#DC2626]">{metrics.dangerousRecall}%</span>
              <span className="text-[11px] text-[#4B5563]">({metrics.dangerousRecalled}/{metrics.dangerousTotal})</span>
            </div>
            <p className="text-[10px] text-[#4B5563] leading-tight">Notifiable cases (Anthrax, FMD, PPR, LSD) flagged High/Urgent.</p>
          </div>

          <div className="bg-[#F3F4F6] border border-[#D1D5DB] rounded-lg p-4 space-y-1">
            <span className="text-[10px] font-bold text-[#0F2F5C] uppercase tracking-wider block">Avg Inference Latency</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-[#111827]">{evaluation?.metadata.averageLatencyMs || '0.09'} ms</span>
            </div>
            <p className="text-[10px] text-[#4B5563] leading-tight">Lightweight execution suitable for 100% offline edge devices.</p>
          </div>

        </div>

        {/* 3. ARCHITECTURE & SPECIFICATION DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          <div className="bg-[#F3F4F6] border border-[#D1D5DB] rounded-lg p-5 space-y-3">
            <h4 className="font-bold text-sm text-[#111827] flex items-center space-x-2 border-b border-[#D1D5DB] pb-2">
              <Layers className="w-4 h-4 text-[#0F2F5C]" />
              <span>Model Architecture & Pipeline</span>
            </h4>
            
            <ul className="text-xs text-[#4B5563] space-y-2">
              <li className="flex items-start space-x-2">
                <span className="font-bold text-[#0F2F5C] shrink-0">1. Pre-Triage Rule Engine:</span>
                <span>Scans red flags (blood, sudden mortality, unable to stand) with immediate 1962 escalation override.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-bold text-[#0F2F5C] shrink-0">2. Adaptive Symptom Clustering:</span>
                <span>Handles single non-specific signs (e.g. isolated fever) by prompting adaptive follow-up queries without premature certainty.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-bold text-[#0F2F5C] shrink-0">3. Likelihood Weighted Scoring:</span>
                <span>Species-constrained candidate disease scoring with regional prior weighting (e.g. active quarantine corridors).</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-bold text-[#0F2F5C] shrink-0">4. Privacy-Preserving Vision Adapter:</span>
                <span>EXIF metadata stripped; only lesion patterns analyzed; output strictly labeled <em>"AI suggestion — a vet will confirm"</em>.</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#F3F4F6] border border-[#D1D5DB] rounded-lg p-5 space-y-3">
            <h4 className="font-bold text-sm text-[#111827] flex items-center space-x-2 border-b border-[#D1D5DB] pb-2">
              <ShieldAlert className="w-4 h-4 text-[#E07B00]" />
              <span>Intended Scope, Safeguards & Ethics</span>
            </h4>

            <ul className="text-xs text-[#4B5563] space-y-2">
              <li className="flex items-start space-x-2">
                <span className="font-bold text-[#15803D] shrink-0">✓ Target Domain:</span>
                <span>Livestock & Poultry (Cattle, Buffalo, Sheep, Goat, Poultry). Dogs and cats redirected to companion clinics.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-bold text-[#DC2626] shrink-0">✗ Hard Restriction:</span>
                <span>Farmer UI strictly omits antibiotic names, doses, or surgical steps to prevent antimicrobial resistance (AMR).</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-bold text-[#0F2F5C] shrink-0">🔒 Data Privacy:</span>
                <span>No farmer PII (name, phone, village) is passed to AI vision inference or public outbreak maps.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-bold text-[#4B5563] shrink-0">📄 Benchmark Origin:</span>
                <span>50 independent cases from ICAR-NIVEDI reports, WOAH manuals, and IVRI journals.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* 4. ITEM-BY-ITEM BENCHMARK TEST RUNNER TABLE */}
        <div className="pt-4 border-t border-[#D1D5DB] space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-base font-bold text-[#111827] flex items-center space-x-2">
                <Activity className="w-5 h-5 text-[#0F2F5C]" />
                <span>Validation Case Test Log ({filteredCases.length} Cases Shown)</span>
              </h3>
              <p className="text-xs text-[#4B5563] mt-0.5">
                Detailed execution trace across ground truth published literature cases.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center space-x-1.5 bg-[#F3F4F6] p-1 rounded-lg border border-[#D1D5DB] text-xs">
              <button
                onClick={() => setFilterResult('ALL')}
                className={`px-3 py-1 rounded font-bold cursor-pointer transition ${
                  filterResult === 'ALL' ? 'bg-[#0F2F5C] text-white' : 'text-[#4B5563] hover:text-[#111827]'
                }`}
              >
                All (50)
              </button>
              <button
                onClick={() => setFilterResult('DANGEROUS')}
                className={`px-3 py-1 rounded font-bold cursor-pointer transition ${
                  filterResult === 'DANGEROUS' ? 'bg-[#DC2626] text-white' : 'text-[#4B5563] hover:text-[#111827]'
                }`}
              >
                Dangerous / Alert (38)
              </button>
              <button
                onClick={() => setFilterResult('FAIL')}
                className={`px-3 py-1 rounded font-bold cursor-pointer transition ${
                  filterResult === 'FAIL' ? 'bg-[#D97706] text-white' : 'text-[#4B5563] hover:text-[#111827]'
                }`}
              >
                Failed Top-1 ({metrics.totalCases - metrics.top1Hits})
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[#D1D5DB]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0F2F5C] text-white font-bold">
                <tr>
                  <th className="py-2.5 px-3">Case ID</th>
                  <th className="py-2.5 px-3">Species</th>
                  <th className="py-2.5 px-3">Reported Symptoms</th>
                  <th className="py-2.5 px-3">Ground Truth</th>
                  <th className="py-2.5 px-3">Top-1 Prediction</th>
                  <th className="py-2.5 px-3 text-center">Top-1</th>
                  <th className="py-2.5 px-3 text-center">Top-3</th>
                  <th className="py-2.5 px-3">Published Literature Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D1D5DB] bg-white">
                {filteredCases.map(c => (
                  <tr key={c.id} className="hover:bg-[#F3F4F6] transition">
                    <td className="py-2 px-3 font-mono font-bold text-[#0F2F5C]">{c.id}</td>
                    <td className="py-2 px-3 font-semibold capitalize text-[#111827]">{c.animal}</td>
                    <td className="py-2 px-3 text-[#4B5563] max-w-xs truncate" title={c.symptoms.join(', ')}>
                      {c.symptoms.join(', ')}
                    </td>
                    <td className="py-2 px-3 font-bold text-[#111827]">
                      {c.groundTruth}
                      {c.isDangerous && (
                        <span className="ml-1.5 bg-red-100 text-[#DC2626] text-[9px] font-bold px-1.5 py-0.5 rounded">
                          Notifiable
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 font-medium text-[#111827]">
                      {c.predictedTop1}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {c.isTop1Match ? (
                        <span className="bg-green-100 text-[#15803D] font-bold px-2 py-0.5 rounded text-[11px] inline-flex items-center gap-1">
                          <Check className="w-3 h-3" /> PASS
                        </span>
                      ) : (
                        <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[11px] inline-flex items-center gap-1">
                          <X className="w-3 h-3" /> FAIL
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {c.isTop3Match ? (
                        <span className="bg-green-100 text-[#15803D] font-bold px-2 py-0.5 rounded text-[11px] inline-flex items-center gap-1">
                          <Check className="w-3 h-3" /> PASS
                        </span>
                      ) : (
                        <span className="bg-red-100 text-[#DC2626] font-bold px-2 py-0.5 rounded text-[11px] inline-flex items-center gap-1">
                          <X className="w-3 h-3" /> FAIL
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-[#4B5563] text-[11px] max-w-xs truncate" title={c.source}>
                      {c.source}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-[#4B5563] pt-2">
            <span>Showing {filteredCases.length} of {evaluation?.caseResults.length || 50} benchmark cases</span>
            <div className="flex items-center space-x-2">
              <span className="font-semibold">Dataset Citation:</span>
              <span>ICAR-NIVEDI, WOAH, IVRI Compendiums (2020-2023)</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
