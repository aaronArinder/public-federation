const { ApolloServer, gql, SchemaDirectiveVisitor } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');
const { PrivateDirective, UpperCaseDirective } = require('./directives');

const typeDefs = gql`
    extend type Ask @key(fields: "id") {
        id: String @external
        shipment: Shipment
    }

    extend type Mutation {
        deleteShipment(askId: String): Shipment
        createShipment(askId: String): Shipment
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
    Mutation: {
        createShipment: () => { throw new Error('Ruh roh, shouldn\'t see this!') },
        deleteShipment: () => { throw new Error('Ruh roh, shouldn\'t see this!') },
    }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
});

server.listen(4005).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
