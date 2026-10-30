/**
 * Automated Validation Harness Engine
 * PashuSuraksha - Phase 4 ML & Model Evaluation
 * 
 * Executes benchmark evaluation across 50 independent published test cases.
 * Computes:
 * - Top-1 Accuracy
 * - Top-3 Accuracy
 * - Recall for Dangerous / Notifiable Diseases
 * - Non-Specific Fever Handling Rate
 * - Average Inference Latency (ms)
 * 
 * Conforms to Section 5: Real numbers, transparent model card metrics,
 * zero fake claims, and honest disclosure of limitations.
 */

import { VALIDATION_TEST_CASES } from '../data/validationCases.js';
import { calculateTriageDiagnosis } from './triageEngine.js';

/**
 * Normalizes disease names for robust comparison
 */
function normalizeDiseaseName(name) {
  if (!name) return '';
  return name.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace('disease', '')
    .replace('fmd', '')
    .replace('lsd', '')
    .replace('ppr', '')
    .replace('nd', '');
}

/**
 * Checks if a predicted item matches a ground truth disease
 */
function isDiseaseMatch(predictedStr, groundTruthStr) {
  if (!predictedStr || !groundTruthStr) return false;
  const pNorm = normalizeDiseaseName(predictedStr);
  const gNorm = normalizeDiseaseName(groundTruthStr);

  if (pNorm.includes(gNorm) || gNorm.includes(pNorm)) return true;

  // Domain acronym matches
  if (groundTruthStr.includes('FMD') && predictedStr.includes('Foot and Mouth')) return true;
  if (groundTruthStr.includes('LSD') && predictedStr.includes('Lumpy Skin')) return true;
  if (groundTruthStr.includes('PPR') && predictedStr.includes('Peste des Petits')) return true;
  if (groundTruthStr.includes('Anthrax') && predictedStr.includes('Anthrax')) return true;
  if (groundTruthStr.includes('Ranikhet') && (predictedStr.includes('Ranikhet') || predictedStr.includes('Newcastle'))) return true;
  if (groundTruthStr.includes('Mastitis') && predictedStr.includes('Mastitis')) return true;
  if (groundTruthStr.includes('Fever Alert') && (predictedStr.includes('Fever Alert') || predictedStr.includes('Non-Specific'))) return true;
  if (groundTruthStr.includes('Emergency Triage') && predictedStr.includes('Critical Emergency')) return true;
  if (groundTruthStr.includes('Companion Animal') && predictedStr.includes('Companion')) return true;

  return false;
}

/**
 * Runs the full validation suite against all benchmark cases
 */
export function runValidationSuite() {
  const startTime = performance.now();
  const results = [];

  let top1Hits = 0;
  let top3Hits = 0;
  let dangerousTotal = 0;
  let dangerousRecalled = 0;
  let nonSpecificTotal = 0;
  let nonSpecificHandled = 0;

  VALIDATION_TEST_CASES.forEach(testCase => {
    const caseStartTime = performance.now();

    const diagnosis = calculateTriageDiagnosis({
      animalId: testCase.animal,
      symptomIds: testCase.symptoms,
      sickCount: 1,
      deadCount: 0
    });

    const latencyMs = Number((performance.now() - caseStartTime).toFixed(2));

    // Extract predicted candidates
    const predictedCandidates = [];
    if (diagnosis.isPetNotice) {
      predictedCandidates.push('Companion Animal Care Notice');
    } else if (diagnosis.isEmergency && diagnosis.matchedConditions?.length === 0) {
      predictedCandidates.push('Critical Emergency Triage Alert');
    } else if (diagnosis.isOnlyFever) {
      predictedCandidates.push('Non-Specific Systemic Fever Alert');
      diagnosis.matchedConditions?.forEach(c => predictedCandidates.push(c.nameEn));
    } else {
      diagnosis.matchedConditions?.forEach(c => predictedCandidates.push(c.nameEn));
    }

    // Evaluate Top-1
    const top1Predicted = predictedCandidates[0] || diagnosis.title || 'Undetermined';
    const isTop1Match = isDiseaseMatch(top1Predicted, testCase.groundTruthDisease);

    // Evaluate Top-3
    const top3Slice = predictedCandidates.slice(0, 3);
    const isTop3Match = top3Slice.some(p => isDiseaseMatch(p, testCase.groundTruthDisease)) || isTop1Match;

    // Track Counters
    if (isTop1Match) top1Hits++;
    if (isTop3Match) top3Hits++;

    // Evaluate Dangerous Disease Recall
    let isDangerousRecalled = null;
    if (testCase.isDangerous) {
      dangerousTotal++;
      // High or URGENT risk assigned AND disease in top 2 predictions
      const isUrgentOrHigh = diagnosis.riskLevel === 'High' || diagnosis.riskLevel === 'URGENT';
      const inTop2 = predictedCandidates.slice(0, 2).some(p => isDiseaseMatch(p, testCase.groundTruthDisease));
      if (isUrgentOrHigh && (inTop2 || diagnosis.isEmergency)) {
        dangerousRecalled++;
        isDangerousRecalled = true;
      } else {
        isDangerousRecalled = false;
      }
    }

    // Evaluate Non-Specific Cases
    if (testCase.symptoms.length === 1 && testCase.symptoms.includes('fever')) {
      nonSpecificTotal++;
      if (diagnosis.isOnlyFever && (diagnosis.riskLevel === 'Low' || diagnosis.riskLevel === 'Medium')) {
        nonSpecificHandled++;
      }
    }

    results.push({
      id: testCase.id,
      animal: testCase.animal,
      symptoms: testCase.symptoms,
      groundTruth: testCase.groundTruthDisease,
      predictedTop1: top1Predicted,
      predictedTop3: top3Slice,
      isDangerous: testCase.isDangerous,
      isTop1Match,
      isTop3Match,
      isDangerousRecalled,
      riskLevelAssigned: diagnosis.riskLevel,
      source: testCase.source,
      notes: testCase.notes,
      latencyMs
    });
  });

  const totalTimeMs = Number((performance.now() - startTime).toFixed(1));
  const totalCount = VALIDATION_TEST_CASES.length;

  const top1Accuracy = Number(((top1Hits / totalCount) * 100).toFixed(1));
  const top3Accuracy = Number(((top3Hits / totalCount) * 100).toFixed(1));
  const dangerousRecall = dangerousTotal > 0 
    ? Number(((dangerousRecalled / dangerousTotal) * 100).toFixed(1)) 
    : 100.0;
  const nonSpecificAccuracy = nonSpecificTotal > 0
    ? Number(((nonSpecificHandled / nonSpecificTotal) * 100).toFixed(1))
    : 100.0;

  const averageLatency = Number((totalTimeMs / totalCount).toFixed(2));

  return {
    metadata: {
      modelVersion: 'v2.1-triage-ensemble',
      evaluationTimestamp: new Date().toISOString(),
      datasetSize: totalCount,
      totalExecutionTimeMs: totalTimeMs,
      averageLatencyMs: averageLatency
    },
    metrics: {
      top1Accuracy,
      top3Accuracy,
      dangerousRecall,
      nonSpecificAccuracy,
      totalCases: totalCount,
      top1Hits,
      top3Hits,
      dangerousTotal,
      dangerousRecalled
    },
    caseResults: results
  };
}

/**
 * Generates an exportable CSV string of the validation results
 */
export function exportValidationResultsCsv(evaluation) {
  const headers = [
    'Case ID',
    'Species',
    'Symptoms',
    'Ground Truth Disease',
    'Predicted Top-1',
    'Top-1 Match',
    'Top-3 Match',
    'Dangerous Recall',
    'Risk Level Assigned',
    'Literature Citation'
  ];

  const rows = evaluation.caseResults.map(c => [
    c.id,
    c.animal,
    `"${c.symptoms.join(', ')}"`,
    `"${c.groundTruth}"`,
    `"${c.predictedTop1}"`,
    c.isTop1Match ? 'PASS' : 'FAIL',
    c.isTop3Match ? 'PASS' : 'FAIL',
    c.isDangerous ? (c.isDangerousRecalled ? 'PASS' : 'FAIL') : 'N/A',
    c.riskLevelAssigned,
    `"${c.source}"`
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}
