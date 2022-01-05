module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    port: 8081,
    proxy: process.env.VUE_APP_API_URL.substring(0, process.env.VUE_APP_API_URL.length - 4),
    // proxy: 'http://localhost:8080/',
  }
}
