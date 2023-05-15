const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addLike({ albumId, userId }) {
    await this.verifyAlbumLike(albumId, userId);

    const id = `like-${nanoid(10)}`;
    const query = {
      text: 'INSERT INTO "userAlbumLikes" VALUES($1,$2,$3) RETURNING id',
      values: [id, userId, albumId],
    };
    const { rows } = await this._pool.query(query);
    if (!rows[0].id) throw new InvariantError('Like gagal ditambahkan');
    this._cacheService.delete(`likes:${albumId}`);
    return rows[0].id;
  }

  async getAlbumLikes(albumId) {
    try {
      const result = await this._cacheService.get(`likes:${albumId}`);
      return [+result, true];
    } catch (error) {
      const query = {
        text: 'SELECT * FROM "userAlbumLikes" WHERE "albumId"=$1',
        values: [albumId],
      };
      const { rowCount } = await this._pool.query(query);
      await this._cacheService.set(`likes:${albumId}`, rowCount);
      return [rowCount, false];
    }
  }

  async deleteAlbumLike(albumId, userId) {
    const query = {
      text: 'DELETE FROM "userAlbumLikes" WHERE "albumId"=$1 AND "userId"=$2 RETURNING id',
      values: [albumId, userId],
    };
    const { rowCount } = await this._pool.query(query);
    this._cacheService.delete(`likes:${albumId}`);
    if (!rowCount) throw new NotFoundError('Gagal menghapus like. Like tidak ditemukan');
  }

  async verifyAlbumLike(albumId, userId) {
    const query = {
      text: 'SELECT * FROM "userAlbumLikes" WHERE "albumId"=$1 AND "userId"=$2',
      values: [albumId, userId],
    };
    const { rowCount } = await this._pool.query(query);

    if (rowCount >= 1) throw new InvariantError('Anda sudah menyukai album tersebut');
  }
}

module.exports = AlbumLikesService;
