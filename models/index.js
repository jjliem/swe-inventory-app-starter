const {sequelize} = require('./db');
const {Brand} = require('./models/Brand');
const {Flavor} = require('./models/Flavor');

//associations
Brand.hasMany(Flavor)
Flavor.belongsTo(Brand);

module.exports = { Brand, Flavor }