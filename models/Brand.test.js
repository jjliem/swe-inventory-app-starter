const {Brand} = require('./Brand');
const {sequelize} = require('../db');

describe('Brand Model', () => {
	beforeAll(async () => {
		await sequelize.sync({force: true})
	});

	test('can create a Brand', async() => {
		const testBrand = await Brand.create({name : 'Magnum'})
		expect(testBrand.name).toBe('Magnum')
	})

})