const { root } = require('./webpack/utils')
// const env = process.env.NODE_ENV
// const prod = env === 'production'

const env = 'development'
const prod = false

const baseConfig = {
  output: {
    path: root('dist'),
    filename: 'bundle.js',
    publicPath: '/dist/',
  },
  resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx', '.css'] },
  module: { rules : require('./webpack/loaders') },
  plugins: require('./webpack/plugins')(env),
}

console.log({module: baseConfig.module.rules[2]});

const devConfig = {
  mode: 'development',
  devtool: 'source-map',
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?https://0.0.0.0:8080',
    'webpack/hot/only-dev-server',
    root('src', 'index.tsx'),
  ],
  performance: { hints: false },
}

const prodConfig = {
  mode: 'production',
  devtool: 'eval',
  entry: [ root('src', 'index.tsx') ],
  optimization: { minimize: true },
}

module.exports = Object.assign(
  {},
  baseConfig,
  prod ? prodConfig : devConfig
)
