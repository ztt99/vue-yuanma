import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'

export default {
    input:'./src/index.js',
    output:{
        file:'dist/umd/vue.js',
        name:'Vue', //指定打包后全局变量的名字
        format:'umd', //统一模块规范
        sourcemap:true, //ES6->ES5 开启源码提示
    },
    plugins:[
        babel({
            exclude:'node_modules/**'
        }),
        process.env.ENV==='development'?serve({
            open:true,
            openPage:'/public/watch.html',
            port:3000,
            contentBase:'', //静态文件位置
        }) :null
    ]
}