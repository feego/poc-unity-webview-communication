const FIELD_TYPE = Symbol('FIELD');
const FORM_TYPE = Symbol('FORM');

export const isField = (field) => field['#type'] === FIELD_TYPE;
export const isForm = (field) => field['#type'] === FORM_TYPE;

export const createField = (validators, metadata) => ({
  '#type': FIELD_TYPE,
  validators,
  metadata,
});

export const createForm = (fields) => {
  const fieldsByName = fields.reduce((result, [name, field]) => {
    return {
      ...result,
      [name]: field,
    };
  }, {});

  return {
    '#type': FORM_TYPE,
    '#fieldsByName': fieldsByName,
    '#fields': fields,
  };
};

export const getField = (schema, key) => {
  const { [key]: field } = schema['#fieldsByName'];

  return field;
};

export const getFields = (schema) => schema['#fields'];
