const {Sequelize, DataTypes, Model} = require('sequelize')
const {sequelize} = require('../db')
const { User } = require('./User');

class Manager extends User {}

Manager.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    userType: DataTypes.STRING,
    authorization: DataTypes.STRING
}, {
    sequelize,
    timestamps: false,
});

module.exports = {Manager};