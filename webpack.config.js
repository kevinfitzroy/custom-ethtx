const path = require('path');

module.exports = {
    devServer: {
        port: '8099',
        progress: true,
        contentBase: './build',
        compress: false
    },
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'docs/dist'),
    filename: 'bundle.js'
  },
  watch: true,
  watchOptions: {
      poll: 1000, 
      aggregateTimeout: 500,  
      ignored: /node_modules/ 
  },
};