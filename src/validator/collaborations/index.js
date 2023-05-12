const { postCollaborationPayloadSchema, deleteCollaborationPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

module.exports = {
  validatePostCollaborationPayload: (payload) => {
    const { error } = postCollaborationPayloadSchema.validate(payload);
    if (error) throw new InvariantError(error.message);
  },
  validateDeleteCollaborationPayload: (payload) => {
    const { error } = deleteCollaborationPayloadSchema.validate(payload);
    if (error) throw new InvariantError(error.message);
  },
};
