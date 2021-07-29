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

	test('can create Brand image ', async () => {
        await sequelize.sync({ force: true }); 
        const testBrandimage = await Brand.create({ name: 'Magnum', image: 'https://pbs.twimg.com/profile_images/1154022165949423616/ttYGBBGT_400x400.png' })
        expect(testBrandimage.id).toBe(1)
    })

})