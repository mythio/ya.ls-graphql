const { SchemaDirectiveVisitor } = require("apollo-server-express");
const { defaultFieldResolver } = require("graphql");

const strategies = require("../rules");

class AuthDirective extends SchemaDirectiveVisitor {
  visitObject(type) {
    this.ensureFieldsWrapped(type);
    type._requiredAuthRole = this.args.requires;
  }

  visitFieldDefinition(field, details) {
    this.ensureFieldWrapped(field);
    field._requiredAuthRole = this.args.requires;
  }

  ensureFieldWrapped(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function(...args) {
      const requiredRole = field._requiredAuthRole;

      if (!requiredRole) {
        throw new Error("not authorized");
      }

      const requestData = args[2];
      await this.executeStrategy(requiredRole, requestData);

      return resolve.apply(this, args);
    }.bind(this);
  }

  ensureFieldsWrapped(objectType) {
    if (objectType._authFieldsWrapped) return;
    objectType._authFieldsWrapped = true;

    const fields = objectType.getFields();

    Object.keys(fields).forEach(fieldName => {
      const field = fields[fieldName];
      const { resolve = defaultFieldResolver } = field;
      field.resolve = async function(...args) {
        const requiredRole =
          field._requiredAuthRole || objectType._requiredAuthRole;

        if (!requiredRole) {
          throw new Error("not authorized");
        }

        const requestData = args[2];
        await this.executeStrategy(requiredRole, requestData);

        return resolve.apply(this, args);
      }.bind(this);
    });
  }

  async executeStrategy(role, requestData) {
    const strategyResult = await strategies[role.toLowerCase()](requestData);

    if (!strategyResult) {
      throw new Error("not authorized");
    }
  }
}

module.exports = AuthDirective;
