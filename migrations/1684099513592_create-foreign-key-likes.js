exports.up = pgm => {
  pgm.addConstraint('userAlbumLikes', 'fk_userAlbumLikes.userId_users.id', 'FOREIGN KEY("userId") REFERENCES users(id) ON DELETE CASCADE');

  pgm.addConstraint('userAlbumLikes', 'fk_userAlbumLikes.albumId_albums.id', 'FOREIGN KEY("albumId") REFERENCES albums(id) ON DELETE CASCADE');
};

exports.down = pgm => {
  pgm.dropConstraint('fk_userAlbumLikes.userId_users.id');

  pgm.dropConstraint('fk_userAlbumLikes.albumId_albums.id');
};
