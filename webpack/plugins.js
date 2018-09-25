const { root } = require('./utils')
const { DefinePlugin, HotModuleReplacementPlugin } = require('webpack')

module.exports = function getPlugins(environment) {
  const base = [
    new DefinePlugin({
      __DEV__: environment === 'development',
      __PROD__: environment === 'production',
    }),
  ]
  return environment === 'development' 
    ? [ ...base, new HotModuleReplacementPlugin() ]
    : base
}
