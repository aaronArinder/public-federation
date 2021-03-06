const { ApolloServer } = require('apollo-server');
const { ApolloGateway } = require('@apollo/gateway');

// Initialize an ApolloGateway instance and pass it an array of
// your implementing service names and URLs
const gateway = process.env.NODE_ENV === 'EXTERNAL'
    ? new ApolloGateway({
        serviceList: [
            { name: 'viewer', url: 'http://localhost:4001' },
            { name: 'products', url: 'http://localhost:4002' },
            { name: 'market', url: 'http://localhost:4003' },
            { name: 'asks', url: 'http://localhost:4004' },
            { name: 'shipments', url: 'http://localhost:4005' },
        ],
    })
    : new ApolloGateway({
        serviceList: [
            { name: 'viewer', url: 'http://localhost:4001' },
            { name: 'products', url: 'http://localhost:4002' },
            { name: 'market', url: 'http://localhost:4003' },
            { name: 'asks', url: 'http://localhost:4004' },
            { name: 'shipments', url: 'http://localhost:4005' },
            { name: 'secrets', url: 'http://localhost:4006' },
        ],
    })

// Pass the ApolloGateway to the ApolloServer constructor
const server = new ApolloServer({
  gateway,

  // Disable subscriptions (not currently supported with ApolloGateway)
  subscriptions: false,
});

server.listen(4000).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
