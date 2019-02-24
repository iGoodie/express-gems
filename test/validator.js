const async = require('async'),
    { body } = require('express-validator/check'),
    gemValidator = require('../main').gemValidator

let chains = gemValidator.backpropagate([
    body('existsTest').exists(),
    body('intTest').exists().isInt({ min: 5 }),
    body('floatTest').exists().isFloat({ max: 5.23 }),
    body('emailTest').exists().isEmail(),
    body('booleanTest').exists().isBoolean(),
    body('containsTest').exists().contains('barbaz'),
    body('equalsTest').exists().equals(123),
    body('isAfterTest').exists().isAfter('2200-10-20T12:34:56Z'),
    body('isBeforeTest').exists().isBefore('2000-10-20T12:34:56Z'),
    body('matchesTest').exists().matches(/^www.*/),
    body('isLengthTest').exists().isLength({ min: 5, max: 30 }),
    body('isInTest').exists().isIn(['admin', 'superadmin']),
    body('mongoIdTest').exists().isMongoId(),
    body('uuidTest').exists().isUUID(2),
])

let _dummy_body = {
    intTest: 'foo',
    floatTest: 'foo',
    emailTest: 'foo',
    containsTest: 'foo',
    equalsTest: 321,
    isAfterTest: new Date(),
    isBeforeTest: new Date(),
    matchesTest: '!www',
    isLengthTest: 'FooBarBaz',
    mongoIdTest: 'No mongo id boi',
    uuidTest: 'No uuid boi'
}

let _dummy_req = { body: _dummy_body }
let _dummy_res = {}

describe('gemValidator', () => {
    describe('.errors', () => {
        it('should generate readible response object', (done) => {
            let chain = gemValidator.backpropagate([body('foo').isInt()])[0]
            chain(_dummy_req, _dummy_res, () => {
                let errors = gemValidator.errors(_dummy_req)
                if (typeof errors != 'object') return done(new Error('not object'))
                if (!errors.hasOwnProperty('foo')) return done(new Error('invalid format'))
                if (typeof errors.foo != 'object') return done(new Error('invalid report format'))
                return done()
            })
        })
    })

    describe('.backpropagate', () => {
        it('should backpropagate each chain and generate message', (done) => {
            chains.forEach(chain => {
                chain._context.validators.forEach(({ message }) => {
                    if (typeof message != 'object')
                        return done(new Error('not object'))
                })
            })

            return done()
        })

        it('should backpropagate with proper error formats', (done) => {
            async.each(chains, function simulateExpressMiddleware(chain, callback) {
                chain(_dummy_req, _dummy_res, callback)
            }, function () {
                let errors = gemValidator.errors(_dummy_req)
                async.filter(Object.keys(errors), (field, callback) => {
                    let assertion = !errors[field].every(e => e.hasOwnProperty('code'))
                    return callback(assertion ? new Error(field + ' ' + JSON.stringify(errors[field])) : null)
                }, done)
            })
        })
    })
})
