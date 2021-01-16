import {isObject} from '../utils/index.js'
import { arrayMethods} from './array.js'
import Dep from './dep.js'
//Object.defineProperty  不能兼容ie8 及以下 vue2 无法兼容ie8版本

class Observe{
    constructor(data){
        this.dep = new Dep
console.log(data);
        Object.defineProperty(data,'__ob__',{
            enumerable:false,
            configurable:false,
            value :this
        })
        if(Array.isArray(data)){
            data.__proto__ = arrayMethods
            this.observeArray(data)
        }else{
            this.walk(data)  //监听对象
        }
    }
    walk(data){
        let keys = Object.keys(data)
        for(let i = 0 , len = keys.length; i< len; i++){
            let key = keys[i]
            let value = data[key]
            console.log(data,key,value);
            defineReactive(data,key,value)
        }
    }
    observeArray(data){
        for(let i = 0, len = data.length;i<len;i++){
            observe(data[i])
        }
    }
}

//defineReactive只监听对象
function defineReactive(data,key,value){
    let dep = new Dep()
    //[1,2,3] [1,2,3] [1,2,3]
    let childOb = observe(value)

    Object.defineProperty(data,key,{
        configurable:true,
        enumerable:true,
        get(){
            if(Dep.target){
                //已经触发 pushTarget 并且Dep.target = Watcher的实例
                dep.depend()  //存watcher  如果是对象或者是数组会depend两次，  childOb.dep.depend()   dep.depend()
                if(childOb){ //数组的依赖收集  这样this中就会得到收集watcher的notify
                    childOb.dep.depend() 
                    // 如果数组中还有数组 
                    if(Array.isArray(value)){
                        dependArray(value)
                    }
                }
            }
            return value
        },
        set(newValue){
            if(newValue === value) return 
            observe(newValue)  //用户设置的值可能是一个对象
            value = newValue
            dep.notify() //更新watcher 如果是数组push等不会触发set方法  notify只是为了更新dom
        }
    })
}

// 数组中的数组的依赖收集
function dependArray(val){
    for(let i = 0 ; i < val.length ; i++){
        let current = val[i]
        current.__ob__&&current.__ob__.dep.depend()
        if(Array.isArray(current)){
            dependArray(current)
        }  
    }
}
export function observe(data){
    if(!isObject(data)) return 
    return new Observe(data)
}
