import assert from 'assert';
import { calculateTriageDiagnosis, parseSymptomsFromText } from '../src/services/triageEngine.js';
import { calculateVectorRisk } from '../src/services/weatherService.js';
import { initialSymptomsList } from '../src/data/symptomsData.js';

console.log('================================================================');
console.log(' PashuSuraksha Automated Unit & Regression Test Suite');
console.log('================================================================\n');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`[PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`[FAIL] ${name}`);
    console.error(`       Error: ${err.message}`);
  }
}

// -----------------------------------------------------------------------------
// 1. TRIAGE RULE TESTS (Section 5 & Section 17.2)
// -----------------------------------------------------------------------------

runTest('Rule 1: Isolated non-specific fever does NOT trigger high-risk or specific disease false positive', () => {
  const result = calculateTriageDiagnosis({
    animalId: 'cow',
    symptomIds: ['fever'],
    sickCount: 1,
    deadCount: 0,
    durationDays: 1,
    location: 'Pune'
  });

  assert.strictEqual(result.riskLevel, 'Low', 'Isolated fever must be Low risk');
  assert.ok(
    result.title.includes('Non-Specific') || result.title.includes('Fever Alert') || result.matchedConditions.some(c => c.nameEn.includes('Fever')),
    'Must advise non-specific fever rather than false-positive FMD'
  );
});

runTest('Rule 2: Urgent red flags (sudden death / blood in orifice) MUST trigger URGENT alert and Anthrax warning', () => {
  const result = calculateTriageDiagnosis({
    animalId: 'cow',
    symptomIds: ['sudden_death', 'blood_stool'],
    sickCount: 1,
    deadCount: 1,
    durationDays: 1,
    location: 'Baramati'
  });

  assert.strictEqual(result.riskLevel, 'URGENT', 'Sudden death + bloody discharge must be URGENT');
  assert.ok(result.isAnthraxSuspect, 'Must trigger Anthrax suspect biosecurity flag');
  assert.ok(result.recommendedActions[0].includes('CRITICAL: DO NOT OPEN OR CUT THE CARCASS') || result.recommendedActions.some(a => a.includes('1962')), 'Must recommend immediate 1962/containment action');
});

runTest('Rule 3: Classic FMD triad (fever + salivation + mouth blisters) identifies Foot and Mouth Disease', () => {
  const result = calculateTriageDiagnosis({
    animalId: 'cow',
    symptomIds: ['fever', 'salivation', 'blisters_mouth'],
    sickCount: 3,
    deadCount: 0,
    durationDays: 2,
    location: 'Haveli'
  });

  const topMatch = result.matchedConditions[0];
  assert.ok(topMatch, 'Must find matched conditions');
  assert.ok(topMatch.nameEn.includes('Foot and Mouth') || topMatch.id === 'fmd', 'Top match must be FMD');
  assert.strictEqual(result.riskLevel, 'High', 'Multiple sick cows with vesicular signs must be High Risk');
});

runTest('Rule 4: Multi-animal mortality raises risk assessment', () => {
  const result = calculateTriageDiagnosis({
    animalId: 'sheep',
    symptomIds: ['fever', 'diarrhea'],
    sickCount: 10,
    deadCount: 3,
    durationDays: 2,
    location: 'Guntur'
  });

  assert.ok(result.riskLevel === 'High' || result.riskLevel === 'URGENT', 'Flock mortality must elevate risk level');
});

// -----------------------------------------------------------------------------
// 2. TEXT PARSING & SYMPTOM EXTRACTION
// -----------------------------------------------------------------------------

runTest('Text Parser: Correctly extracts symptoms from natural language text', () => {
  const text = 'My cow has high fever, stringy drooling and painful blisters in her mouth';
  const matched = parseSymptomsFromText(text, initialSymptomsList);

  assert.ok(matched.includes('fever'), 'Should match fever');
  assert.ok(matched.includes('salivation'), 'Should match salivation');
  assert.ok(matched.includes('blisters_mouth'), 'Should match blisters_mouth');
});

// -----------------------------------------------------------------------------
// 3. WEATHER VECTOR FOREWARNING RISK CALCULATION
// -----------------------------------------------------------------------------

runTest('Vector Forewarning: High humidity and warm temperature produces elevated vector score', () => {
  // 31°C and 85% RH (optimal breeding conditions for Stomoxys and Culicoides midges)
  const highRisk = calculateVectorRisk(31, 85, 12);
  assert.ok(highRisk.score >= 75, 'Favorable breeding conditions must score >= 75');
  assert.strictEqual(highRisk.riskLevel, 'HIGH', 'Vector risk must be HIGH');

  // 12°C and 30% RH (cold, dry non-breeding condition)
  const lowRisk = calculateVectorRisk(12, 30, 0);
  assert.ok(lowRisk.score < 50, 'Cold dry climate must score low vector risk');
  assert.strictEqual(lowRisk.riskLevel, 'LOW', 'Vector risk must be LOW');
});

// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------
console.log('\n----------------------------------------------------------------');
console.log(`Tests Completed: ${passedTests} / ${totalTests} passed`);
console.log('================================================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
}
