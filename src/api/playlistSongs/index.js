const PlaylistSongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistSongs',
  version: '1.0.0',
  register: (server, {
    service, validator, playlistsService, songsService, activitiesService,
  }) => {
    const playlistSongsHandler = new PlaylistSongsHandler(
      service, validator, playlistsService, songsService, activitiesService,
    );
    server.route(routes(playlistSongsHandler));
  },
};
