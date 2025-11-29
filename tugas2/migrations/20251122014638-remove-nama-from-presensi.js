"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Presensis", "nama");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("Presensis", "nama", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
