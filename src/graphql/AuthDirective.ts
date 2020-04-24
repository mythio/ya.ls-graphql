import { SchemaDirectiveVisitor } from "apollo-server-express";
import { defaultFieldResolver } from "graphql";
import { ruleStrategy } from '../auth/authUtils';

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
				try {
					await ruleStrategy(requestData, requiredRole);
				} catch (err) {
					if (requiredRole !== 'REVIEWER') {
						throw err;
					}
				}

				return resolve.apply(this, args);
			}.bind(this);
		});
	}
};