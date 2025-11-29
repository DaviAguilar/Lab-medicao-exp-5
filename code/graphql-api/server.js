const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const schema = require('./schema');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true // Enable GraphiQL interface for testing
}));

app.listen(PORT, () => {
  console.log(`GraphQL API server running on http://localhost:${PORT}/graphql`);
});

