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

})