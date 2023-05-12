const { nanoid } = require('nanoid');
const { Pool } = require('pg');

class ActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async Activity(playlistsId, songId, userId, status) {
    const idActivitiy = `activitiy-${nanoid(10)}`;
    const query = {
      text: 'INSERT INTO activities VALUES($1,$2,$3,$4,$5,$6)',
      values: [idActivitiy, playlistsId, songId, userId, status, new Date().toISOString()],
    };

    await this._pool.query(query);
  }
}

module.exports = ActivitiesService;
