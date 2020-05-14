const { ApolloServer, gql, SchemaDirectiveVisitor } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');
const { PrivateDirective, UpperCaseDirective } = require('./directives');

const typeDefs = gql`
    directive @uppercase on FIELD_DEFINITION
    directive @private on FIELD_DEFINITION

    extend type Ask @key(fields: "id") {
        id: String @external
        shipment: Shipment
    }

    extend type Mutation {
        deleteShipment(askId: String): Shipment @private
        createShipment(askId: String): Shipment @private
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

// to be functionified
if (process.env.NODE_ENV === 'EXTERNAL') {
    typeDefs.definitions = typeDefs.definitions.map(def => {
        if (def.fields) {
           def.fields = def.fields.filter(field => {
                if (field.directives && field.directives.some(directive =>
                        directive.name
                        && directive.name.value === 'private'
                )) {
                    return false;
                } else {
                    return true;
                }
            })
        }
        return def;
    }).filter(def => def.fields && def.fields.length)
}

const schema = buildFederatedSchema([{ typeDefs, resolvers }]);
const schemaDirectives = {
    private: PrivateDirective,
    uppercase: UpperCaseDirective
};

SchemaDirectiveVisitor.visitSchemaDirectives(schema, schemaDirectives);

const server = new ApolloServer({
    schema,
    schemaDirectives
})

server.listen(4005).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
