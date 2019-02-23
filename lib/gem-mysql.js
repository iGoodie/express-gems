'use strict'

const mysql = require('mysql')

function createPool(config, callback) {
    mysql.createPool(config).getConnection((err, connection) => {
        if (err) return callback(err)
        connection.release()
        return callback(null, pool)
    })
}

function buildWhereTemplate(input, rules) {
    let whereClauses = [], parameters = []

    // Traverse every rule
    Object.keys(rules).forEach(key => {
        if(Array.isArray(rules[key])) {
            whereClauses.push(`${key} IN (?)`)
            parameters.push(rules[key])
            return
        }

        if (!input[key]) return

        switch (typeof rules[key]) {
            case 'string': {
                whereClauses.push(key + rules[key])
                parameters.push(input[key])
            } break

            case 'object': {
                let { $clause, $prefix, $postfix } = rules[key]
                if (!$clause) return
                whereClauses.push(key + $clause)
                parameters.push(($prefix || '') + input[key] + ($postfix || ''))
            } break
        }
    })

    // Return built clause
    return {
        where: !!whereClauses.length ? 'WHERE ' + whereClauses.join(' AND ') : undefined,
        params: parameters
    }
}

module.exports = { createPool, buildWhereTemplate }
