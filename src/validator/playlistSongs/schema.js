const Joi = require('joi');

const postPlaylistSongPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

const deletePlaylistSongPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = { postPlaylistSongPayloadSchema, deletePlaylistSongPayloadSchema };
