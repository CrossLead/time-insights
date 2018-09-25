const { root } = require('../utils')

module.exports = {
  test: /\.tsx?$/,
  loaders: ['ts-loader'],
  include: [root('src')],
}
