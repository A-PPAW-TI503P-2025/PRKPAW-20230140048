"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDesc = await queryInterface.describeTable("Presensis");
    if (!tableDesc.buktiFoto) {
      await queryInterface.addColumn("Presensis", "buktiFoto", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Presensis", "buktiFoto");
  },
};
