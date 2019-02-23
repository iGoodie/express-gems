const assert = require('assert'),
    gemMySQL = require('../main').gemMySQL

describe('gemMySQL', () => {
    describe('.createPool', () => {
        it('should callback passed function with error', (done) => {
            gemMySQL.createPool({ invalid: 'options' }, (err, pool) => {
                if (err) return done()
                return done({ err: 'Oof :c' })
            })
        })
    })

    describe('.buildWhereTemplate', () => {
        let input = {
            foo: 'Some String',
            bar: 1837837,
            inject: "1 OR 1=1' --",
            q: 'etition',
            unwantedInput: 1,
        }

        let { where, params } = gemMySQL.buildWhereTemplate(input, {
            foo: '=?',
            bar: '=CAST(? AS UNSIGNED)',
            q: { $clause: '=?', $prefix: '%' },
            locale: ['tr_TR', 'en_GB'],
            inject: '=?',
            invalid: 1,
        })

        it('should be able to deconstructed into two variables', () => {
            assert.ok(!!where)
            assert.ok(!!params)
        })

        it('should return proper types of values', () => {
            assert.equal(typeof where, 'string')
            assert.ok(Array.isArray(params))
        })

        it('should return expected values', () => {
            let expectedWhere = "WHERE foo=? AND bar=CAST(? AS UNSIGNED) AND q=? AND locale IN (?) AND inject=?",
                expectedParams = ['Some String', 1837837, '%etition', ['tr_TR', 'en_GB'], '1 OR 1=1\' --']

            assert.strictEqual(where, expectedWhere)
            assert.deepStrictEqual(params, expectedParams)
        })
    })
})