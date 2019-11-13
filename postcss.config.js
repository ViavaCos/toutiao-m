module.exports = {
  plugins: {
    'autoprefixer': {},
    // 配置postcss插件
    'postcss-pxtorem': {
      rootValue: 37.5,
      propList: ['*']
    }
  }
}
