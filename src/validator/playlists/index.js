const InvariantError = require('../../exceptions/InvariantError');
const { postPlaylistPayloadSchema } = require('./schema');

module.exports = {
  validatePostPlaylistPayload: (payload) => {
    const { error } = postPlaylistPayloadSchema.validate(payload);
    if (error) throw new InvariantError(error.message);
  },
};
