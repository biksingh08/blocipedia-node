'use strict';

const faker = require("faker");

 let wikis = [];

 for(let i = 1 ; i <= 15 ; i++){
   wikis.push({
     title: faker.hacker.noun(),
     body: faker.hacker.phrase(),
     private: false,
     createdAt: new Date(),
     updatedAt: new Date(),
     userId: i
   });
 }
module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
