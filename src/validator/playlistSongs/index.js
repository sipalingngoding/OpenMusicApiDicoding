const InvariantError = require('../../exceptions/InvariantError');
const { postPlaylistSongPayloadSchema, deletePlaylistSongPayloadSchema } = require('./schema');

module.exports = {
  validatePostPlaylistSongsPayload: (payload) => {
    const { error } = postPlaylistSongPayloadSchema.validate(payload);
    if (error) throw new InvariantError(error.message);
  },
  validateDeletePlaylistSongsPayload: (payload) => {
    const { error } = deletePlaylistSongPayloadSchema.validate(payload);
    if (error) throw new InvariantError(error.message);
  },
};
