const {Flavor} = require('./Flavor');
const {sequelize} = require('../db');

describe('Flavor Model', () => {
	beforeAll(async () => {
		await sequelize.sync({force: true})
	});

	test('can create a Flavor', async() => {
		const testFlavor = await Flavor.create({name : 'Chocolate'})
		expect(testFlavor.name).toBe('Chocolate')
	})

	test('can create Brand image ', async () => {
        await sequelize.sync({ force: true }); 
        const testFlavorimage = await  Flavor.create({ name: 'Chocolate', image: 'https://www.modernhoney.com/wp-content/uploads/2018/08/Homemade-Chocolate-Ice-Cream-1.jpg' })
        expect(testFlavorimage.id).toBe(1)
    })

})