const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class CollaborationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addCollaboration({ playlistId, userId }) {
    const id = `collab-${nanoid(10)}`;
    const query = {
      text: 'INSERT INTO collaborations VALUES($1,$2,$3) RETURNING id',
      values: [id, playlistId, userId],
    };
    const { rows } = await this._pool.query(query);
    if (!rows[0].id) throw new InvariantError('Kolaborasi gagal ditambahkan');
    return rows[0].id;
  }

  async deleteCollaboration({ playlistId, userId }) {
    const query = {
      text: 'DELETE FROM collaborations WHERE "playlistId"=$1 AND "userId"=$2 RETURNING id',
      values: [playlistId, userId],
    };
    const { rowCount } = await this._pool.query(query);
    if (!rowCount) throw new NotFoundError('Gagal menghapus kolaborasi. Kolaborasi tidak ditemukan');
  }

  async verifyCollaboration(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE "playlistId"=$1 AND "userId"=$2',
      values: [playlistId, userId],
    };
    const { rowCount } = await this._pool.query(query);
    if (!rowCount) throw new AuthorizationError('Anda tidak boleh mengakses resource ini');
  }
}

module.exports = CollaborationsService;
