const {Sequelize, DataTypes, Model} = require('sequelize')
const {sequelize} = require('../db')
const { User } = require('./User');

class Customer extends User {}

Customer.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    userType: DataTypes.STRING,
    coupon: DataTypes.STRING,
}, {
    sequelize,
    timestamps: false,
});

module.exports = {Customer};