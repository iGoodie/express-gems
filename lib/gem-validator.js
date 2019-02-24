'use strict'

const { validationResult } = require('express-validator/check')

exports = module.exports

exports.errors = function (req) {
    const errors = validationResult(req)

    if (errors.isEmpty()) return null

    let result = {}
    errors.array().forEach(error => {
        if (!result.hasOwnProperty(error.param))
            result[error.param] = []
        result[error.param].push(error.msg)
    })

    return result
}

const builderTable = {
    existsValidator:
        (options) => ({ code: 'ERR_V_REQUIRED' }),
    equals:
        (options) => ({ code: 'ERR_V_VALUE', equals: options[0] }),
    contains:
        (options) => ({ code: 'ERR_V_VALUE', contains: options[0] }),
    isWhitelisted:
        (options) => ({ code: 'ERR_V_VALUE', whitelist: options[0] }),
    isLowercase:
        (options) => ({ code: 'ERR_V_VALUE', case: 'lower' }),
    isUppercase:
        (options) => ({ code: 'ERR_V_VALUE', case: 'upper' }),
    isEmpty:
        (options) => ({ code: 'ERR_V_EMPTY' }),
    isLength:
        (options) => ({ code: 'ERR_V_LENGTH', ...options[0] }),
    isByteLength:
        (options) => ({ code: 'ERR_V_BYTE_LENGTH', ...options[0] }),
    isSurrogatePair:
        (options) => ({ code: 'ERR_V_TYPE', type: 'surrogatepair' }),
    isMultibyte:
        (options) => ({ code: 'ERR_V_TYPE', type: 'multibyte' }),
    isVariableWidth:
        (options) => ({ code: 'ERR_V_TYPE', type: 'variablewidth' }),
    isFullWidth:
        (options) => ({ code: 'ERR_V_TYPE', type: 'fullwidth' }),
    isHalfWidth:
        (options) => ({ code: 'ERR_V_TYPE', type: 'halfwidth' }),
    isISRC:
        (options) => ({ code: 'ERR_V_TYPE', type: 'isrc' }),
    isISBN:
        (options) => ({ code: 'ERR_V_TYPE', type: 'isbn', version: options[0] }),
    isISSN:
        (options) => ({ code: 'ERR_V_TYPE', type: 'issn', ...options[0] }),
    isISIN:
        (options) => ({ code: 'ERR_V_TYPE', type: 'isin' }),
    isFQDN:
        (options) => ({ code: 'ERR_V_TYPE', type: 'fqdn', ...options[0] }),
    isISO8601:
        (options) => ({ code: 'ERR_V_TYPE', type: 'iso8601' }),
    isISO31661Alpha2:
        (options) => ({ code: 'ERR_V_TYPE', type: 'iso3166-1alpha2' }),
    isISO31661Alpha3:
        (options) => ({ code: 'ERR_V_TYPE', type: 'iso3166-1alpha3' }),
    isRFC3339:
        (options) => ({ code: 'ERR_V_TYPE', type: 'rfc3339' }),
    isURL:
        (options) => ({ code: 'ERR_V_TYPE', ...options[0] }),
    isDataURI:
        (options) => ({ code: 'ERR_V_TYPE', type: 'datauri' }),
    isMagnetURI:
        (options) => ({ code: 'ERR_V_TYPE', type: 'magneturi' }),
    isMobilePhone:
        (options) => ({ code: 'ERR_V_TYPE', type: 'mobilephone', locale: options[0] }),
    isEmail:
        (options) => ({ code: 'ERR_V_TYPE', type: 'email' }),
    isIdentityCard:
        (options) => ({ code: 'ERR_V_TYPE', type: 'identitycard', locale: options[0] }),
    isPostalCode:
        (options) => ({ code: 'ERR_V_TYPE', type: 'postalcode', locale: options[0] }),
    isCreditCard:
        (options) => ({ code: 'ERR_V_TYPE', type: 'creditcard' }),
    isCurrency:
        (options) => ({ code: 'ERR_V_TYPE', type: 'currency', ...options[0] }),
    isDivisibleBy:
        (options) => ({ code: 'ERR_V_TYPE', type: 'numeric', divisibleby: options[0] }),
    isDecimal:
        (options) => ({ code: 'ERR_V_TYPE', type: 'decimal', ...options[0] }),
    isAlpha:
        (options) => ({ code: 'ERR_V_TYPE', type: 'alpha' }),
    isAlphanumeric:
        (options) => ({ code: 'ERR_V_TYPE', type: 'alphanumeric' }),
    isNumeric:
        (options) => ({ code: 'ERR_V_TYPE', type: 'numeric' }),
    isAscii:
        (options) => ({ code: 'ERR_V_TYPE', type: 'ascii' }),
    isBase64:
        (options) => ({ code: 'ERR_V_TYPE', type: 'base64' }),
    isHash:
        (options) => ({ code: 'ERR_V_TYPE', type: 'hash', algorithm: options[0] }),
    isHexadecimal:
        (options) => ({ code: 'ERR_V_TYPE', type: 'hexadecimal' }),
    isHexColor:
        (options) => ({ code: 'ERR_V_TYPE', type: 'hexcolor' }),
    isMimeType:
        (options) => ({ code: 'ERR_V_TYPE', type: 'mimetype' }),
    isBoolean:
        (options) => ({ code: 'ERR_V_TYPE', type: 'boolean' }),
    isInt:
        (options) => ({ code: 'ERR_V_TYPE', type: 'integer', ...options[0] }),
    isFloat:
        (options) => ({ code: 'ERR_V_TYPE', type: 'float', ...options[0] }),
    isIPRange:
        (options) => ({ code: 'ERR_V_TYPE', type: 'iprange' }),
    isIP:
        (options) => ({ code: 'ERR_V_TYPE', type: 'ipaddress', version: options[0] }),
    isPort:
        (options) => ({ code: 'ERR_V_TYPE', type: 'port' }),
    isMACAddress:
        (options) => ({ code: 'ERR_V_TYPE', type: 'macadress' }),
    isMongoId:
        (options) => ({ code: 'ERR_V_TYPE', type: 'mongoid' }),
    isUUID:
        (options) => ({ code: 'ERR_V_TYPE', type: 'uuid', version: options[0] }),
    isJSON:
        (options) => ({ code: 'ERR_V_TYPE', type: 'json' }),
    isJWT:
        (options) => ({ code: 'ERR_V_TYPE', type: 'jwt' }),
    isMD5:
        (options) => ({ code: 'ERR_V_TYPE', type: 'md5' }),
    _default: // For some reason name prop of isLatLong is _default
        (options) => ({ code: 'ERR_V_TYPE', type: 'latlong' }),
    isAfter:
        (options) => ({ code: 'ERR_V_DATE', after: options[0] }),
    isBefore:
        (options) => ({ code: 'ERR_V_DATE', before: options[0] }),
    isIn:
        (options) => ({ code: 'ERR_V_ENUM', in: options[0] }),
    matches:
        (options) => ({ code: 'ERR_V_REGEX', regex: options[0].toString() + (options[1] || '') })
}

exports.backpropagate = function (chains, errorTable) {
    chains.forEach(chain => {
        chain._context.validators.forEach(v => {
            let { validator, negated, options } = v

            let message_builder = errorTable ?
                errorTable[validator.name] :
                builderTable[validator.name]

            if (!message_builder) return

            v.message = message_builder(options)

            if (negated) Object.assign(v.message, { not: true })
        })
    })

    return chains
}
