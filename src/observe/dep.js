let id = 0
class Dep{
    constructor(){
        this.id = id++
        this.subs = []
    }
    addSub(watcher){
        // 因为在addDep是去重了，所以这里不会重复添加watcher ，有几个需要观测的就有几个watcher
        this.subs.push(watcher)
    }
    depend(){
        // 让watcher记住当前的dep
        // this.subs.push(Dep.target)
        // 保存在watcher实例上一个dep
        Dep.target.addDep(this) 

    }
    notify(){
        // 阶段一：只是有数据的更改，没有computed等，此时每个sub中只有一个watcher
        this.subs.forEach(watcher=>{
            watcher.update(); //修改完数据，触发updated
            if(watcher.isWatcher){
                watcher.cb()   //触发updated 生命周期
            }
        })
    }
}
const stack = []
// 在初始化时 new Watcher的时候调用，然后执行getters函数，触发get函数
export function pushTarget(watcher){
    Dep.target = watcher
    stack.push(watcher)
}

export function popTarget(){
    stack.pop()
    Dep.target = stack[stack.length - 1]
}

export default Dep
