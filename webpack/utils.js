const path = require('path')

exports.root = function root(...args) {
  return path.resolve(__dirname, '..', ...args)
}
