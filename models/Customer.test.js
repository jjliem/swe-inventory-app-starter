const { Customer } = require('./Customer');
const {sequelize} = require('../db');

describe('Customer Model', () => {
	beforeAll(async () => {
		await sequelize.sync({force: true})
	});

	test('can create a Customer', async() => {
		const testCustomer = await Customer.create({email : 'admin@google.com', password : '123456', userType: 'customer', coupon: 'save'});
        expect(testCustomer.email).toBe('admin@google.com')
        expect(testCustomer.password).toBe('123456')
        expect(testCustomer.userType).toBe('customer')
        expect(testCustomer.coupon).toBe('save')
	})

})