import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import path from "path"//处理路径相关的，node.js内置模块

//resolve.alias起别名，~代表src这个路径，__dirname拿到当前目录绝对路径
//resolve和alias里面都是一个对象
export default defineConfig({
  resolve: {
    alias: {
      "~":path.resolve(__dirname,"src")
    }
  },
  //定义代理，使用'/api'代理/代替target这个域名，解决请求后端接口的跨域问题
  server: {
    proxy: {
      // 选项写法
      '/api': {
        target: 'http://ceshi13.dishait.cn',
        //当你在前端代码中发起一个以 / api 开头的请求时，Vite 的开发服务器会拦截这个请求，并通过代理将其转发到目标服务器。
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
        //去掉请求路径中的 /api 前缀
      }
    }
  },
  plugins: [vue(), WindiCSS()],
})
