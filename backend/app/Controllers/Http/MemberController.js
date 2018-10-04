'use strict'

/**
 * Resourceful controller for interacting with members
 */
class MemberController {
  /**
   * Show a list of all members.
   * GET members
   */
  async index ({ request, response, view }) {
  }

  /**
   * Render a form to be used for creating a new member.
   * GET members/create
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new member.
   * POST members
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single member.
   * GET members/:id
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing member.
   * GET members/:id/edit
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update member details.
   * PUT or PATCH members/:id
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a member with id.
   * DELETE members/:id
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = MemberController
