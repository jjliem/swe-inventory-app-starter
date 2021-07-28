const { User } = require('./User');
const {sequelize} = require('../db');

describe('User Model', () => {
	beforeAll(async () => {
		await sequelize.sync({force: true})
	});

	test('can create a User', async() => {
		const testUser = await User.create({email : 'admin@google.com', password : '123456'})
        expect(testUser.email).toBe('admin@google.com')
        expect(testUser.password).toBe('123456')
	})

})