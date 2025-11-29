# GraphQL vs REST Experiment

This project implements a controlled experiment to compare GraphQL and REST APIs.

## Project Structure

```
code/
├── rest-api/          # REST API implementation
├── graphql-api/       # GraphQL API implementation
├── experiments/       # Data collection and analysis scripts
└── shared/           # Shared data source for both APIs
```

## Setup

1. Install dependencies:
```bash
npm run install-all
```

Or install individually:
```bash
cd rest-api && npm install
cd ../graphql-api && npm install
cd ../experiments && npm install
```

## Running the APIs

Start REST API (port 3001):
```bash
npm run start:rest
```

Start GraphQL API (port 3002):
```bash
npm run start:graphql
```

## Running Experiments

1. Make sure both APIs are running
2. Collect data:
```bash
npm run collect-data
```

3. Analyze results:
```bash
npm run analyze
```

## Experiment Scenarios

The experiment includes:
- Simple queries (single resource)
- Complex queries (nested resources)
- Queries with different data volumes

