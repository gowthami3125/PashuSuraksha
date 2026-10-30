import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fileContent = fs.readFileSync(path.join(__dirname, '../src/data/validationCases.js'), 'utf8');

const caseRegex = /{\s*id:\s*'([^']+)',\s*animal:\s*'([^']+)',\s*symptoms:\s*\[([^\]]+)\],\s*groundTruthDisease:\s*'([^']+)',\s*isDangerous:\s*(true|false),\s*source:\s*'([^']+)',\s*notes:\s*'([^']+)'\s*}/g;

const rows = [
  ['case_id', 'species', 'symptoms', 'ground_truth_disease', 'is_dangerous_notifiable', 'source_citation', 'clinical_presentation']
];

let match;
while ((match = caseRegex.exec(fileContent)) !== null) {
  const [_, id, animal, symptomsRaw, disease, isDangerous, source, notes] = match;
  const symptomsClean = symptomsRaw.replace(/['"\s]/g, '').replace(/,/g, ';');
  rows.push([
    id,
    animal,
    `"${symptomsClean}"`,
    `"${disease}"`,
    isDangerous,
    `"${source.replace(/"/g, '""')}"`,
    `"${notes.replace(/"/g, '""')}"`
  ]);
}

const csvOutput = rows.map(r => r.join(',')).join('\n');
const targetPath = path.join(__dirname, '../data/test_cases.csv');
fs.writeFileSync(targetPath, csvOutput, 'utf8');
console.log(`Generated ${rows.length - 1} test cases into ${targetPath}`);
