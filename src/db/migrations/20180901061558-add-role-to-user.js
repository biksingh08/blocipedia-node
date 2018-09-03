'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Users', 'role',
      {
        type: Sequelize.INTEGER, // keep type to a number for default value
        allowNull: false,
        defaultValue: 0
        // use 0 for standard, 1 for premium and 2 for admin
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn( 'Users', 'role');
  }
};
