'use strict'

const Schema = use('Schema')

class MemberSchema extends Schema {
  up () {
    this.create('members', (table) => {
      table.increments()
      table.string('email')
      table.timestamps()
    })
  }

  down () {
    this.drop('members')
  }
}

module.exports = MemberSchema
