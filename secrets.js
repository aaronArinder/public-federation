const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');

const typeDefs = gql`
    extend type User @key(fields: "id") {
        id: ID! @external
        secrets: [ Secret ]
    }


    type Secret {
        someSecret: String
        anotherSecret: String
    }
`;

const SECRETS = {
    'user-A': [
        { someSecret: 'so very secret', anotherSecret: 'another secret' }
    ],
};

const resolvers = {
    User: {
        secrets: (user) => SECRETS[user.id] || null,
    },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
});

server.listen(4006).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
