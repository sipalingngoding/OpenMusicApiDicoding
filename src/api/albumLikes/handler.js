const autoBind = require('auto-bind');

class AlbumLikesHandler {
  constructor(service, albumsService) {
    this._service = service;
    this._albumsService = albumsService;

    autoBind(this);
  }

  async postAlbumLikeHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._albumsService.getAlbumById(id);
    await this._service.addLike({ albumId: id, userId: credentialId });
    return h.response({
      status: 'success',
      message: 'Berhasil menambahkan suka',
    }).code(201);
  }

  async getAlbumLikesByIdHandler(request, h) {
    const { id } = request.params;
    await this._albumsService.getAlbumById(id);
    const [result, cache] = await this._service.getAlbumLikes(id);

    const response = h.response({
      status: 'success',
      data: {
        likes: result,
      },
    });
    if (cache) response.header('X-Data-Source', 'cache');
    return response;
  }

  async deleteAlbumLikeByIdHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._service.deleteAlbumLike(id, credentialId);
    return h.response({
      status: 'success',
      message: 'Berhasil menghapus suka',
    });
  }
}

module.exports = AlbumLikesHandler;
