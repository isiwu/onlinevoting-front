module.exports = {
  devServer: {
    proxy: {
      '^/api': {
        target: 'https://onlinevoting.herokuapp.com/',
        ws: true,
        changeOrigin: true,
      },
    }
  },
}