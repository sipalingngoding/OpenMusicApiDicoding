const InvariantError = require('../../exceptions/InvariantError');
const {
  postAuthenticationPayloadSchema,
  putAuthenticationPayloadSchema,
  deleteAuthenticationPayloadSchema,
} = require('./schema');

const authenticationsValidator = {
  validatePostAuthenticationPayload: (payload) => {
    const { error } = postAuthenticationPayloadSchema.validate(payload);
    if (error) throw new InvariantError(error.message);
  },
  validatePutAuthenticationPayload: (payload) => {
    const { error } = putAuthenticationPayloadSchema.validate(payload);
    if (error) throw new InvariantError(error.message);
  },
  validateDeleteAuthenticationPayload: (payload) => {
    const { error } = deleteAuthenticationPayloadSchema.validate(payload);
    if (error) throw new InvariantError(error.message);
  },
};

module.exports = authenticationsValidator;
