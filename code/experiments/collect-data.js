const axios = require('axios');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const path = require('path');

const REST_API_URL = 'http://localhost:3001';
const GRAPHQL_API_URL = 'http://localhost:3002/graphql';

// Number of iterations per scenario
const ITERATIONS = 50;

// Experiment scenarios
const scenarios = [
  {
    name: 'simple_user',
    description: 'Get single user',
    rest: { method: 'GET', url: `${REST_API_URL}/api/users/1` },
    graphql: {
      method: 'POST',
      url: GRAPHQL_API_URL,
      data: {
        query: `
          {
            user(id: 1) {
              id
              name
              email
              age
            }
          }
        `
      }
    }
  },
  {
    name: 'simple_users_list',
    description: 'Get all users',
    rest: { method: 'GET', url: `${REST_API_URL}/api/users` },
    graphql: {
      method: 'POST',
      url: GRAPHQL_API_URL,
      data: {
        query: `
          {
            users {
              id
              name
              email
              age
            }
          }
        `
      }
    }
  },
  {
    name: 'simple_post',
    description: 'Get single post',
    rest: { method: 'GET', url: `${REST_API_URL}/api/posts/1` },
    graphql: {
      method: 'POST',
      url: GRAPHQL_API_URL,
      data: {
        query: `
          {
            post(id: 1) {
              id
              title
              content
              authorId
              createdAt
            }
          }
        `
      }
    }
  },
  {
    name: 'complex_user_with_posts',
    description: 'Get user with posts (nested)',
    rest: { method: 'GET', url: `${REST_API_URL}/api/users/1/with-posts` },
    graphql: {
      method: 'POST',
      url: GRAPHQL_API_URL,
      data: {
        query: `
          {
            user(id: 1) {
              id
              name
              email
              age
              posts {
                id
                title
                content
                createdAt
              }
            }
          }
        `
      }
    }
  },
  {
    name: 'complex_post_with_details',
    description: 'Get post with author and comments (nested)',
    rest: { method: 'GET', url: `${REST_API_URL}/api/posts/1/with-details` },
    graphql: {
      method: 'POST',
      url: GRAPHQL_API_URL,
      data: {
        query: `
          {
            post(id: 1) {
              id
              title
              content
              createdAt
              author {
                id
                name
                email
              }
              comments {
                id
                text
                createdAt
                author {
                  id
                  name
                }
              }
            }
          }
        `
      }
    }
  },
  {
    name: 'complex_all_posts_with_authors',
    description: 'Get all posts with authors',
    rest: { 
      method: 'GET', 
      url: `${REST_API_URL}/api/posts/with-authors`
    },
    graphql: {
      method: 'POST',
      url: GRAPHQL_API_URL,
      data: {
        query: `
          {
            posts {
              id
              title
              content
              createdAt
              author {
                id
                name
                email
              }
            }
          }
        `
      }
    }
  }
];

// Function to measure request
async function measureRequest(config, apiType) {
  const startTime = process.hrtime.bigint();
  
  try {
    const response = await axios(config);
    const endTime = process.hrtime.bigint();
    
    const responseTime = Number(endTime - startTime) / 1000000; // Convert to milliseconds
    const responseSize = JSON.stringify(response.data).length; // Size in bytes
    
    return {
      success: true,
      responseTime,
      responseSize,
      statusCode: response.status
    };
  } catch (error) {
    const endTime = process.hrtime.bigint();
    const responseTime = Number(endTime - startTime) / 1000000;
    
    return {
      success: false,
      responseTime,
      responseSize: 0,
      statusCode: error.response?.status || 0,
      error: error.message
    };
  }
}

// Function to run experiment for a scenario
async function runScenario(scenario) {
  console.log(`\nRunning scenario: ${scenario.name} - ${scenario.description}`);
  
  const results = [];
  
  // Run REST API tests
  console.log(`  Testing REST API (${ITERATIONS} iterations)...`);
  for (let i = 0; i < ITERATIONS; i++) {
    const result = await measureRequest(scenario.rest, 'REST');
    results.push({
      scenario: scenario.name,
      description: scenario.description,
      apiType: 'REST',
      iteration: i + 1,
      responseTime: result.responseTime,
      responseSize: result.responseSize,
      success: result.success,
      statusCode: result.statusCode
    });
    
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  
  // Run GraphQL API tests
  console.log(`  Testing GraphQL API (${ITERATIONS} iterations)...`);
  for (let i = 0; i < ITERATIONS; i++) {
    const result = await measureRequest(scenario.graphql, 'GraphQL');
    results.push({
      scenario: scenario.name,
      description: scenario.description,
      apiType: 'GraphQL',
      iteration: i + 1,
      responseTime: result.responseTime,
      responseSize: result.responseSize,
      success: result.success,
      statusCode: result.statusCode
    });
    
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  
  return results;
}

// Main function
async function main() {
  console.log('Starting data collection...');
  console.log(`Iterations per scenario: ${ITERATIONS}`);
  console.log(`Total scenarios: ${scenarios.length}`);
  
  // Check if APIs are running
  try {
    await axios.get(`${REST_API_URL}/api/users`);
    console.log('✓ REST API is running');
  } catch (error) {
    console.error('✗ REST API is not running. Please start it first.');
    process.exit(1);
  }
  
  try {
    await axios.post(GRAPHQL_API_URL, { query: '{ users { id } }' });
    console.log('✓ GraphQL API is running');
  } catch (error) {
    console.error('✗ GraphQL API is not running. Please start it first.');
    process.exit(1);
  }
  
  const allResults = [];
  
  // Run all scenarios
  for (const scenario of scenarios) {
    const results = await runScenario(scenario);
    allResults.push(...results);
  }
  
  // Create data directory if it doesn't exist
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Save to CSV
  const csvPath = path.join(dataDir, 'experiment-results.csv');
  const csvWriter = createCsvWriter({
    path: csvPath,
    header: [
      { id: 'scenario', title: 'Scenario' },
      { id: 'description', title: 'Description' },
      { id: 'apiType', title: 'API Type' },
      { id: 'iteration', title: 'Iteration' },
      { id: 'responseTime', title: 'Response Time (ms)' },
      { id: 'responseSize', title: 'Response Size (bytes)' },
      { id: 'success', title: 'Success' },
      { id: 'statusCode', title: 'Status Code' }
    ]
  });
  
  await csvWriter.writeRecords(allResults);
  console.log(`\n✓ Data saved to ${csvPath}`);
  
  // Save to JSON
  const jsonPath = path.join(dataDir, 'experiment-results.json');
  fs.writeFileSync(jsonPath, JSON.stringify(allResults, null, 2));
  console.log(`✓ Data saved to ${jsonPath}`);
  
  console.log(`\nTotal measurements: ${allResults.length}`);
  console.log('Data collection complete!');
}

main().catch(console.error);

