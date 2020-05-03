const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');

const typeDefs = gql`
    extend type Ask @key(fields: "id") {
        id: ID! @external
        shipment: Shipment
    }

    type Shipment {
        authCenter: String
        shipBy: String
        received: Boolean
    }
`;

const SHIPMENTS = {
    '1234': {}, // unmatched
    '2345': {}, // unmatched
    '3456': { authCenter: 'Detroit', shipBy: '2020-04-23', received: true }
};

const resolvers = {
    Ask: {
        shipment: (ask) => SHIPMENTS[ask.id] || null,
    },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
});

server.listen(4005).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
