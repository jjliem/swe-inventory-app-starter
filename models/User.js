const {Sequelize, DataTypes, Model} = require('sequelize')
const {sequelize} = require('../db')

class User extends Model {}

User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
}, {
    sequelize,
    timestamps: false,
});

module.exports = {User};