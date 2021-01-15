import {observe}  from './observe/index'
import {proxy} from './utils/index.js'
import Watcher from './observe/watcher.js'
import Dep from './observe/dep'
export function initState(vm){
    const opts = vm.$options
    if(opts.props){
        initProps(vm)
    }
    if(opts.data){
        initData(vm)
    }
    if(opts.computed){
        // 原理也是get ，会缓存，内部有变量 dirty
        // 也是一个watcher
        initComputed(vm)
    }
    if(opts.methods){
        initMethods(vm)
    }
    if(opts.watch){
        initWatch(vm)
    }
}

function initProps(vm){}

function initData(vm){
    let data = vm.$options.data
    data = vm._data = typeof data === 'function' ? data.call(vm) : data

    for(let key in data){
        proxy(vm,'_data',key)
    }
    observe(data)
}
function initComputed(vm){
    let computed = vm.$options.computed
    const watchers = vm._computedWatchers = {}

    // 1. 需要有watcher
    // 2. 需要通过defineProperty
    // 3. 需要一个变量
    for(let key in computed){
        const userDep = computed[key]
        const getter = typeof userDep === 'function'? userDep:userDep.get
        watchers[key] = new Watcher(vm,getter,()=>{},{lazy:true})
        defineCpmputed(vm,key,userDep)
    }

}

const sharedPropertyDefinition = {
    enumerable:true,
    configurable:true,
    get:()=>{},
    set:()=>{}
}
function defineCpmputed(target,key ,userDep){
    if(typeof userDep === 'function'){
        // 需要重写get ， 进行缓存
        sharedPropertyDefinition.get = createComputedGetter(key)
    }else{
        sharedPropertyDefinition.get =createComputedGetter(key) 
        sharedPropertyDefinition.set = userDep.set
    }
    Object.defineProperty(target,key,sharedPropertyDefinition)
}
function createComputedGetter(key){
    return function(){
         //如果是脏的就执行
        const watcher = this._computedWatchers[key]
        if(watcher){
            if(watcher.dirty){ //如果是脏的就求值
               watcher.evaluate()
            }
            if(Dep.target){ 
                /**
                 * watcher则个watcher是计算属性的watcher ，如果存在其他watcher那么久收集起来
                 */
                watcher.depend()
            }
            return watcher.value
        }
        
    }
}

function initMethods(vm){
    let methods = vm.$options.methods
    Object.keys(methods).forEach(method=>method.bind(vm))
}
function initWatch(vm){
    let watch =  vm.$options.watch
    for(let key in watch){
        let handlers = watch[key]
        if(Array.isArray(handlers)){
            handlers.forEach(handler=>{ ///watch 的值是数组
                createWatcher(vm,key,handler)
            })
        }else{
            createWatcher(vm,key,handlers) //watch 的值是函数，字符串，对象
        }
    }
}

function createWatcher(vm,exprOrFn,handler,options){
    if(typeof handler == 'object'){
        options = handler
        handler = handler.handler
    }
    if(typeof handler == 'string'){ //使用的是methods上的方法
        handler = vm[handler]
    }
    /**
     * exprOrFn 监听的属性
     * handler 监听的方法
     * options 监听的配置
     * 
     */
    return vm.$watch(exprOrFn,handler,options)
}

export function stateMixin(Vue){
    Vue.prototype.$watch = function (exprOrFn,cb,options={}){
        new Watcher(this,exprOrFn,cb,{...options,user:true})
        if(options.immediate){
            cb()
        }
    }
}
