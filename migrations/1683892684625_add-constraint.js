exports.up = pgm => {
  pgm.addConstraint('playlist_songs', 'fk_playlist_songs.playlistId_playlists.id', 'FOREIGN KEY("playlistId") REFERENCES playlists(id) ON DELETE CASCADE');

  pgm.addConstraint('playlist_songs', 'fk_playlist_songs.songId_songs.id', 'FOREIGN KEY("songId") REFERENCES songs(id) ON DELETE CASCADE');
};

exports.down = pgm => {
  pgm.dropConstraint('fk_playlist_songs.playlistId_playlists.id');

  pgm.dropConstraint('fk_playlist_songs.songId_songs.id');
};
