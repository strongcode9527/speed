const webpack = require('webpack')
const devServer = require('webpack-dev-server')
const openBrowser = require('react-dev-utils/openBrowser')
const {choosePort, createCompiler, prepareUrls} = require('react-dev-utils/WebpackDevServerUtils')
const config = require('../webpack/webpack.dev')

choosePort('localhost', 9527)
.then(port => {
  const urls = prepareUrls('http', 'localhost', port)
  const compiler = createCompiler(webpack, config, 'speed', urls, true)

  const server = devServer(compiler)

  server.listen(port, () => {
    console.log(`the client is open in ${port}`)
    openBrowser(`http://localhost:${port}`)
  })

})      
