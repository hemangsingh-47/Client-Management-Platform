/**
 * FreelanceHub — Unified Test Suite Runner (Phase 14)
 * Executes all unit, integration, route handler, and E2E workflow tests in sequence.
 */

import { execSync } from 'child_process';

const testSuites = [
  { name: 'Business Logic & Financial Precision Tests', file: 'tests/business-logic.test.ts' },
  { name: 'API Services & Database Integration Tests', file: 'tests/api-integration-test.ts' },
  { name: 'Direct HTTP Route Handler Tests', file: 'tests/http-route-test.ts' },
  { name: 'End-to-End Freelancer Workflow Tests', file: 'tests/e2e-workflow.test.ts' },
];

console.log('=================================================================');
console.log('🛡️  FREELANCEHUB — PHASE 14 FULL QUALITY ASSURANCE SUITE');
console.log('=================================================================\n');

let allPassed = true;

for (const suite of testSuites) {
  console.log(`\n▶ Running: ${suite.name} (${suite.file})...`);
  try {
    execSync(`npx tsx ${suite.file}`, { stdio: 'inherit' });
  } catch {
    console.error(`\n❌ Test Suite Failed: ${suite.name}`);
    allPassed = false;
    process.exit(1);
  }
}

if (allPassed) {
  console.log('\n=================================================================');
  console.log('✨ ALL 4 TEST SUITES COMPLETED WITH 100% PASS RATE! ✨');
  console.log('=================================================================\n');
}
