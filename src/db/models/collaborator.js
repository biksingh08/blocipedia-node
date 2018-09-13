'use strict';

module.exports = (sequelize, DataTypes) => {

  var Collaborator = sequelize.define('Collaborators', {

    wikiId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: "CASCADE",
      references: {
        model: "Wikis",
        as: "wikiId"
      }
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: "CASCADE",
      references: {
        model: "Users",
        as: "userId"
      }
    },
  }, {});

  Collaborator.associate = function(models) {

    Collaborator.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });

    Collaborator.belongsTo(models.Wiki, {
      foreignKey: "wikiId",
      onDelete: "CASCADE"
    });

  };
  return Collaborator;
};
