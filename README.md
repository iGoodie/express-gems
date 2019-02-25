# 💎 express-gems
[![NPM](https://nodei.co/npm/express-gems.png?downloads=true&downloadRank=true)](https://nodei.co/npm/express-gems/)

Encapsulated express related libraries for external utilities. 

It's named "gems", but it has nothing to do with Ruby programming language, believe me. It is just a programmer trying to name things 🤷

Utility "gems" will keep expanding as I discover new needings with the libraries I am using.

# ⚙️ Setup

## Via npm
You can install package by executing following command:
```
$ npm i express-gems -s
```

<!-- ---------------------------------- -->

# 📦 Provided gems/goodies

## ✉️ MySQL Gem

### .createPool(config, callback)
Creates traditional connection pool with given configs.
However, `callback` is called with an `err` and `pool` object 

Example:
```javascript
const gemMySQL = require('express-gems').gemMySQL

let options = { /* ... */ }

gemMySQL.createPool(options, (err, pool) => {
    if (err) console.log('Error connecting to the DB.')
    // Tadaa! Connection established and pool is created successfully
})
```

### .buildWhereTemplate(input, rules)
Helps you to build where templates.
```javascript
const gemMySQL = require('express-gems').gemMySQL

let _pseudoReqBody = { foo:'Lorem ips', bar:'123.45', baz:'somevariable', unwanted:'malicious' }

let { where, params } = gemMySQL.buildWhereTemplate(_pseudoReqBody, {
    foo: { $clause:'=?', $prefix:'%', $postfix:'%' },
    bar: '=CAST(? AS UNSIGNED)',
    baz: '=?',
    locale: ['tr_TR', 'en_GB']
})

// "where" will be
///     "WHERE foo=? AND bar=CAST(? AS UNSIGNED) AND baz=? AND locale IN ('tr_TR', 'en_GB')"
// "params" will be
//     ['%Lorem ips%', '123.45', 'somevariable']
```

<!-- ---------------------------------- -->

## ✉️ Express-validator Gem

### .errors(req)
Returns a gathered up, *response-ready* format of errors within req. **MUST BE** used after `express-validator` middlewares are executed.
```javascript
const express = require('express')
const gemValidator = require('express-gems').gemValidator

let app = express()

app.all('/some-endpoint', [ ... ], (req, res, next) => {
    const errors = gemValidator.errors(req)
    if (errors) return res.status(400).json({ errors })
})
```
`errors` is an object with checked fields in it. Error objects within the arrays are determined by the `.withMessage(MSG)` chain within the check rules.
```json
{
    "checkedField1": [
        { "code":"SOME_ERROR_CODE", "arg1":"SOME_ARG" },
        { "code":"SOME_ERROR_CODE", "arg1":"SOME_ARG" },
    ],
    "checkedField2": [
        { "code":"SOME_ERROR_CODE", "arg1":"SOME_ARG" },
        { "code":"SOME_ERROR_CODE", "arg1":"SOME_ARG" },
    ],
    ...
}
```

### .backpropagate(chains, errorTable?)
Backpropagates given `chains` array and fills them with appropriate error messages. (Helps you in cases you do not want to repeat same `withMessage(MSG)` statements)
```javascript
const gemValidator = require('express-gems').gemValidator
const { check, body } = require('express-validator/check')

// With built-in standard messages
const validationRules = gemValidator.backpropagate([
    check('foo').exists().isInt({ min: 5 }),
    body('bar').optional().isLength({ max: 20 })
])

// With custom message builder table
const validationRules = gemValidator.backpropagate([
    check('foo').exists().isInt({ min: 5 }),
    body('bar').optional().isLength({ max: 20 })
], {
    isInt: (options) => ({ error: 'Should be an integer', someCustomField: 'Yea custom field' }),
    isLength: (options) => ({ error: 'Should be between', min: options[0].min, max: options[0].max })
})

// CAUTION: Please note that while using builder table
const validationRules = gemValidator.backpropagate([
    check('latlongfield').exists().isLatLong()
], {
    // isLatLong check is mapped into "_default"
    _default: (options) => ({ error: 'Should be a latlong value' })
})
```

# ‼️ Found a bug or have a suggestion?
Feel free to open up an issue to let me know if you;
- Found a bug
- Have a suggestion
- Have a question

At: https://github.com/iGoodie/express-gems/issues