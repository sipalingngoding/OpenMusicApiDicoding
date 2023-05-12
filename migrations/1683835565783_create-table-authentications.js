exports.up = pgm => {
  pgm.createTable('authentications', {
    token: {
      type: 'TEXT',
      notNull: true,
    },
  })
};

exports.down = pgm => {
  pgm.dropDown('authentications');
};
