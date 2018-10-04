'use strict'

/**
 * Resourceful controller for interacting with followings
 */
class FollowingController {
  /**
   * Show a list of all followings.
   * GET followings
   */
  async index ({ request, response, view }) {
  }

  /**
   * Render a form to be used for creating a new following.
   * GET followings/create
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new following.
   * POST followings
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single following.
   * GET followings/:id
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing following.
   * GET followings/:id/edit
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update following details.
   * PUT or PATCH followings/:id
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a following with id.
   * DELETE followings/:id
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = FollowingController
