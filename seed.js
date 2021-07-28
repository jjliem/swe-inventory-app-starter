const path = require('path');
const fs = require('fs').promises;

const {sequelize} = require('./db');
const {Brand, Flavor} = require('./models/index.js');


const seed = async () => {

    await sequelize.sync({ force: true });

    const seedPath = path.join(__dirname, 'icecream.json'); // creates path to seed data
    const buffer = await fs.readFile(seedPath); // reads json
    const {data} = JSON.parse(String(buffer)); //parses data
    
    for (const brandData of data) {
        const brand = await Brand.create(brandData);
        for (const flavorData of brandData.flavors) {
            const flavor = await Flavor.create(flavorData);
            await brand.addFlavor(flavor);
        }
    }

    // const dataPromises = data.map(item => Brand.create(item))
    // await Promise.all(dataPromises)
    console.log("db populated!")
}


module.exports = seed