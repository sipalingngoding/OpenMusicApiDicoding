const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const AuthenticationError = require('../../exceptions/AuthenticationError');
const NotFoundError = require('../../exceptions/NotFoundError');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ username, password, fullname }) {
    await this.verifyUsername(username);

    const idUser = `user-${nanoid(10)}`;
    const hashPassword = await bcrypt.hash(password, 10);
    const query = {
      text: 'INSERT INTO users VALUES($1,$2,$3,$4) RETURNING id',
      values: [idUser, username, hashPassword, fullname],
    };
    const { rows } = await this._pool.query(query);
    if (!rows[0].id) throw new InvariantError('User gagal ditambahkan');
    return rows[0].id;
  }

  async getUserById(id) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    };
    const { rowCount } = await this._pool.query(query);
    if (!rowCount) throw new NotFoundError('User tidak ditemukan');
  }

  async verifyUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };
    const { rowCount } = await this._pool.query(query);
    if (rowCount > 0) throw new InvariantError('User gagal ditambahkan. Username sudah digunakan');
  }

  async verifyCredentials({ username, password }) {
    const query = {
      text: 'SELECT * FROM users WHERE username=$1',
      values: [username],
    };
    const { rowCount, rows } = await this._pool.query(query);
    if (!rowCount) throw new AuthenticationError('username atau password salah!');
    const { id, password: hashPassword } = rows[0];
    const isSame = await bcrypt.compare(password, hashPassword);
    if (!isSame) throw new AuthenticationError('username atau password salah!');
    return id;
  }
}

module.exports = UsersService;
