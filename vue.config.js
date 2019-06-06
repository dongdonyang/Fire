// vue.config.js 配置说明
// 这里只列一部分，具体配置惨考文档啊
module.exports = {
  lintOnSave: true,
  // productionSourceMap：{ type:Bollean,default:true } 生产源映射
  // 如果您不需要生产时的源映射，那么将此设置为false可以加速生产构建
  productionSourceMap: false,
  // devServer:{type:Object} 3个属性host,port,https
  // 它支持webPack-dev-server的所有选项

  devServer: {
    port: 8084, // 端口号
    host: "0.0.0.0",
    https: false, // https:{type:Boolean}
    open: false, //配置自动启动浏览器
    // proxy: "http://localhost:4000" // 配置跨域处理,只有一个代理
    proxy: {
      "/api": {
        target: "http://fd.sctsjkj.com:5080", //线上环境
        // target: "http://192.168.0.67:5080", //调试环境、陈龙
        // target: "http://192.168.0.179:5000", //调试环境、陈昊文
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/api"
        }
      }
    }
  }
};
