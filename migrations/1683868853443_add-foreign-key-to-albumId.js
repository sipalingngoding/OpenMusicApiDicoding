exports.up = pgm => {
  pgm.addConstraint('songs', 'fk_songs.albumid_albums.id', 'FOREIGN KEY("albumId") REFERENCES albums(id) ON DELETE CASCADE');
};

exports.down = pgm => {
  pgm.dropConstraint('fk_songs.albumid_albums.id');
};
