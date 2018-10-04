'use strict'

/**
 * Resourceful controller for interacting with likes
 */
class LikeController {
  /**
   * Show a list of all likes.
   * GET likes
   */
  async index ({ request, response, view }) {
  }

  /**
   * Render a form to be used for creating a new like.
   * GET likes/create
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new like.
   * POST likes
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single like.
   * GET likes/:id
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing like.
   * GET likes/:id/edit
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update like details.
   * PUT or PATCH likes/:id
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a like with id.
   * DELETE likes/:id
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = LikeController
