const { root } = require('../utils')

module.exports = {
  test: /\.tsx?$/,
  include: [root('src')],
  enforce: 'pre',
  use: [
    {
      loader: 'tslint-loader',
      options: { configFile: root('tslint.yml') },
    },
  ],
}
