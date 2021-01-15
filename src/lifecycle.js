import Watcher from './observe/watcher'
import { patch } from './vdom/patch'
export function lifecycleMixin(Vue) {
    // 通过虚拟DOM创建真实的DOm
    Vue.prototype._update = function (vnode) {
        let vm = this
        let prevVnode = vm._vnode
        if (!prevVnode) {
            // 需要用虚拟节点创建真实节点，替换原有的$el
            vm.$el = patch(vm.$el, vnode)
        } else {
            vm.$el = patch(prevVnode, vnode)
        }
        vm._vnode = vnode
    }
}
//初始化组件
export function mountComponent(vm, el) {
    const options = vm.$options  //render
    vm.$el = el //真实的dom
    callHook(vm, 'beforeMount')
    //_render 通过render方法，渲染出虚拟DOM
    //无论渲染还是更新都会调用此方法
    let updateComponent = () => {
        //返回虚拟dom
        vm._update(vm._render())
    }
    //渲染watcher
    new Watcher(vm, updateComponent, () => {
        callHook(vm, 'updated')
    }, true)
    callHook(vm, 'mounted')

}

export function callHook(vm, hook) {
    const handlers = vm.$options[hook]
    if (handlers) {
        handlers.forEach(hook => {
            hook.call(vm)
        })
    }
}