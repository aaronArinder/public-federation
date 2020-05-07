const {  SchemaDirectiveVisitor } = require('apollo-server');
const { defaultFieldResolver } = require('graphql');

// Create (or import) a custom schema directive
class PrivateDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field, more) {
        return field;
    }
}

class UpperCaseDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
      console.log('field', field);
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function (...args) {
      const result = await resolve.apply(this, args);
      if (typeof result === "string") {
        return result.toUpperCase();
      }
      return result;
    };
  }
}


module.exports = {
    PrivateDirective,
    UpperCaseDirective,
}
