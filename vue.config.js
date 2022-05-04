const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  chainWebpack:config=>{
    // 当前环境为 发布阶段
    config.when(process.env.NODE_ENV == 'production',config=>{
      config.entry('app').clear().add('./src/main-prod.js')
    })
    // 当前环境为 开发阶段
    config.when(process.env.NODE_ENV == 'development',config=>{
      config.entry('app').clear().add('./src/main-dev.js')
    })
  }
})
