const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');

const typeDefs = gql`
    extend type User @key(fields: "id") {
        id: ID! @external
        asks: [ Ask ]
    }

    extend type Product @key(fields: "id") {
        id: ID! @external
    }

    type Ask {
        id: String
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
        { id: '1234', amount: 437, active: true, productID: 'product-A', matched: false },
        { id: '2345', amount: 662, active: true, productID: 'product-B', matched: false },
        { id: '3456', amount: 437, active: false, productID: 'product-C', matched: true, matchedWith: 'asdf-1234' },
    ],
};

const resolvers = {
    User: {
        asks: (user) => {
            console.log('user', user)
            return user.id ? ASKS_DATABASE[user.id] : null;
        }
    },
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
});

server.listen(4004).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
