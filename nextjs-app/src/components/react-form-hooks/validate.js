import { getFields, isForm } from './schemaUtils';

export const errorTypes = {
  REQUIRED: 'REQUIRED',
  INVALID_TYPE: 'INVALID_TYPE',
  FAILED_REGEX: 'FAILED_REGEX',
  UNEXPECTED: 'UNEXPECTED',
};

const typeCheckers = {
  number: (value) => Boolean(parseInt(value, 10)),
};

const identity = [true];

export const identityValidator = (result = identity) => result;

export const requiredValidator = (result, value) => (!value ? [false, errorTypes.REQUIRED] : identityValidator(result));

export const createTypeValidator = (type) => (result, value) => {
  const typeChecker = typeCheckers[type];

  return typeChecker !== undefined && !typeChecker(value) ? [false, errorTypes.INVALID_TYPE] : identityValidator(result);
};

export const createRegexValidator = (regex) => (result, value) =>
  !regex.test(value) ? [false, errorTypes.FAILED_REGEX] : identityValidator();

/**
 * Validates a field value.
 *
 * @param {Object} field - Field schema.
 * @param {any} value - Field value.
 * @param {Object} metadata - Configurations and metadata for validations (validators and other fields data).
 * @returns {Array} Array with a boolean that flags the validation result and the error as the second element.
 */
export const validateField = (field, value, metadata) => {
  const { validators = [identityValidator] } = field;

  return validators.reduce((result, validator) => validator(result, value, field, metadata), identity);
};

/**
 * Validates a fields array.
 *
 * @example Example structute:
 * [{ name: 'firstName', placeholder: 'first-name' }, { ... }]
 *
 * @param {Schema} schema - Form schema.
 * @param {Object} values - Values to validate.
 * @param {Object} touched - Touched fields.
 * @returns {Array} Array with a boolean that flags the validation result and the errors object as the second element.
 */
export default function validate(schema, values = {}, touched = {}) {
  return getFields(schema).reduce(
    ([isValid, fieldValidationResults], [fieldName, field]) => {
      const wasFieldTouched = Boolean(touched[fieldName]);

      // We only validate touched fields.
      // eslint-disable-next-line no-nested-ternary
      const validationResult = isForm(field)
        ? validate(field, values[fieldName], touched[fieldName])
        : wasFieldTouched
        ? validateField(field, values[fieldName], { fieldName, fields: getFields(schema), values })
        : identity;

      return [
        isValid && validationResult[0],
        {
          ...fieldValidationResults,
          [fieldName]: validationResult,
        },
      ];
    },
    [true, {}]
  );
}
