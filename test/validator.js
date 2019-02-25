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
    body('matchesTest').exists().matches(/^www.*/, 'gi'),
    body('isLengthTest').exists().isLength({ min: 5, max: 30 }),
    body('isInTest').exists().isIn(['admin', 'superadmin']),
    body('mongoIdTest').exists().isMongoId(),
    body('uuidTest').exists().isUUID(2),
    body('isAlphaTest').exists().isAlpha('tr-TR'),
    body('isAlphanumericTest').exists().isAlphanumeric('tr-TR'),
    body('isAsciiTest').exists().isAscii(),
    body('isBase64Test').exists().isBase64(),
    body('isByteLengthTest').exists().isByteLength({ min: 50 }),
    body('isCreditCardTest').exists().isCreditCard(),
    body('isCurrencyTest').exists().isCurrency({ symbol: '₺', require_symbol: false }),
    body('isDataURITest').exists().isDataURI(),
    body('isMagnetURITest').exists().isMagnetURI(),
    body('isDecimalTest').exists().isDecimal({ force_decimal: true, locale: 'tr-TR' }),
    body('isDivisibleByTest').exists().isDivisibleBy(34),
    body('isEmptyTest').exists().isEmpty(),
    body('isFQDNTest').exists().isFQDN({ require_tld: true }),
    body('isFullWidthTest').exists().isFullWidth(),
    body('isHalfWidthTest').exists().isHalfWidth(),
    body('isHashTest').exists().isHash('sha256'),
    body('isHexColorTest').exists().isHexColor(),
    body('isHexadecimalTest').exists().isHexadecimal(),
    body('isIdentityCardTest').exists().isIdentityCard('any'),
    body('isIPTest').exists().isIP(6),
    body('isIPRangeTest').exists().isIPRange(),
    body('isISBNTest').exists().isISBN(10),
    body('isISSNTest').exists().isISSN({ case_sensitive: false }),
    body('isISINTest').exists().isISIN(),
    body('isISO8601Test').exists().isISO8601(),
    body('isRFC3339Test').exists().isRFC3339(),
    body('isISO31661Alpha2Test').exists().isISO31661Alpha2(),
    body('isISO31661Alpha3Test').exists().isISO31661Alpha3(),
    body('isISRCTest').exists().isISRC(),
    body('isJSONTest').exists().isJSON(),
    body('isJWTTest').exists().isJWT(),
    body('isLatLongTest').exists().isLatLong(),
    body('isLowercaseTest').exists().isLowercase(),
    body('isMACAddressTest').exists().isMACAddress(),
    body('isMD5Test').exists().isMD5(),
    body('isMimeTypeTest').exists().isMimeType(),
    body('isMobilePhoneTest').exists().isMobilePhone('any'),
    body('isMultibyte').exists().isMultibyte(),
    body('isNumericTest').exists().isNumeric(),
    body('isPortTest').exists().isPort(),
    body('isPostalCodeTest').exists().isPostalCode('any'),
    body('isSurrogatePairTest').exists().isSurrogatePair(),
    body('isURLTest').exists().isURL({ protocols: ['https', 'ftp'] }),
    body('isUppercaseTest').exists().isUppercase(),
    body('isVariableWidthTest').exists().isVariableWidth(),
    body('isWhitelistedTest').exists().isWhitelisted('abcdefABCDEF'),
    body('isWhitelistedTest2').exists().not().isWhitelisted('abcdefABCDEF'),
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
    uuidTest: 'No uuid boi',
    isAlphaTest: '122313124 Definitely not alpha',
    isAlphanumericTest: '$$$ <- Not alphanum',
    isAsciiTest: 'ŞŞŞ <- Not ascii',
    isBase64Test: '%%% <- Definitely not B64',
    isByteLengthTest: '<50byte',
    isCreditCardTest: 'BEEP BOOP BOOP',
    isCurrencyTest: '1000.00$',
    isDataURITest: '!=d_uri',
    isMagnetURITest: '!=m_uri',
    isDecimalTest: 'NOPE',
    isDivisibleByTest: 35,
    isEmptyTest: '           Almost empty :C',
    isFQDNTest: 'NOPE',
    isFullWidthTest: 'Foo',
    isHalfWidthTest: 'Ｆｏｏ',
    isHashTest: 'NOPE',
    isHexColorTest: '#ALMOSTHEXCOLOR',
    isHexadecimalTest: 'NOPE',
    isIdentityCardTest: 'NOPE',
    isIPTest: 'nope.nope.nope',
    isIPRangeTest: 'nope.nope.nope',
    isISBNTest: 'nope',
    isISINTest: 'nope',
    isISSNTest: 'nope',
    isISO8601Test: '12:34:56 2001-20-30Z',
    isRFC3339Test: '12:34:56 2001-20-30Z',
    isISO31661Alpha2Test: 'NOPE',
    isISO31661Alpha3Test: 'NOPE',
    isISRCTest: 'NOPE',
    isJSONTest: '{}} <- invalid json there',
    isJWTTest: 'beepBOOPboop',
    isLatLongTest: 'No latlang for you',
    isLowercaseTest: 'BROWN FOX JUMPS OVER LAZY DOG',
    isMACAddressTest: 'Nononono',
    isMD5Test: 'Noinoinoi',
    isMimeTypeTest: '####',
    isMobilePhoneTest: '-----',
    isMultibyte: 'AAAA',
    isNumericTest: 'No numeric for you',
    isPortTest: 'Definitely not a port',
    isPostalCodeTest: 'Definitely not a postal code',
    isSurrogatePairTest: 'No surrogate pair here',
    isURLTest: 'Nope no url',
    isUppercaseTest: 'brown fox jumps over lazy dog',
    isVariableWidthTest: 'aaa',
    isWhitelistedTest: 'Anything except [a-fA-F]',
    isWhitelistedTest2: 'a',
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
            for (let i = 0; i < chains.length; i++) {
                let chain = chains[i]
                for (let j = 0; j < chain._context.validators.length; j++) {
                    let { validator, message } = chain._context.validators[j]
                    if (typeof message != 'object')
                        return done(new Error(JSON.stringify({ func: validator.name, message })))
                }
            }

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
