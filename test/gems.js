const assert = require('assert'),
    expressGems = require('../main')

describe('expressGems', () => {
    it('should return subpackages and express', () => {
        assert.strictEqual(expressGems, require('express'))
        assert.strictEqual(typeof expressGems.gemMySQL, 'object')
    })
})