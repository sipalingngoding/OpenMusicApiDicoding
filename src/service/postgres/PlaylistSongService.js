const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistSong(id, songId) {
    const idPlaylistSongs = `playlistSongs-${nanoid(10)}`;
    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1,$2,$3) RETURNING id',
      values: [idPlaylistSongs, id, songId],
    };
    const { rows } = await this._pool.query(query);
    if (!rows[0].id) throw new InvariantError('Gagal menambahkan song ke playlist');
  }

  async getPlaylistsSongs(id) {
    const query = {
      text: `SELECT songs.id,songs.title,songs.performer FROM songs
      LEFT JOIN playlist_songs ON playlist_songs."songId" = songs.id
      WHERE playlist_songs."playlistId" = $1`,
      values: [id],
    };
    const { rows } = await this._pool.query(query);
    return rows;
  }

  async deletePlaylistSong(id, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE "playlistId"=$1 AND "songId"=$2',
      values: [id, songId],
    };
    await this._pool.query(query);
  }
}

module.exports = PlaylistSongsService;
