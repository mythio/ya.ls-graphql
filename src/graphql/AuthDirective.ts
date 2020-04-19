import { SchemaDirectiveVisitor } from "apollo-server-express";
import { defaultFieldResolver, GraphQLObjectType, GraphQLField } from "graphql";
import logger from "../core/Logger";
import { rules } from "./auth/rules";
import { adminRule } from "./auth/rules/admin";

/** Class definition for @auth directive */
export class AuthDirective extends SchemaDirectiveVisitor {
  /**
   * @param {object} type - type of the object from GraphQL
   * @override
   */
  visitObject(type) {
    this.ensureFieldsWrapped(type);
    type._requiredAuthRole = this.args.requires;
  }

  /**
   * @param {object} field
   * @param {object} details - type of the object from GraphQL
   * @override
   */
  visitFieldDefinition(field, details) {
    this.ensureFieldsWrapped(details.objectType);
    field._requiredAuthRole = this.args.requires;
  }

  /**
   * Ensure that the fields and objects are wrapped to be able to traverse the AST generated
   * @param {object} objectType -
   */
  ensureFieldsWrapped(objectType) {
    if (objectType._authFieldsWrapped) return;
    objectType._authFieldsWrapped = true;

    const fields = objectType.getFields();

    Object.keys(fields).forEach(fieldName => {
      const field = fields[fieldName];
      const { resolve = defaultFieldResolver } = field;

      field.resolve = async function (...args) {
        const requiredRole =
          field._requiredAuthRole || objectType._requiredAuthRole;

        if (!requiredRole) {
          return resolve.apply(this, args);
        }

        const requestData = args[2];
        await this.execRule(requiredRole, requestData);

        return resolve.apply(this, args);
      }.bind(this);
    });
  }

  /**
   * Check if current user is authorized to perform the requested operation(s)
   * @param {string} role - Role of the current user
   * @param {object} requestData - Role of the requested operation
   */
  async execRule(role: string, requestData): Promise<void> {
    // const strategyResult = await adminRule(requestData);
    const strategyResult = await rules[role.toLowerCase()](requestData);
    console.log(strategyResult);
    if (!strategyResult) {
      throw new Error("not authorized");
    }
  }
}
