const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor(collaborationsService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(10)}`;
    const query = {
      text: 'INSERT INTO playlists(id,name,owner) VALUES($1,$2,$3) RETURNING id',
      values: [id, name, owner],
    };
    const { rows } = await this._pool.query(query);
    if (!rows[0].id) throw new InvariantError('playlist gagal ditambah');
    return rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: `SELECT playlists.id,playlists.name,users.username FROM playlists
      LEFT JOIN collaborations ON collaborations."playlistId" = playlists.id
      LEFT JOIN users ON playlists.owner = users.id
      WHERE playlists.owner = $1 OR collaborations."userId" = $1`,
      values: [owner],
    };
    const { rows } = await this._pool.query(query);
    return rows;
  }

  async getPlaylistById(id) {
    const query = {
      text: `SELECT playlists.id,playlists.name,users.username FROM playlists
      LEFT JOIN users ON playlists.owner = users.id
      WHERE playlists.id = $1`,
      values: [id],
    };
    const { rowCount, rows } = await this._pool.query(query);
    if (!rowCount) throw new NotFoundError('Playlist tidak ditemukan');
    return rows[0];
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id=$1 RETURNING id',
      values: [id],
    };
    const { rowCount } = await this._pool.query(query);
    if (!rowCount) throw new NotFoundError('Gagal menghapus playlist. Playlist tidak ditemukan');
  }

  async verifyPlaylistOwner(playlistId, id) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id=$1 AND owner=$2',
      values: [playlistId, id],
    };
    const { rowCount } = await this._pool.query(query);
    if (!rowCount) throw new AuthorizationError('Anda tidak boleh mengakses resource ini');
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      await this._collaborationsService.verifyCollaboration(playlistId, userId);
    }
  }

  async playlistActivities(id) {
    const query = {
      text: `SELECT users.username,songs.title,activities.action,activities.time FROM activities
      LEFT JOIN playlists ON activities."playlistId" = playlists.id
      LEFT JOIN users ON activities."userId" = users.id
      LEFT JOIN songs ON activities."songId" = songs.id
      WHERE activities."playlistId" = $1`,
      values: [id],
    };
    const { rows } = await this._pool.query(query);
    return rows;
  }
}

module.exports = PlaylistsService;
