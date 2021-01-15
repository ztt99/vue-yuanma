let  oldArrayMethods = Array.prototype

export const arrayMethods = Object.create(oldArrayMethods)

//列举出会使数据变化的方法
const methods = ['push','pop','shift','unshift','splice','reverce','sort']

methods.forEach(name=>{
    arrayMethods[name] = function(...args){
       const result =  oldArrayMethods[name].apply(this,args)

       let inserted,ob = this.__ob__
       switch (name) {
            case 'push':
            case 'unshift':
                inserted = args
               break; 
            case 'splice':
                inserted = args.slice(2)
       }
       console.log('push',this);
       ob.dep.notify() //数组push的时候不会触发get那里的notify
       ob.observeArray(inserted)
       return result
    }
})



