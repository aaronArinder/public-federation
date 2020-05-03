const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');
const DataLoader = require('dataloader');

const typeDefs = gql`
    extend type Viewer @key(fields: "id") {
        asks: [ Ask ]
    }

    extend type Product @key(fields: "id") {
        id: String @external
    }

    type Ask {
        amount: Int
        product: Product
        productID: String
        active: Boolean
        matched: Boolean
        matchedWith: String
    }
`;

const ASKS_DATABASE = {
    'user-A': [
        { amount: 437, active: true, productID: 'product-A', matched: false },
        { amount: 662, active: true, productID: 'product-B', matched: false },
        { amount: 437, active: false, productID: 'product-C', matched: true, matchedWith: 'asdf-1234' },
    ],
};

const resolvers = {
    Viewer: {
        Asks: (viewer) => viewer.id ? ASKS_DATABASE[viewer.id] : null,
    },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
});

server.listen(4005).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
