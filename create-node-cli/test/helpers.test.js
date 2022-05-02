const helpers = require('../utils/helpers');

test('if printToConsole is working correctly', () => {
	const spy = jest.spyOn(helpers, 'printToConsole');
	const isCalled = helpers.printToConsole('0', '0');

	expect(spy).toHaveBeenCalled();
	expect(isCalled).toContain('0');
	expect(isCalled).toContain('0');

	spy.mockRestore();
});
