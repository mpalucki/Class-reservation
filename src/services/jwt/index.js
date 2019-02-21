const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../../config')
const util = require('util');

// Takes a function following the common error-first callback style,
// i.e. taking a (err, value) => ... callback as the last argument, and returns a version that returns promises.
const jwtSign = util.promisify(jwt.sign)
const jwtVerify = util.promisify(jwt.verify)

const sign = (user, options, method = jwtSign) => {
    // Deklarujemy zawartosc tokena
    const {id, role, group} = user
    const payload = {id, role, group}
    return method(payload, jwtSecret, options)
}

module.exports = {
    sign
}
