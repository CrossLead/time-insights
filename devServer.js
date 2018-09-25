const port = process.env.PORT || 8080

const WebpackDevServer = require('webpack-dev-server')
const webpack = require('webpack')
const config = require('./webpack.config')
const compiler = webpack(config)

new WebpackDevServer(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  stats: {
    colors: true,
  },
}).listen(port, 'localhost', err => err
  ? console.error('DevServer Error:', err)
  : console.log(`Development server running on port ${port}`)
)
