import { pushTarget, popTarget } from './dep'
import { queueWatcher } from './schedular.js'
let id = 0
class Watcher {
    constructor(vm, exportFn, cb, options = {}) {
        this.vm = vm
        this.cb = cb
        this.options = options
        this.isWatcher = typeof options === 'object' ? false : options //是渲染watcher
        this.id = id++
        this.lazy = options.lazy
        this.dirty = options.lazy
        this.user = options.user  //用户 watch
        this.depsid = new Set()
        this.deps = []
        if (typeof exportFn == 'function') {
            this.getter = exportFn
        } else {
            // getter 返回当前值
            this.getter = function () {
                let val = exportFn.split('.')
                return val.reduce((p, c) => {
                    return p[c]
                }, vm)
            }

        }
        // 默认先调用一次get  取值将结果保留下来
        if (!this.lazy) {
            this.value = this.get()
        }
    }
    addDep(dep) {
        // watcher里不能放重复的dep dep中不能放重复的watcher
        // 进行去重操作，可能重复触发get 
        let id = dep.id
        if (!this.depsid.has(id)) {
            this.depsid.add(id)
            this.deps.push(dep)
            dep.addSub(this)
        }
    }
    get() {
        pushTarget(this) //添加watcher
        let redult = this.getter.call(this.vm) //渲染watcher执行,调用render
        popTarget()
        return redult
    }
    update() {
        if (this.lazy) {
            this.dirty = true
        } else {
            // 每次get都会调用watcher中的get
            // this.get()
            queueWatcher(this)
        }

    }
    run() {
        this.newValue = this.get()
        this.oldValue = this.value
        if (this.user) {
            this.cb.call(this.vm, this.newValue, this.oldValue)
        }
    }
    evaluate() {
        this.value = this.get()
        this.dirty = false
    }
    depend(){
        let i = this.deps.length
        while(i--){
            this.deps[i].depend()  //继续收集watcher 
        }
    }
}


export default Watcher