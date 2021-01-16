import {isReservedTag} from '../utils/index'

/**
 * 
 * @param {*} tag 标签
 * @param {*} data 属性
 * @param  {...any} children 
 */
export function createElement(vm,tag, data = {}, ...children) {
    let key = data.key
    key ? delete data.key :''
    if(isReservedTag(tag)){
        return vnode(tag, data, key, children,undefined)
    }else{
        let Cons = vm.$options.components[tag]  //全局以及局部的components都在这里，全局的是构造函数，局部的是对象
        if(typeof Cons === 'object'){
            Cons = vm.options._base.extent(Cons)
        }
        data.hook = {
            init(){}
        }
        return vnode(`vue-compoment-${Cons.cid}-${tag}`,
         data,
         key,
          undefined,
          undefined,
          { Cons,
            children //插槽
        }
          )
    }
}

export function createTextNode(text) {
    return vnode(undefined, undefined, undefined, undefined,text)
}

function vnode(tag, data, key, children,text,componentOptions) {
    return {
        tag, 
        data, 
        key, 
        children,
        text,
        componentOptions
    }
}