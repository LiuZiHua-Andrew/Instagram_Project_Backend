'use strict'

const Schema = use('Schema')

class FollowingSchema extends Schema {
  up () {
    this.create('followings', (table) => {
      table.increments()
      table.integer('MemberID').unsigned().references('id').inTable('members');
      table.integer('FollowingMemberID').unsigned().references('id').inTable('members');
      table.timestamps()
    })
  }

  down () {
    this.drop('followings')
  }
}

module.exports = FollowingSchema
