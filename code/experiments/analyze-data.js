const fs = require('fs');
const path = require('path');
const ss = require('simple-statistics');

// Read data from JSON file
function loadData() {
  const dataPath = path.join(__dirname, '..', 'data', 'experiment-results.json');
  
  if (!fs.existsSync(dataPath)) {
    console.error('Error: Data file not found. Please run collect-data.js first.');
    process.exit(1);
  }
  
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  return data.filter(r => r.success); // Only analyze successful requests
}

// Calculate descriptive statistics
function calculateStats(values) {
  if (values.length === 0) {
    return {
      count: 0,
      mean: 0,
      median: 0,
      stdDev: 0,
      min: 0,
      max: 0,
      q1: 0,
      q3: 0
    };
  }
  
  return {
    count: values.length,
    mean: ss.mean(values),
    median: ss.median(values),
    stdDev: ss.standardDeviation(values),
    min: ss.min(values),
    max: ss.max(values),
    q1: ss.quantile(values, 0.25),
    q3: ss.quantile(values, 0.75)
  };
}

// Calculate Cohen's d (effect size)
function cohensD(group1, group2) {
  const mean1 = ss.mean(group1);
  const mean2 = ss.mean(group2);
  const std1 = ss.standardDeviation(group1);
  const std2 = ss.standardDeviation(group2);
  const n1 = group1.length;
  const n2 = group2.length;
  
  // Pooled standard deviation
  const pooledStd = Math.sqrt(((n1 - 1) * std1 * std1 + (n2 - 1) * std2 * std2) / (n1 + n2 - 2));
  
  if (pooledStd === 0) return 0;
  
  return (mean1 - mean2) / pooledStd;
}

// Perform t-test (simplified - using simple-statistics)
function performTTest(group1, group2) {
  // Using Welch's t-test approximation
  const mean1 = ss.mean(group1);
  const mean2 = ss.mean(group2);
  const std1 = ss.standardDeviation(group1);
  const std2 = ss.standardDeviation(group2);
  const n1 = group1.length;
  const n2 = group2.length;
  
  const se1 = std1 / Math.sqrt(n1);
  const se2 = std2 / Math.sqrt(n2);
  const seDiff = Math.sqrt(se1 * se1 + se2 * se2);
  
  if (seDiff === 0) {
    return { t: 0, pValue: 1, significant: false };
  }
  
  const t = (mean1 - mean2) / seDiff;
  const df = Math.min(n1 - 1, n2 - 1); // Conservative degrees of freedom
  
  // Approximate p-value (two-tailed)
  // For large samples, |t| > 1.96 is significant at 0.05 level
  // |t| > 2.58 is significant at 0.01 level
  const pValue = t > 0 ? 
    (Math.abs(t) > 1.96 ? 0.05 : (Math.abs(t) > 2.58 ? 0.01 : 0.1)) :
    (Math.abs(t) > 1.96 ? 0.05 : (Math.abs(t) > 2.58 ? 0.01 : 0.1));
  
  const significant = Math.abs(t) > 1.96; // p < 0.05
  
  return { t, pValue, significant };
}

// Calculate confidence interval (95%)
function confidenceInterval(values, confidence = 0.95) {
  if (values.length === 0) return [0, 0];
  
  const mean = ss.mean(values);
  const std = ss.standardDeviation(values);
  const n = values.length;
  const se = std / Math.sqrt(n);
  
  // Z-score for 95% confidence (1.96)
  const z = 1.96;
  const margin = z * se;
  
  return [mean - margin, mean + margin];
}

// Analyze data by scenario and API type
function analyzeData(data) {
  const scenarios = [...new Set(data.map(r => r.scenario))];
  const results = {};
  
  console.log('\n=== EXPERIMENT ANALYSIS ===\n');
  
  // Overall analysis for RQ1 (Response Time)
  console.log('RQ1: Are GraphQL query responses faster than REST query responses?');
  console.log('='.repeat(70));
  
  const allRestTimes = data.filter(r => r.apiType === 'REST').map(r => r.responseTime);
  const allGraphQLTimes = data.filter(r => r.apiType === 'GraphQL').map(r => r.responseTime);
  
  const restTimeStats = calculateStats(allRestTimes);
  const graphQLTimeStats = calculateStats(allGraphQLTimes);
  
  console.log('\nOverall Response Time Statistics:');
  console.log('REST API:');
  console.log(`  Mean: ${restTimeStats.mean.toFixed(2)} ms`);
  console.log(`  Median: ${restTimeStats.median.toFixed(2)} ms`);
  console.log(`  Std Dev: ${restTimeStats.stdDev.toFixed(2)} ms`);
  console.log(`  Min: ${restTimeStats.min.toFixed(2)} ms`);
  console.log(`  Max: ${restTimeStats.max.toFixed(2)} ms`);
  
  console.log('\nGraphQL API:');
  console.log(`  Mean: ${graphQLTimeStats.mean.toFixed(2)} ms`);
  console.log(`  Median: ${graphQLTimeStats.median.toFixed(2)} ms`);
  console.log(`  Std Dev: ${graphQLTimeStats.stdDev.toFixed(2)} ms`);
  console.log(`  Min: ${graphQLTimeStats.min.toFixed(2)} ms`);
  console.log(`  Max: ${graphQLTimeStats.max.toFixed(2)} ms`);
  
  const timeEffectSize = cohensD(allGraphQLTimes, allRestTimes);
  const timeTest = performTTest(allGraphQLTimes, allRestTimes);
  
  console.log('\nStatistical Test Results (Response Time):');
  console.log(`  Effect Size (Cohen's d): ${timeEffectSize.toFixed(3)}`);
  console.log(`  T-statistic: ${timeTest.t.toFixed(3)}`);
  console.log(`  Significant difference: ${timeTest.significant ? 'YES' : 'NO'}`);
  
  const restTimeCI = confidenceInterval(allRestTimes);
  const graphQLTimeCI = confidenceInterval(allGraphQLTimes);
  console.log(`  REST 95% CI: [${restTimeCI[0].toFixed(2)}, ${restTimeCI[1].toFixed(2)}] ms`);
  console.log(`  GraphQL 95% CI: [${graphQLTimeCI[0].toFixed(2)}, ${graphQLTimeCI[1].toFixed(2)}] ms`);
  
  // Overall analysis for RQ2 (Response Size)
  console.log('\n\nRQ2: Do GraphQL query responses have smaller size than REST query responses?');
  console.log('='.repeat(70));
  
  const allRestSizes = data.filter(r => r.apiType === 'REST').map(r => r.responseSize);
  const allGraphQLSizes = data.filter(r => r.apiType === 'GraphQL').map(r => r.responseSize);
  
  const restSizeStats = calculateStats(allRestSizes);
  const graphQLSizeStats = calculateStats(allGraphQLSizes);
  
  console.log('\nOverall Response Size Statistics:');
  console.log('REST API:');
  console.log(`  Mean: ${restSizeStats.mean.toFixed(2)} bytes`);
  console.log(`  Median: ${restSizeStats.median.toFixed(2)} bytes`);
  console.log(`  Std Dev: ${restSizeStats.stdDev.toFixed(2)} bytes`);
  console.log(`  Min: ${restSizeStats.min.toFixed(2)} bytes`);
  console.log(`  Max: ${restSizeStats.max.toFixed(2)} bytes`);
  
  console.log('\nGraphQL API:');
  console.log(`  Mean: ${graphQLSizeStats.mean.toFixed(2)} bytes`);
  console.log(`  Median: ${graphQLSizeStats.median.toFixed(2)} bytes`);
  console.log(`  Std Dev: ${graphQLSizeStats.stdDev.toFixed(2)} bytes`);
  console.log(`  Min: ${graphQLSizeStats.min.toFixed(2)} bytes`);
  console.log(`  Max: ${graphQLSizeStats.max.toFixed(2)} bytes`);
  
  const sizeEffectSize = cohensD(allGraphQLSizes, allRestSizes);
  const sizeTest = performTTest(allGraphQLSizes, allRestSizes);
  
  console.log('\nStatistical Test Results (Response Size):');
  console.log(`  Effect Size (Cohen's d): ${sizeEffectSize.toFixed(3)}`);
  console.log(`  T-statistic: ${sizeTest.t.toFixed(3)}`);
  console.log(`  Significant difference: ${sizeTest.significant ? 'YES' : 'NO'}`);
  
  const restSizeCI = confidenceInterval(allRestSizes);
  const graphQLSizeCI = confidenceInterval(allGraphQLSizes);
  console.log(`  REST 95% CI: [${restSizeCI[0].toFixed(2)}, ${restSizeCI[1].toFixed(2)}] bytes`);
  console.log(`  GraphQL 95% CI: [${graphQLSizeCI[0].toFixed(2)}, ${graphQLSizeCI[1].toFixed(2)}] bytes`);
  
  // Per-scenario analysis
  console.log('\n\n=== PER-SCENARIO ANALYSIS ===\n');
  
  for (const scenario of scenarios) {
    const scenarioData = data.filter(r => r.scenario === scenario);
    const restData = scenarioData.filter(r => r.apiType === 'REST');
    const graphQLData = scenarioData.filter(r => r.apiType === 'GraphQL');
    
    const restTimes = restData.map(r => r.responseTime);
    const graphQLTimes = graphQLData.map(r => r.responseTime);
    const restSizes = restData.map(r => r.responseSize);
    const graphQLSizes = graphQLData.map(r => r.responseSize);
    
    const scenarioName = scenarioData[0].description;
    
    console.log(`\nScenario: ${scenarioName} (${scenario})`);
    console.log('-'.repeat(70));
    
    // Response Time
    const restTimeStats = calculateStats(restTimes);
    const graphQLTimeStats = calculateStats(graphQLTimes);
    const timeEffect = cohensD(graphQLTimes, restTimes);
    const timeTest = performTTest(graphQLTimes, restTimes);
    
    console.log('\nResponse Time:');
    console.log(`  REST:    Mean=${restTimeStats.mean.toFixed(2)}ms, Median=${restTimeStats.median.toFixed(2)}ms`);
    console.log(`  GraphQL: Mean=${graphQLTimeStats.mean.toFixed(2)}ms, Median=${graphQLTimeStats.median.toFixed(2)}ms`);
    console.log(`  Difference: ${(graphQLTimeStats.mean - restTimeStats.mean).toFixed(2)}ms (${((graphQLTimeStats.mean / restTimeStats.mean - 1) * 100).toFixed(1)}%)`);
    console.log(`  Effect Size: ${timeEffect.toFixed(3)}, Significant: ${timeTest.significant ? 'YES' : 'NO'}`);
    
    // Response Size
    const restSizeStats = calculateStats(restSizes);
    const graphQLSizeStats = calculateStats(graphQLSizes);
    const sizeEffect = cohensD(graphQLSizes, restSizes);
    const sizeTest = performTTest(graphQLSizes, restSizes);
    
    console.log('\nResponse Size:');
    console.log(`  REST:    Mean=${restSizeStats.mean.toFixed(2)} bytes, Median=${restSizeStats.median.toFixed(2)} bytes`);
    console.log(`  GraphQL: Mean=${graphQLSizeStats.mean.toFixed(2)} bytes, Median=${graphQLSizeStats.median.toFixed(2)} bytes`);
    console.log(`  Difference: ${(graphQLSizeStats.mean - restSizeStats.mean).toFixed(2)} bytes (${((graphQLSizeStats.mean / restSizeStats.mean - 1) * 100).toFixed(1)}%)`);
    console.log(`  Effect Size: ${sizeEffect.toFixed(3)}, Significant: ${sizeTest.significant ? 'YES' : 'NO'}`);
    
    results[scenario] = {
      responseTime: {
        rest: restTimeStats,
        graphql: graphQLTimeStats,
        effectSize: timeEffect,
        significant: timeTest.significant
      },
      responseSize: {
        rest: restSizeStats,
        graphql: graphQLSizeStats,
        effectSize: sizeEffect,
        significant: sizeTest.significant
      }
    };
  }
  
  // Summary
  console.log('\n\n=== SUMMARY ===');
  console.log('='.repeat(70));
  
  const fasterScenarios = scenarios.filter(s => {
    const r = results[s];
    return r.responseTime.graphql.mean < r.responseTime.rest.mean;
  });
  
  const smallerScenarios = scenarios.filter(s => {
    const r = results[s];
    return r.responseSize.graphql.mean < r.responseSize.rest.mean;
  });
  
  console.log(`\nGraphQL was faster in ${fasterScenarios.length} out of ${scenarios.length} scenarios`);
  console.log(`GraphQL had smaller responses in ${smallerScenarios.length} out of ${scenarios.length} scenarios`);
  
  // Save detailed results
  const resultsPath = path.join(__dirname, '..', 'data', 'analysis-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify({
    overall: {
      responseTime: {
        rest: restTimeStats,
        graphql: graphQLTimeStats,
        effectSize: timeEffectSize,
        significant: timeTest.significant
      },
      responseSize: {
        rest: restSizeStats,
        graphql: graphQLSizeStats,
        effectSize: sizeEffectSize,
        significant: sizeTest.significant
      }
    },
    scenarios: results
  }, null, 2));
  
  console.log(`\nDetailed analysis saved to: ${resultsPath}`);
}

// Main
function main() {
  const data = loadData();
  console.log(`Loaded ${data.length} successful measurements`);
  analyzeData(data);
}

main();

