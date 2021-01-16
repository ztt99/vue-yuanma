export function isObject(data){
    return typeof data === 'object' && data !== null
}

export function proxy(vm,source,key){
    Object.defineProperty(vm,key,{
        get(){
            return vm[source][key]
        },
        set(val){
            vm[source][key] = val
        }
    })
}
const API_HOOkS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated'
]
let starts = {}

starts.components = function(parent,child){
    const res = Object.create(parent)  //res.__proto__ = Object.create(parent)
    for(let key in child){
        res[key] = child[key]
    }
    return res
}

starts.data = function(parent,child){
    return child
}
API_HOOkS.forEach(hook=>{
    starts[hook] = mergeHook
})
function mergeHook(parent,child){
    if(child){
        if(parent){
            return parent.concat(child)
        }else{
            return [child]
        }
    }else{
        return parent
    }
}
export  function mergeOptions(parent,child){
    let options = {}
    for(let key in parent){
        mergefile(key)
    } 
    for(let key in child){
        if(!parent.hasOwnProperty(key)){
            mergefile(key)
        }
    }
    function mergefile(key){
        if(starts[key]){
            options[key]  = starts[key](parent[key],child[key])
             return options[key]

        }
        if(typeof parent[key] == 'object' && typeof child[key] === 'object'){
            options[key] = {...parent[key],...child[key]} //如果是引用类型，则合并
        }else if(!child[key]){ //如果子类型没有则用父类型
            options[key] = parent[key]
        }else{
            options[key] = child[key] 
        }
    }

    return options
}