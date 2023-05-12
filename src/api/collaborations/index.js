const CollaborationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  register: (server, {
    service, validator, playlistsService, usersService,
  }) => {
    const collaborationsHandler = new CollaborationsHandler(
      service, validator, playlistsService, usersService,
    );
    server.route(routes(collaborationsHandler));
  },
};
