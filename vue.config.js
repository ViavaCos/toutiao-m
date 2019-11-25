module.exports = {
  // 配置构建完毕的代码访问方式
  // 如 / 则必须通过服务器方式访问，也是默认值
  publicPath: './',
  css: {
    loaderOptions: {
      less: {
        // 这里的选项会传递给 less-loader
        modifyVars: {
          blue: '#3296fa'
        }
      }
    }
  }
}
