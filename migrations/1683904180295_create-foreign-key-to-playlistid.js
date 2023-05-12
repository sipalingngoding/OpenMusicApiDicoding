exports.up = pgm => {
  pgm.addConstraint('activities', 'fk_activities.playlistId_playlists.id', 'FOREIGN KEY("playlistId") REFERENCES playlists(id) ON DELETE CASCADE');
};

exports.down = pgm => {
  pgm.dropConstraint('fk_activities.playlistId_playlists.id');
};
