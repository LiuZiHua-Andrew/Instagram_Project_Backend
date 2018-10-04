'use strict'

/**
 * Resourceful controller for interacting with comments
 */
class CommentController {
  /**
   * Show a list of all comments.
   * GET comments
   */
  async index ({ request, response, view }) {
  }

  /**
   * Render a form to be used for creating a new comment.
   * GET comments/create
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new comment.
   * POST comments
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single comment.
   * GET comments/:id
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing comment.
   * GET comments/:id/edit
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update comment details.
   * PUT or PATCH comments/:id
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a comment with id.
   * DELETE comments/:id
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = CommentController
