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

// TODO: Cover every method within https://github.com/chriso/validator.js
const builderTable = {
    existsValidator:
        (options) => ({ code: 'ERR_V_REQUIRED' }),
    equals:
        (options) => ({ code: 'ERR_V_VALUE', equals: options[0] }),
    contains:
        (options) => ({ code: 'ERR_V_VALUE', contains: options[0] }),
    isLength:
        (options) => ({ code: 'ERR_V_LENGTH', ...options[0] }),
    isEmail:
        (options) => ({ code: 'ERR_V_TYPE', type: 'email' }),
    isBoolean:
        (options) => ({ code: 'ERR_V_TYPE', type: 'boolean' }),
    isInt:
        (options) => ({ code: 'ERR_V_TYPE', type: 'integer', ...options[0] }),
    isFloat:
        (options) => ({ code: 'ERR_V_TYPE', type: 'float', ...options[0] }),
    isMongoId:
        (options) => ({ code: 'ERR_V_TYPE', type: 'mongoid' }),
    isUUID:
        (options) => ({ code: 'ERR_V_TYPE', type: 'uuid', version: options[0] }),
    isAfter:
        (options) => ({ code: 'ERR_V_DATE', after: options[0] }),
    isBefore:
        (options) => ({ code: 'ERR_V_DATE', before: options[0] }),
    isIn:
        (options) => ({ code: 'ERR_V_ENUM', in: options[0] }),
    matches:
        (options) => ({ code: 'ERR_V_REGEX', regex: options[0].toString() })
}

exports.backpropagate = function (chains, errorTable) {
    chains.forEach(chain => {
        chain._context.validators.forEach(v => {
            let { validator, options } = v

            let message_builder = errorTable ?
                errorTable[validator.name] :
                builderTable[validator.name]

            if (!message_builder) return

            v.message = message_builder(options)
        })
    })

    return chains
}
