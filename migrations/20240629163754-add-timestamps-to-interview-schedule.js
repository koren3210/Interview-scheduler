"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Interview_Schedule", "createdAt", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });

    await queryInterface.addColumn("Interview_Schedule", "updatedAt", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal(
        "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
      ),
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Interview_Schedule", "createdAt");
    await queryInterface.removeColumn("Interview_Schedule", "updatedAt");
  },
};
