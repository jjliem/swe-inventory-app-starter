const { Manager } = require('./Manager');
const {sequelize} = require('../db');

describe('Manager Model', () => {
	beforeAll(async () => {
		await sequelize.sync({force: true})
	});

	test('can create a Manager', async() => {
		const testManager = await Manager.create({email : 'admin@google.com', password : '123456', userType: 'manager', authorization: 'abc'});
        expect(testManager.email).toBe('admin@google.com')
        expect(testManager.password).toBe('123456')
        expect(testManager.userType).toBe('manager')
        expect(testManager.authorization).toBe('abc')
	})

})