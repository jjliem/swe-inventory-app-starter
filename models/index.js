const {sequelize} = require('../db');
const {Brand} = require('./Brand');
const {Flavor} = require('./Flavor');
const {User} = require('./User');
const {Manager} = require('./Manager');
const {Customer} = require('./Customer');

//associations
Brand.hasMany(Flavor)
Flavor.belongsTo(Brand);

module.exports = { Brand, Flavor, User, Manager, Customer }