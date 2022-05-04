const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  chainWebpack:config=>{
    // 当前环境为 发布阶段
    config.when(process.env.NODE_ENV == 'production',config=>{
      config.entry('app').clear().add('./src/main-prod.js')
      // 通过externals加载外部CDN资源
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })
      // 发布模式的isProd为true
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })
    // 当前环境为 开发阶段
    config.when(process.env.NODE_ENV == 'development',config=>{
      config.entry('app').clear().add('./src/main-dev.js')
      // 开发模式的isProd为false
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  }
})
