import validate from './validate';
import { getFields, isForm } from './schemaUtils';

export const getInitialValues = (schema, initialValues = {}) => getFields(schema).reduce(
    (result, [name, field]) => result[name] === undefined ? {
        ...result,
        [name]: isForm(field) ?
            getInitialValues(field, initialValues[field.name]) :
            undefined,
    } : result,
    initialValues,
);

const populateRecursively = (schema, value) => getFields(schema).reduce(
    (result, [name, field]) => ({
        ...result,
        [name]: isForm(field) ?
            populateRecursively(field, value) :
            value,
    }),
    {},
);

export const getInitialTouched = (schema, validateOnInit) => populateRecursively(schema, validateOnInit);

export const getInitialVisited = (schema) => populateRecursively(schema, false);

export const getAllFieldsTouched = (schema) => populateRecursively(schema, true);

export const getValidationResult = (schema, values, touched, additionalErrors) => {
    const [isValid, errors] = validate(schema, values, touched);
    const allErrors = additionalErrors !== undefined ? { ...errors, ...additionalErrors } : errors;

    return [isValid, allErrors];
};
