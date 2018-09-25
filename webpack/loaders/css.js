const { root } = require('../utils')

module.exports = {
  test: /\.css$/,
  use: [
		{ loader: 'style-loader' },
    {
      loader: 'css-loader',
      options: {
				import: true,
				importLoaders: 1,
      },
    },
	],
  include: [
		root('src'),
  ],
}