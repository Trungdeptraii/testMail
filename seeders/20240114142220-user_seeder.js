'use strict';
const bycrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

let salt = 10;
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
    */
   let data = [];
   for(let i=0; i<50; i++){
    const seedata = {
      fullname: faker.internet.displayName(),
      email: faker.internet.email(),
      status: faker.datatype.boolean(),
      password: bycrypt.hashSync("123456", salt),
      created_at: new Date(),
      updated_at: new Date()
    }
    data.push(seedata)
   }
    await queryInterface.bulkInsert('users', data, {});},

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('users',null, {});
  }
};
